import json
from openai import OpenAI
from app.config import settings
from typing import List, Dict, Any
import logging

logger = logging.getLogger("matrix_generator")

def generate_requirement_matrix(tender_text: str) -> List[Dict[str, Any]]:
    default_matrix = [
        {
            "id": "req-1",
            "title": "Company Registration Certificate",
            "description": "Provide a copy of the active company registration certificate or business license.",
            "status": "pending",
            "notes": ""
        },
        {
            "id": "req-2",
            "title": "ISO 9001 / ISO 27001 Certification",
            "description": "Submit a valid ISO 9001 (Quality Management) or ISO 27001 (Information Security) certificate.",
            "status": "pending",
            "notes": ""
        },
        {
            "id": "req-3",
            "title": "Audited Financial Statements",
            "description": "Submit audited financial statements for the last fiscal year showing annual turnover > $2M.",
            "status": "pending",
            "notes": ""
        },
        {
            "id": "req-4",
            "title": "Project Experience & Case Studies",
            "description": "Submit at least 2 case studies detailing similar project executions in the enterprise AI domain.",
            "status": "pending",
            "notes": ""
        }
    ]

    if not settings.OPENAI_API_KEY:
        logger.warning("OPENAI_API_KEY not set. Using default simulation requirement matrix.")
        return default_matrix

    try:
        client = OpenAI(api_key=settings.OPENAI_API_KEY)
        prompt = f"""
        You are an expert procurement auditor. You will receive the text of a tender document.
        Your task is to analyze the text and extract all required submission documents, certificates, qualifications, and criteria that the bidder must fulfill.
        
        Generate a list of 3 to 6 structured requirements.
        Return ONLY a JSON object containing a key "requirements" which is an array of objects in the following format:
        {{
          "requirements": [
            {{
              "id": "req-1",
              "title": "Requirement title (e.g. ISO 27001 Certificate)",
              "description": "Exact criteria description extracted from text.",
              "status": "pending",
              "notes": ""
            }}
          ]
        }}
        
        Tender Document Text:
        {tender_text[:12000]}
        """
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a professional JSON-generating procurement agent."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )
        
        content = response.choices[0].message.content
        data = json.loads(content)
        if "requirements" in data:
            return data["requirements"]
        elif isinstance(data, list):
            return data
            
    except Exception as e:
        logger.error(f"Failed to generate matrix using OpenAI: {e}. Falling back to default.")
        
    return default_matrix
