from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime

class CompanyCreate(BaseModel):
    name: str
    registration_number: Optional[str] = None

class CompanyOut(BaseModel):
    id: str
    name: str
    registration_number: Optional[str]
    created_at: datetime
    class Config:
        from_attributes = True

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: Optional[str] = None
    company_name: Optional[str] = None  # If provided, creates a company
    role: Optional[str] = "bidder"  # 'bidder', 'internal_evaluator'

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: str
    email: EmailStr
    role: str
    name: Optional[str]
    company_id: Optional[str]
    created_at: datetime
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

class TenderCreate(BaseModel):
    title: str
    description: Optional[str] = None
    requirement_matrix: Optional[List[Dict[str, Any]]] = None

class TenderOut(BaseModel):
    id: str
    title: str
    description: Optional[str]
    requirement_matrix: Optional[List[Dict[str, Any]]]
    status: str
    created_at: datetime
    class Config:
        from_attributes = True

class SessionCreate(BaseModel):
    tender_id: str

class SessionOut(BaseModel):
    id: str
    tender: Optional[TenderOut] = None
    tender_id: str
    company_id: str
    company: Optional[CompanyOut] = None
    user_id: str
    status: str
    compliance_score: float
    last_activity: datetime
    created_at: datetime
    class Config:
        from_attributes = True

class ChatMessageOut(BaseModel):
    id: str
    session_id: str
    sender: str
    message: str
    extracted_data: Optional[List[Dict[str, Any]]] = None
    created_at: datetime
    class Config:
        from_attributes = True

# --- HR MODULE SCHEMAS ---

class JobPositionCreate(BaseModel):
    title: str
    department: str
    employment_type: str
    location: str
    salary_range: str
    description: str
    requirements: str

class JobPositionUpdate(BaseModel):
    title: Optional[str] = None
    department: Optional[str] = None
    employment_type: Optional[str] = None
    location: Optional[str] = None
    salary_range: Optional[str] = None
    description: Optional[str] = None
    requirements: Optional[str] = None
    status: Optional[str] = None

class JobPositionOut(BaseModel):
    id: str
    title: str
    department: str
    employment_type: str
    location: str
    salary_range: str
    description: str
    requirements: str
    status: str
    created_at: datetime
    class Config:
        from_attributes = True

class CandidateApplicationCreate(BaseModel):
    job_id: str
    name: str
    email: EmailStr
    phone: str
    current_company: Optional[str] = None
    current_designation: Optional[str] = None
    experience_years: float
    expected_salary: Optional[str] = None
    notice_period: Optional[str] = None
    linkedin_url: Optional[str] = None
    portfolio_url: Optional[str] = None

class CandidateApplicationOut(BaseModel):
    id: str
    job_id: str
    name: str
    email: str
    phone: str
    current_company: Optional[str]
    current_designation: Optional[str]
    experience_years: float
    expected_salary: Optional[str]
    notice_period: Optional[str]
    linkedin_url: Optional[str]
    portfolio_url: Optional[str]
    resume_url: str
    application_status: str
    ai_score: float
    created_at: datetime
    class Config:
        from_attributes = True

class CandidateAIAnalysisOut(BaseModel):
    id: str
    candidate_id: str
    parsed_resume: Optional[Dict[str, Any]]
    skills: Optional[List[str]]
    strengths: Optional[List[str]]
    weaknesses: Optional[List[str]]
    job_match_score: float
    summary: Optional[str]
    recommended_interview_questions: Optional[List[Dict[str, Any]]]
    created_at: datetime
    class Config:
        from_attributes = True

class CandidateProfileOut(BaseModel):
    application: CandidateApplicationOut
    analysis: Optional[CandidateAIAnalysisOut] = None
    class Config:
        from_attributes = True

class HREmailRequest(BaseModel):
    email_type: str  # 'applied', 'interview', 'review', 'offer', 'rejection'
    recipient: EmailStr
    context: Dict[str, Any]

class CopilotChatRequest(BaseModel):
    message: str
    history: List[Dict[str, str]]  # list of {"role": "user"/"assistant", "content": "..."}
    job_id: Optional[str] = None
    candidate_id: Optional[str] = None

