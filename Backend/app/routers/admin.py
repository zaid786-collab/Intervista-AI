from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db
from app.dependencies import get_current_admin

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.get("/users", response_model=List[schemas.UserOut])
def list_users(
    db: Session = Depends(get_db),
    _admin: models.User = Depends(get_current_admin),
):
    return db.query(models.User).order_by(models.User.created_at.desc()).all()


@router.get("/users/{user_id}", response_model=schemas.UserOut)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    _admin: models.User = Depends(get_current_admin),
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


@router.patch("/users/{user_id}", response_model=schemas.UserOut)
def update_user(
    user_id: int,
    payload: schemas.UserUpdateByAdmin,
    db: Session = Depends(get_db),
    admin: models.User = Depends(get_current_admin),
):
    """Admin-only: promote/demote to admin, enable/disable an account, or
    set a user's progress percentage (useful once the admin-side progress
    bar view is built)."""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if user.id == admin.id and payload.is_admin is False:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You cannot remove your own admin access.")

    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user, field, value)

    db.commit()
    db.refresh(user)
    return user


@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    admin: models.User = Depends(get_current_admin),
):
    if user_id == admin.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You cannot delete your own account.")

    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    db.delete(user)
    db.commit()
    return None