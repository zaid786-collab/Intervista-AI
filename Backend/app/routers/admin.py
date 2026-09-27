from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db
from app.dependencies import get_current_admin, is_master_admin_email

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.get("/users", response_model=List[schemas.UserOut])
def list_users(
    db: Session = Depends(get_db),
    _admin: models.User = Depends(get_current_admin),
):
    return db.query(models.User).order_by(models.User.created_at.desc()).all()


@router.get("/users/{user_id}", response_model=schemas.AdminUserDetails)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    _admin: models.User = Depends(get_current_admin),
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    completed_filter = (
        models.Interview.user_id == user.id,
        models.Interview.status == "Completed",
    )
    completed_interviews = db.query(models.Interview).filter(*completed_filter).count()
    scheduled_interviews = db.query(models.Interview).filter(
        models.Interview.user_id == user.id,
        models.Interview.status == "Scheduled",
    ).count()
    average_score = db.query(func.avg(models.Interview.score_num)).filter(
        *completed_filter, models.Interview.score_num.isnot(None)
    ).scalar()
    best_score = db.query(func.max(models.Interview.score_num)).filter(
        *completed_filter, models.Interview.score_num.isnot(None)
    ).scalar()
    practice_minutes = db.query(func.sum(models.Interview.duration_minutes)).filter(
        *completed_filter
    ).scalar() or 0

    recent = db.query(models.Interview).filter(
        models.Interview.user_id == user.id
    ).order_by(models.Interview.created_at.desc()).limit(5).all()

    return {
        **schemas.UserOut.model_validate(user).model_dump(),
        "completed_interviews": completed_interviews,
        "scheduled_interviews": scheduled_interviews,
        "average_interview_score": round(average_score) if average_score is not None else None,
        "best_interview_score": round(best_score) if best_score is not None else None,
        "practice_minutes": practice_minutes,
        "solved_resources": db.query(models.UserSolvedResource).filter(models.UserSolvedResource.user_id == user.id).count(),
        "solved_challenges": db.query(models.UserSolvedChallenge).filter(models.UserSolvedChallenge.user_id == user.id).count(),
        "unread_notifications": db.query(models.Notification).filter(
            models.Notification.user_id == user.id, models.Notification.is_read.is_(False)
        ).count(),
        "recent_interviews": recent,
    }


@router.patch("/users/{user_id}", response_model=schemas.UserOut)
def update_user(
    user_id: int,
    payload: schemas.UserUpdateByAdmin,
    db: Session = Depends(get_db),
    admin: models.User = Depends(get_current_admin),
):
    """Admin-only: enable/disable an account, or set a user's progress percentage.
    Admin promotion/demotion is strictly disallowed: only zaidkhan24082006@gmail.com can hold admin rights.
    """
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    is_target_master = is_master_admin_email(user.email)

    # Master admin cannot be demoted or disabled
    if is_target_master:
        if payload.is_admin is False:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="The master administrator account cannot be demoted.",
            )
        if payload.is_active is False:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="The master administrator account cannot be disabled.",
            )

    # Prevent granting admin privileges to any other user
    if payload.is_admin is True and not is_target_master:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Admin privileges cannot be granted to this account. Only the master admin is permitted.",
        )

    update_data = payload.model_dump(exclude_unset=True)
    # Strip is_admin from arbitrary payload dict so it cannot be directly elevated
    update_data.pop("is_admin", None)

    for field, value in update_data.items():
        setattr(user, field, value)

    # Invariant: only master admin has is_admin=True
    user.is_admin = is_target_master

    db.commit()
    db.refresh(user)
    return user


@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    admin: models.User = Depends(get_current_admin),
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if is_master_admin_email(user.email) or user.id == admin.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The master administrator account cannot be deleted.",
        )

    db.delete(user)
    db.commit()
    return None
