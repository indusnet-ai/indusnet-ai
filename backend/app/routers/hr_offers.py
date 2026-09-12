import re
import logging
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from openai import OpenAI
from app import models, schemas
from app.db import get_db
from app.config import settings
from app.routers.auth import get_current_user
from app.routers.hr_jobs import get_current_hr_manager
from app.utils.email import send_recruitment_email

router = APIRouter(prefix="/hr/applications", tags=["hr-offers"])
logger = logging.getLogger("hr_offers")

def get_fallback_offer_letter(
    name: str, address: str, job_title: str, department: str, location: str,
    annual_ctc: str, variable_pay: str, basic: int, hra: int, conveyance: int,
    medical: int, lta: int, pf: int, special: int, monthly_total: int, annual_total: float, variable_numeric: float
) -> str:
    """
    Standard professional fallback template when OpenAI is not configured or fails.
    """
    current_date = datetime.now().strftime("%dth %B %Y")
    address_str = address if address else "Not Provided"
    
    return f"""REF: INDUSNET/HR/APPT/{datetime.now().year}/{name[:3].upper()}
Date: {current_date}

To:
Mr./Ms. {name}
{address_str}

Dear {name},

### Subject: Letter of Appointment

This has reference to your application and the subsequent discussions we have had with you. We are pleased to offer you an appointment in Indusnet AI Corporation on the following terms and conditions:

1. **Designation & Reporting:** You will be designated as **{job_title}** in the **{department}** department. You will report to **Senthilkumar Elu, Managing Director**, or any other authority designated by him.
2. **Compensation:** You will be eligible for benefits and allowances as shown in the compensation package in the Annexure.
3. **Statutory Benefits:** You will be eligible for statutory benefits, as may be applicable in accordance with local labor laws.
4. **Altering Benefits:** The Company reserves the right to alter or modify the governing rules of the Compensation Package depending upon organizational exigencies.
5. **Location & Posting:** Your initial posting will be at **Chennai** (Velachery HQ). However, you are liable to be transferred to any department, branch, or location of the Company in India or abroad, at the sole discretion of the Management.
6. **Exclusivity of Service:** While in the service of the Company, you shall not enter into employment of or act as an advisor/consultant to any other person, firm, or company, or be interested directly or indirectly in any other business whatsoever.
7. **Code of Conduct:** You will be subject to the service rules, regulations, policies, and Code of Conduct of the Company as in force from time to time.
8. **Confidentiality of Salary:** You shall not disclose your compensation details, either directly or indirectly, to any other employee of the Company. Breach of this confidentiality will be treated as a material breach of trust.
9. **Non-Disclosure of Trade Secrets:** You shall not during your employment or at any time thereafter, divulge or make known any confidential information relating to the Company, its clients, or its business secrets.
10. **Non-Compete:** You shall not join any of the direct competitors of the Company for a minimum period of one (1) year after severance of services and after being relieved by the Company.
11. **Accuracy of Information:** This appointment is offered to you on the basis of information furnished by you in your application. If any information is found to be false or incorrect, you will be liable for immediate dismissal without notice.
12. **Medical Fitness:** This appointment is subject to you being medically, physically, and mentally fit to perform your duties.
13. **Specialized Training Bond:** If sent abroad or provided specialized training, you may be required to execute a service agreement or bond to serve the Company for a specified period of time.
14. **Termination & Notice Period:** This employment can be terminated by either party giving to the other **one month's notice** or payment of one month's salary in lieu thereof.
15. **Retirement:** You will normally retire from the service of the Company at the end of the month in which you complete **58 years** of age.
16. **Jurisdiction:** Any dispute or difference in relation to any of the terms and conditions of this letter of appointment shall be subject to the exclusive jurisdiction of courts in **Chennai** only.
17. **Joining Documents:** You must submit the following documents at the time of joining:
    a. Original and photocopies of age, qualification, experience, last drawn salary slips, and relieving letter.
    b. Copy of Passport/Voter ID, PAN card, and Aadhaar/Driving License.
    c. 3 passport-sized color photographs.

Please sign and return the duplicate copy of this letter in token of your acceptance of all the terms and conditions.

Yours faithfully,
**For INDUSNET AI CORPORATION**

**Senthilkumar Elu**
Managing Director

---
**Acceptance Signature**

I accept the terms and conditions outlined in this appointment letter and will join on ______________________.

Name: ______________________
Signature: __________________
Date: ______________________

---

## ANNEXURE

### Compensation Structure (INR)

| Component | Monthly Amount (INR) | Annualized Amount (INR) |
| :--- | :--- | :--- |
| **A. Monthly Salary** | | |
| Basic Salary | {basic:,.2f} | {basic * 12:,.2f} |
| House Rent Allowance (HRA) | {hra:,.2f} | {hra * 12:,.2f} |
| Conveyance Allowance | {conveyance:,.2f} | {conveyance * 12:,.2f} |
| Medical Allowance | {medical:,.2f} | {medical * 12:,.2f} |
| Leave Travel Allowance (LTA) | {lta:,.2f} | {lta * 12:,.2f} |
| Special Allowance | {special:,.2f} | {special * 12:,.2f} |
| **Subtotal A** | **{monthly_total - pf:,.2f}** | **{(monthly_total - pf) * 12:,.2f}** |
| **B. Retiral Benefits** | | |
| Provident Fund (PF - 12% of Basic) | {pf:,.2f} | {pf * 12:,.2f} |
| **Subtotal B** | **{pf:,.2f}** | **{pf * 12:,.2f}** |
| **C. Variable Compensation** | | |
| Performance Linked Variable Pay | {variable_numeric / 12:,.2f} | {variable_numeric:,.2f} |
| **Subtotal C** | **{variable_numeric / 12:,.2f}** | **{variable_numeric:,.2f}** |
| **Grand Total (A + B + C) / CTC** | **{monthly_total + (variable_numeric / 12):,.2f}** | **{annual_total:,.2f}** |

**Medical Insurance:** In addition to the compensation details listed above, you will be covered under the Employee Group Health Insurance Scheme for hospitalization expenses as per Company Policy.
"""

