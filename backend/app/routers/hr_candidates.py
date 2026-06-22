from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app import models, schemas
from app.db import get_db
from app.routers.auth import get_current_user
from app.routers.hr_jobs import get_current_hr_manager
from app.utils.storage import get_resume_url

router = APIRouter(prefix="/hr/candidates", tags=["hr-candidates"])

@router.get("/{candidate_id}", response_model=schemas.CandidateProfileOut)
def get_candidate_profile(
    candidate_id: str,
    db: Session = Depends(get_db),
    current_user: models.PortalUser = Depends(get_current_hr_manager)
):
    application = db.query(models.CandidateApplication).filter(models.CandidateApplication.id == candidate_id).first()
    if not application:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Candidate application not found")
        
    analysis = db.query(models.CandidateAIAnalysis).filter(models.CandidateAIAnalysis.candidate_id == candidate_id).first()
    
    # Resolve storage link to actual signed URL or public local fallback URL
    application_out = schemas.CandidateApplicationOut.model_validate(application)
    application_out.resume_url = get_resume_url(application.resume_url)
    
    return {
        "application": application_out,
        "analysis": analysis
    }

@router.get("/{candidate_id}/resume")
def get_candidate_resume_link(
    candidate_id: str,
    db: Session = Depends(get_db),
    current_user: models.PortalUser = Depends(get_current_hr_manager)
):
    application = db.query(models.CandidateApplication).filter(models.CandidateApplication.id == candidate_id).first()
    if not application:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Candidate application not found")
        
    resolved_url = get_resume_url(application.resume_url)
    return {"url": resolved_url}
