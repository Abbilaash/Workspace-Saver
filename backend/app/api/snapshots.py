from fastapi import APIRouter, HTTPException, status
from app.schemas.snapshot import SnapshotCreate
from app.services.snapshot_service import SnapshotService

router = APIRouter(prefix="/projects/{project_id}/snapshots", tags=["snapshots"])

@router.get("", response_model=dict)
async def list_snapshots(project_id: str):
    snapshots = await SnapshotService.get_snapshots_for_project(project_id)
    return {"success": True, "data": snapshots}

@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_snapshot(project_id: str, data: SnapshotCreate):
    data.project_id = project_id
    snapshot = await SnapshotService.create_snapshot(data)
    return {"success": True, "data": snapshot}
