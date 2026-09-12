import os
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse, RedirectResponse
from sqlalchemy.orm import Session
from app import models, schemas
from app.db import get_db
from app.routers.hr_jobs import get_current_hr_manager
from app.utils.storage import get_resume_url, LOCAL_UPLOAD_DIR, WORKSPACE_DIR, get_content_type

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
    offer = db.query(models.CandidateOffer).filter(models.CandidateOffer.candidate_id == candidate_id).first()
    
    application_out = schemas.CandidateApplicationOut.model_validate(application)
    application_out.resume_url = f"/api/backend/hr/candidates/{candidate_id}/resume/file"
    
    analysis_out = schemas.CandidateAIAnalysisOut.model_validate(analysis) if analysis else None
    offer_out = schemas.CandidateOfferOut.model_validate(offer) if offer else None
    
    return {
        "application": application_out,
        "analysis": analysis_out,
        "offer": offer_out
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
        
    return {"url": f"/api/backend/hr/candidates/{candidate_id}/resume/file"}

@router.get("/{candidate_id}/resume/file")
def get_candidate_resume_file(
    candidate_id: str,
    db: Session = Depends(get_db),
    current_user: models.PortalUser = Depends(get_current_hr_manager)
):
    """
    Protected resume file download endpoint. Only HR Managers can access.
    """
    application = db.query(models.CandidateApplication).filter(models.CandidateApplication.id == candidate_id).first()
    if not application:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Candidate application not found")

    stored_path = application.resume_url
    if stored_path.startswith("supabase://"):
        signed_url = get_resume_url(stored_path)
        return RedirectResponse(url=signed_url)

    filename = os.path.basename(stored_path)
    file_path = os.path.join(LOCAL_UPLOAD_DIR, filename)
    if not os.path.exists(file_path):
        legacy_path = os.path.join(WORKSPACE_DIR, "public", "uploads", filename)
        if os.path.exists(legacy_path):
            file_path = legacy_path
        else:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume file not found")

    content_type = get_content_type(filename)
    return FileResponse(file_path, media_type=content_type, filename=filename)
