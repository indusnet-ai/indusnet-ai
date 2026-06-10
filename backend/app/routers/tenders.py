from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import json
from app.db import get_db
from app.routers.auth import get_current_user, get_current_evaluator
from app import models, schemas
from app.utils.parsers import extract_text_from_pdf
from app.utils.matrix_generator import generate_requirement_matrix
from app.agents.copilot import copilot_graph

router = APIRouter(tags=["tenders"])

@router.post("/tenders", response_model=schemas.TenderOut)
async def create_tender(
    title: str = Form(...),
    description: str = Form(None),
    file: UploadFile = File(None),
    db: Session = Depends(get_db),
    evaluator: models.PortalUser = Depends(get_current_evaluator)
):
    requirement_matrix = []
    if file:
        file_bytes = await file.read()
        tender_text = extract_text_from_pdf(file_bytes)
        requirement_matrix = generate_requirement_matrix(tender_text)
        
    db_tender = models.Tender(
        title=title,
        description=description,
        requirement_matrix=requirement_matrix
    )
    db.add(db_tender)
    db.commit()
    db.refresh(db_tender)
    return db_tender

@router.get("/tenders", response_model=List[schemas.TenderOut])
def list_tenders(
    db: Session = Depends(get_db),
    current_user: models.PortalUser = Depends(get_current_user)
):
    return db.query(models.Tender).all()

@router.post("/sessions", response_model=schemas.SessionOut)
def create_session(
    session_in: schemas.SessionCreate,
    db: Session = Depends(get_db),
    current_user: models.PortalUser = Depends(get_current_user)
):
    if current_user.role != "bidder":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only bidding company representatives can start a bid session"
        )
        
    existing_session = db.query(models.BidderSession).filter(
        models.BidderSession.tender_id == session_in.tender_id,
        models.BidderSession.company_id == current_user.company_id
    ).first()
    
    if existing_session:
        return existing_session
        
    tender = db.query(models.Tender).filter(models.Tender.id == session_in.tender_id).first()
    if not tender:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tender not found"
        )
        
    db_session = models.BidderSession(
        tender_id=session_in.tender_id,
        company_id=current_user.company_id,
        user_id=current_user.id,
        status="in_progress",
        compliance_score=0.00
    )
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session

@router.get("/sessions", response_model=List[schemas.SessionOut])
def list_sessions(
    db: Session = Depends(get_db),
    current_user: models.PortalUser = Depends(get_current_user)
):
    if current_user.role == "internal_evaluator":
        sessions = db.query(models.BidderSession).all()
        # Eagerly load tender relation
        for s in sessions:
            s.tender = db.query(models.Tender).filter(models.Tender.id == s.tender_id).first()
        return sessions
    else:
        sessions = db.query(models.BidderSession).filter(
            models.BidderSession.company_id == current_user.company_id
        ).all()
        for s in sessions:
            s.tender = db.query(models.Tender).filter(models.Tender.id == s.tender_id).first()
        return sessions

@router.get("/sessions/{session_id}")
def get_session_details(
    session_id: str,
    db: Session = Depends(get_db),
    current_user: models.PortalUser = Depends(get_current_user)
):
    session = db.query(models.BidderSession).filter(models.BidderSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    if current_user.role != "internal_evaluator" and session.company_id != current_user.company_id:
        raise HTTPException(status_code=403, detail="Access denied")
        
    last_chat = db.query(models.ChatHistory).filter(
        models.ChatHistory.session_id == session_id
    ).order_by(models.ChatHistory.created_at.desc()).first()
    
    matrix = None
    if last_chat and last_chat.extracted_data:
        matrix = last_chat.extracted_data
    else:
        matrix = session.tender.requirement_matrix
        
    chats = db.query(models.ChatHistory).filter(
        models.ChatHistory.session_id == session_id
    ).order_by(models.ChatHistory.created_at.asc()).all()
    
    # Pre-populate session and tender relations
    session.tender = session.tender
    
    return {
        "session": session,
        "tender": session.tender,
        "requirement_matrix": matrix or [],
        "chats": chats
    }

@router.post("/sessions/{session_id}/chat")
async def chat_session(
    session_id: str,
    message: str = Form(""),
    file: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user: models.PortalUser = Depends(get_current_user)
):
    session = db.query(models.BidderSession).filter(models.BidderSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    if current_user.role != "internal_evaluator" and session.company_id != current_user.company_id:
        raise HTTPException(status_code=403, detail="Access denied")
        
    uploaded_text = ""
    if file:
        file_bytes = await file.read()
        uploaded_text = extract_text_from_pdf(file_bytes)
        
    last_chat = db.query(models.ChatHistory).filter(
        models.ChatHistory.session_id == session_id
    ).order_by(models.ChatHistory.created_at.desc()).first()
    
    current_matrix = []
    if last_chat and last_chat.extracted_data:
        current_matrix = last_chat.extracted_data
    else:
        current_matrix = session.tender.requirement_matrix or []
        
    db_chats = db.query(models.ChatHistory).filter(
        models.ChatHistory.session_id == session_id
    ).order_by(models.ChatHistory.created_at.asc()).all()
    
    messages_history = []
    for c in db_chats:
        messages_history.append({"role": c.sender, "content": c.message})
        
    user_msg_content = message
    if file:
        prefix = "\n" if user_msg_content else ""
        user_msg_content += f"{prefix}[Uploaded Document: {file.filename}]"
        
    messages_history.append({"role": "user", "content": user_msg_content})
    
    db_user_msg = models.ChatHistory(
        session_id=session_id,
        sender="user",
        message=user_msg_content,
        extracted_data=current_matrix
    )
    db.add(db_user_msg)
    db.commit()
    
    initial_state = {
        "messages": messages_history,
        "requirement_matrix": current_matrix,
        "uploaded_context": uploaded_text,
        "response": "",
        "compliance_score": float(session.compliance_score)
    }
    
    final_state = copilot_graph.invoke(initial_state)
    
    session.compliance_score = final_state["compliance_score"]
    session.last_activity = datetime.utcnow()
    
    db_agent_msg = models.ChatHistory(
        session_id=session_id,
        sender="agent",
        message=final_state["response"],
        extracted_data=final_state["requirement_matrix"]
    )
    db.add(db_agent_msg)
    db.commit()
    db.refresh(session)
    
    return {
        "response": final_state["response"],
        "compliance_score": final_state["compliance_score"],
        "requirement_matrix": final_state["requirement_matrix"]
    }
