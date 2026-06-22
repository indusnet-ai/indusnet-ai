import json
import logging
import re
from typing import Dict, Any
from openai import OpenAI
from app.config import settings
from app.utils.parsers import extract_text_from_file

logger = logging.getLogger("parser")

def extract_basic_info_regex(text: str) -> Dict[str, Any]:
    """
    Fallback regex parser to extract name, email, and phone from resume text.
    """
    email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text)
    phone_match = re.search(r'\(?\+?[0-9]{1,4}\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{3,4})[-.\s]?([0-9]{4})', text)
    
    email = email_match.group(0) if email_match else "unknown@example.com"
    phone = phone_match.group(0) if phone_match else "000-000-0000"
    
    # Try to get candidate name from the first non-empty lines
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    name = "Unknown Candidate"
    if lines:
        for line in lines[:3]:
            # Simple heuristic: ignore lines with @ or digits or common headers
            if "@" not in line and not any(char.isdigit() for char in line) and len(line) < 50:
                if not any(header in line.lower() for header in ["resume", "cv", "curriculum", "contact", "email"]):
                    name = line
                    break
                    
    return {
        "name": name,
        "email": email,
        "phone": phone
    }

def parse_resume_and_analyze(
    file_name: str,
    file_bytes: bytes,
    job_title: str = "",
    job_description: str = "",
    job_requirements: str = ""
) -> Dict[str, Any]:
    """
    Parses resume text from a PDF/DOCX file and uses OpenAI to structure the data and perform matching.
    """
    # 1. Extract raw text
    try:
        raw_text = extract_text_from_file(file_name, file_bytes)
    except Exception as e:
        logger.error(f"Failed to extract text from file {file_name}: {e}")
        raw_text = "[Failed to extract text from document]"

    # If document is empty, return minimal structure
    if not raw_text.strip():
        raw_text = "[Empty Document]"

    # Setup basic fallback structure
    basic_info = extract_basic_info_regex(raw_text)
    fallback_analysis = {
        "parsed_resume": {
            "name": basic_info["name"],
            "email": basic_info["email"],
            "phone": basic_info["phone"],
            "education": [],
            "experience": [],
            "certifications": [],
            "projects": []
        },
        "skills": ["Communication", "Problem Solving"],
        "strengths": ["Demonstrates technical capacity in resume upload"],
        "weaknesses": ["Unable to complete deep AI analysis due to API fallback"],
        "job_match_score": 50.0,
        "summary": "This candidate's resume was parsed using the fallback text parser because OpenAI API was not configured or succeeded.",
        "recommended_interview_questions": [
            {
                "question": "Can you walk us through your relevant experience in this domain?",
                "purpose": "To understand candidate's experience and fill in missing detail",
                "expected_answer": "Candidate should detail project-specific contributions and skill applications."
            }
        ]
    }

    # 2. OpenAI Structured Parsing
    if not settings.OPENAI_API_KEY:
        logger.warning("OPENAI_API_KEY not set. Using fallback regex parser.")
        return fallback_analysis

    try:
        client = OpenAI(api_key=settings.OPENAI_API_KEY)
        
        prompt = f"""
        You are a expert AI recruiter. You will receive the raw text of a candidate's resume.
        Your task is to parse this resume, extract structured information, and compare it against the job description and requirements.
        
        Job Details:
        * Title: {job_title}
        * Description: {job_description}
        * Requirements: {job_requirements}
        
        Resume Content:
        ---
        {raw_text[:12000]}
        ---
        
        Analyze the resume and return a JSON object with the following fields:
        1. "parsed_resume": An object containing:
           - "name": Full name of candidate.
           - "email": Contact email.
           - "phone": Phone number.
           - "education": Array of objects, each containing:
             - "school": School or university name.
             - "degree": Degree received (e.g. BS, MS).
             - "field": Major/field of study.
             - "year": Graduation year or "Present".
           - "experience": Array of objects, each containing:
             - "company": Employer name.
             - "title": Job title.
             - "start_date": e.g. "June 2022" or "2022-06".
             - "end_date": e.g. "Present" or "2024-01".
             - "description": Work accomplishments.
           - "certifications": Array of strings of professional certifications.
           - "projects": Array of objects with "name", "description", "technologies".
        2. "skills": Array of strings representing technical and soft skills.
        3. "strengths": Array of 3-5 strings detailing why they are a strong match for this job.
        4. "weaknesses": Array of 1-3 strings detailing any gaps, red flags, or areas of improvement compared to the job description.
        5. "job_match_score": A float between 0.0 and 100.0 indicating overall alignment with the job.
        6. "summary": A 3-4 sentence professional summary of the candidate's fit.
        7. "recommended_interview_questions": Array of 3 objects to ask the candidate, each with:
           - "question": The question.
           - "purpose": Why the interviewer should ask it.
           - "expected_answer": What standard of response the interviewer should expect.
        
        You must return ONLY the JSON object.
        """
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a professional recruiting parser that outputs strict JSON."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )
        
        content = response.choices[0].message.content
        data = json.loads(content)
        
        # Merge key fields and ensure scores are valid floats
        if "job_match_score" in data:
            try:
                data["job_match_score"] = float(data["job_match_score"])
            except ValueError:
                data["job_match_score"] = 50.0
                
        return data
        
    except Exception as e:
        logger.error(f"Failed to parse resume using OpenAI: {e}")
        return fallback_analysis
