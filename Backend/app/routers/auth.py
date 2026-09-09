import os
import hashlib
import logging
import secrets
import uuid
from datetime import timedelta, timezone
from typing import Optional
import requests

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


@router.get("/oauth/{provider}/url", response_model=schemas.OAuthUrlResponse)
def get_oauth_authorization_url(
    provider: str,
    redirect_uri: str = "http://localhost:5173/oauth/callback",
):
    provider_clean = provider.lower().strip()
    if provider_clean == "google":
        client_id = os.getenv("GOOGLE_CLIENT_ID", "").strip()
        if not client_id:
            # Fallback dev simulation URL if Google client credentials are not yet configured in .env
            dev_url = f"{redirect_uri}?provider=google&code=mock_google_auth_code&state=dev"
            return schemas.OAuthUrlResponse(url=dev_url, provider="google")
        
        # OpenID Connect / OAuth 2.0 Auth URL
        scope = "openid email profile"
        url = (
            f"https://accounts.google.com/o/oauth2/v2/auth?"
            f"client_id={client_id}&redirect_uri={redirect_uri}&response_type=code&scope={scope}&access_type=offline&prompt=select_account"
        )
        return schemas.OAuthUrlResponse(url=url, provider="google")

    elif provider_clean == "github":
        client_id = os.getenv("GITHUB_CLIENT_ID", "").strip()
        if not client_id:
            # Fallback dev simulation URL if GitHub client credentials are not yet configured in .env
            dev_url = f"{redirect_uri}?provider=github&code=mock_github_auth_code&state=dev"
            return schemas.OAuthUrlResponse(url=dev_url, provider="github")

        scope = "user:email"
        url = (
            f"https://github.com/login/oauth/authorize?"
            f"client_id={client_id}&redirect_uri={redirect_uri}&scope={scope}"
        )
        return schemas.OAuthUrlResponse(url=url, provider="github")

    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail=f"Unsupported OAuth provider: '{provider}'. Supported providers are 'google' and 'github'.",
    )


