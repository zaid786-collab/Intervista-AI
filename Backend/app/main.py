import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app import models  # noqa: F401
from app.routers import (
    admin,
    ai,
    auth,
    challenges,
    companies,
    dashboard,
    interviews,
    leaderboard_jobs,
    resources,
    users,
)
from app.seed import seed_db

load_dotenv()

# Creates any tables that don't exist yet
Base.metadata.create_all(bind=engine)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure database is seeded with initial data if empty
    try:
        seed_db()
    except Exception as e:
        print(f"Startup DB seed check: {e}")
    yield


app = FastAPI(
    title="Intervista AI API",
    description="Full-featured Backend API for Intervista AI with AI Mock Interviews, Resume Analysis, Coding Challenges, and Company Prep Guides.",
    version="2.0.0",
    lifespan=lifespan,
)

frontend_origins = os.getenv(
    "FRONTEND_ORIGINS",
    "http://localhost:5173,http://localhost:5174,http://localhost:3000,http://127.0.0.1:5173",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(ai.router)
app.include_router(ai.resume_router)
app.include_router(interviews.router)
app.include_router(challenges.router)
app.include_router(companies.router)
app.include_router(dashboard.router)
app.include_router(resources.router)
app.include_router(leaderboard_jobs.router)
app.include_router(admin.router)


@app.get("/")
def root():
    return {
        "name": "Intervista AI API",
        "version": "2.0.0",
        "status": "online",
        "message": "Welcome to Intervista AI Backend Services",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "services": {
            "database": "connected",
            "ai_coach": "active",
            "mock_interviews": "ready",
            "resume_analyzer": "ready",
        },
    }