import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app import models, schemas
from app.db import get_db
from app.routers.auth import get_current_user
from app.routers.hr_jobs import get_current_hr_manager
from app.utils.email import send_recruitment_email

router = APIRouter(prefix="/hr/email", tags=["hr-email"])
logger = logging.getLogger("hr_email")

@router.post("/send")
def send_candidate_email(
    payload: schemas.HREmailRequest,
    db: Session = Depends(get_db),
    current_user: models.PortalUser = Depends(get_current_hr_manager)
):
    """
    Manually sends a structured HTML notification email to a candidate.
    """
    candidate_id = payload.context.get("candidate_id")
    candidate_name = payload.context.get("candidate_name")
    job_title = payload.context.get("job_title")

    # If candidate_id is provided, automatically populate name and job details from DB
    if candidate_id:
        candidate = db.query(models.CandidateApplication).filter(models.CandidateApplication.id == candidate_id).first()
        if not candidate:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Candidate not found")
            
        if not candidate_name:
            candidate_name = candidate.name
            
        if not job_title:
            job = db.query(models.JobPosition).filter(models.JobPosition.id == candidate.job_id).first()
            if job:
                job_title = job.title
                
    # Fallback default values
    if not candidate_name:
        candidate_name = "Candidate"
    if not job_title:
        job_title = "Applied Position"

    email_status = send_recruitment_email(
        email_type=payload.email_type,
        recipient_email=str(payload.recipient),
        candidate_name=candidate_name,
        job_title=job_title,
        context=payload.context
    )
    
    if email_status == "not_configured":
        return {
            "status": "not_configured",
            "message": f"Email not sent to {payload.recipient} because SMTP credentials are not configured on the server."
        }
    elif email_status == "failed":
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send email. Check SMTP server logs or credentials."
        )
        
    return {"status": "sent", "message": f"Email of type '{payload.email_type}' successfully sent to {payload.recipient}"}
