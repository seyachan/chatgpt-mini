import os
from typing import List
from fastapi import FastAPI, Depends, Request, HTTPException, Response, status
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session
from starlette.middleware.sessions import SessionMiddleware
from fastapi.middleware.cors import CORSMiddleware
import openai
from dotenv import load_dotenv

# .envファイルを最初に読み込む
load_dotenv()

import models, schemas, crud, auth
from database import SessionLocal, engine

# データベーステーブルを作成
models.Base.metadata.create_all(bind=engine)

# --- 環境変数の読み込み ---
# os.getenvの第一引数は「環境変数名」の文字列である必要があります
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8001")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3002")
openai.api_key = os.getenv("OPENAI_API_KEY")
openai.base_url = os.getenv("OPENAI_API_BASE")
SESSION_SECRET = os.getenv("SESSION_SECRET_KEY", "a_very_long_and_super_secret_random_string_12345")


app = FastAPI()

# --- Middlewareの設定 ---

# 1. CORS設定
origins = [
    "http://localhost:3000", 
    "http://localhost:3002",
    "https://chatgpt-mini-pink.vercel.app"
]
app.add_middleware(
    CORSMiddleware, 
    allow_origins=origins, 
    allow_credentials=True, 
    allow_methods=["*"], 
    allow_headers=["*"]
)

# 2. Session設定 (本番環境とローカル環境で自動切り替え)
IS_PRODUCTION = "onrender.com" in BACKEND_URL

if IS_PRODUCTION:
    # 本番環境用の設定 (HTTPSでドメインをまたぐ)
    app.add_middleware(
        SessionMiddleware,
        secret_key=SESSION_SECRET,
        same_site='none',
        https_only=True
    )
else:
    # ローカル開発用の設定 (HTTPで同一ドメイン)
    app.add_middleware(
        SessionMiddleware,
        secret_key=SESSION_SECRET,
        https_only=False
    )

# --- データベースセッションの依存関係 ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- ルート（エンドポイント）の定義 ---

@app.get("/auth/login/google")
async def login_google(request: Request):
    # 環境変数からリダイレクトURIを動的に生成
    redirect_uri = f"{BACKEND_URL}/auth/callback/google"
    return await auth.oauth.google.authorize_redirect(request, redirect_uri)

@app.get("/auth/callback/google")
async def auth_google_callback(request: Request, db: Session = Depends(get_db)):
    try:
        token = await auth.oauth.google.authorize_access_token(request)
        user_info = token.get('userinfo')
        if not user_info: 
            raise HTTPException(status_code=400, detail="Could not fetch user info")
        
        db_user = crud.get_user_by_email(db, email=user_info['email'])
        if not db_user:
            user_create = schemas.UserCreate(email=user_info['email'], name=user_info['name'], google_id=user_info['sub'])
            db_user = crud.create_user(db=db, user=user_create)

        access_token = auth.create_access_token(data={"sub": db_user.email, "user_id": db_user.id})
        
        # 環境変数からフロントエンドのURLを動的に指定してメッセージを送信
        return HTMLResponse(f"""<script>window.opener.postMessage({{'type': 'auth_success', 'token': '{access_token}'}}, '{FRONTEND_URL}'); window.close();</script>""")
    except Exception as e:
        # エラーの詳細をログに出力するとデバッグに役立ちます
        print(f"Auth callback error: {e}")
        raise HTTPException(status_code=401, detail=f"Could not validate credentials: {e}")

@app.get("/api/v1/users/me", response_model=schemas.User)
def read_users_me(current_user_id: int = Depends(auth.get_current_user_from_token), db: Session = Depends(get_db)):
    user = crud.get_user(db, user_id=current_user_id)
    if user is None: 
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.get("/api/v1/sessions", response_model=List[schemas.ChatSession])
def get_sessions(current_user_id: int = Depends(auth.get_current_user_from_token), db: Session = Depends(get_db)):
    return crud.get_sessions_by_user(db=db, user_id=current_user_id)

@app.post("/api/v1/sessions", response_model=schemas.ChatSession)
def create_session(current_user_id: int = Depends(auth.get_current_user_from_token), db: Session = Depends(get_db)):
    return crud.create_user_session(db=db, user_id=current_user_id)

@app.post("/api/v1/sessions/{session_id}/messages", response_model=schemas.ChatMessage)
def create_message(session_id: int, message: schemas.ChatMessageCreate, current_user_id: int = Depends(auth.get_current_user_from_token), db: Session = Depends(get_db)):
    crud.create_chat_message(db=db, session_id=session_id, message=message)
    try:
        history = crud.get_messages_by_session(db, session_id=session_id, limit=10)
        messages_for_api = [{"role": msg.role, "content": msg.content} for msg in history]
        
        completion = openai.chat.completions.create(model="llama3-8b-8192", messages=messages_for_api)
        ai_response_content = completion.choices[0].message.content
    except Exception as e:
        print(f"API Error: {e}")
        ai_response_content = "申し訳ありません、AIとの通信でエラーが発生しました。"
    
    ai_message = schemas.ChatMessageCreate(role="assistant", content=ai_response_content)
    return crud.create_chat_message(db=db, session_id=session_id, message=ai_message)

@app.delete("/api/v1/sessions/{session_id}", status_code=204)
def delete_session_endpoint(session_id: int, current_user_id: int = Depends(auth.get_current_user_from_token), db: Session = Depends(get_db)):
    result = crud.delete_session_by_id(db=db, session_id=session_id, user_id=current_user_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Session not found or not owned by user")
    return Response(status_code=status.HTTP_204_NO_CONTENT)