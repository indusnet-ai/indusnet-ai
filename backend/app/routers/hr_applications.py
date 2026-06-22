import logging
from fastapi import APIRouter, Depends, HTTPException, status, Form, File, UploadFile, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
from app import models, schemas
from app.db import get_db, SessionLocal
from app.routers.auth import get_current_user
from app.routers.hr_jobs import get_current_hr_manager
from app.utils.storage import save_resume, get_resume_url
from app.utils.email import send_recruitment_email
from app.utils.parser import parse_resume_and_analyze

router = APIRouter(prefix="/hr/applications", tags=["hr-applications"])
logger = logging.getLogger("hr_applications")

def run_background_analysis_and_email(
    application_id: str,
    file_name: str,
    file_bytes: bytes,
    job_id: str,
    candidate_name: str,
    candidate_email: str
):
    """
    Background worker that runs the resume parsing via OpenAI and updates the candidate's AI score,
    then triggers the application confirmation email.
    """
    db: Session = SessionLocal()
    job_title = "Applied Position"
    try:
        # 1. Get job position details for analysis context
        job = db.query(models.JobPosition).filter(models.JobPosition.id == job_id).first()
        if not job:
            logger.error(f"Job position {job_id} not found in background task for application {application_id}")
            return
            
        job_title = job.title
        job_description = job.description
        job_requirements = job.requirements
        
        # 2. Run OpenAI analysis
        logger.info(f"Running resume analysis for application {application_id}")
        analysis_data = parse_resume_and_analyze(
            file_name=file_name,
            file_bytes=file_bytes,
            job_title=job_title,
            job_description=job_description,
            job_requirements=job_requirements
        )
        
        # 3. Create CandidateAIAnalysis record
        match_score = analysis_data.get("job_match_score", 0.0)
        db_analysis = models.CandidateAIAnalysis(
            candidate_id=application_id,
            parsed_resume=analysis_data.get("parsed_resume"),
            skills=analysis_data.get("skills"),
            strengths=analysis_data.get("strengths"),
            weaknesses=analysis_data.get("weaknesses"),
            job_match_score=match_score,
            summary=analysis_data.get("summary"),
            recommended_interview_questions=analysis_data.get("recommended_interview_questions")
        )
        db.add(db_analysis)
        
        # 4. Update the application's AI score
        application = db.query(models.CandidateApplication).filter(models.CandidateApplication.id == application_id).first()
        if application:
            application.ai_score = match_score
            
        db.commit()
        logger.info(f"Successfully saved AI analysis and updated AI score for application {application_id}")
        
    except Exception as e:
        logger.error(f"Failed background parsing for application {application_id}: {e}")
    finally:
        db.close()
        
    # 5. Send Email (fails gracefully inside, and does not require active DB session)
    try:
        send_recruitment_email(
            email_type="applied",
            recipient_email=candidate_email,
            candidate_name=candidate_name,
            job_title=job_title,
            context={}
        )
    except Exception as ee:
        logger.error(f"Failed sending application confirmation email: {ee}")

@router.post("", response_model=schemas.CandidateApplicationOut, status_code=status.HTTP_201_CREATED)
async def submit_application(
    job_id: str = Form(...),
    name: str = Form(...),
    email: str = Form(...),
    phone: str = Form(...),
    experience_years: float = Form(...),
    current_company: Optional[str] = Form(None),
    current_designation: Optional[str] = Form(None),
    expected_salary: Optional[str] = Form(None),
    notice_period: Optional[str] = Form(None),
    linkedin_url: Optional[str] = Form(None),
    portfolio_url: Optional[str] = Form(None),
    resume: UploadFile = File(...),
    background_tasks: BackgroundTasks = BackgroundTasks(),
    db: Session = Depends(get_db)
):
    # Verify job position exists
    job = db.query(models.JobPosition).filter(models.JobPosition.id == job_id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job position not found")

    # Read and store resume file
    try:
        resume_bytes = await resume.read()
        stored_path = save_resume(resume.filename, resume_bytes)
    except Exception as e:
        logger.error(f"Resume upload failed: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to upload resume file")

    # Create application record
    db_application = models.CandidateApplication(
        job_id=job_id,
        name=name,
        email=email,
        phone=phone,
        current_company=current_company,
        current_designation=current_designation,
        experience_years=experience_years,
        expected_salary=expected_salary,
        notice_period=notice_period,
        linkedin_url=linkedin_url,
        portfolio_url=portfolio_url,
        resume_url=stored_path,
        application_status="applied",
        ai_score=0.0
    )
    db.add(db_application)
    db.commit()
    db.refresh(db_application)

    # Queue background task for parsing and emailing
    background_tasks.add_task(
        run_background_analysis_and_email,
        application_id=db_application.id,
        file_name=resume.filename,
        file_bytes=resume_bytes,
        job_id=job_id,
        candidate_name=name,
        candidate_email=email
    )

    return db_application

@router.get("", response_model=List[schemas.CandidateApplicationOut])
def list_applications(
    job_id: Optional[str] = None,
    application_status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: models.PortalUser = Depends(get_current_hr_manager)
):
    query = db.query(models.CandidateApplication)
    if job_id:
        query = query.filter(models.CandidateApplication.job_id == job_id)
    if application_status:
        query = query.filter(models.CandidateApplication.application_status == application_status)
    return query.order_by(models.CandidateApplication.created_at.desc()).all()

@router.put("/{application_id}/status", response_model=schemas.CandidateApplicationOut)
def update_application_status(
    application_id: str,
    status_update: schemas.JobPositionUpdate,  # Reuse or check fields; we can use a custom schema or update schema
    db: Session = Depends(get_db),
    current_user: models.PortalUser = Depends(get_current_hr_manager)
):
    # Wait, we need the status field. The Pydantic status_update may have status or we can just expect it.
    # JobPositionUpdate has status, but let's make sure it is safe.
    status_str = status_update.status
    if not status_str:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Status field is required")
        
    application = db.query(models.CandidateApplication).filter(models.CandidateApplication.id == application_id).first()
    if not application:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
        
    old_status = application.application_status
    application.application_status = status_str
    db.commit()
    db.refresh(application)
    
    # If the status changed, trigger automated email communication in a thread-safe way
    if old_status != status_str:
        try:
            job = db.query(models.JobPosition).filter(models.JobPosition.id == application.job_id).first()
            email_type = None
            if status_str == "review":
                email_type = "review"
            elif status_str == "interview":
                email_type = "interview"
            elif status_str == "offered":
                email_type = "offer"
            elif status_str == "rejected":
                email_type = "rejection"
                
            if email_type:
                # Provide standard contexts for interview and offer
                context = {}
                if email_type == "interview":
                    context = {
                        "date_time": "Next 3 business days (to be coordinated)",
                        "details": "We will email you a calendar invite link shortly."
                    }
                elif email_type == "offer":
                    context = {
                        "salary": application.expected_salary or "As discussed during the interview",
                        "start_date": "To be determined"
                    }
                send_recruitment_email(
                    email_type=email_type,
                    recipient_email=application.email,
                    candidate_name=application.name,
                    job_title=job.title if job else "Position",
                    context=context
                )
        except Exception as e:
            logger.error(f"Failed to send automated status transition email: {e}")
            
    return application
