import os
from contextlib import asynccontextmanager
from app.config import reload_env
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app import models
from app.routers import (
    admin,
    auth,
    dashboard,
    resources,
    users,
    ai,
    challenges,
    companies,
    interviews,
    leaderboard_jobs,
    payments,
    feedback,
)
from app.seed import seed_db

# Creates any tables that don't exist yet
Base.metadata.create_all(bind=engine)

def ensure_db_columns():
    """Idempotently adds missing columns to existing SQLite/Postgres tables."""
    from sqlalchemy import text, inspect
    try:
        insp = inspect(engine)
        user_cols = {c["name"] for c in insp.get_columns("users")}
        interview_cols = {c["name"] for c in insp.get_columns("interviews")}
    except Exception:
        user_cols, interview_cols = set(), set()

    with engine.connect() as conn:
        for col, col_type in [
            ("technical_score", "INTEGER"),
            ("communication_score", "INTEGER"),
            ("problem_solving_score", "INTEGER"),
            ("grade", "VARCHAR(50)"),
            ("report_data", "TEXT"),
            ("warning_count", "INTEGER DEFAULT 0"),
            ("termination_reason", "VARCHAR(255)"),
            ("proctoring_data", "TEXT"),
            ("candidate_answers", "TEXT"),
            ("question_count", "INTEGER DEFAULT 0"),
            ("answered_count", "INTEGER DEFAULT 0"),
            ("skipped_count", "INTEGER DEFAULT 0"),
            ("correct_count", "INTEGER DEFAULT 0"),
            ("partial_count", "INTEGER DEFAULT 0"),
            ("incorrect_count", "INTEGER DEFAULT 0"),
            ("started_at", "TIMESTAMP"),
            ("ended_at", "TIMESTAMP"),
            ("duration_seconds", "INTEGER"),
        ]:
            if col not in interview_cols:
                try:
                    conn.execute(text(f"ALTER TABLE interviews ADD COLUMN {col} {col_type}"))
                    conn.commit()
                except Exception:
                    conn.rollback()

        for col, col_type in [
            ("subscription_plan", "VARCHAR(50) DEFAULT 'free'"),
            ("subscription_cycle", "VARCHAR(20) DEFAULT 'monthly'"),
            ("subscription_expires_at", "TIMESTAMP"),
            ("last_login_at", "TIMESTAMP"),
            ("last_active_at", "TIMESTAMP"),
            ("last_login_ip", "VARCHAR(100)"),
            ("last_login_user_agent", "VARCHAR(500)"),
            ("is_blocked", "BOOLEAN DEFAULT FALSE"),
            ("block_reason", "VARCHAR(500)"),
        ]:
            if col not in user_cols:
                try:
                    conn.execute(text(f"ALTER TABLE users ADD COLUMN {col} {col_type}"))
                    conn.commit()
                except Exception:
                    conn.rollback()


def normalize_admin_privileges():
    """Idempotently ensures that ONLY the master admin email (zaidkhan24082006@gmail.com)
    has is_admin=True, and every other user account has is_admin=False.
    Safe to run repeatedly on startup without hardcoded credentials.
    """
    from app.database import SessionLocal
    from app.dependencies import MASTER_ADMIN_EMAIL, is_master_admin_email
    import logging

    log = logging.getLogger(__name__)
    db = SessionLocal()
    try:
        # Demote any non-master user who currently has is_admin=True
        all_admins = db.query(models.User).filter(models.User.is_admin.is_(True)).all()
        for user in all_admins:
            if not is_master_admin_email(user.email):
                user.is_admin = False
                log.info("Demoted non-master admin account: %s", user.email)

        # If the master admin account exists, ensure is_admin=True
        all_users = db.query(models.User).all()
        for user in all_users:
            if is_master_admin_email(user.email) and not user.is_admin:
                user.is_admin = True
                log.info("Promoted master admin account: %s", user.email)

        db.commit()
    except Exception as exc:
        db.rollback()
        log.warning("Could not normalize admin privileges during startup: %s", exc)
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure all columns exist, seed default mock data if empty, and normalize admin role
    ensure_db_columns()
    seed_db()
    normalize_admin_privileges()
    yield


app = FastAPI(
    title="Intervista AI API",
    description="Full Backend API for Intervista AI Platform",
    version="2.0.0",
    lifespan=lifespan,
)

# Open CORS configuration for development and local testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all API routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(admin.router)
app.include_router(dashboard.router)
app.include_router(resources.router)
app.include_router(ai.router)
app.include_router(challenges.router)
app.include_router(companies.router)
app.include_router(interviews.router)
app.include_router(leaderboard_jobs.router)
app.include_router(payments.router)
app.include_router(feedback.router)


@app.get("/")
def root():
    return {
        "message": "Welcome to Intervista AI Backend",
        "status": "online",
        "version": "2.0.0",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "database": "connected",
    }