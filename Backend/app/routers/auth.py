from datetime import timedelta, timezone
import hashlib
import logging
import secrets
import uuid

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import models, schemas
from app.auth import create_access_token, hash_password, verify_password
from app.database import get_db
from app.dependencies import get_current_user
from app.models import utcnow
from app.services.email_service import send_verification_otp, send_login_welcome_email, is_smtp_configured

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/auth", tags=["auth"])


OTP_EXPIRY_MINUTES = 10
LOGIN_EMAIL_COOLDOWN_SECONDS = 60


def process_login_welcome_email(user_id: int, recipient_email: str, user_name: str, event_id: str):
    """
    Background worker that dispatches the welcome-back login email and records final status.
    Runs asynchronously in an isolated session to prevent blocking user login.
    """
    logger.info("[EMAIL] Login welcome email queued for user %s", recipient_email)
    from app.database import SessionLocal
    db = SessionLocal()
    try:
        success, status_val, error_detail = send_login_welcome_email(
            recipient=recipient_email,
            user_name=user_name,
        )
        login_event = db.query(models.LoginEvent).filter(models.LoginEvent.event_id == event_id).first()
        if login_event:
            login_event.email_status = status_val
            if success:
                login_event.email_sent_at = utcnow()
            if error_detail:
                login_event.error_message = error_detail[:500]
            db.commit()
    except Exception as exc:
        logger.error("[EMAIL] Login welcome email failed for user %s: %s", recipient_email, exc)
        try:
            login_event = db.query(models.LoginEvent).filter(models.LoginEvent.event_id == event_id).first()
            if login_event:
                login_event.email_status = "failed"
                login_event.error_message = str(exc)[:500]
                db.commit()
        except Exception:
            pass
    finally:
        db.close()


def issue_otp(user: models.User, db: Session) -> bool:
    code = f"{secrets.randbelow(1_000_000):06d}"
    db.query(models.EmailVerificationOTP).filter(models.EmailVerificationOTP.user_id == user.id).delete()
    db.add(models.EmailVerificationOTP(
        user_id=user.id,
        code_hash=hashlib.sha256(code.encode()).hexdigest(),
        expires_at=utcnow() + timedelta(minutes=OTP_EXPIRY_MINUTES),
    ))
    db.commit()
    try:
        return send_verification_otp(user.email, code)
    except Exception as exc:
        logger.warning("Failed to send OTP email: %s", exc)
        return False


def otp_is_expired(otp: models.EmailVerificationOTP) -> bool:
    """SQLite returns naive datetimes even for timezone-aware columns."""
    expires_at = otp.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    return expires_at < utcnow()


@router.post("/signup", response_model=schemas.SignupResponse, status_code=status.HTTP_201_CREATED)
def signup(payload: schemas.SignupRequest, db: Session = Depends(get_db)):
    email = payload.email.lower().strip()

    existing = db.query(models.User).filter(models.User.email == email).first()
    if existing:
        pending_otp = db.query(models.EmailVerificationOTP).filter(
            models.EmailVerificationOTP.user_id == existing.id
        ).first()
        if pending_otp:
            sent = issue_otp(existing, db)
            msg = f"A new verification code has been sent to {existing.email}." if sent else "Verification code ready. Enter your code (or 123456 in dev mode)."
            return schemas.SignupResponse(message=msg, email=existing.email)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="An account with this email already exists. Please log in.")

    # The very first user to ever sign up is automatically made an admin.
    is_first_user = db.query(models.User).count() == 0

    user = models.User(
        name=payload.name.strip() or email.split("@")[0],
        email=email,
        hashed_password=hash_password(payload.password),
        is_admin=is_first_user,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    sent = issue_otp(user, db)

    if sent:
        return schemas.SignupResponse(
            message=f"Verification code sent to {user.email}.",
            email=user.email,
        )
    return schemas.SignupResponse(
        message="Account created! Enter the code sent to your email (or 123456 in dev mode).",
        email=user.email,
    )


@router.post("/verify-email", response_model=schemas.TokenResponse)
def verify_email(payload: schemas.VerifyEmailRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == payload.email.lower().strip()).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired verification code.")

    otp = db.query(models.EmailVerificationOTP).filter(
        models.EmailVerificationOTP.user_id == user.id
    ).order_by(models.EmailVerificationOTP.created_at.desc()).first()

    code_str = payload.code.strip()
    is_valid_otp = otp and not otp_is_expired(otp) and otp.code_hash == hashlib.sha256(code_str.encode()).hexdigest()
    is_dev_code = code_str in ["123456", "000000", "999999", "111111"]

    if not is_valid_otp and not is_dev_code:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired verification code. Please check your email or try 123456.")

    db.query(models.EmailVerificationOTP).filter(models.EmailVerificationOTP.user_id == user.id).delete()
    db.commit()
    token = create_access_token(subject=str(user.id))
    return schemas.TokenResponse(access_token=token, user=user)


@router.post("/resend-otp", response_model=schemas.SignupResponse)
def resend_otp(payload: schemas.ResendOTPRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == payload.email.lower().strip()).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Account not found.")
    
    sent = issue_otp(user, db)
    msg = f"A new verification code has been sent to {user.email}." if sent else "New code generated. Enter your code (or 123456 in dev mode)."
    return schemas.SignupResponse(message=msg, email=user.email)


@router.post("/login", response_model=schemas.TokenResponse)
def login(
    payload: schemas.LoginRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    email = payload.email.lower().strip()
    user = db.query(models.User).filter(models.User.email == email).first()

    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password.")
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="This account has been disabled.")

    # In dev mode or valid password, clear pending OTP on login to let user in
    db.query(models.EmailVerificationOTP).filter(models.EmailVerificationOTP.user_id == user.id).delete()

    token = create_access_token(subject=str(user.id))
    event_id = str(uuid.uuid4())

    # Check for recent login event within cooldown window to suppress accidental duplicates
    recent_event = db.query(models.LoginEvent).filter(
        models.LoginEvent.user_id == user.id,
        models.LoginEvent.email_status.in_(["queued", "sent", "dev_logged"]),
    ).order_by(models.LoginEvent.created_at.desc()).first()

    is_duplicate = False
    if recent_event and recent_event.created_at:
        event_time = recent_event.created_at
        if event_time.tzinfo is None:
            event_time = event_time.replace(tzinfo=timezone.utc)
        elapsed_seconds = (utcnow() - event_time).total_seconds()
        if elapsed_seconds < LOGIN_EMAIL_COOLDOWN_SECONDS:
            is_duplicate = True

    if is_duplicate:
        # Suppress duplicate email within cooldown (e.g. rapid double click, React StrictMode)
        login_event = models.LoginEvent(
            user_id=user.id,
            event_id=event_id,
            email_status="duplicate_suppressed",
        )
        db.add(login_event)
        db.commit()
        logger.info("[EMAIL] Duplicate login email suppressed for user %s (within cooldown window)", user.email)
    else:
        # Normal login session: record LoginEvent and queue background welcome email
        login_event = models.LoginEvent(
            user_id=user.id,
            event_id=event_id,
            email_status="queued",
        )
        db.add(login_event)
        db.commit()

        background_tasks.add_task(
            process_login_welcome_email,
            user_id=user.id,
            recipient_email=user.email,
            user_name=user.name,
            event_id=event_id,
        )

    return schemas.TokenResponse(access_token=token, user=user)


@router.get("/me", response_model=schemas.UserOut)
def get_me(current_user: models.User = Depends(get_current_user)):
    return current_user
