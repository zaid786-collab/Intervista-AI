import os
from contextlib import asynccontextmanager
from dotenv import load_dotenv
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

load_dotenv()

# Creates any tables that don't exist yet
Base.metadata.create_all(bind=engine)

def ensure_db_columns():
    """Idempotently adds missing columns to existing SQLite/Postgres tables."""
    from sqlalchemy import text
    with engine.connect() as conn:
        for col, col_type in [
            ("technical_score", "INTEGER"),
            ("communication_score", "INTEGER"),
            ("problem_solving_score", "INTEGER"),
            ("grade", "VARCHAR(50)"),
            ("report_data", "TEXT"),
        ]:
            try:
                conn.execute(text(f"ALTER TABLE interviews ADD COLUMN {col} {col_type}"))
                conn.commit()
            except Exception:
                pass

        for col, col_type in [
            ("subscription_plan", "VARCHAR(50) DEFAULT 'free'"),
            ("subscription_cycle", "VARCHAR(20) DEFAULT 'monthly'"),
            ("subscription_expires_at", "DATETIME"),
        ]:
            try:
                conn.execute(text(f"ALTER TABLE users ADD COLUMN {col} {col_type}"))
                conn.commit()
            except Exception:
                pass


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure all columns exist and seed default mock data if empty
    ensure_db_columns()
    seed_db()
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