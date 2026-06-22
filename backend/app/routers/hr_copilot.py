import json
import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from openai import OpenAI
from app import models, schemas
from app.db import get_db
from app.config import settings
from app.routers.auth import get_current_user
from app.routers.hr_jobs import get_current_hr_manager

router = APIRouter(prefix="/hr/copilot", tags=["hr-copilot"])
logger = logging.getLogger("hr_copilot")

# Define tools for OpenAI Function Calling
COPILOT_TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "list_job_positions",
            "description": "Lists all job positions available in the system with their IDs and details.",
            "parameters": {
                "type": "object",
                "properties": {},
                "required": []
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_candidates_for_job",
            "description": "Gets all candidate applications and their matching scores for a specific job position ID.",
            "parameters": {
                "type": "object",
                "properties": {
                    "job_id": {
                        "type": "string",
                        "description": "The UUID of the job position"
                    }
                },
                "required": ["job_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "search_candidates_by_skills",
            "description": "Searches for candidate applications whose parsed profiles match specific skills or experience requirements.",
            "parameters": {
                "type": "object",
                "properties": {
                    "skills": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "List of keywords/skills to filter candidates by (e.g. React, Python)"
                    },
                    "min_experience_years": {
                        "type": "number",
                        "description": "Minimum years of professional experience"
                    }
                },
                "required": []
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_candidate_profile_and_analysis",
            "description": "Retrieves the full profile details, parsed resume details, strengths, weaknesses, and recommended interview questions for a specific candidate by their ID.",
            "parameters": {
                "type": "object",
                "properties": {
                    "candidate_id": {
                        "type": "string",
                        "description": "The UUID of the candidate application"
                    }
                },
                "required": ["candidate_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "draft_offer_letter",
            "description": "Generates a customized draft offer letter for a candidate for a specific job position, containing salary and corporate info.",
            "parameters": {
                "type": "object",
                "properties": {
                    "candidate_name": {
                        "type": "string",
                        "description": "Candidate's full name"
                    },
                    "job_title": {
                        "type": "string",
                        "description": "Title of the job position"
                    },
                    "salary": {
                        "type": "string",
                        "description": "Proposed monthly or annual compensation (e.g., SGD 8,000/month or $95,000/year)"
                    },
                    "start_date": {
                        "type": "string",
                        "description": "Proposed join date (e.g., July 15, 2026)"
                    }
                },
                "required": ["candidate_name", "job_title", "salary", "start_date"]
            }
        }
    }
]

# Database Tool Executors
def run_list_job_positions(db: Session) -> str:
    jobs = db.query(models.JobPosition).all()
    out = []
    for j in jobs:
        out.append({
            "id": j.id,
            "title": j.title,
            "department": j.department,
            "location": j.location,
            "status": j.status
        })
    return json.dumps(out)

def run_get_candidates_for_job(db: Session, job_id: str) -> str:
    applications = db.query(models.CandidateApplication).filter(models.CandidateApplication.job_id == job_id).all()
    out = []
    for app in applications:
        out.append({
            "candidate_id": app.id,
            "name": app.name,
            "email": app.email,
            "experience_years": float(app.experience_years),
            "ai_match_score": float(app.ai_score),
            "status": app.application_status
        })
    # Sort by match score descending
    out = sorted(out, key=lambda x: x["ai_match_score"], reverse=True)
    return json.dumps(out)

def run_search_candidates_by_skills(db: Session, skills: Optional[List[str]] = None, min_experience_years: Optional[float] = None) -> str:
    query = db.query(models.CandidateApplication)
    if min_experience_years is not None:
        query = query.filter(models.CandidateApplication.experience_years >= min_experience_years)
        
    apps = query.all()
    out = []
    
    # Filter candidates by skills matching the parsed analysis
    for app in apps:
        analysis = db.query(models.CandidateAIAnalysis).filter(models.CandidateAIAnalysis.candidate_id == app.id).first()
        matched = True
        
        # Simple text matching in skills array or parsed resume if skills filter provided
        if skills:
            matched = False
            candidate_skills = []
            if analysis and analysis.skills:
                candidate_skills = [s.lower() for s in analysis.skills]
            
            # Combine raw skills and other texts
            text_context = f"{app.current_company} {app.current_designation}".lower()
            if analysis and analysis.parsed_resume:
                text_context += " " + json.dumps(analysis.parsed_resume).lower()
                
            for skill in skills:
                skill_l = skill.lower()
                if skill_l in candidate_skills or skill_l in text_context:
                    matched = True
                    break
                    
        if matched:
            out.append({
                "candidate_id": app.id,
                "name": app.name,
                "email": app.email,
                "experience_years": float(app.experience_years),
                "ai_match_score": float(app.ai_score),
                "status": app.application_status,
                "skills": analysis.skills if (analysis and analysis.skills) else []
            })
            
    return json.dumps(out)

def run_get_candidate_profile_and_analysis(db: Session, candidate_id: str) -> str:
    app = db.query(models.CandidateApplication).filter(models.CandidateApplication.id == candidate_id).first()
    if not app:
        return json.dumps({"error": "Candidate not found"})
        
    analysis = db.query(models.CandidateAIAnalysis).filter(models.CandidateAIAnalysis.candidate_id == candidate_id).first()
    
    return json.dumps({
        "candidate": {
            "id": app.id,
            "name": app.name,
            "email": app.email,
            "phone": app.phone,
            "experience_years": float(app.experience_years),
            "expected_salary": app.expected_salary,
            "notice_period": app.notice_period,
            "linkedin_url": app.linkedin_url,
            "portfolio_url": app.portfolio_url,
            "status": app.application_status,
            "ai_score": float(app.ai_score)
        },
        "analysis": {
            "parsed_resume": analysis.parsed_resume if (analysis and analysis.parsed_resume) else {},
            "skills": analysis.skills if (analysis and analysis.skills) else [],
            "strengths": analysis.strengths if (analysis and analysis.strengths) else [],
            "weaknesses": analysis.weaknesses if (analysis and analysis.weaknesses) else [],
            "summary": analysis.summary if (analysis and analysis.summary) else "No analysis available"
        }
    })

def run_draft_offer_letter(candidate_name: str, job_title: str, salary: str, start_date: str) -> str:
    letter = f"""
# INDUSNET AI CORPORATION
**OFFER OF EMPLOYMENT**

**Date:** {start_date}

**To:**
{candidate_name}

Dear {candidate_name},

On behalf of Indusnet AI, I am absolutely thrilled to offer you the position of **{job_title}** under the leadership of our Managing Director, **Senthilkumar Elu**. We were highly impressed by your qualifications and technical capability during the recruitment process, and we believe you will be a vital addition to our engineering team.

### 1. Position & Duties
You will be employed in the position of **{job_title}**. Your duties, responsibilities, and reporting lines will be detailed upon joining, but will align with the core software architect and engineering goals of Indusnet AI.

### 2. Compensation & Benefits
Your proposed starting base salary is **{salary}**, subject to applicable taxes and withholdings. You will also be eligible for standard health benefits, performance bonuses, and annual paid leaves in accordance with company policy.

### 3. Location & Joining Details
* **Join Date:** {start_date}
* **Work Location:** Velachery Headquarters, Chennai (or Singapore branch as coordinated with HR).
* **Corporate Office Coordinates:**
  * **Singapore Branch:** 51 Ubi Ave 1, #05-16 Paya Ubi Industrial Park, Singapore 408933. Phone: +65-9448-3805 / +65-6747-4753
  * **Chennai HQ:** Number 46 First Floor, Tansi Nagar, Velachery, Chennai, Tamil Nadu 600042. Phone: +91-9884915977

### 4. Acceptance of Offer
To accept this offer of employment, please sign and date this document and return it to us via the Candidate Application Portal within five (5) business days.

We look forward to welcoming you to the Indusnet AI family!

Sincerely,
**HR Talent Acquisition Team**
Indusnet AI Corporation

---
**Acceptance Signature**

I accept the offer of employment as outlined above:

Signature: __________________________  Date: _______________
"""
    return json.dumps({"draft_letter": letter})

@router.post("/chat")
def copilot_chat(
    payload: schemas.CopilotChatRequest,
    db: Session = Depends(get_db),
    current_user: models.PortalUser = Depends(get_current_hr_manager)
):
    """
    Recruitment Copilot Chatbot endpoint. Runs a tool-calling agent loop with OpenAI.
    """
    if not settings.OPENAI_API_KEY:
        # Fallback response if OpenAI is offline
        return {
            "response": "Hello! I am the Indusnet AI Recruitment Copilot. OpenAI API is not currently configured, but I can tell you that the local databases are active. Once configured, I will be able to search candidates, inspect match scores, and draft custom offer letters."
        }

    try:
        client = OpenAI(api_key=settings.OPENAI_API_KEY)
        
        # Construct message payload
        messages = [
            {
                "role": "system",
                "content": (
                    "You are the Indusnet AI Recruitment Copilot, a senior talent acquisition assistant. "
                    "You help the HR manager query the database of candidates and jobs, search candidates by skills/experience, "
                    "rank candidates, and draft employment offer letters.\n"
                    "Always output professional, detailed markdown responses. When requested to draft an offer letter, "
                    "use the draft_offer_letter tool to create the initial structure, and then expand it into a comprehensive "
                    "and legally professional document with headers, bold text, bullet points, and signing fields. "
                    "Company Managing Director: Senthilkumar Elu.\n"
                    "Chennai Office: Number 46 First Floor, Tansi Nagar, Velachery, Chennai 600042. Phone: +91-9884915977.\n"
                    "Singapore Office: 51 Ubi Ave 1, #05-16 Paya Ubi Industrial Park, Singapore 408933. Phone: +65-9448-3805, +65-6747-4753."
                )
            }
        ]
        
        # Add conversation history
        for msg in payload.history:
            messages.append({"role": msg["role"], "content": msg["content"]})
            
        # Add user's latest query
        messages.append({"role": "user", "content": payload.message})
        
        # Call OpenAI with Tools
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            tools=COPILOT_TOOLS,
            tool_choice="auto"
        )
        
        response_message = response.choices[0].message
        
        # If model called tools
        if response_message.tool_calls:
            # Add assistant's message with tool calls to history
            messages.append(response_message)
            
            # Execute tool calls
            for tool_call in response_message.tool_calls:
                func_name = tool_call.function.name
                arguments = json.loads(tool_call.function.arguments)
                
                logger.info(f"Copilot Agent calling tool {func_name} with args: {arguments}")
                
                result = ""
                if func_name == "list_job_positions":
                    result = run_list_job_positions(db)
                elif func_name == "get_candidates_for_job":
                    result = run_get_candidates_for_job(db, arguments.get("job_id"))
                elif func_name == "search_candidates_by_skills":
                    result = run_search_candidates_by_skills(
                        db,
                        skills=arguments.get("skills"),
                        min_experience_years=arguments.get("min_experience_years")
                    )
                elif func_name == "get_candidate_profile_and_analysis":
                    result = run_get_candidate_profile_and_analysis(db, arguments.get("candidate_id"))
                elif func_name == "draft_offer_letter":
                    result = run_draft_offer_letter(
                        candidate_name=arguments.get("candidate_name"),
                        job_title=arguments.get("job_title"),
                        salary=arguments.get("salary"),
                        start_date=arguments.get("start_date")
                    )
                else:
                    result = json.dumps({"error": f"Unknown function: {func_name}"})
                    
                messages.append({
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "name": func_name,
                    "content": result
                })
                
            # Call OpenAI again with the tool responses
            second_response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages
            )
            return {"response": second_response.choices[0].message.content}
            
        # If no tool calls were made, return response content directly
        return {"response": response_message.content or "I'm sorry, I couldn't process that request."}
        
    except Exception as e:
        logger.error(f"Copilot chat agent failed: {e}")
        return {
            "response": f"An error occurred in the AI recruitment assistant: {str(e)}"
        }
