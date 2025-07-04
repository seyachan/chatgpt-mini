# backend/crud.py
from sqlalchemy.orm import Session
import models, schemas

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(email=user.email, name=user.name, google_id=user.google_id)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_sessions_by_user(db: Session, user_id: int):
    return db.query(models.ChatSession).filter(models.ChatSession.owner_id == user_id).order_by(models.ChatSession.created_at.desc()).all()

def create_user_session(db: Session, user_id: int):
    db_session = models.ChatSession(owner_id=user_id, title="新しいチャット")
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session

def get_messages_by_session(db: Session, session_id: int, limit: int = 20):
    return db.query(models.ChatMessage).filter(models.ChatMessage.session_id == session_id).order_by(models.ChatMessage.created_at.asc()).limit(limit).all()

def create_chat_message(db: Session, session_id: int, message: schemas.ChatMessageCreate):
    db_message = models.ChatMessage(**message.model_dump(), session_id=session_id)
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message
    
def delete_session_by_id(db: Session, session_id: int, user_id: int):
    db_session = db.query(models.ChatSession).filter(models.ChatSession.id == session_id, models.ChatSession.owner_id == user_id).first()
    if db_session:
        db.delete(db_session)
        db.commit()
        return {"ok": True}
    return None