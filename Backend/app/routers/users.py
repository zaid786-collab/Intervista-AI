from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db
from app.dependencies import get_current_user

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("/me", response_model=schemas.UserOut)
def get_my_profile(current_user: models.User = Depends(get_current_user)):
    """Returns the authenticated user profile."""
    return current_user


@router.patch("/me", response_model=schemas.UserOut)
def update_my_profile(
    payload: schemas.UserProfileUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Allows candidates to update their name, bio, target role, and skills."""
    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        if value is not None:
            setattr(current_user, field, value)

    db.commit()
    db.refresh(current_user)
    return current_user


@router.patch("/me/progress", response_model=schemas.UserOut)
def update_my_progress(
    payload: schemas.ProgressUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Allows candidate to update progress percentage."""
    current_user.progress = payload.progress
    db.commit()
    db.refresh(current_user)
    return current_user


@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
def delete_my_account(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Allows user to permanently delete their account."""
    db.delete(current_user)
    db.commit()
    return None