import os
from typing import List
from fastapi import FastAPI, Depends, Request, HTTPException, Response, status
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session
from starlette.middleware.sessions import SessionMiddleware
from fastapi.middleware.cors import CORSMiddleware
import openai
from dotenv import load_dotenv
BACKEND_URL = os.getenv("https://chatgpt-mini-g9tk.onrender.com", "http://localhost:8001")
FRONTEND_URL = os.getenv("https://chatgpt-mini-pink.vercel.app", "http://localhost:3002")


# .envファイルを最初に読み込む
load_dotenv()

import models, schemas, crud, auth
from database import SessionLocal, engine

# データベーステーブルを作成
models.Base.metadata.create_all(bind=engine)

# .envファイルからキーを読み込む
openai.api_key = os.getenv("OPENAI_API_KEY")
openai.base_url = os.getenv("OPENAI_API_BASE")
SESSION_SECRET = os.getenv("SESSION_SECRET_KEY", "a_default_secret_key")

app = FastAPI()

origins = [
    "http://localhost:3000", 
    "http://localhost:3002",
    "https://chatgpt-mini-pink.vercel.app"  # <-- VercelのURLを追加
]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
app.add_middleware(
    SessionMiddleware,
    secret_key=SESSION_SECRET,
    https_only=False # http://localhost で動作させるために、この設定のみに絞ります
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/auth/login/google")
async def login_google(request: Request):
    redirect_uri = "http://localhost:8001/auth/callback/google"
    return await auth.oauth.google.authorize_redirect(request, redirect_uri)

@app.get("/auth/callback/google")
async def auth_google_callback(request: Request, db: Session = Depends(get_db)):
    try:
        token = await auth.oauth.google.authorize_access_token(request)
        user_info = token.get('userinfo')
        if not user_info: raise HTTPException(status_code=400, detail="Could not fetch user info")
        
        db_user = crud.get_user_by_email(db, email=user_info['email'])
        if not db_user:
            user_create = schemas.UserCreate(email=user_info['email'], name=user_info['name'], google_id=user_info['sub'])
            db_user = crud.create_user(db=db, user=user_create)

        access_token = auth.create_access_token(data={"sub": db_user.email, "user_id": db_user.id})
        
        return HTMLResponse(f"""<script>window.opener.postMessage({{'type': 'auth_success', 'token': '{access_token}'}}, 'http://localhost:3002'); window.close();</script>""")
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Could not validate credentials: {e}")

@app.get("/api/v1/users/me", response_model=schemas.User)
def read_users_me(current_user_id: int = Depends(auth.get_current_user_from_token), db: Session = Depends(get_db)):
    user = crud.get_user(db, user_id=current_user_id)
    if user is None: raise HTTPException(status_code=404, detail="User not found")
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
    # 成功時は何も返さず、ステータスコード204だけを返す
    return Response(status_code=status.HTTP_204_NO_CONTENT)