import uuid
from datetime import datetime
from app.db.mongodb import get_database
from app.schemas.snapshot import SnapshotCreate, SnapshotResponse

class SnapshotService:
    @staticmethod
    async def create_snapshot(data: SnapshotCreate):
        db = get_database()
        snap_id = data.id or str(uuid.uuid4())
        now = datetime.utcnow().isoformat()
        user_id = data.user_id or "default_user"
        
        doc = {
            "_id": snap_id,
            "project_id": data.project_id,
            "user_id": user_id,
            "created_at": data.created_at or now,
            "windows": [w.model_dump() for w in data.windows],
            "tab_groups": [g.model_dump() for g in data.tab_groups],
            "tabs_count": data.tabs_count,
            "groups_count": data.groups_count
        }
        
        if db is not None:
            await db.snapshots.update_one({"_id": snap_id}, {"$set": doc}, upsert=True)
            # Update project metadata
            await db.projects.update_one(
                {"_id": data.project_id},
                {
                    "$set": {
                        "updated_at": now,
                        "tabs_count": data.tabs_count,
                        "groups_count": data.groups_count,
                        "last_snapshot_time": doc["created_at"]
                    }
                }
            )

        return SnapshotResponse(
            id=snap_id,
            project_id=data.project_id,
            user_id=user_id,
            created_at=doc["created_at"],
            windows=data.windows,
            tab_groups=data.tab_groups,
            tabs_count=data.tabs_count,
            groups_count=data.groups_count
        )

    @staticmethod
    async def get_snapshots_for_project(project_id: str):
        db = get_database()
        if db is None:
            return []
        cursor = db.snapshots.find({"project_id": project_id}).sort("created_at", -1)
        snapshots = []
        async for doc in cursor:
            snapshots.append(SnapshotResponse(
                id=doc["_id"],
                project_id=doc["project_id"],
                user_id=doc.get("user_id", "default_user"),
                created_at=doc.get("created_at", datetime.utcnow().isoformat()),
                windows=doc.get("windows", []),
                tab_groups=doc.get("tab_groups", []),
                tabs_count=doc.get("tabs_count", 0),
                groups_count=doc.get("groups_count", 0)
            ))
        return snapshots