def generate_offer_letter_text(
    candidate_name: str,
    candidate_email: str,
    candidate_phone: str,
    candidate_address: str,
    job_title: str,
    department: str,
    location: str,
    annual_ctc: str,
    variable_pay: str,
    additional_instructions: str = ""
) -> str:
    # 1. Clean and parse numeric CTC and Variable Pay
    ctc_numeric = 0.0
    variable_numeric = 0.0
    try:
        ctc_clean = re.sub(r'[^\d.]', '', annual_ctc)
        ctc_numeric = float(ctc_clean) if ctc_clean else 0.0
    except Exception:
        pass
        
    try:
        var_clean = re.sub(r'[^\d.]', '', variable_pay)
        variable_numeric = float(var_clean) if var_clean else 0.0
    except Exception:
        pass

    # Monthly Base (excluding variable pay)
    monthly_base = (ctc_numeric - variable_numeric) / 12.0 if ctc_numeric > 0 else 0.0
    
    basic = round(monthly_base * 0.40)
    hra = round(basic * 0.50)
    pf = round(basic * 0.12)
    conveyance = 1600 if monthly_base > 5000 else 0
    medical = 1250 if monthly_base > 5000 else 0
    lta = 1250 if monthly_base > 5000 else 0
    
    special = round(monthly_base - (basic + hra + conveyance + medical + lta + pf))
    if special < 0:
        special = 0
        
    monthly_total = basic + hra + conveyance + medical + lta + special + pf
    annual_total = monthly_total * 12 + variable_numeric

    math_context = f"""
    Calculated Breakdown (INR):
    - Monthly Base (excluding variable): INR {monthly_base:,.2f}
    - Basic Salary: INR {basic:,.2f} per month
    - HRA (50% of Basic): INR {hra:,.2f} per month
    - Conveyance Allowance: INR {conveyance:,.2f} per month
    - Medical Allowance: INR {medical:,.2f} per month
    - Leave Travel Allowance (LTA): INR {lta:,.2f} per month
    - Provident Fund (PF): INR {pf:,.2f} per month
    - Special Allowance: INR {special:,.2f} per month
    - Total Monthly Base: INR {monthly_total:,.2f} per month
    - Performance Variable Pay (Annualized): INR {variable_numeric:,.2f}
    - Grand Total CTC (Annual): INR {annual_total:,.2f}
    """

    if not settings.OPENAI_API_KEY:
        logger.warning("OPENAI_API_KEY not set. Using local fallback template.")
        return get_fallback_offer_letter(
            candidate_name, candidate_address, job_title, department, location, 
            annual_ctc, variable_pay, basic, hra, conveyance, medical, lta, pf, special, 
            monthly_total, annual_total, variable_numeric
        )

    try:
        client = OpenAI(api_key=settings.OPENAI_API_KEY)
        
        prompt = f"""
        You are an expert HR Talent Acquisition Specialist at Indusnet AI.
        Your task is to prepare a formal, comprehensive, and legally robust Employment Offer Letter (Appointment Letter) in English, utilizing INR currency.
        
        Candidate Details:
        - Name: {candidate_name}
        - Email: {candidate_email}
        - Phone: {candidate_phone}
        - Address: {candidate_address or "Not Provided"}
        
        Job Details:
        - Job Title: {job_title}
        - Department: {department}
        - Location: {location}
        
        Compensation Details:
        - Annual CTC: {annual_ctc}
        - Variable Pay: {variable_pay}
        
        Mathematical component breakdown to format inside the Annexure:
        {math_context}

        Company Context:
        - Company Name: Indusnet AI Corporation
        - Managing Director: Senthilkumar Elu
        - Chennai HQ Address: Number 46 First Floor, Tansi Nagar, Velachery, Chennai, Tamil Nadu 600042. Phone: +91-9884915977
        - Singapore Office: 51 Ubi Ave 1, #05-16 Paya Ubi Industrial Park, Singapore 408933. Phone: +65-9448-3805, +65-6747-4753

        Additional Instructions:
        {additional_instructions}

        Instructions:
        1. Format the body of the offer letter in a detailed, professional, and clean Markdown format. 
        2. Do NOT include the company notepad header or company logo/addresses at the very top of the letter, as those are already printed on the physical notepad letterhead template. Start directly with the Reference Number, Date, Candidate Address block, Salutation, Subject Line ("Subject: Offer of Employment - [Job Title]"), and then the terms.
        3. Write 17 formal legal clauses modeled after the standard appointment letters (e.g. designation and reporting to MD Senthilkumar Elu, compensation rules, posting/transfer, exclusivity/exclusively serving the company, code of conduct, strict confidentiality of salary details, non-disclosure of trade secrets, 3-year non-compete after exit, accuracy of information, medical fitness, training/abroad bond, termination & 1-month notice period, retirement at 58, courts jurisdiction in Chennai only, and list of joining documents).
        4. Add an Acceptance Sign-off block at the end of the letter clauses: "I accept the terms and conditions outlined in this appointment letter and will join on..." with spaces for Name, Signature, and Date.
        5. Insert a PAGE BREAK (using markdown syntax `---` or a clear header like `\n\n---\n\n## ANNEXURE\n\n`) and write the compensation annexure.
        6. In the Annexure, present a clear, structured Markdown table listing the Monthly and Annual figures for the salary components. Ensure the table uses the exact calculated figures provided above:
           - Basic Salary
           - HRA
           - Conveyance Allowance
           - Medical Allowance
           - LTA
           - Special Allowance
           - Retiral Benefits: PF (12% of Basic)
           - Performance Linked Variable Pay (Annualized / Monthly)
           - Total Monthly Base CTC, and Grand Total Annual CTC.
        7. Ensure all numbers are formatted clearly as currency (e.g., INR 17,000 / month, INR 9,24,000 / annum).
        
        Return ONLY the raw markdown content of the offer letter body. Do not wrap it in markdown block characters (like ```markdown ... ```), just return the plain markdown text.
        """
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a professional HR assistant that drafts legal employment letters in markdown."},
                {"role": "user", "content": prompt}
            ]
        )
        return response.choices[0].message.content or ""
    except Exception as e:
        logger.error(f"OpenAI offer letter generation failed: {e}")
        return get_fallback_offer_letter(
            candidate_name, candidate_address, job_title, department, location, 
            annual_ctc, variable_pay, basic, hra, conveyance, medical, lta, pf, special, 
            monthly_total, annual_total, variable_numeric
        )

