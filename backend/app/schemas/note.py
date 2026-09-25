from pydantic import BaseModel
from typing import Optional

class NoteCreate(BaseModel):
    project_id: str
    user_id: Optional[str] = "default_user"
    content: str
    updated_at: Optional[str] = None

class NoteResponse(BaseModel):
    project_id: str
    user_id: str
    content: str
    updated_at: str
