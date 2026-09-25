import uuid
from datetime import datetime
from app.db.mongodb import get_database
from app.schemas.user import UserCreate, UserResponse

class UserService:
    @staticmethod
    async def create_or_get_user(data: UserCreate):
        db = get_database()
        now = datetime.utcnow().isoformat()
        
        # Check if user with same email exists
        if db is not None:
            existing = await db.users.find_one({"email": data.email.lower().strip()})
            if existing:
                return UserResponse(
                    id=existing["_id"],
                    name=existing.get("name", data.name),
                    email=existing["email"],
                    created_at=existing.get("created_at", now)
                )

        user_id = data.id or str(uuid.uuid4())
        doc = {
            "_id": user_id,
            "name": data.name.strip(),
            "email": data.email.lower().strip(),
            "created_at": now
        }

        if db is not None:
            await db.users.update_one({"_id": user_id}, {"$set": doc}, upsert=True)

        return UserResponse(
            id=user_id,
            name=doc["name"],
            email=doc["email"],
            created_at=doc["created_at"]
        )

    @staticmethod
    async def get_user_by_id(user_id: str):
        db = get_database()
        if db is None:
            return None
        doc = await db.users.find_one({"_id": user_id})
        if not doc:
            return None
        return UserResponse(
            id=doc["_id"],
            name=doc.get("name", ""),
            email=doc.get("email", ""),
            created_at=doc.get("created_at", datetime.utcnow().isoformat())
        )
