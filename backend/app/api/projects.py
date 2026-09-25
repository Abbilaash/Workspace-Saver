from fastapi import APIRouter, HTTPException, status
from typing import Optional
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse
from app.services.project_service import ProjectService

router = APIRouter(prefix="/projects", tags=["projects"])

@router.get("", response_model=dict)
async def list_projects(user_id: Optional[str] = None):
    projects = await ProjectService.list_projects(user_id=user_id)
    return {"success": True, "data": projects}

@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_project(data: ProjectCreate):
    project = await ProjectService.create_project(data)
    return {"success": True, "data": project}

@router.delete("/clear-cloud", response_model=dict)
async def clear_cloud_data():
    await ProjectService.clear_all_cloud_data()
    return {"success": True, "data": {"message": "All cloud database records cleared successfully"}}

@router.get("/{project_id}", response_model=dict)
async def get_project(project_id: str):
    project = await ProjectService.get_project(project_id)
    if not project:
        raise HTTPException(
            status_code=404,
            detail={"success": False, "error": {"code": "PROJECT_NOT_FOUND", "message": "Project not found"}}
        )
    return {"success": True, "data": project}

@router.patch("/{project_id}", response_model=dict)
async def update_project(project_id: str, data: ProjectUpdate):
    project = await ProjectService.update_project(project_id, data)
    if not project:
        raise HTTPException(
            status_code=404,
            detail={"success": False, "error": {"code": "PROJECT_NOT_FOUND", "message": "Project not found"}}
        )
    return {"success": True, "data": project}

@router.delete("/{project_id}", response_model=dict)
async def delete_project(project_id: str):
    await ProjectService.delete_project(project_id)
    return {"success": True, "data": {"message": "Project deleted successfully"}}
