from fastapi import APIRouter, HTTPException, status
from app.schemas.user import UserCreate
from app.services.user_service import UserService

router = APIRouter(prefix="/users", tags=["users"])

@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_user(data: UserCreate):
    user = await UserService.create_or_get_user(data)
    return {"success": True, "data": user}

@router.get("/{user_id}", response_model=dict)
async def get_user(user_id: str):
    user = await UserService.get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=404,
            detail={"success": False, "error": {"code": "USER_NOT_FOUND", "message": "User not found"}}
        )
    return {"success": True, "data": user}