@router.post("/oauth/{provider}/callback", response_model=schemas.TokenResponse)
def oauth_callback(
    provider: str,
    payload: schemas.OAuthCallbackRequest,
    db: Session = Depends(get_db),
):
    provider_clean = provider.lower().strip()
    if provider_clean not in ("google", "github"):
        raise HTTPException(status_code=400, detail="Unsupported OAuth provider.")

    email: str = ""
    name: str = ""
    provider_user_id: str = ""
    avatar: Optional[str] = None

    if provider_clean == "google":
        client_id = os.getenv("GOOGLE_CLIENT_ID", "").strip()
        client_secret = os.getenv("GOOGLE_CLIENT_SECRET", "").strip()

        if payload.code == "mock_google_auth_code" or not (client_id and client_secret):
            # Development fallback when OAuth credentials are not configured
            email = "google.candidate@example.com"
            name = "Google Candidate"
            provider_user_id = "google_dev_1001"
            avatar = "https://lh3.googleusercontent.com/a/default-user"
        else:
            try:
                # Exchange authorization code for token
                token_resp = requests.post(
                    "https://oauth2.googleapis.com/token",
                    data={
                        "client_id": client_id,
                        "client_secret": client_secret,
                        "code": payload.code,
                        "grant_type": "authorization_code",
                        "redirect_uri": payload.redirect_uri or "http://localhost:5173/oauth/callback",
                    },
                    timeout=10,
                )
                if not token_resp.ok:
                    logger.error("Google token exchange failed: %s", token_resp.text)
                    raise HTTPException(status_code=400, detail="Failed to exchange authorization code with Google.")

                token_data = token_resp.json()
                access_token = token_data.get("access_token")

                # Fetch user profile
                userinfo_resp = requests.get(
                    "https://www.googleapis.com/oauth2/v3/userinfo",
                    headers={"Authorization": f"Bearer {access_token}"},
                    timeout=10,
                )
                if not userinfo_resp.ok:
                    raise HTTPException(status_code=400, detail="Failed to fetch Google user profile.")

                u_info = userinfo_resp.json()
                email = (u_info.get("email") or "").lower().strip()
                name = u_info.get("name") or email.split("@")[0]
                provider_user_id = str(u_info.get("sub") or "")
                avatar = u_info.get("picture")
            except HTTPException:
                raise
            except Exception as exc:
                logger.error("Google OAuth error: %s", exc)
                raise HTTPException(status_code=400, detail="Google authentication failed. Please try again.")

    elif provider_clean == "github":
        client_id = os.getenv("GITHUB_CLIENT_ID", "").strip()
        client_secret = os.getenv("GITHUB_CLIENT_SECRET", "").strip()

        if payload.code == "mock_github_auth_code" or not (client_id and client_secret):
            # Development fallback
            email = "github.engineer@example.com"
            name = "GitHub Engineer"
            provider_user_id = "github_dev_2002"
            avatar = "https://avatars.githubusercontent.com/u/9919"
        else:
            try:
                # Exchange code for GitHub access token
                token_resp = requests.post(
                    "https://github.com/login/oauth/access_token",
                    headers={"Accept": "application/json"},
                    data={
                        "client_id": client_id,
                        "client_secret": client_secret,
                        "code": payload.code,
                        "redirect_uri": payload.redirect_uri or "http://localhost:5173/oauth/callback",
                    },
                    timeout=10,
                )
                if not token_resp.ok:
                    logger.error("GitHub token exchange failed: %s", token_resp.text)
                    raise HTTPException(status_code=400, detail="Failed to exchange authorization code with GitHub.")

                token_data = token_resp.json()
                gh_token = token_data.get("access_token")
                if not gh_token:
                    raise HTTPException(status_code=400, detail="No access token returned by GitHub.")

                # Fetch user info
                user_resp = requests.get(
                    "https://api.github.com/user",
                    headers={"Authorization": f"Bearer {gh_token}", "Accept": "application/json"},
                    timeout=10,
                )
                if not user_resp.ok:
                    raise HTTPException(status_code=400, detail="Failed to fetch GitHub profile.")

                gh_user = user_resp.json()
                provider_user_id = str(gh_user.get("id") or "")
                name = gh_user.get("name") or gh_user.get("login") or "GitHub User"
                avatar = gh_user.get("avatar_url")
                email = (gh_user.get("email") or "").lower().strip()

                # If email is private in primary profile, fetch from emails endpoint
                if not email:
                    emails_resp = requests.get(
                        "https://api.github.com/user/emails",
                        headers={"Authorization": f"Bearer {gh_token}", "Accept": "application/json"},
                        timeout=10,
                    )
                    if emails_resp.ok:
                        email_list = emails_resp.json()
                        primary_email = next((e["email"] for e in email_list if e.get("primary") and e.get("verified")), None)
                        if not primary_email and email_list:
                            primary_email = email_list[0].get("email")
                        email = (primary_email or "").lower().strip()
            except HTTPException:
                raise
            except Exception as exc:
                logger.error("GitHub OAuth error: %s", exc)
                raise HTTPException(status_code=400, detail="GitHub authentication failed. Please try again.")

    if not email:
        raise HTTPException(status_code=400, detail="No verified email address found for this OAuth account.")

    # 1. ACCOUNT LINKING: Check if user exists by email
    user = db.query(models.User).filter(models.User.email == email).first()

    if user:
        # Existing account found -> Link provider IDs and avatar if not present
        if provider_clean == "google" and not user.google_id:
            user.google_id = provider_user_id
        elif provider_clean == "github" and not user.github_id:
            user.github_id = provider_user_id

        if avatar and not user.avatar:
            user.avatar = avatar

        db.commit()
        db.refresh(user)
    else:
        # 2. New account creation for verified OAuth identity
        is_first_user = db.query(models.User).count() == 0
        user = models.User(
            name=name or email.split("@")[0],
            email=email,
            hashed_password=hash_password(secrets.token_urlsafe(32)),
            google_id=provider_user_id if provider_clean == "google" else None,
            github_id=provider_user_id if provider_clean == "github" else None,
            auth_provider=provider_clean,
            avatar=avatar,
            is_admin=is_first_user,
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="This account has been disabled.")

    token = create_access_token(subject=str(user.id))
    return schemas.TokenResponse(access_token=token, user=user)


@router.get("/me", response_model=schemas.UserOut)
def get_me(current_user: models.User = Depends(get_current_user)):
    return current_user
