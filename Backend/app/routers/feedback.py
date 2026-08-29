import logging
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_optional_current_user
from app.models import Feedback, User, Notification
from app import schemas
from app.services.email_service import send_feedback_email

logger = logging.getLogger(__name__)

router = APIRouter(tags=["feedback"])


@router.post(
    "/api/feedback",
    response_model=schemas.FeedbackResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Submit Instant Feedback and send to Intervista Gmail",
)
@router.post(
    "/feedback",
    response_model=schemas.FeedbackResponse,
    status_code=status.HTTP_201_CREATED,
    include_in_schema=False,
)
def submit_feedback(
    payload: schemas.FeedbackCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user),
):
    """
    Submits user or visitor instant feedback, saves it to the database,
    and sends a formatted notification email to Intervista AI's official Gmail (intervistaai06@gmail.com).
    """
    message_clean = payload.message.strip()
    if not message_clean:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Feedback message cannot be empty.",
        )

    # Determine submitter identity
    user_id = current_user.id if current_user else None
    submitter_name = payload.name.strip() if payload.name else (current_user.name if current_user else "Anonymous Visitor")
    submitter_email = payload.email.strip() if payload.email else (current_user.email if current_user else "")

    feedback_type = payload.feedback_type or "General Feedback"
    rating = payload.rating
    page_context = payload.page_context or "Home Page - Instant Feedback"

    # 1. Save to Database
    feedback_record = Feedback(
        user_id=user_id,
        name=submitter_name,
        email=submitter_email,
        feedback_type=feedback_type,
        rating=rating,
        message=message_clean,
        page_context=page_context,
    )
    db.add(feedback_record)
    db.commit()
    db.refresh(feedback_record)

    # 2. Add Notification if user is logged in
    if current_user:
        try:
            notif = Notification(
                user_id=current_user.id,
                title="Feedback Received ✦",
                desc=f"Thanks for your feedback! Our team has received it.",
                color="#06b6d4",
                is_read=False,
            )
            db.add(notif)
            db.commit()
        except Exception as e:
            logger.warning(f"Could not create user notification: {e}")

    # 3. Dispatch Email to Intervista AI Gmail
    email_sent = False
    try:
        email_sent = send_feedback_email(
            name=submitter_name,
            email=submitter_email,
            feedback_type=feedback_type,
            rating=rating,
            message_text=message_clean,
            page_context=page_context,
        )
    except Exception as exc:
        logger.error(f"Error while dispatching feedback email: {exc}")

    return schemas.FeedbackResponse(
        success=True,
        message="Thank you! Your feedback has been received and sent directly to the Intervista team.",
        feedback_id=feedback_record.id,
        sent_to_email=email_sent,
    )
