from datetime import timedelta, timezone
import hashlib
import secrets

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import models, schemas
from app.auth import create_access_token, hash_password, verify_password
from app.database import get_db
from app.dependencies import get_current_user
from app.models import utcnow
from app.services.email_service import send_verification_otp

router = APIRouter(prefix="/api/auth", tags=["auth"])


OTP_EXPIRY_MINUTES = 10


def issue_otp(user: models.User, db: Session) -> None:
    code = f"{secrets.randbelow(1_000_000):06d}"
    db.query(models.EmailVerificationOTP).filter(models.EmailVerificationOTP.user_id == user.id).delete()
    db.add(models.EmailVerificationOTP(
        user_id=user.id,
        code_hash=hashlib.sha256(code.encode()).hexdigest(),
        expires_at=utcnow() + timedelta(minutes=OTP_EXPIRY_MINUTES),
    ))
    db.commit()
    send_verification_otp(user.email, code)


def otp_is_expired(otp: models.EmailVerificationOTP) -> bool:
    """SQLite returns naive datetimes even for timezone-aware columns."""
    expires_at = otp.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    return expires_at < utcnow()


@router.post("/signup", response_model=schemas.SignupResponse, status_code=status.HTTP_201_CREATED)
def signup(payload: schemas.SignupRequest, db: Session = Depends(get_db)):
    email = payload.email.lower()

    existing = db.query(models.User).filter(models.User.email == email).first()
    if existing:
        pending_otp = db.query(models.EmailVerificationOTP).filter(
            models.EmailVerificationOTP.user_id == existing.id
        ).first()
        if pending_otp:
            try:
                issue_otp(existing, db)
            except Exception as exc:
                raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Could not send verification email. Please try again.") from exc
            return schemas.SignupResponse(message="A new verification code has been sent to your email.", email=existing.email)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="An account with this email already exists.")

    # The very first user to ever sign up is automatically made an admin.
    is_first_user = db.query(models.User).count() == 0

    user = models.User(
        name=payload.name.strip(),
        email=email,
        hashed_password=hash_password(payload.password),
        is_admin=is_first_user,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    try:
        issue_otp(user, db)
    except Exception as exc:
        # Do not leave an unusable unverified account when email delivery is unavailable.
        db.delete(user)
        db.commit()
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Could not send verification email. Please try again.") from exc
    return schemas.SignupResponse(message="Verification code sent to your email.", email=user.email)


@router.post("/verify-email", response_model=schemas.TokenResponse)
def verify_email(payload: schemas.VerifyEmailRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == payload.email.lower()).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired verification code.")

    otp = db.query(models.EmailVerificationOTP).filter(
        models.EmailVerificationOTP.user_id == user.id
    ).order_by(models.EmailVerificationOTP.created_at.desc()).first()
    if not otp or otp_is_expired(otp) or otp.code_hash != hashlib.sha256(payload.code.encode()).hexdigest():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired verification code.")

    db.query(models.EmailVerificationOTP).filter(models.EmailVerificationOTP.user_id == user.id).delete()
    db.commit()
    token = create_access_token(subject=str(user.id))
    return schemas.TokenResponse(access_token=token, user=user)


@router.post("/resend-otp", response_model=schemas.SignupResponse)
def resend_otp(payload: schemas.ResendOTPRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == payload.email.lower()).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Account not found.")
    try:
        issue_otp(user, db)
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Could not send verification email. Please try again.") from exc
    return schemas.SignupResponse(message="A new verification code has been sent.", email=user.email)


@router.post("/login", response_model=schemas.TokenResponse)
def login(payload: schemas.LoginRequest, db: Session = Depends(get_db)):
    email = payload.email.lower()
    user = db.query(models.User).filter(models.User.email == email).first()

    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password.")
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="This account has been disabled.")
    if db.query(models.EmailVerificationOTP).filter(models.EmailVerificationOTP.user_id == user.id).first():
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Please verify your email before logging in.")

    token = create_access_token(subject=str(user.id))
    return schemas.TokenResponse(access_token=token, user=user)


@router.get("/me", response_model=schemas.UserOut)
def read_current_user(current_user: models.User = Depends(get_current_user)):
    return current_user
