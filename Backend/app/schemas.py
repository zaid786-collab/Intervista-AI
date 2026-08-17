from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


# ---------- Auth ----------

class SignupRequest(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserOut"


# ---------- Users ----------

class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    is_admin: bool
    is_active: bool
    progress: int
    created_at: datetime

    class Config:
        from_attributes = True


class UserUpdateByAdmin(BaseModel):
    """Fields an admin is allowed to change on another user."""
    is_admin: Optional[bool] = None
    is_active: Optional[bool] = None
    progress: Optional[int] = Field(default=None, ge=0, le=100)

class ProgressUpdate(BaseModel):
    progress: int = Field(ge=0, le=100)


# ---------- Dashboard ----------

class MetricOut(BaseModel):
    total_interviews: int = 24
    avg_score: str = "78%"
    best_score: str = "92%"
    practice_time: str = "18 hrs"

class PerformancePoint(BaseModel):
    name: str
    score: int

class InterviewOut(BaseModel):
    id: Optional[int] = None
    role: str
    company: Optional[str] = None
    score: Optional[str] = None
    status: str
    date: Optional[str] = None
    time: Optional[str] = None
    mode: Optional[str] = None


class ActivityOut(BaseModel):
    id: Optional[int] = None
    title: str
    company: Optional[str] = None
    time: Optional[str] = None
    color: str = "#2563eb"

class NotificationOut(BaseModel):
    id: Optional[int] = None
    title: str
    desc: Optional[str] = None
    color: str = "#2563eb"
    time: Optional[str] = None
    is_read: bool = False

class DashboardDataOut(BaseModel):
    metrics: MetricOut
    weekly_performance: list[PerformancePoint]
    recent_interviews: list[InterviewOut]
    upcoming_interviews: list[InterviewOut]
    activities: list[ActivityOut]
    notifications: list[NotificationOut]


# ---------- Resources ----------

class ProblemOut(BaseModel):
    id: Optional[int] = None
    name: str
    difficulty: str
    leetcode: Optional[str] = None

class TopicOut(BaseModel):
    id: Optional[int] = None
    icon: Optional[str] = "▣"
    title: str
    description: Optional[str] = None
    problemCount: int = 0
    problems: list[ProblemOut] = []

class ToggleSolvedRequest(BaseModel):
    title: str

class ToggleSolvedResponse(BaseModel):
    title: str
    is_solved: bool
    solved_titles: list[str]


TokenResponse.model_rebuild()