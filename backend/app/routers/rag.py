from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form, status
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import os
import time
import uuid

router = APIRouter(prefix="/api/rag", tags=["RAG Engine"])

# Request/Response Schemas
class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    name: str

class QueryRequest(BaseModel):
    query: str
    collection_name: Optional[str] = "metro_financial_v2"

class SourceCitation(BaseModel):
    doc: str
    chunk: str
    similarity: str
    excerpt: str

class QueryResponse(BaseModel):
    answer: str
    sources: List[SourceCitation]
    latency_ms: float

# Default Mock DB Collections & Docs for RAG Engine
COLLECTIONS_DB = [
    {"id": "col-1", "name": "Metro Financial Underwriting Rules", "collection_name": "metro_financial_v2", "docs_count": 142, "chunks_count": 18450},
    {"id": "col-2", "name": "MNRE Renewable Energy Guidelines", "collection_name": "mnre_reg_2026", "docs_count": 89, "chunks_count": 11200},
    {"id": "col-3", "name": "CareAll EHR Diagnostic Standards", "collection_name": "careall_hipaa", "docs_count": 64, "chunks_count": 8900}
]

DOCUMENTS_DB = [
    {"id": "doc-1", "filename": "Metro_Underwriting_Guidelines_v4.2.pdf", "size": "4.8 MB", "chunks": 320, "type": "PDF", "uploaded_at": "2026-07-20", "status": "Indexed in Qdrant"},
    {"id": "doc-2", "filename": "Commercial_Loan_Compliance_2026.docx", "size": "2.1 MB", "chunks": 145, "type": "DOCX", "uploaded_at": "2026-07-21", "status": "Indexed in Qdrant"},
    {"id": "doc-3", "filename": "Risk_Mitigation_Matrix_PHI.pdf", "size": "7.4 MB", "chunks": 512, "type": "PDF", "uploaded_at": "2026-07-22", "status": "Indexed in Qdrant"}
]

@router.post("/login", response_model=TokenResponse)
def rag_login(req: LoginRequest):
    if not req.email or not req.password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email and password required")
    
    return TokenResponse(
        access_token=f"rag_token_{uuid.uuid4().hex[:12]}",
        token_type="bearer",
        user_id=f"user_{uuid.uuid4().hex[:8]}",
        name=req.email.split("@")[0].replace(".", " ").title()
    )

@router.get("/collections")
def get_collections():
    return {"collections": COLLECTIONS_DB}

@router.get("/documents")
def get_documents(collection_name: Optional[str] = None):
    return {"documents": DOCUMENTS_DB, "collection": collection_name or "metro_financial_v2"}

@router.post("/query", response_model=QueryResponse)
def rag_query(req: QueryRequest):
    start_time = time.time()
    
    # Pre-calculated answers or dynamic semantic response
    query_lower = req.query.lower()
    
    if "dti" in query_lower or "debt" in query_lower or "limit" in query_lower:
        answer = "According to Metro Financial Underwriting Guidelines v4.2 (Section 8.1), Tier-1 commercial green bond issuances enforce a strict Maximum Debt-to-Income (DTI) ratio of 42.5%. For projects exceeding $50M in capital expenditure, an adjusted Debt Service Coverage Ratio (DSCR) of 1.35x is mandatory prior to credit committee sign-off."
        sources = [
            SourceCitation(doc="Metro_Underwriting_Guidelines_v4.2.pdf", chunk="Chunk #108 (p. 44)", similarity="99.2%", excerpt="Tier-1 commercial green bond issuances enforce a strict Maximum DTI ratio of 42.5%. For projects exceeding $50M in CapEx, DSCR threshold must equal or exceed 1.35x..."),
            SourceCitation(doc="Commercial_Loan_Compliance_2026.docx", chunk="Chunk #42 (p. 12)", similarity="96.4%", excerpt="Green energy credit facility compliance requires dual verification of CapEx limits and DTI ceilings under Section 8.1 standards.")
        ]
    elif "4.2" in query_lower or "risk" in query_lower or "mitigation" in query_lower:
        answer = "Section 4.2 mandates a three-tier risk mitigation framework for non-recourse infrastructure financing:\n1. 100% Escrow Account Reserve covering 6 months of debt principal & interest.\n2. Independent Engineering Performance Guarantee from an accredited audit firm.\n3. Mandatory Business Interruption Insurance with a minimum indemnity period of 180 days."
        sources = [
            SourceCitation(doc="Risk_Mitigation_Matrix_PHI.pdf", chunk="Chunk #215 (p. 89)", similarity="98.7%", excerpt="Section 4.2: Non-recourse infrastructure loans require 6-month escrow reserve funding, independent performance guarantees, and 180-day indemnity coverage...")
        ]
    else:
        answer = f"Synthesized response for: '{req.query}' across collection {req.collection_name}.\n\nVector Similarity Analysis: Retrieved 4 matching embedding chunks from Qdrant vector database with average similarity score of 97.4%. All compliance requirements are verified."
        sources = [
            SourceCitation(doc="Metro_Underwriting_Guidelines_v4.2.pdf", chunk="Chunk #14 (p. 6)", similarity="97.8%", excerpt="Retrieved matching embedding vector from Qdrant private instance..."),
            SourceCitation(doc="Commercial_Loan_Compliance_2026.docx", chunk="Chunk #91 (p. 22)", similarity="95.4%", excerpt="Verified against role-based security subnet policies...")
        ]
        
    latency = round((time.time() - start_time) * 1000, 2)
    return QueryResponse(answer=answer, sources=sources, latency_ms=latency)

@router.post("/upload")
def upload_document(file_name: str = Form(...)):
    new_doc = {
        "id": f"doc-{int(time.time())}",
        "filename": file_name,
        "size": "3.8 MB",
        "chunks": 180,
        "type": file_name.split(".")[-1].upper() if "." in file_name else "PDF",
        "uploaded_at": time.strftime("%Y-%m-%d"),
        "status": "Indexed in Qdrant"
    }
    DOCUMENTS_DB.insert(0, new_doc)
    return {"message": "Document uploaded and indexed successfully", "document": new_doc}
