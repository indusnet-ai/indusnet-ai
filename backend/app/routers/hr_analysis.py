import os
import urllib.request
import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app import models, schemas
from app.db import get_db
from app.routers.auth import get_current_user
from app.routers.hr_jobs import get_current_hr_manager
from app.utils.storage import get_resume_url, LOCAL_UPLOAD_DIR
from app.utils.parser import parse_resume_and_analyze

router = APIRouter(prefix="/hr/analysis", tags=["hr-analysis"])
logger = logging.getLogger("hr_analysis")

@router.get("/{candidate_id}", response_model=schemas.CandidateAIAnalysisOut)
def get_candidate_analysis(
    candidate_id: str,
    db: Session = Depends(get_db),
    current_user: models.PortalUser = Depends(get_current_hr_manager)
):
    analysis = db.query(models.CandidateAIAnalysis).filter(models.CandidateAIAnalysis.candidate_id == candidate_id).first()
    if not analysis:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="AI analysis not found for this candidate")
    return analysis

@router.post("/{candidate_id}/reanalyze", response_model=schemas.CandidateAIAnalysisOut)
def reanalyze_candidate_resume(
    candidate_id: str,
    db: Session = Depends(get_db),
    current_user: models.PortalUser = Depends(get_current_hr_manager)
):
    # 1. Fetch application and job
    application = db.query(models.CandidateApplication).filter(models.CandidateApplication.id == candidate_id).first()
    if not application:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Candidate application not found")
        
    job = db.query(models.JobPosition).filter(models.JobPosition.id == application.job_id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job position not found")
        
    # 2. Retrieve resume file bytes
    file_bytes = b""
    filename = "resume.pdf"
    
    stored_path = application.resume_url
    if stored_path.startswith("/uploads/"):
        filename = os.path.basename(stored_path)
        local_path = os.path.join(LOCAL_UPLOAD_DIR, filename)
        if os.path.exists(local_path):
            try:
                with open(local_path, "rb") as f:
                    file_bytes = f.read()
            except Exception as e:
                logger.error(f"Failed to read local resume file {local_path}: {e}")
                raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to read stored resume file")
        else:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Local resume file not found on disk")
    else:
        # Supabase file - fetch via URL
        resolved_url = get_resume_url(stored_path)
        filename = stored_path.split("/")[-1]
        try:
            req = urllib.request.Request(resolved_url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req) as response:
                file_bytes = response.read()
        except Exception as e:
            logger.error(f"Failed to fetch remote resume file {resolved_url}: {e}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to retrieve remote resume file")

    # 3. Re-run analysis
    try:
        analysis_data = parse_resume_and_analyze(
            file_name=filename,
            file_bytes=file_bytes,
            job_title=job.title,
            job_description=job.description,
            job_requirements=job.requirements
        )
        
        # 4. Update or create CandidateAIAnalysis record
        db_analysis = db.query(models.CandidateAIAnalysis).filter(models.CandidateAIAnalysis.candidate_id == candidate_id).first()
        match_score = analysis_data.get("job_match_score", 0.0)
        
        if db_analysis:
            db_analysis.parsed_resume = analysis_data.get("parsed_resume")
            db_analysis.skills = analysis_data.get("skills")
            db_analysis.strengths = analysis_data.get("strengths")
            db_analysis.weaknesses = analysis_data.get("weaknesses")
            db_analysis.job_match_score = match_score
            db_analysis.summary = analysis_data.get("summary")
            db_analysis.recommended_interview_questions = analysis_data.get("recommended_interview_questions")
        else:
            db_analysis = models.CandidateAIAnalysis(
                candidate_id=candidate_id,
                parsed_resume=analysis_data.get("parsed_resume"),
                skills=analysis_data.get("skills"),
                strengths=analysis_data.get("strengths"),
                weaknesses=analysis_data.get("weaknesses"),
                job_match_score=match_score,
                summary=analysis_data.get("summary"),
                recommended_interview_questions=analysis_data.get("recommended_interview_questions")
            )
            db.add(db_analysis)
            
        # Update the application match score as well
        application.ai_score = match_score
        
        db.commit()
        db.refresh(db_analysis)
        return db_analysis
        
    except Exception as e:
        logger.error(f"Failed to reanalyze candidate {candidate_id}: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Reanalysis failed: {str(e)}")
