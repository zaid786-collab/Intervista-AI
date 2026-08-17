from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import models, schemas
from app.auth import create_access_token, hash_password, verify_password
from app.database import get_db
from app.dependencies import get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/signup", response_model=schemas.TokenResponse, status_code=status.HTTP_201_CREATED)
def signup(payload: schemas.SignupRequest, db: Session = Depends(get_db)):
    email = payload.email.lower()

    existing = db.query(models.User).filter(models.User.email == email).first()
    if existing:
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

    token = create_access_token(subject=str(user.id))
    return schemas.TokenResponse(access_token=token, user=user)


@router.post("/login", response_model=schemas.TokenResponse)
def login(payload: schemas.LoginRequest, db: Session = Depends(get_db)):
    email = payload.email.lower()
    user = db.query(models.User).filter(models.User.email == email).first()

    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password.")
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="This account has been disabled.")

    token = create_access_token(subject=str(user.id))
    return schemas.TokenResponse(access_token=token, user=user)


@router.get("/me", response_model=schemas.UserOut)
def read_current_user(current_user: models.User = Depends(get_current_user)):
    return current_user