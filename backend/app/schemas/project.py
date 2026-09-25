from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ProjectCreate(BaseModel):
    id: Optional[str] = None
    name: str
    description: Optional[str] = ""
    color: str = "purple"
    user_id: Optional[str] = "default_user"
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    color: Optional[str] = None

class ProjectResponse(BaseModel):
    id: str
    name: str
    description: Optional[str] = ""
    color: str
    user_id: str
    created_at: str
    updated_at: str
    tabs_count: Optional[int] = 0
    groups_count: Optional[int] = 0
    last_snapshot_time: Optional[str] = None
