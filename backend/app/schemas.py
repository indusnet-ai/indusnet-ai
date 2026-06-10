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