@router.post("/{application_id}/offer/generate", response_model=schemas.CandidateOfferOut)
def generate_offer_letter(
    application_id: str,
    payload: schemas.CandidateOfferCreate,
    db: Session = Depends(get_db),
    current_user: models.PortalUser = Depends(get_current_hr_manager)
):
    application = db.query(models.CandidateApplication).filter(models.CandidateApplication.id == application_id).first()
    if not application:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
        
    job = db.query(models.JobPosition).filter(models.JobPosition.id == application.job_id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Associated job position not found")

    # Update candidate details if changed
    if payload.candidate_name:
        application.name = payload.candidate_name
    if payload.candidate_email:
        application.email = payload.candidate_email
    if payload.candidate_phone:
        application.phone = payload.candidate_phone
    db.commit()

    # Generate text
    offer_text = generate_offer_letter_text(
        candidate_name=application.name,
        candidate_email=application.email,
        candidate_phone=application.phone,
        candidate_address=payload.candidate_address or "",
        job_title=job.title,
        department=job.department,
        location=job.location,
        annual_ctc=payload.annual_ctc,
        variable_pay=payload.variable_pay,
        additional_instructions=payload.additional_instructions or ""
    )

    # Upsert CandidateOffer
    offer = db.query(models.CandidateOffer).filter(models.CandidateOffer.candidate_id == application_id).first()
    if offer:
        offer.annual_ctc = payload.annual_ctc
        offer.variable_pay = payload.variable_pay
        offer.candidate_address = payload.candidate_address
        offer.offer_letter_text = offer_text
        offer.status = "draft"
        offer.updated_at = datetime.utcnow()
    else:
        offer = models.CandidateOffer(
            candidate_id=application_id,
            annual_ctc=payload.annual_ctc,
            variable_pay=payload.variable_pay,
            candidate_address=payload.candidate_address,
            offer_letter_text=offer_text,
            status="draft"
        )
        db.add(offer)

    db.commit()
    db.refresh(offer)
    return offer

@router.get("/{application_id}/offer", response_model=schemas.CandidateOfferOut)
def get_offer_letter(
    application_id: str,
    db: Session = Depends(get_db),
    current_user: models.PortalUser = Depends(get_current_hr_manager)
):
    offer = db.query(models.CandidateOffer).filter(models.CandidateOffer.candidate_id == application_id).first()
    if not offer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Offer letter not found")
    return offer

@router.put("/{application_id}/offer/update", response_model=schemas.CandidateOfferOut)
def update_offer_letter(
    application_id: str,
    payload: schemas.CandidateOfferUpdate,
    db: Session = Depends(get_db),
    current_user: models.PortalUser = Depends(get_current_hr_manager)
):
    offer = db.query(models.CandidateOffer).filter(models.CandidateOffer.candidate_id == application_id).first()
    if not offer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Offer letter not found")

    offer.offer_letter_text = payload.offer_letter_text
    if payload.annual_ctc is not None:
        offer.annual_ctc = payload.annual_ctc
    if payload.variable_pay is not None:
        offer.variable_pay = payload.variable_pay
    if payload.candidate_address is not None:
        offer.candidate_address = payload.candidate_address
        
    offer.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(offer)
    return offer

@router.post("/{application_id}/offer/approve-and-send")
def approve_and_send_offer(
    application_id: str,
    db: Session = Depends(get_db),
    current_user: models.PortalUser = Depends(get_current_hr_manager)
):
    application = db.query(models.CandidateApplication).filter(models.CandidateApplication.id == application_id).first()
    if not application:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
        
    offer = db.query(models.CandidateOffer).filter(models.CandidateOffer.candidate_id == application_id).first()
    if not offer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Offer letter not raised yet")
        
    job = db.query(models.JobPosition).filter(models.JobPosition.id == application.job_id).first()

    # Update states
    offer.status = "sent"
    offer.updated_at = datetime.utcnow()
    application.application_status = "offered"
    db.commit()

    # Send Email
    email_status = send_recruitment_email(
        email_type="offer",
        recipient_email=application.email,
        candidate_name=application.name,
        job_title=job.title if job else "Position",
        context={
            "offer_letter_text": offer.offer_letter_text,
            "salary": offer.annual_ctc,
            "start_date": "To be determined"
        }
    )
    
    if email_status == "failed":
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send offer letter email. SMTP settings could be invalid."
        )

    msg = f"Offer approved and email sent to {application.email}." if email_status == "sent" else f"Offer approved in system for {application.email}. Logged (Email Not Configured - SMTP credentials missing)."

    return {"status": email_status, "message": msg}
