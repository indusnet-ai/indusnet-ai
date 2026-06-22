import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Dict, Any
from app.config import settings

logger = logging.getLogger("email")

# Singapore and Chennai contact footers
EMAIL_FOOTER = """
<div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #334155; font-size: 12px; color: #94a3b8; font-family: sans-serif; line-height: 1.6;">
  <p style="margin: 0 0 10px 0; font-weight: 600; color: #f8fafc; text-transform: uppercase; letter-spacing: 0.05em;">Indusnet AI Corporation</p>
  <table style="width: 100%; border-collapse: collapse; font-size: 12px; color: #94a3b8;">
    <tr>
      <td style="width: 50%; vertical-align: top; padding-right: 20px;">
        <strong style="color: #cbd5e1;">Singapore Office</strong><br/>
        51 Ubi Ave 1, #05-16 Paya Ubi Industrial Park,<br/>
        Singapore, SG 408933<br/>
        Phone: +65-9448-3805 | +65-6747-4753
      </td>
      <td style="width: 50%; vertical-align: top; padding-left: 20px; border-left: 1px solid #334155;">
        <strong style="color: #cbd5e1;">Chennai HQ</strong><br/>
        Number 46 First Floor, Tansi Nagar,<br/>
        Velachery, Chennai, India 600042<br/>
        Phone: +91-9884915977
      </td>
    </tr>
  </table>
  <p style="margin: 20px 0 0 0; text-align: center; color: #64748b; font-size: 11px;">
    This is an automated message from the Indusnet AI Recruitment Portal. Please do not reply directly to this email.
  </p>
</div>
"""

