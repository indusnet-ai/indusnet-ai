import json
from openai import OpenAI
from app.config import settings
from typing import List, Dict, Any
import logging

logger = logging.getLogger("matrix_generator")

def generate_requirement_matrix(tender_text: str) -> List[Dict[str, Any]]:
    if not settings.OPENAI_API_KEY:
        logger.warning("OPENAI_API_KEY not configured for AI requirement extraction.")
        return [
            {
                "id": "req-1",
                "title": "AI Matrix Extraction Unavailable",
                "description": "OPENAI_API_KEY is not configured on the server. Please manually add requirement items or configure OpenAI API key.",
                "status": "pending",
                "notes": "AI requirement extraction unavailable (OPENAI_API_KEY missing)"
            }
        ]

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
        data = json.loads(content) if content else {}
        if "requirements" in data:
            return data["requirements"]
        elif isinstance(data, list):
            return data
            
    except Exception as e:
        logger.error(f"Failed to generate matrix using OpenAI: {e}")
        return [
            {
                "id": "req-1",
                "title": "AI Matrix Extraction Failed",
                "description": f"AI requirement extraction encountered an error: {str(e)}. Please manually add requirement items.",
                "status": "pending",
                "notes": "AI extraction failed"
            }
        ]
        
    return [
        {
            "id": "req-1",
            "title": "AI Matrix Extraction Unavailable",
            "description": "No valid requirement matrix could be generated from the document text.",
            "status": "pending",
            "notes": ""
        }
    ]
