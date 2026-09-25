from pydantic import BaseModel, Field
from typing import List, Optional

class WorkspaceTabSchema(BaseModel):
    url: str
    title: str
    index: int
    active: bool = False
    pinned: bool = False
    muted: bool = False
    groupId: Optional[int] = None
    scrollX: Optional[float] = 0
    scrollY: Optional[float] = 0
    selectedText: Optional[str] = None

class WorkspaceWindowSchema(BaseModel):
    originalWindowId: Optional[int] = None
    left: Optional[int] = None
    top: Optional[int] = None
    width: Optional[int] = None
    height: Optional[int] = None
    tabs: List[WorkspaceTabSchema] = []

class TabGroupSchema(BaseModel):
    id: int
    title: str
    color: str
    collapsed: Optional[bool] = False

class SnapshotCreate(BaseModel):
    id: Optional[str] = None
    project_id: str
    user_id: Optional[str] = "default_user"
    created_at: Optional[str] = None
    windows: List[WorkspaceWindowSchema] = []
    tab_groups: List[TabGroupSchema] = []
    tabs_count: int = 0
    groups_count: int = 0

class SnapshotResponse(BaseModel):
    id: str
    project_id: str
    user_id: str
    created_at: str
    windows: List[WorkspaceWindowSchema]
    tab_groups: List[TabGroupSchema] = []
    tabs_count: int
    groups_count: int
