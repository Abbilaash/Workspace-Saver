import httpx
import jwt
from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException, Header, status
from pydantic import BaseModel, ConfigDict
from typing import Optional

from app.config import settings
from app.db.mongodb import get_database

router = APIRouter(prefix="/auth", tags=["auth"])

class GoogleAuthRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id_token: Optional[str] = None
    access_token: Optional[str] = None
    email: Optional[str] = None
    name: Optional[str] = None
    picture: Optional[str] = None
    google_id: Optional[str] = None

def create_jwt_token(user_id: str, email: str) -> str:
    expiration = datetime.utcnow() + timedelta(days=settings.JWT_EXPIRE_DAYS) # 180 days (6 months)
    payload = {
        "sub": user_id,
        "email": email,
        "exp": expiration,
        "iat": datetime.utcnow()
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm="HS256")

@router.post("/google", response_model=dict)
async def authenticate_google(payload: GoogleAuthRequest):
    email = payload.email
    name = payload.name or "Workspace User"
    picture = payload.picture or ""
    google_id = payload.google_id

    # 1. If id_token provided, verify with Google OAuth2 API
    if payload.id_token:
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.get(f"https://oauth2.googleapis.com/tokeninfo?id_token={payload.id_token}")
                if res.status_code == 200:
                    token_info = res.json()
                    email = token_info.get("email") or email
                    name = token_info.get("name") or name
                    picture = token_info.get("picture") or picture
                    google_id = token_info.get("sub") or google_id
        except Exception as e:
            print(f"Google ID token verification fallback: {e}")

    # 2. If access_token provided, fetch userinfo from Google API
    if not email and payload.access_token:
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.get(
                    "https://www.googleapis.com/oauth2/v3/userinfo",
                    headers={"Authorization": f"Bearer {payload.access_token}"}
                )
                if res.status_code == 200:
                    user_info = res.json()
                    email = user_info.get("email") or email
                    name = user_info.get("name") or name
                    picture = user_info.get("picture") or picture
                    google_id = user_info.get("sub") or google_id
        except Exception as e:
            print(f"Google access token verification fallback: {e}")

    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"success": False, "error": {"code": "AUTH_FAILED", "message": "Could not verify Google account details"}}
        )

    db = get_database()
    now = datetime.utcnow().isoformat()
    user_id = google_id or email.replace("@", "_at_").replace(".", "_")

    user_doc = {
        "_id": user_id,
        "id": user_id,
        "google_id": google_id,
        "email": email,
        "name": name,
        "picture": picture,
        "last_login": now,
        "updated_at": now
    }

    if db is not None:
        await db.users.update_one(
            {"$or": [{"_id": user_id}, {"email": email}]},
            {
                "$set": user_doc,
                "$setOnInsert": {"created_at": now}
            },
            upsert=True
        )

    # Issue 6-month JWT token
    token = create_jwt_token(user_id, email)

    return {
        "success": True,
        "data": {
            "token": token,
            "user": {
                "id": user_id,
                "google_id": google_id,
                "email": email,
                "name": name,
                "picture": picture
            }
        }
    }
