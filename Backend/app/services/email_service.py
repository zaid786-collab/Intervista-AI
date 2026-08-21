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


def send_verification_otp(recipient: str, code: str) -> None:
    """Send a verification code using the SMTP account configured in .env, or log in dev mode."""
    if not is_smtp_configured():
        print(f"\n==========================================")
        print(f"[DEV AUTH OTP] Verification Code for {recipient}: {code}")
        print(f"==========================================\n")
        logger.info("[DEV AUTH OTP] Verification Code for %s: %s", recipient, code)
        return

    host = os.getenv("SMTP_HOST")
    username = os.getenv("SMTP_USERNAME")
    password = os.getenv("SMTP_PASSWORD")
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

    with smtplib.SMTP(host, port, timeout=15) as smtp:
        smtp.starttls()
        smtp.login(username, password)
        smtp.send_message(message)

