from typing import List, Optional

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db
from app.dependencies import get_current_user_optional

router = APIRouter(prefix="/api", tags=["Leaderboard & Jobs"])

DEFAULT_LEADERBOARD = [
    {"rank": 1, "name": "Rahul Sharma", "score": "96%", "badge": "🥇", "xp": 2450},
    {"rank": 2, "name": "Zaid Khan", "score": "94%", "badge": "🥈", "xp": 2180},
    {"rank": 3, "name": "Priya Singh", "score": "90%", "badge": "🥉", "xp": 1950},
    {"rank": 4, "name": "Aman Gupta", "score": "88%", "badge": "🏅", "xp": 1720},
    {"rank": 5, "name": "Neha Verma", "score": "84%", "badge": "🏅", "xp": 1560},
    {"rank": 6, "name": "Rohan Patel", "score": "82%", "badge": "🏅", "xp": 1420},
    {"rank": 7, "name": "Ananya Roy", "score": "80%", "badge": "🏅", "xp": 1310},
]

RECOMMENDED_JOBS = [
    {
        "id": 1,
        "company": "Google",
        "role": "Software Engineer Intern",
        "location": "Bangalore, India",
        "salary": "₹18 - ₹24 LPA",
        "color": "#4285F4",
        "logo_letter": "G",
        "tags": ["Full-Time", "DSA", "C++/Python", "Hybrid"],
        "apply_url": "https://careers.google.com",
    },
    {
        "id": 2,
        "company": "Microsoft",
        "role": "Frontend Developer (L59/L60)",
        "location": "Hyderabad, India",
        "salary": "₹22 - ₹28 LPA",
        "color": "#7FBA00",
        "logo_letter": "M",
        "tags": ["Full-Time", "React", "TypeScript", "Remote Friendly"],
        "apply_url": "https://careers.microsoft.com",
    },
    {
        "id": 3,
        "company": "Amazon",
        "role": "SDE I - Backend Infrastructure",
        "location": "Delhi NCR, India",
        "salary": "₹20 - ₹26 LPA",
        "color": "#FF9900",
        "logo_letter": "A",
        "tags": ["Full-Time", "Java/Go", "AWS", "Distributed Systems"],
        "apply_url": "https://amazon.jobs",
    },
    {
        "id": 4,
        "company": "Netflix",
        "role": "Senior Full Stack Engineer",
        "location": "Remote",
        "salary": "₹35 - ₹48 LPA",
        "color": "#E50914",
        "logo_letter": "N",
        "tags": ["Remote", "Node.js", "React", "GraphQL"],
        "apply_url": "https://jobs.netflix.com",
    },
    {
        "id": 5,
        "company": "Meta",
        "role": "Software Engineer - Product Systems",
        "location": "Bangalore / Remote",
        "salary": "₹28 - ₹38 LPA",
        "color": "#0668E1",
        "logo_letter": "M",
        "tags": ["Full-Time", "Python", "React", "AI Integration"],
        "apply_url": "https://metacareers.com",
    },
]


@router.get("/leaderboard", response_model=List[schemas.LeaderboardUserOut])
def get_leaderboard(
    current_user: Optional[models.User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db),
):
    """
    Returns weekly rankings combined from real database users and top performers.
    """
    users = db.query(models.User).filter(models.User.is_active == True).order_by(models.User.xp.desc()).limit(10).all()
    
    ranks = []
    badges = ["🥇", "🥈", "🥉", "🏅", "🏅", "🏅", "🏅", "🏅"]

    for idx, u in enumerate(users):
        ranks.append(
            schemas.LeaderboardUserOut(
                rank=idx + 1,
                name=u.name,
                score=f"{min(80 + (u.xp // 50), 98)}%",
                badge=badges[idx] if idx < len(badges) else "🏅",
                xp=u.xp or 250,
                is_current_user=bool(current_user and u.id == current_user.id),
            )
        )

    # If DB has fewer than 5 users, supplement with default leaderboard
    if len(ranks) < 5:
        existing_names = {r.name for r in ranks}
        for item in DEFAULT_LEADERBOARD:
            if item["name"] not in existing_names:
                ranks.append(
                    schemas.LeaderboardUserOut(
                        rank=len(ranks) + 1,
                        name=item["name"],
                        score=item["score"],
                        badge=badges[len(ranks)] if len(ranks) < len(badges) else "🏅",
                        xp=item["xp"],
                        is_current_user=False,
                    )
                )

    return ranks[:8]


@router.get("/jobs", response_model=List[schemas.JobOut])
def get_jobs():
    """Returns curated job recommendations."""
    return [schemas.JobOut(**j) for j in RECOMMENDED_JOBS]
