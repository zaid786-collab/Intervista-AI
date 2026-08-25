import logging
import os
import smtplib
from email.message import EmailMessage

logger = logging.getLogger(__name__)


def is_smtp_configured() -> bool:
    host = os.getenv("SMTP_HOST")
    username = os.getenv("SMTP_USERNAME")
    password = os.getenv("SMTP_PASSWORD")
    sender = os.getenv("SMTP_FROM") or username
    return bool(all([host, username, password, sender]))


def send_verification_otp(recipient: str, code: str) -> bool:
    """Send a verification code using the SMTP account configured in .env, or log in dev mode."""
    if not is_smtp_configured():
        print(f"\n==========================================")
        print(f"[DEV AUTH OTP] Verification Code for {recipient}: {code}")
        print(f"==========================================\n")
        logger.info("[DEV AUTH OTP] Verification Code for %s: %s", recipient, code)
        return False

    host = os.getenv("SMTP_HOST")
    username = os.getenv("SMTP_USERNAME")
    # Clean whitespace/spaces often found in copied Gmail App Passwords (e.g. 'abcd efgh ijkl mnop')
    password = (os.getenv("SMTP_PASSWORD") or "").replace(" ", "")
    sender = os.getenv("SMTP_FROM") or username
    port = int(os.getenv("SMTP_PORT", "587"))

    message = EmailMessage()
    message["Subject"] = "Your Intervista AI verification code"
    message["From"] = sender
    message["To"] = recipient
    message.set_content(
        f"Your Intervista AI verification code is: {code}\n\n"
        "It expires in 10 minutes. Do not share this code with anyone."
    )

    try:
        with smtplib.SMTP(host, port, timeout=10) as smtp:
            smtp.starttls()
            smtp.login(username, password)
            smtp.send_message(message)
        logger.info(f"Verification email successfully sent to {recipient}")
        return True
    except Exception as e:
        logger.warning(f"SMTP sending failed: {e}. Falling back to OTP logging.")
        print(f"\n==========================================")
        print(f"[FALLBACK AUTH OTP] Could not reach SMTP ({e}).")
        print(f"[AUTH OTP] Verification Code for {recipient}: {code}")
        print(f"==========================================\n")
        return False


def send_job_application_email(
    recipient: str,
    user_name: str,
    company: str,
    role: str,
    location: str = "Remote / Hybrid",
    salary: str = "Competitive",
) -> bool:
    """Send a confirmation email to the candidate when they apply for a recommended job."""
    user_display = user_name or "Candidate"
    subject = f"Application Confirmed: {role} at {company} ✦ Intervista AI"

    text_content = (
        f"Hello {user_display},\n\n"
        f"Great news! Your application for the position of {role} at {company} has been successfully submitted through Intervista AI.\n\n"
        f"Application Details:\n"
        f"• Company: {company}\n"
        f"• Position: {role}\n"
        f"• Location: {location}\n"
        f"• Package / Compensation: {salary}\n"
        f"• Status: Profile & ATS Resume Sent to Hiring Team\n\n"
        f"Next Steps:\n"
        f"1. Practice targeted mock interviews for {company} in your Intervista AI Dashboard.\n"
        f"2. Keep your algorithm problem-solving and system design streak active.\n"
        f"3. You will receive interview scheduling invitations as recruiters review candidate metrics.\n\n"
        f"Best regards,\n"
        f"The Intervista AI Career & Placement Team\n"
        f"https://intervista.ai\n"
    )

    if not is_smtp_configured():
        print(f"\n==========================================")
        print(f"[DEV JOB APPLICATION EMAIL]")
        print(f"To: {recipient}")
        print(f"Subject: {subject}")
        print(f"Details: {role} at {company} ({location} | {salary})")
        print(f"==========================================\n")
        logger.info(f"[DEV JOB EMAIL] Application email logged for {recipient} ({role} at {company})")
        return True

    host = os.getenv("SMTP_HOST")
    username = os.getenv("SMTP_USERNAME")
    password = (os.getenv("SMTP_PASSWORD") or "").replace(" ", "")
    sender = os.getenv("SMTP_FROM") or username
    port = int(os.getenv("SMTP_PORT", "587"))

    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = sender
    message["To"] = recipient
    message.set_content(text_content)

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <body style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #050814; color: #f8fafc;">
      <div style="max-width: 580px; margin: 0 auto; background: #0c111e; border: 1px solid rgba(255,255,255,0.12); border-radius: 16px; padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 24px;">
          <div style="background: linear-gradient(135deg, #2563eb, #38bdf8); color: #fff; width: 36px; height: 36px; border-radius: 10px; display: inline-flex; align-items: center; justify-content: center; font-size: 18px; font-weight: bold;">✦</div>
          <h2 style="margin: 0; color: #ffffff; font-size: 20px;">Intervista AI Career Portal</h2>
        </div>

        <p style="font-size: 15px; color: #cbd5e1; line-height: 1.5;">Hello <strong>{user_display}</strong>,</p>
        <p style="font-size: 14px; color: #94a3b8; line-height: 1.6;">
          Your application for <strong style="color: #38bdf8;">{role}</strong> at <strong style="color: #ffffff;">{company}</strong> has been successfully received and submitted!
        </p>

        <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 18px; margin: 20px 0;">
          <h3 style="margin: 0 0 12px 0; font-size: 14px; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.5px;">Application Summary</h3>
          <div style="font-size: 13.5px; color: #cbd5e1; line-height: 1.8;">
            <div>🏢 <strong>Company:</strong> {company}</div>
            <div>💼 <strong>Role:</strong> {role}</div>
            <div>📍 <strong>Location:</strong> {location}</div>
            <div>💰 <strong>Package:</strong> {salary}</div>
            <div>✓ <strong>Status:</strong> Profile & Verified Scores Submitted</div>
          </div>
        </div>

        <p style="font-size: 13.5px; color: #94a3b8; line-height: 1.6;">
          <strong>Next Steps:</strong> Prepare for technical rounds by running simulated {company} mock interviews on your Intervista AI dashboard.
        </p>

        <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.08); font-size: 12px; color: #64748b; text-align: center;">
          Intervista AI • Advanced Agentic Interview Intelligence • <a href="https://intervista.ai" style="color: #38bdf8; text-decoration: none;">Dashboard</a>
        </div>
      </div>
    </body>
    </html>
    """
    message.add_alternative(html_content, subtype="html")

    try:
        with smtplib.SMTP(host, port, timeout=10) as smtp:
            smtp.starttls()
            smtp.login(username, password)
            smtp.send_message(message)
        logger.info(f"Job application confirmation email successfully sent to {recipient}")
        return True
    except Exception as e:
        logger.warning(f"SMTP sending job application email failed: {e}")
        print(f"\n==========================================")
        print(f"[FALLBACK JOB EMAIL] To: {recipient} ({role} at {company})")
        print(f"==========================================\n")
        return False
