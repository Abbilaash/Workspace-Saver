from fastapi import APIRouter
from app.schemas.note import NoteCreate
from app.services.note_service import NoteService

router = APIRouter(prefix="/projects/{project_id}/notes", tags=["notes"])

@router.get("", response_model=dict)
async def get_note(project_id: str):
    note = await NoteService.get_note(project_id)
    return {"success": True, "data": note}

@router.put("", response_model=dict)
async def save_note(project_id: str, data: NoteCreate):
    data.project_id = project_id
    note = await NoteService.save_note(data)
    return {"success": True, "data": note}