def generate_email_html(email_type: str, candidate_name: str, job_title: str, context: Dict[str, Any]) -> str:
    """
    Generates HTML email content styled with glassmorphism dark-theme aesthetics.
    """
    title = ""
    body_content = ""

    if email_type == "applied":
        title = "Application Received - Indusnet AI"
        body_content = f"""
        <p>Dear {candidate_name},</p>
        <p>Thank you for applying for the <strong>{job_title}</strong> position at Indusnet AI. We have successfully received your application and resume.</p>
        <p>Our talent acquisition team is currently reviewing your profile against our requirements. If your background aligns with our needs, we will reach out to you for the next steps in our hiring process.</p>
        <p>You can track the status of your application through our careers portal.</p>
        """
    elif email_type == "review":
        title = "Application Update - Indusnet AI"
        body_content = f"""
        <p>Dear {candidate_name},</p>
        <p>We are writing to let you know that your application for the <strong>{job_title}</strong> position is now <strong>Under Review</strong> by our hiring committee.</p>
        <p>We will be in touch shortly if we decide to move forward with scheduling a screening call or interview.</p>
        """
    elif email_type == "interview":
        title = "Interview Invitation - Indusnet AI"
        date_time = context.get("date_time", "To Be Scheduled")
        interview_details = context.get("details", "Details will be provided shortly.")
        body_content = f"""
        <p>Dear {candidate_name},</p>
        <p>Congratulations! We were impressed by your background and would like to invite you for an interview for the <strong>{job_title}</strong> role.</p>
        <div style="background: rgba(30, 41, 59, 0.5); border: 1px solid #475569; border-radius: 8px; padding: 15px; margin: 20px 0; color: #f1f5f9;">
          <h3 style="margin-top: 0; color: #38bdf8;">Interview Details</h3>
          <p style="margin: 5px 0;"><strong>Date/Time:</strong> {date_time}</p>
          <p style="margin: 5px 0;"><strong>Format:</strong> Video Call / Technical Discussion</p>
          <p style="margin: 5px 0;"><strong>Instructions:</strong> {interview_details}</p>
        </div>
        <p>Please reply to this email or confirm your availability via our portal as soon as possible.</p>
        """
    elif email_type == "offer":
        title = "Job Offer - Indusnet AI"
        salary = context.get("salary", "As discussed")
        start_date = context.get("start_date", "TBD")
        body_content = f"""
        <p>Dear {candidate_name},</p>
        <p>We are absolutely thrilled to offer you the position of <strong>{job_title}</strong> at Indusnet AI!</p>
        <p>We believe your skills and experience will be a fantastic addition to our engineering team, and we look forward to achieving great milestones together.</p>
        <div style="background: rgba(30, 41, 59, 0.5); border: 1px solid #475569; border-radius: 8px; padding: 15px; margin: 20px 0; color: #f1f5f9;">
          <h3 style="margin-top: 0; color: #10b981;">Offer Summary</h3>
          <p style="margin: 5px 0;"><strong>Role:</strong> {job_title}</p>
          <p style="margin: 5px 0;"><strong>Compensation:</strong> {salary}</p>
          <p style="margin: 5px 0;"><strong>Proposed Start Date:</strong> {start_date}</p>
        </div>
        <p>Please review the detailed offer letter attached/provided in the candidate portal, sign it, and return it to us to accept the offer.</p>
        """
    elif email_type == "rejection":
        title = "Application Status - Indusnet AI"
        body_content = f"""
        <p>Dear {candidate_name},</p>
        <p>Thank you for your interest in the <strong>{job_title}</strong> position and for taking the time to apply and speak with us.</p>
        <p>After careful consideration, we regret to inform you that we have decided to move forward with other candidates whose experience more closely matches the specific requirements of this role.</p>
        <p>We appreciate your interest in Indusnet AI and wish you the best of luck in your job search and future professional endeavors.</p>
        """
    else:
        title = "Notification - Indusnet AI"
        body_content = f"<p>Dear {candidate_name},</p><p>{context.get('message', '')}</p>"

    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>{title}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0f172a; color: #cbd5e1; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; padding: 30px; background: #0f172a;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="color: #38bdf8; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.025em;">INDUSNET <span style="color: #f8fafc;">AI</span></h2>
          <p style="color: #64748b; margin: 5px 0 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Next-Gen Enterprise Recruitment</p>
        </div>
        
        <!-- Glassmorphism Card -->
        <div style="background: rgba(30, 41, 59, 0.4); border: 1px solid #1e293b; border-radius: 12px; padding: 24px; color: #e2e8f0; font-size: 15px; line-height: 1.6;">
          {body_content}
        </div>
        
        <!-- Footer -->
        {EMAIL_FOOTER}
      </div>
    </body>
    </html>
    """
    return html

def send_recruitment_email(
    email_type: str,
    recipient_email: str,
    candidate_name: str,
    job_title: str,
    context: Dict[str, Any]
) -> bool:
    """
    Sends an automated email utilizing settings.SMTP_* variables.
    Fails gracefully with logger output to prevent blocking key user flows.
    """
    # 1. Generate HTML content
    html_content = generate_email_html(email_type, candidate_name, job_title, context)
    
    # Define Subject mapping
    subject_map = {
        "applied": f"Application Received: {job_title} - Indusnet AI",
        "review": f"Application Status Update: {job_title} - Indusnet AI",
        "interview": f"Interview Invitation: {job_title} - Indusnet AI",
        "offer": f"Job Offer: {job_title} - Indusnet AI",
        "rejection": f"Application Status: {job_title} - Indusnet AI"
    }
    subject = subject_map.get(email_type, f"Recruitment Update: {job_title} - Indusnet AI")

    # 2. Check if SMTP configuration exists
    if not settings.SMTP_PASSWORD:
        logger.warning(
            f"[MOCK EMAIL SENT] To: {recipient_email} | Type: {email_type} | Candidate: {candidate_name} | Job: {job_title}\n"
            f"SMTP credentials missing. Configure SMTP_PASSWORD to send actual emails."
        )
        return True

    # 3. Formulate SMTP email
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = settings.SMTP_USERNAME
        msg["To"] = recipient_email
        
        part_html = MIMEText(html_content, "html")
        msg.attach(part_html)
        
        # Connect and send
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
            server.sendmail(settings.SMTP_USERNAME, recipient_email, msg.as_string())
            
        logger.info(f"Email successfully sent to {recipient_email} for type {email_type}")
        return True
    except Exception as e:
        logger.error(f"Failed to send email to {recipient_email}: {e}")
        # Return True to avoid breaking candidate submission flows if SMTP setup fails
        return False
