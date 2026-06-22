import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Numeric, JSON
from sqlalchemy.orm import relationship
from app.db import Base

def generate_uuid():
    return str(uuid.uuid4())

class BiddingCompany(Base):
    __tablename__ = "bidding_companies"
    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    registration_number = Column(String(100), unique=True, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    users = relationship("PortalUser", back_populates="company")
    sessions = relationship("BidderSession", back_populates="company")

class PortalUser(Base):
    __tablename__ = "portal_users"
    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), default="bidder", nullable=False)  # 'bidder', 'internal_evaluator'
    company_id = Column(String(36), ForeignKey("bidding_companies.id", ondelete="SET NULL"), nullable=True)
    name = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    company = relationship("BiddingCompany", back_populates="users")
    sessions = relationship("BidderSession", back_populates="user")

class Tender(Base):
    __tablename__ = "tenders"
    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    requirement_matrix = Column(JSON, nullable=True)  # Structured requirements JSON
    status = Column(String(50), default="open", nullable=False)  # 'open', 'closed'
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    sessions = relationship("BidderSession", back_populates="tender")

class BidderSession(Base):
    __tablename__ = "bidder_sessions"
    id = Column(String(36), primary_key=True, default=generate_uuid)
    tender_id = Column(String(36), ForeignKey("tenders.id", ondelete="CASCADE"), nullable=False)
    company_id = Column(String(36), ForeignKey("bidding_companies.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(String(36), ForeignKey("portal_users.id", ondelete="CASCADE"), nullable=False)
    status = Column(String(50), default="in_progress", nullable=False)  # 'in_progress', 'submitted', 'evaluated'
    compliance_score = Column(Numeric(5, 2), default=0.00, nullable=False)
    last_activity = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    tender = relationship("Tender", back_populates="sessions")
    company = relationship("BiddingCompany", back_populates="sessions")
    user = relationship("PortalUser", back_populates="sessions")
    chats = relationship("ChatHistory", back_populates="session")

class ChatHistory(Base):
    __tablename__ = "chat_history"
    id = Column(String(36), primary_key=True, default=generate_uuid)
    session_id = Column(String(36), ForeignKey("bidder_sessions.id", ondelete="CASCADE"), nullable=False)
    sender = Column(String(50), nullable=False)  # 'user', 'agent'
    message = Column(Text, nullable=False)
    extracted_data = Column(JSON, nullable=True)  # Structured JSON state of checklist
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    session = relationship("BidderSession", back_populates="chats")

class JobPosition(Base):
    __tablename__ = "job_positions"
    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(255), nullable=False)
    department = Column(String(100), nullable=False)
    employment_type = Column(String(50), nullable=False)
    location = Column(String(100), nullable=False)
    salary_range = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    requirements = Column(Text, nullable=False)
    status = Column(String(20), default="active", nullable=False)  # 'active', 'draft', 'closed'
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    applications = relationship("CandidateApplication", back_populates="job", cascade="all, delete-orphan")

class CandidateApplication(Base):
    __tablename__ = "candidate_applications"
    id = Column(String(36), primary_key=True, default=generate_uuid)
    job_id = Column(String(36), ForeignKey("job_positions.id", ondelete="CASCADE"), nullable=False)
    
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=False)
    
    current_company = Column(String(255), nullable=True)
    current_designation = Column(String(255), nullable=True)
    
    experience_years = Column(Numeric(5, 2), default=0.00, nullable=False)
    
    expected_salary = Column(String(100), nullable=True)
    notice_period = Column(String(100), nullable=True)
    
    linkedin_url = Column(Text, nullable=True)
    portfolio_url = Column(Text, nullable=True)
    
    resume_url = Column(Text, nullable=False)
    application_status = Column(String(50), default="applied", nullable=False)  # 'applied', 'review', 'interview', 'offered', 'rejected'
    
    ai_score = Column(Numeric(5, 2), default=0.00, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    job = relationship("JobPosition", back_populates="applications")
    analysis = relationship("CandidateAIAnalysis", back_populates="candidate", uselist=False, cascade="all, delete-orphan")

class CandidateAIAnalysis(Base):
    __tablename__ = "candidate_ai_analysis"
    id = Column(String(36), primary_key=True, default=generate_uuid)
    candidate_id = Column(String(36), ForeignKey("candidate_applications.id", ondelete="CASCADE"), nullable=False)
    
    parsed_resume = Column(JSON, nullable=True)  # JSON representation of resume text components
    skills = Column(JSON, nullable=True)  # JSON array of skills
    strengths = Column(JSON, nullable=True)  # JSON array of strengths
    weaknesses = Column(JSON, nullable=True)  # JSON array of weaknesses
    
    job_match_score = Column(Numeric(5, 2), default=0.00, nullable=False)
    summary = Column(Text, nullable=True)
    recommended_interview_questions = Column(JSON, nullable=True)  # JSON array of interview questions
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    candidate = relationship("CandidateApplication", back_populates="analysis")

