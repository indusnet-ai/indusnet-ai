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
