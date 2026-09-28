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
            query = {"$or": [{"user_id": user_id}, {"user_id": "default_user"}, {"user_id": ""}, {"user_id": {"$exists": False}}]}

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

    @staticmethod
    async def get_all_user_data(user_id: str):
        db = get_database()
        if db is None or not user_id:
            return {"projects": [], "snapshots": [], "notes": []}
        
        # Include requested user_id AND default_user / unassigned legacy projects
        query = {
            "user_id": user_id
        }

        # Auto-claim any unassigned/default_user projects to this user_id in MongoDB
        await db.projects.update_many({"$or": [{"user_id": "default_user"}, {"user_id": ""}, {"user_id": {"$exists": False}}]}, {"$set": {"user_id": user_id}})
        await db.snapshots.update_many({"$or": [{"user_id": "default_user"}, {"user_id": ""}, {"user_id": {"$exists": False}}]}, {"$set": {"user_id": user_id}})
        await db.notes.update_many({"$or": [{"user_id": "default_user"}, {"user_id": ""}, {"user_id": {"$exists": False}}]}, {"$set": {"user_id": user_id}})

        # Diagnostic logging for MongoDB database state
        total_in_db = await db.projects.count_documents({})
        matching_user = await db.projects.count_documents({"user_id": user_id})
        existing_user_ids = await db.projects.distinct("user_id")
        print(f"[DB DIAGNOSTIC] Total projects in MongoDB: {total_in_db} | Matching user_id '{user_id}': {matching_user} | Existing user_ids in DB: {existing_user_ids}")

        projects_cursor = db.projects.find({"$or": [{"user_id": user_id}, {"user_id": "default_user"}, {"user_id": ""}, {"user_id": {"$exists": False}}]})
        snapshots_cursor = db.snapshots.find({"$or": [{"user_id": user_id}, {"user_id": "default_user"}, {"user_id": ""}, {"user_id": {"$exists": False}}]})
        notes_cursor = db.notes.find({"$or": [{"user_id": user_id}, {"user_id": "default_user"}, {"user_id": ""}, {"user_id": {"$exists": False}}]})

        projects = []
        async for doc in projects_cursor:
            print("[DB DOC FOUND]:", doc)
            p_id = str(doc.get("id") or doc.get("_id") or "")
            if p_id:
                projects.append({
                    "id": p_id,
                    "name": doc.get("name", "Untitled Project"),
                    "description": doc.get("description", ""),
                    "color": doc.get("color", "purple"),
                    "user_id": user_id,
                    "created_at": doc.get("created_at", datetime.utcnow().isoformat()),
                    "updated_at": doc.get("updated_at", datetime.utcnow().isoformat()),
                    "tabs_count": doc.get("tabs_count", 0),
                    "groups_count": doc.get("groups_count", 0),
                    "last_snapshot_time": doc.get("last_snapshot_time")
                })

        snapshots = []
        async for doc in snapshots_cursor:
            snapshots.append({
                "id": str(doc.get("id") or doc.get("_id") or ""),
                "project_id": doc.get("project_id"),
                "user_id": user_id,
                "created_at": doc.get("created_at"),
                "windows": doc.get("windows", []),
                "tab_groups": doc.get("tab_groups", []),
                "tabs_count": doc.get("tabs_count", 0),
                "groups_count": doc.get("groups_count", 0)
            })

        notes = []
        async for doc in notes_cursor:
            notes.append({
                "project_id": doc.get("project_id"),
                "user_id": user_id,
                "content": doc.get("content", ""),
                "updated_at": doc.get("updated_at")
            })

        return {
            "projects": projects,
            "snapshots": snapshots,
            "notes": notes
        }
