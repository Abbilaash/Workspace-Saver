from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    id: Optional[str] = None
    name: str
    email: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    created_at: str
