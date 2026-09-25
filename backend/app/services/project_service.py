import uuid
from typing import Optional
from datetime import datetime
from app.db.mongodb import get_database
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse

class ProjectService:
    @staticmethod
    async def list_projects(user_id: Optional[str] = None):
        db = get_database()
        if db is None:
            return []
        
        query = {}
        if user_id and user_id != "all":
            query = {"user_id": user_id}

        cursor = db.projects.find(query).sort("updated_at", -1)
        projects = []
        async for doc in cursor:
            proj_id = str(doc.get("id") or doc.get("_id") or "")
            if not proj_id:
                continue
            projects.append(ProjectResponse(
                id=proj_id,
                name=doc.get("name", "Untitled Project"),
                description=doc.get("description", ""),
                color=doc.get("color", "purple"),
                user_id=doc.get("user_id", "default_user"),
                created_at=doc.get("created_at", datetime.utcnow().isoformat()),
                updated_at=doc.get("updated_at", datetime.utcnow().isoformat()),
                tabs_count=doc.get("tabs_count", 0),
                groups_count=doc.get("groups_count", 0),
                last_snapshot_time=doc.get("last_snapshot_time")
            ))
        return projects

    @staticmethod
    async def create_project(data: ProjectCreate):
        db = get_database()
        proj_id = data.id or str(uuid.uuid4())
        now = datetime.utcnow().isoformat()
        doc = {
            "_id": proj_id,
            "id": proj_id,
            "name": data.name,
            "description": data.description or "",
            "color": data.color or "purple",
            "user_id": data.user_id or "default_user",
            "created_at": data.created_at or now,
            "updated_at": data.updated_at or now,
            "tabs_count": 0,
            "groups_count": 0
        }
        if db is not None:
            await db.projects.update_one({"_id": proj_id}, {"$set": doc}, upsert=True)
        return ProjectResponse(
            id=proj_id,
            name=doc["name"],
            description=doc["description"],
            color=doc["color"],
            user_id=doc["user_id"],
            created_at=doc["created_at"],
            updated_at=doc["updated_at"],
            tabs_count=doc["tabs_count"],
            groups_count=doc["groups_count"]
        )

    @staticmethod
    async def get_project(project_id: str):
        db = get_database()
        if db is None or not project_id or project_id == "undefined":
            return None
        doc = await db.projects.find_one({"$or": [{"_id": project_id}, {"id": project_id}]})
        if not doc:
            return None
        proj_id = str(doc.get("id") or doc.get("_id") or "")
        return ProjectResponse(
            id=proj_id,
            name=doc.get("name", "Untitled Project"),
            description=doc.get("description", ""),
            color=doc.get("color", "purple"),
            user_id=doc.get("user_id", "default_user"),
            created_at=doc.get("created_at", datetime.utcnow().isoformat()),
            updated_at=doc.get("updated_at", datetime.utcnow().isoformat()),
            tabs_count=doc.get("tabs_count", 0),
            groups_count=doc.get("groups_count", 0),
            last_snapshot_time=doc.get("last_snapshot_time")
        )

    @staticmethod
    async def update_project(project_id: str, data: ProjectUpdate):
        db = get_database()
        if db is None or not project_id or project_id == "undefined":
            return None
        update_data = {k: v for k, v in data.model_dump().items() if v is not None}
        if not update_data:
            return await ProjectService.get_project(project_id)
        update_data["updated_at"] = datetime.utcnow().isoformat()
        await db.projects.update_one({"$or": [{"_id": project_id}, {"id": project_id}]}, {"$set": update_data})
        return await ProjectService.get_project(project_id)

    @staticmethod
    async def delete_project(project_id: str):
        db = get_database()
        if db is not None and project_id and project_id != "undefined":
            await db.projects.delete_one({"$or": [{"_id": project_id}, {"id": project_id}]})
            await db.snapshots.delete_many({"project_id": project_id})
            await db.notes.delete_one({"project_id": project_id})
        return True

    @staticmethod
    async def clear_all_cloud_data():
        db = get_database()
        if db is not None:
            await db.projects.delete_many({})
            await db.snapshots.delete_many({})
            await db.notes.delete_many({})
        return True
