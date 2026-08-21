import os
import smtplib
from email.message import EmailMessage


def send_verification_otp(recipient: str, code: str) -> None:
    """Send a verification code using the SMTP account configured in .env."""
    host = os.getenv("SMTP_HOST")
    username = os.getenv("SMTP_USERNAME")
    password = os.getenv("SMTP_PASSWORD")
    sender = os.getenv("SMTP_FROM") or username
    port = int(os.getenv("SMTP_PORT", "587"))

    if not all([host, username, password, sender]):
        raise RuntimeError("Email service is not configured. Set SMTP_HOST, SMTP_USERNAME, SMTP_PASSWORD, and SMTP_FROM.")

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
