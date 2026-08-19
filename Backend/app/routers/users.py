from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db
from app.dependencies import get_current_user

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("/me", response_model=schemas.UserOut)
def get_my_profile(current_user: models.User = Depends(get_current_user)):
    return current_user


@router.patch("/me/progress", response_model=schemas.UserOut)
def update_my_progress(
    payload: schemas.ProgressUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Lets the logged-in user update their own progress percentage.
    Handy hook for when interview/practice progress tracking is wired up later.
    """
    current_user.progress = payload.progress
    db.commit()
    db.refresh(current_user)
    return current_user