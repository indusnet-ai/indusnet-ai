import re
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

def markdown_to_html(md_text: str) -> str:
    """
    Converts simple markdown text of the offer letter to clean, email-safe HTML structure.
    """
    html = md_text
    
    # 1. Blockquote format
    html = re.sub(r'^>\s+(.*?)$', r'<blockquote style="border-left: 4px solid #cbd5e1; padding-left: 15px; margin: 15px 0; color: #475569; font-style: italic;">\1</blockquote>', html, flags=re.MULTILINE)
    
    # 2. Table formatting
    # Replace markdown table rows
    def replace_table(match):
        table_content = match.group(0)
        rows = table_content.strip().split('\n')
        if len(rows) < 2:
            return table_content
        
        table_html = ['<table style="width:100%; border-collapse:collapse; margin:20px 0; font-family:sans-serif; font-size:13px; color:#1e293b;">']
        for i, row in enumerate(rows):
            # Skip alignment row (e.g. | :--- | :--- |)
            if '---' in row:
                continue
            cells = [c.strip() for c in row.split('|')[1:-1]]
            
            row_style = 'border-bottom:1px solid #e2e8f0; background-color:#f8fafc;' if i % 2 == 0 else 'border-bottom:1px solid #e2e8f0;'
            if i == 0:
                row_style = 'border-bottom:2px solid #cbd5e1; background-color:#f1f5f9; font-weight:bold; color:#0f172a;'
                
            table_html.append(f'<tr style="{row_style}">')
            for cell in cells:
                cell_type = 'th' if i == 0 else 'td'
                padding_style = 'padding:10px; text-align:left;'
                # If bold, make it clean
                if cell.startswith('**') and cell.endswith('**'):
                    cell = f'<strong>{cell[2:-2]}</strong>'
                table_html.append(f'<{cell_type} style="{padding_style}">{cell}</{cell_type}>')
            table_html.append('</tr>')
            
        table_html.append('</table>')
        return '\n'.join(table_html)
        
    # Regex to capture markdown tables
    html = re.sub(r'(?:\|.*\|(?:\n|$))+', replace_table, html)
    
    # 3. Headers
    html = re.sub(r'^### (.*?)$', r'<h3 style="color:#0f172a; margin-top:20px; margin-bottom:10px; font-family:sans-serif; font-size:15px; font-weight:700;">\1</h3>', html, flags=re.MULTILINE)
    html = re.sub(r'^## (.*?)$', r'<h2 style="color:#0f172a; margin-top:25px; margin-bottom:12px; border-bottom:1px solid #e2e8f0; padding-bottom:5px; font-family:sans-serif; font-size:18px; font-weight:700;">\1</h2>', html, flags=re.MULTILINE)
    html = re.sub(r'^# (.*?)$', r'<h1 style="color:#0f172a; margin-top:30px; margin-bottom:15px; text-align:center; font-family:sans-serif; font-size:22px; font-weight:800;">\1</h1>', html, flags=re.MULTILINE)
    
    # 4. Bold and Italic formatting
    html = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', html)
    html = re.sub(r'\*(.*?)\*', r'<em>\1</em>', html)
    
    # 5. Lists (Unordered)
    html = re.sub(r'^\s*[-*]\s+(.*?)$', r'<li style="margin-left:20px; margin-bottom:5px; color:#334155;">\1</li>', html, flags=re.MULTILINE)
    
    # 6. Paragraphs and Line Breaks
    paragraphs = html.split('\n\n')
    formatted_paras = []
    for p in paragraphs:
        p_strip = p.strip()
        if not p_strip:
            continue
        # If it's already an HTML block element, do not wrap it
        if p_strip.startswith('<h') or p_strip.startswith('<table') or p_strip.startswith('<tr') or p_strip.startswith('<blockquote') or p_strip.startswith('<li') or p_strip.startswith('<ul'):
            formatted_paras.append(p_strip)
        else:
            p_strip = p_strip.replace('\n', '<br/>')
            formatted_paras.append(f'<p style="margin-top:0; margin-bottom:15px; line-height:1.6; color:#334155;">{p_strip}</p>')
            
    return '\n'.join(formatted_paras)

import html

def generate_email_html(email_type: str, candidate_name: str, job_title: str, context: Dict[str, Any]) -> str:
    """
    Generates HTML email content styled with glassmorphism dark-theme aesthetics.
    """
    candidate_name = html.escape(candidate_name)
    job_title = html.escape(job_title)
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
        custom_letter = context.get("offer_letter_text")
        if custom_letter:
            body_content = f"""
            <div style="text-align: center; border-bottom: 2px double #cbd5e1; padding-bottom: 15px; margin-bottom: 25px;">
              <h1 style="color: #0f172a; margin: 0; font-family: sans-serif; font-size: 26px; font-weight: 800; letter-spacing: -0.03em; text-transform: uppercase;">INDUSNET <span style="color: #2563eb;">AI</span></h1>
              <p style="color: #64748b; margin: 3px 0; font-family: sans-serif; font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; font-weight: 600;">Next-Gen Enterprise Recruitment</p>
              <div style="margin-top: 8px; font-family: sans-serif; font-size: 10px; color: #475569; line-height: 1.4;">
                Velachery HQ: Number 46 First Floor, Tansi Nagar, Velachery, Chennai, India 600042 | Phone: +91-9884915977<br/>
                Singapore Branch: 51 Ubi Ave 1, #05-16 Paya Ubi Industrial Park, SG 408933 | Phone: +65-9448-3805
              </div>
            </div>
            <div style="text-align: left; font-family: 'Times New Roman', Times, serif; color: #1e293b; font-size: 14px; line-height: 1.6;">
              {markdown_to_html(custom_letter)}
            </div>
            """
        else:
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

    card_style = "background: rgba(30, 41, 59, 0.4); border: 1px solid #1e293b; border-radius: 12px; padding: 24px; color: #e2e8f0; font-size: 15px; line-height: 1.6;"
    if email_type == "offer" and context.get("offer_letter_text"):
        card_style = "background: #ffffff; border: 1px solid #cbd5e1; border-radius: 12px; padding: 40px; color: #1e293b; font-size: 14px; line-height: 1.6; font-family: 'Times New Roman', Times, serif; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);"

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
        
        <!-- Notepad / Card -->
        <div style="{card_style}">
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
) -> str:
    """
    Sends an automated email utilizing settings.SMTP_* variables.
    Returns: 'sent', 'not_configured', or 'failed'.
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
            f"[MOCK EMAIL PREVIEW] To: {recipient_email} | Type: {email_type} | Candidate: {candidate_name} | Job: {job_title}\n"
            f"SMTP credentials missing. Configure SMTP_PASSWORD to send actual emails."
        )
        return "not_configured"

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
        return "sent"
    except Exception as e:
        logger.error(f"Failed to send email to {recipient_email}: {e}")
        return "failed"
