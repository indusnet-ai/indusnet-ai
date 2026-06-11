from typing import TypedDict, List, Dict, Any
from langgraph.graph import StateGraph, END
import json
from openai import OpenAI
from app.config import settings

class AgentState(TypedDict):
    messages: List[Dict[str, str]]
    requirement_matrix: List[Dict[str, Any]]
    uploaded_context: str
    response: str
    compliance_score: float

def evaluate_compliance(state: AgentState) -> AgentState:
    matrix = state["requirement_matrix"]
    uploaded = state["uploaded_context"]
    
    if not uploaded.strip():
        # Calculate current score based on existing items
        verified_count = sum(1 for r in matrix if r["status"] == "verified")
        score = (verified_count / len(matrix)) * 100 if matrix else 0.0
        state["compliance_score"] = round(score, 2)
        return state
        
    if not settings.OPENAI_API_KEY:
        # Mock compliance verification for local/offline testing
        updated_matrix = []
        for req in matrix:
            req_copy = req.copy()
            # Simple keyword matching to simulate document verification
            if "Company Registration" in req["title"] and "registration" in uploaded.lower():
                req_copy["status"] = "verified"
                req_copy["notes"] = "Verified: Valid business license for Indusnet AI Partner Org found."
            elif "ISO" in req["title"] and "iso" in uploaded.lower():
                req_copy["status"] = "verified"
                req_copy["notes"] = "Verified: ISO certifications verified from uploaded compliance files."
            elif "Financial" in req["title"] and "turnover" in uploaded.lower():
                req_copy["status"] = "verified"
                req_copy["notes"] = "Verified: Audited statements show annual turnover of $12.5M, meeting threshold."
            elif "Experience" in req["title"] and "experience" in uploaded.lower():
                req_copy["status"] = "verified"
                req_copy["notes"] = "Verified: Past projects demonstrate similar technical scope."
            updated_matrix.append(req_copy)
            
        verified_count = sum(1 for r in updated_matrix if r["status"] == "verified")
        score = (verified_count / len(updated_matrix)) * 100 if updated_matrix else 0.0
        
        state["requirement_matrix"] = updated_matrix
        state["compliance_score"] = round(score, 2)
        return state

    try:
        client = OpenAI(api_key=settings.OPENAI_API_KEY)
        prompt = f"""
        You are an expert compliance evaluation agent.
        Your task is to analyze the extracted document context and verify it against the requirements checklist.
        
        Here is the current requirement matrix:
        {json.dumps(matrix, indent=2)}
        
        Here is the extracted document text uploaded by the bidder:
        {uploaded}
        
        Evaluate each requirement. For each requirement, determine if the document provides sufficient proof.
        If a requirement is now proven, change its status to "verified" and write detailed audit proof notes in the "notes" field.
        If the document mentions the requirement but details are insufficient or show failure, mark it as "missing" or keep as "pending" with notes explaining why.
        If the document doesn't address the requirement, preserve its current status and notes.
        
        Return the updated requirement matrix as a JSON object with key "requirements" in the exact same structure.
        """
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a professional compliance auditor that updates requirement checklists."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )
        
        data = json.loads(response.choices[0].message.content)
        if "requirements" in data:
            updated_matrix = data["requirements"]
            verified_count = sum(1 for r in updated_matrix if r["status"] == "verified")
            score = (verified_count / len(updated_matrix)) * 100 if updated_matrix else 0.0
            
            state["requirement_matrix"] = updated_matrix
            state["compliance_score"] = round(score, 2)
            
    except Exception as e:
        print(f"Compliance evaluation error: {e}")
        # Recalculate score based on current matrix in case of error
        verified_count = sum(1 for r in matrix if r["status"] == "verified")
        score = (verified_count / len(matrix)) * 100 if matrix else 0.0
        state["compliance_score"] = round(score, 2)
        
    return state

def generate_response(state: AgentState) -> AgentState:
    matrix = state["requirement_matrix"]
    messages = state["messages"]
    
    pending = [r["title"] for r in matrix if r["status"] != "verified"]
    
    if not pending:
        state["response"] = (
            "Excellent news! All the checklist requirements have been successfully verified (100% compliance). "
            "You are now ready to finalize and submit your bid proposal. Good luck!"
        )
        return state

    if not settings.OPENAI_API_KEY:
        state["response"] = (
            f"Thank you for the upload. I have scanned the documents and updated your checklist. "
            f"We still require files for: {', '.join(pending)}. "
            f"Please upload them so we can proceed with your compliance check."
        )
        return state

    try:
        client = OpenAI(api_key=settings.OPENAI_API_KEY)
        chat_context = []
        for msg in messages[-5:]:
            chat_context.append(f"{msg['role'].capitalize()}: {msg['content']}")
            
        prompt = f"""
        You are the "Smart Tender Officer", a meticulous AI procurement auditor. 
        A bidder has uploaded proposal documents (potentially a consolidated zip folder with multiple compliance files).
        Your job is to audit their submission, cross-reference their uploaded text context, and guide them in completing their compliance checklist.
        
        Here is the current requirements matrix state:
        {json.dumps(matrix, indent=2)}
        
        Here are the missing/pending items:
        {', '.join(pending)}
        
        Here is the recent conversation history:
        {chr(10).join(chat_context)}
        
        Please formulate a structured audit response to the bidder:
        1. Acknowledge their upload (if a zip or document was uploaded, confirm the files have been read and held in memory).
        2. State their current Compliance Score: {state['compliance_score']:.1f}%.
        3. Provide a structured summary of:
           - **Verified Requirements**: Brief mention of what has been met.
           - **Missing/Incomplete Requirements**: Explicit details of what is lacking or needs clarification.
        4. If there are missing requirements, generate a **fillable structured Markdown template** (e.g., using placeholders like `[Insert Organization Details Here]`) so the bidder can easily fill it out and reply to fulfill the requirements.
        5. Maintain a professional, clear, and helpful auditing tone.
        """
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a professional Smart Tender Officer conducting compliance reviews."},
                {"role": "user", "content": prompt}
            ]
        )
        state["response"] = response.choices[0].message.content
        
    except Exception as e:
        state["response"] = f"Thank you for uploading. We need your next documents to resolve: {', '.join(pending)}."
        
    return state

builder = StateGraph(AgentState)
builder.add_node("evaluate_compliance", evaluate_compliance)
builder.add_node("generate_response", generate_response)

builder.set_entry_point("evaluate_compliance")
builder.add_edge("evaluate_compliance", "generate_response")
builder.add_edge("generate_response", END)

copilot_graph = builder.compile()
