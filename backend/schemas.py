# schemas.py
from pydantic import BaseModel, ConfigDict
from datetime import datetime

# --- ChatMessage Schemas ---
class ChatMessageBase(BaseModel):
    role: str
    content: str

class ChatMessageCreate(ChatMessageBase):
    pass

class ChatMessage(ChatMessageBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# --- ChatSession Schemas ---
class ChatSessionBase(BaseModel):
    title: str

class ChatSessionCreate(ChatSessionBase):
    pass

class ChatSession(ChatSessionBase):
    id: int
    owner_id: int
    created_at: datetime
    messages: list[ChatMessage] = []

    model_config = ConfigDict(from_attributes=True)

# --- User Schemas ---
class UserBase(BaseModel):
    email: str
    name: str | None = None

class UserCreate(UserBase):
    google_id: str | None = None

class User(UserBase):
    id: int
    google_id: str | None = None
    sessions: list[ChatSession] = []

    model_config = ConfigDict(from_attributes=True)