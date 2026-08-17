import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app import models  # noqa: F401  (needed so Base knows about the User table)
from app.routers import admin, auth, users

load_dotenv()

# Creates any tables that don't exist yet (e.g. `users`). For a first pass this
# is enough; if you outgrow it, swap in Alembic migrations.
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Intervista AI API",
    description="Backend API for Intervista AI",
    version="1.0.0",
)

frontend_origins = os.getenv("FRONTEND_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in frontend_origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(admin.router)


@app.get("/")
def root():
    return {
        "message": "Welcome to Intervista AI Backend"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }

companies = [
    "Google",
    "Microsoft",
    "Amazon",
    "Meta",
    "Apple",
    "Netflix",
    "Adobe",
    "Salesforce",
    "IBM",
    "Oracle",
    "NVIDIA",
    "Infosys",
    "TCS",
    "Wipro",
    "Accenture"
]


@app.get("/api/companies")
def get_companies():
    return {
        "companies": companies
    }