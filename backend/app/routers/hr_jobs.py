from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app import models, schemas
from app.db import get_db
from app.routers.auth import get_current_user

router = APIRouter(prefix="/hr/jobs", tags=["hr-jobs"])

def get_current_hr_manager(current_user: models.PortalUser = Depends(get_current_user)) -> models.PortalUser:
    if current_user.role != "hr_manager":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user does not have enough privileges (HR Manager role required)"
        )
    return current_user

@router.post("", response_model=schemas.JobPositionOut, status_code=status.HTTP_201_CREATED)
def create_job(job_in: schemas.JobPositionCreate, db: Session = Depends(get_db), current_user: models.PortalUser = Depends(get_current_hr_manager)):
    db_job = models.JobPosition(
        title=job_in.title,
        department=job_in.department,
        employment_type=job_in.employment_type,
        location=job_in.location,
        salary_range=job_in.salary_range,
        description=job_in.description,
        requirements=job_in.requirements,
        status="active"
    )
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job

@router.get("", response_model=List[schemas.JobPositionOut])
def list_jobs(status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.JobPosition)
    if status:
        query = query.filter(models.JobPosition.status == status)
    else:
        # Default for anonymous/public listings is active only unless filtered
        query = query.filter(models.JobPosition.status == "active")
    return query.order_by(models.JobPosition.created_at.desc()).all()

@router.get("/all", response_model=List[schemas.JobPositionOut])
def list_all_jobs(db: Session = Depends(get_db), current_user: models.PortalUser = Depends(get_current_hr_manager)):
    # Returns all jobs regardless of status for HR manager
    return db.query(models.JobPosition).order_by(models.JobPosition.created_at.desc()).all()

@router.get("/{job_id}", response_model=schemas.JobPositionOut)
def get_job(job_id: str, db: Session = Depends(get_db)):
    job = db.query(models.JobPosition).filter(models.JobPosition.id == job_id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job position not found")
    return job

@router.put("/{job_id}", response_model=schemas.JobPositionOut)
def update_job(
    job_id: str,
    job_update: schemas.JobPositionUpdate,
    db: Session = Depends(get_db),
    current_user: models.PortalUser = Depends(get_current_hr_manager)
):
    job = db.query(models.JobPosition).filter(models.JobPosition.id == job_id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job position not found")
        
    update_data = job_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(job, key, value)
        
    db.commit()
    db.refresh(job)
    return job

@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_job(job_id: str, db: Session = Depends(get_db), current_user: models.PortalUser = Depends(get_current_hr_manager)):
    job = db.query(models.JobPosition).filter(models.JobPosition.id == job_id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job position not found")
        
    db.delete(job)
    db.commit()
    return None
