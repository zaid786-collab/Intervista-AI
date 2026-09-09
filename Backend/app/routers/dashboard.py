from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from app import models, schemas

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get("", response_model=schemas.DashboardDataOut)
def get_dashboard_data(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Fetch complete dashboard data directly from database records.
    Requires an authenticated user session. Strictly isolates metrics,
    interviews, activities, and notifications to the active user.
    """
    user_id = current_user.id

    # Strictly isolated filters for authenticated user
    interview_filter = (models.Interview.user_id == user_id)
    activity_filter = (models.Activity.user_id == user_id)
    notification_filter = (models.Notification.user_id == user_id)
    performance_filter = (models.WeeklyPerformance.user_id == user_id)

    # 1. Compute Metrics dynamically via SQL queries for the active user
    completed_query = db.query(models.Interview).filter(interview_filter, models.Interview.status == "Completed")
    total_interviews = completed_query.count()

    avg_score_res = db.query(func.avg(models.Interview.score_num)).filter(
        interview_filter,
        models.Interview.status == "Completed",
        models.Interview.score_num.isnot(None),
    ).scalar()
    avg_score_str = f"{round(avg_score_res)}%" if avg_score_res is not None else "0%"

    best_score_res = db.query(func.max(models.Interview.score_num)).filter(
        interview_filter,
        models.Interview.status == "Completed",
        models.Interview.score_num.isnot(None),
    ).scalar()
    best_score_str = f"{round(best_score_res)}%" if best_score_res is not None else "0%"

    total_minutes_res = db.query(func.sum(models.Interview.duration_minutes)).filter(
        interview_filter,
        models.Interview.status == "Completed",
    ).scalar() or 0

    if total_minutes_res == 0:
        practice_time_str = "0 mins"
    elif total_minutes_res < 60:
        practice_time_str = f"{total_minutes_res} mins"
    else:
        hours = int(total_minutes_res // 60)
        mins = int(total_minutes_res % 60)
        practice_time_str = f"{hours}h {mins}m" if mins > 0 else f"{hours} hrs"

    # 2. Query Recent Interviews from DB
    recent_db = db.query(models.Interview).filter(
        interview_filter,
        models.Interview.status.in_(["Completed", "Pending"]),
    ).order_by(models.Interview.id.desc()).all()

    recent_interviews = [
        {
            "id": item.id,
            "role": item.role,
            "company": item.company,
            "score": item.score,
            "score_num": item.score_num,
            "technical_score": item.technical_score,
            "communication_score": item.communication_score,
            "problem_solving_score": item.problem_solving_score,
            "grade": item.grade,
            "status": item.status,
            "date": item.date,
            "time": item.time,
            "mode": item.mode,
            "feedback": item.feedback,
            "duration_minutes": item.duration_minutes,
        }
        for item in recent_db
    ]

    # 3. Query Upcoming Interviews from DB
    upcoming_db = db.query(models.Interview).filter(
        interview_filter,
        models.Interview.status == "Scheduled",
    ).order_by(models.Interview.id.asc()).all()

    upcoming_interviews = [
        {
            "id": item.id,
            "role": item.role,
            "company": item.company,
            "score": item.score,
            "score_num": item.score_num,
            "status": item.status,
            "date": item.date,
            "time": item.time,
            "mode": item.mode,
            "feedback": item.feedback,
            "duration_minutes": item.duration_minutes,
        }
        for item in upcoming_db
    ]

    # 4. Query Weekly Performance Points from DB (Map across Mon-Sun with 0 defaults)
    perf_db = db.query(models.WeeklyPerformance).filter(performance_filter).order_by(models.WeeklyPerformance.id.asc()).all()
    perf_map = {p.day_name: p.score for p in perf_db}
    days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    weekly_performance = [
        {
            "name": day,
            "score": perf_map.get(day, 0),
        }
        for day in days
    ]

    # 5. Query Activities from DB
    activities_db = db.query(models.Activity).filter(activity_filter).order_by(models.Activity.id.desc()).all()
    activities = [
        {
            "id": a.id,
            "title": a.title,
            "company": a.company,
            "time": a.time,
            "color": a.color,
        }
        for a in activities_db
    ]

    # 6. Query Notifications from DB
    notifs_db = db.query(models.Notification).filter(notification_filter).order_by(models.Notification.id.desc()).all()
    notifications = [
        {
            "id": n.id,
            "title": n.title,
            "desc": n.desc,
            "color": n.color,
            "time": n.time,
            "is_read": n.is_read,
        }
        for n in notifs_db
    ]

    return {
        "metrics": {
            "total_interviews": total_interviews,
            "avg_score": avg_score_str,
            "best_score": best_score_str,
            "practice_time": practice_time_str,
        },
        "weekly_performance": weekly_performance,
        "recent_interviews": recent_interviews,
        "upcoming_interviews": upcoming_interviews,
        "activities": activities,
        "notifications": notifications,
    }
