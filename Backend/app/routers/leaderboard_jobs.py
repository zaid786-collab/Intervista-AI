from typing import List, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from app.dependencies import get_current_user_optional
from app.services.email_service import send_job_application_email

router = APIRouter(prefix="/api", tags=["Leaderboard & Jobs"])

DEFAULT_LEADERBOARD = [
    {"rank": 1, "name": "Sarah Chen", "role": "Senior Frontend", "interviews": 42, "avg_score": 96, "xp": 4850, "badge": "Master"},
    {"rank": 2, "name": "Alex Rivera", "role": "Full Stack Dev", "interviews": 38, "avg_score": 94, "xp": 4210, "badge": "Diamond"},
    {"rank": 3, "name": "Priya Sharma", "role": "Backend Engineer", "interviews": 35, "avg_score": 92, "xp": 3950, "badge": "Platinum"},
    {"rank": 4, "name": "Michael Zhang", "role": "ML Engineer", "interviews": 31, "avg_score": 89, "xp": 3400, "badge": "Gold"},
    {"rank": 5, "name": "David Kim", "role": "DevOps / SRE", "interviews": 28, "avg_score": 88, "xp": 3120, "badge": "Gold"},
]

FEATURED_JOBS = [
    {
        "id": 1,
        "title": "Senior Frontend Engineer",
        "company": "Google",
        "location": "Mountain View, CA (Hybrid)",
        "salary": "$165k - $220k",
        "type": "Full-Time",
        "match_score": 94,
        "skills": ["React", "TypeScript", "Performance", "Web Vitals"],
        "logo": "G",
    },
    {
        "id": 2,
        "title": "Backend Distributed Systems Engineer",
        "company": "Microsoft",
        "location": "Redmond, WA (Remote)",
        "salary": "$155k - $210k",
        "type": "Full-Time",
        "match_score": 91,
        "skills": ["Python", "FastAPI", "Redis", "Distributed Systems"],
        "logo": "M",
    },
    {
        "id": 3,
        "title": "Full Stack Engineer (Growth)",
        "company": "Meta",
        "location": "Menlo Park, CA (Hybrid)",
        "salary": "$170k - $230k",
        "type": "Full-Time",
        "match_score": 88,
        "skills": ["React", "GraphQL", "Python", "System Design"],
        "logo": "∞",
    },
    {
        "id": 4,
        "title": "AI Platform Engineer",
        "company": "Amazon",
        "location": "Seattle, WA (Hybrid)",
        "salary": "$160k - $225k",
        "type": "Full-Time",
        "match_score": 86,
        "skills": ["Python", "PyTorch", "vLLM", "AWS"],
        "logo": "A",
    },
]

@router.get("/leaderboard", response_model=List[schemas.LeaderboardUser])
def get_leaderboard(
    current_user: Optional[models.User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db),
):
    users = db.query(models.User).order_by(models.User.xp.desc()).limit(10).all()
    if not users:
        return [schemas.LeaderboardUser(**u) for u in DEFAULT_LEADERBOARD]

    result = []
    for idx, u in enumerate(users):
        xp = u.xp or 1200
        badge = "Master" if xp >= 4000 else "Diamond" if xp >= 3000 else "Platinum" if xp >= 2000 else "Gold"
        result.append(
            schemas.LeaderboardUser(
                rank=idx + 1,
                name=u.name,
                role=u.target_role or "Software Engineer",
                interviews=max(int(xp / 100), 5),
                avg_score=min(75 + int(xp / 200), 98),
                xp=xp,
                badge=badge,
            )
        )
    return result

@router.get("/jobs", response_model=List[schemas.JobOut])
def get_job_recommendations(
    current_user: Optional[models.User] = Depends(get_current_user_optional),
):
    return [schemas.JobOut(**j) for j in FEATURED_JOBS]

@router.post("/jobs/apply", response_model=schemas.JobApplyResponse)
def apply_to_job(
    req: schemas.JobApplyRequest,
    current_user: Optional[models.User] = Depends(get_current_user_optional),
):
    target_email = req.recipient_email or (current_user.email if current_user else "candidate@intervista.ai")
    target_name = req.candidate_name or (current_user.name if current_user else "Candidate")

    send_job_application_email(
        recipient=target_email,
        user_name=target_name,
        company=req.company,
        role=req.role,
        location=req.location or "Remote / Hybrid",
        salary=req.salary or "Competitive",
    )

    return schemas.JobApplyResponse(
        success=True,
        message=f"Application for {req.role} at {req.company} submitted successfully. Confirmation email sent to {target_email}.",
        job_id=req.job_id,
        company=req.company,
        role=req.role,
        email_sent_to=target_email,
    )
