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


def send_feedback_email(
    name: str = "",
    email: str = "",
    feedback_type: str = "General Feedback",
    rating: int = None,
    message_text: str = "",
    page_context: str = "Home Page",
) -> bool:
    """Send an instant feedback notification email directly to Intervista AI's Gmail."""
    destination_email = os.getenv("FEEDBACK_RECEIVER_EMAIL") or os.getenv("SMTP_USERNAME") or "intervistaai06@gmail.com"
    user_name = name.strip() if name else "Anonymous Visitor"
    user_email = email.strip() if email else "Not provided"
    rating_display = f"{rating} / 5 Stars {'★' * rating}{'☆' * (5 - rating)}" if (rating and 1 <= rating <= 5) else "Not Rated"

    subject = f"✦ [Instant Feedback] {feedback_type} from {user_name} ({rating_display})"

    text_content = (
        f"New Feedback Received via Intervista AI ({page_context})\n"
        f"====================================================\n\n"
        f"• Type: {feedback_type}\n"
        f"• Rating: {rating_display}\n"
        f"• Submitter Name: {user_name}\n"
        f"• Submitter Email: {user_email}\n"
        f"• Origin Page: {page_context}\n\n"
        f"Message / Feedback:\n"
        f"-------------------\n"
        f"{message_text}\n\n"
        f"====================================================\n"
        f"Intervista AI Instant Feedback System"
    )

    if not is_smtp_configured():
        print(f"\n==========================================")
        print(f"[DEV INSTANT FEEDBACK RECEIVED]")
        print(f"To: {destination_email}")
        print(f"Subject: {subject}")
        print(f"From: {user_name} <{user_email}>")
        print(f"Type: {feedback_type} | Rating: {rating_display}")
        print(f"Message: {message_text}")
        print(f"==========================================\n")
        logger.info(f"[DEV FEEDBACK] Feedback logged for {destination_email} from {user_name}")
        return True

    host = os.getenv("SMTP_HOST")
    username = os.getenv("SMTP_USERNAME")
    password = (os.getenv("SMTP_PASSWORD") or "").replace(" ", "")
    sender = os.getenv("SMTP_FROM") or username
    port = int(os.getenv("SMTP_PORT", "587"))

    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = sender
    message["To"] = destination_email
    if email and "@" in email:
        message["Reply-To"] = email.strip()

    message.set_content(text_content)

    # Clean styling for Gmail
    stars_html = ""
    if rating and 1 <= rating <= 5:
        stars_html = "".join(["★" for _ in range(rating)]) + "".join(["☆" for _ in range(5 - rating)])

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin: 0; padding: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #050814; color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; background: #0b1120; border: 1px solid rgba(56, 189, 248, 0.25); border-radius: 16px; padding: 32px; box-shadow: 0 16px 40px rgba(0,0,0,0.6);">
        
        <!-- Header -->
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 18px; margin-bottom: 24px;">
          <div>
            <span style="font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #38bdf8; display: block; margin-bottom: 4px;">INTERVISTA AI NOTIFICATION</span>
            <h2 style="margin: 0; font-size: 22px; color: #ffffff; font-weight: 700;">Instant Feedback Received 💬</h2>
          </div>
          <div style="background: linear-gradient(135deg, #2563eb, #06b6d4); color: #fff; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 600;">
            {feedback_type}
          </div>
        </div>

        <!-- Rating & Details Grid -->
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #cbd5e1;">
            <tr>
              <td style="padding: 6px 0; color: #94a3b8; width: 130px;">⭐ Rating:</td>
              <td style="padding: 6px 0; color: #fbbf24; font-size: 16px; font-weight: bold;">
                {f"{stars_html} ({rating}/5)" if rating else "<span style='color:#94a3b8; font-size:13px;'>Not rated</span>"}
              </td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #94a3b8;">👤 User Name:</td>
              <td style="padding: 6px 0; color: #ffffff; font-weight: 600;">{user_name}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #94a3b8;">✉️ Email:</td>
              <td style="padding: 6px 0;">
                {f'<a href="mailto:{user_email}" style="color: #38bdf8; text-decoration: none;">{user_email}</a>' if email else '<span style="color:#64748b;">Not provided</span>'}
              </td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #94a3b8;">📍 Page Context:</td>
              <td style="padding: 6px 0; color: #94a3b8;">{page_context}</td>
            </tr>
          </table>
        </div>

        <!-- Message Body -->
        <div style="margin-bottom: 24px;">
          <h4 style="margin: 0 0 10px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.8px; color: #38bdf8;">Feedback Message</h4>
          <div style="background: #060913; border: 1px solid rgba(255,255,255,0.1); border-left: 4px solid #38bdf8; border-radius: 8px; padding: 18px; color: #f1f5f9; font-size: 15px; line-height: 1.7; white-space: pre-wrap;">{message_text}</div>
        </div>

        {f'''
        <!-- Reply CTA -->
        <div style="text-align: center; margin: 26px 0 12px 0;">
          <a href="mailto:{user_email}?subject=Re:%20Thank%20you%20for%20your%20feedback%20on%20Intervista%20AI" style="display: inline-block; background: linear-gradient(90deg, #2563eb, #0284c7); color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: 600; font-size: 14px; box-shadow: 0 4px 14px rgba(37,99,235,0.4);">
            Reply to {user_name} →
          </a>
        </div>
        ''' if (email and "@" in email) else ''}

        <!-- Footer -->
        <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 12px; color: #64748b; text-align: center;">
          Sent automatically from Intervista AI Instant Feedback System • <a href="https://intervista.ai" style="color: #38bdf8; text-decoration: none;">Intervista AI</a>
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
        logger.info(f"Instant feedback email successfully sent to {destination_email}")
        return True
    except Exception as e:
        logger.warning(f"SMTP sending feedback email failed: {e}")
        print(f"\n==========================================")
        print(f"[FALLBACK FEEDBACK EMAIL] To: {destination_email} | Message: {message_text}")
        print(f"==========================================\n")
        return False
