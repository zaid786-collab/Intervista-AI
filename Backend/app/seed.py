from app.database import SessionLocal, engine, Base
from app import models
from app.routers.resources import DEFAULT_DSA_TOPICS

DEFAULT_WEEKLY_PERFORMANCE = [
    {"day_name": "Mon", "score": 70},
    {"day_name": "Tue", "score": 82},
    {"day_name": "Wed", "score": 75},
    {"day_name": "Thu", "score": 90},
    {"day_name": "Fri", "score": 88},
    {"day_name": "Sat", "score": 95},
    {"day_name": "Sun", "score": 80},
]

DEFAULT_INTERVIEWS = [
    # Completed interviews
    {"role": "Frontend Developer", "company": "Meta", "score": "92%", "score_num": 92, "duration_minutes": 60, "status": "Completed", "date": "10 Aug 2026", "time": "03:00 PM", "mode": "Virtual"},
    {"role": "Backend Developer", "company": "Google", "score": "85%", "score_num": 85, "duration_minutes": 45, "status": "Completed", "date": "08 Aug 2026", "time": "11:00 AM", "mode": "Virtual"},
    {"role": "React Developer", "company": "Netflix", "score": "78%", "score_num": 78, "duration_minutes": 60, "status": "Pending", "date": "06 Aug 2026", "time": "04:30 PM", "mode": "Online Coding"},
    {"role": "AI Engineer", "company": "OpenAI", "score": "95%", "score_num": 95, "duration_minutes": 90, "status": "Completed", "date": "02 Aug 2026", "time": "01:00 PM", "mode": "Virtual"},
    {"role": "Fullstack Engineer", "company": "Apple", "score": "88%", "score_num": 88, "duration_minutes": 45, "status": "Completed", "date": "28 Jul 2026", "time": "10:00 AM", "mode": "Virtual"},
    {"role": "DevOps Engineer", "company": "Amazon", "score": "82%", "score_num": 82, "duration_minutes": 60, "status": "Completed", "date": "25 Jul 2026", "time": "02:00 PM", "mode": "Virtual"},
    
    # Upcoming / Scheduled interviews
    {"role": "SDE Intern", "company": "Google", "score": None, "score_num": None, "duration_minutes": 45, "status": "Scheduled", "date": "04 Aug 2026", "time": "10:00 AM", "mode": "Virtual"},
    {"role": "Frontend Developer", "company": "Microsoft", "score": None, "score_num": None, "duration_minutes": 60, "status": "Scheduled", "date": "05 Aug 2026", "time": "02:00 PM", "mode": "Online Coding"},
    {"role": "Backend Engineer", "company": "Amazon", "score": None, "score_num": None, "duration_minutes": 45, "status": "Scheduled", "date": "07 Aug 2026", "time": "11:30 AM", "mode": "Virtual"},
]

DEFAULT_ACTIVITIES = [
    {"title": "Interview Completed", "company": "Google", "time": "2 hours ago", "color": "#22c55e"},
    {"title": "AI Feedback Generated", "company": "Score: 92%", "time": "Yesterday", "color": "#2563eb"},
    {"title": "Interview Scheduled", "company": "Microsoft", "time": "Tomorrow 11:00 AM", "color": "#f59e0b"},
    {"title": "Coding Challenge Completed", "company": "LeetCode", "time": "Today", "color": "#a855f7"},
]

DEFAULT_NOTIFICATIONS = [
    {"title": "Google Interview Tomorrow", "desc": "10:00 AM • Software Engineer", "color": "#2563eb", "time": "2 min ago", "is_read": False},
    {"title": "AI Resume Analysis Complete", "desc": "Your ATS Score improved to 91%", "color": "#8b5cf6", "time": "20 min ago", "is_read": False},
    {"title": "New Coding Challenge", "desc": "Today's DSA question is available", "color": "#22c55e", "time": "1 hour ago", "is_read": False},
    {"title": "Interview Completed", "desc": "Feedback report is ready", "color": "#f59e0b", "time": "Yesterday", "is_read": False},
]

def seed_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # Seed DSA Topics & Resources
        if db.query(models.DSATopic).count() == 0:
            print("Seeding DSA topics and resources...")
            for topic_data in DEFAULT_DSA_TOPICS:
                topic = models.DSATopic(
                    title=topic_data["title"],
                    description=topic_data["description"],
                    icon=topic_data["icon"],
                    problem_count=topic_data["problemCount"],
                )
                db.add(topic)
                db.flush()

                for prob in topic_data["problems"]:
                    resource = models.Resource(
                        topic_id=topic.id,
                        topic_title=topic.title,
                        title=prob["name"],
                        difficulty=prob["difficulty"],
                        leetcode_url=prob["leetcode"],
                        category="DSA",
                    )
                    db.add(resource)
            db.commit()
            print("DSA topics seeded!")

        # Note: Interview, Activity, Notification and WeeklyPerformance records are created
        # dynamically as users practice and complete mock interviews.
        print("Database seed complete!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
