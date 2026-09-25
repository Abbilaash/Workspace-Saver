from datetime import datetime
from app.db.mongodb import get_database
from app.schemas.note import NoteCreate, NoteResponse

class NoteService:
    @staticmethod
    async def get_note(project_id: str):
        db = get_database()
        if db is None:
            return NoteResponse(project_id=project_id, user_id="default_user", content="", updated_at=datetime.utcnow().isoformat())
        doc = await db.notes.find_one({"project_id": project_id})
        if not doc:
            return NoteResponse(project_id=project_id, user_id="default_user", content="", updated_at=datetime.utcnow().isoformat())
        return NoteResponse(
            project_id=doc["project_id"],
            user_id=doc.get("user_id", "default_user"),
            content=doc.get("content", ""),
            updated_at=doc.get("updated_at", datetime.utcnow().isoformat())
        )

    @staticmethod
    async def save_note(data: NoteCreate):
        db = get_database()
        now = datetime.utcnow().isoformat()
        user_id = data.user_id or "default_user"
        doc = {
            "project_id": data.project_id,
            "user_id": user_id,
            "content": data.content,
            "updated_at": data.updated_at or now
        }
        if db is not None:
            await db.notes.update_one({"project_id": data.project_id}, {"$set": doc}, upsert=True)
        return NoteResponse(project_id=data.project_id, user_id=user_id, content=data.content, updated_at=doc["updated_at"])
