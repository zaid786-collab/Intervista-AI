from datetime import datetime
from typing import List, Optional
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


class SignupResponse(BaseModel):
    message: str
    email: EmailStr


class VerifyEmailRequest(BaseModel):
    email: EmailStr
    code: str = Field(min_length=6, max_length=6, pattern=r"^\d{6}$")


class ResendOTPRequest(BaseModel):
    email: EmailStr


# ---------- Users ----------

class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    is_admin: bool
    is_active: bool
    progress: int
    xp: Optional[int] = 1250
    target_role: Optional[str] = "Software Engineer"
    bio: Optional[str] = None
    skills: Optional[str] = None
    avatar: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    bio: Optional[str] = None
    target_role: Optional[str] = None
    skills: Optional[str] = None


class UserUpdateByAdmin(BaseModel):
    is_admin: Optional[bool] = None
    is_active: Optional[bool] = None
    progress: Optional[int] = Field(default=None, ge=0, le=100)


class AdminUserDetails(UserOut):
    """Full account and activity snapshot for the admin user inspector."""
    completed_interviews: int = 0
    scheduled_interviews: int = 0
    average_interview_score: Optional[int] = None
    best_interview_score: Optional[int] = None
    practice_minutes: int = 0
    solved_resources: int = 0
    solved_challenges: int = 0
    unread_notifications: int = 0
    recent_interviews: List["InterviewOut"] = []


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
    score_num: Optional[int] = None
    technical_score: Optional[int] = None
    communication_score: Optional[int] = None
    problem_solving_score: Optional[int] = None
    grade: Optional[str] = None
    status: str
    date: Optional[str] = None
    time: Optional[str] = None
    mode: Optional[str] = None
    feedback: Optional[str] = None
    duration_minutes: Optional[int] = 45


AdminUserDetails.model_rebuild()


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
    weekly_performance: List[PerformancePoint]
    recent_interviews: List[InterviewOut]
    upcoming_interviews: List[InterviewOut]
    activities: List[ActivityOut]
    notifications: List[NotificationOut]


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
    problems: List[ProblemOut] = []


class ToggleSolvedRequest(BaseModel):
    title: str


class ToggleSolvedResponse(BaseModel):
    title: str
    is_solved: bool
    solved_titles: List[str]


# ---------- AI Chat ----------

class ChatMessage(BaseModel):
    sender: str
    text: str


class AIChatRequest(BaseModel):
    message: str = Field(min_length=1)
    history: Optional[List[ChatMessage]] = []
    category: Optional[str] = "general"


class AIChatResponse(BaseModel):
    response: str
    suggested_followups: Optional[List[str]] = []


# ---------- Resume Analyzer ----------

class ResumeAnalysisRequest(BaseModel):
    resume_text: str = Field(min_length=10)
    target_role: Optional[str] = "Software Engineer"
    target_company: Optional[str] = "Google"


class KeywordAnalysis(BaseModel):
    matched: List[str]
    missing: List[str]


class ResumeAnalysisResponse(BaseModel):
    ats_score: int
    target_role: str
    verdict: str
    keywords: KeywordAnalysis
    strengths: List[str]
    suggestions: List[str]
    formatting_score: int = 88
    technical_depth_score: int = 85
    impact_score: Optional[int] = 82
    structure_score: Optional[int] = 90
    action_verbs: Optional[List[dict]] = None
    word_count: Optional[int] = None
    file_name: Optional[str] = None


# ---------- Mock Interview Engine ----------

class StartInterviewRequest(BaseModel):
    company: str = "Google"
    role: str = "Software Engineer"
    difficulty: str = "Medium"
    duration_minutes: int = 45


class InterviewQuestion(BaseModel):
    id: int
    category: str
    question: str
    hint: Optional[str] = None
    round_number: Optional[int] = 1
    round_title: Optional[str] = None
    expected_key_points: Optional[List[str]] = []


class StartInterviewResponse(BaseModel):
    session_id: str
    company: str
    role: str
    difficulty: str
    duration_minutes: int
    questions: List[InterviewQuestion]


class CandidateAnswer(BaseModel):
    question_id: int
    question: str
    answer: str


class SubmitInterviewRequest(BaseModel):
    company: str
    role: str
    difficulty: str
    duration_minutes: int = 45
    answers: List[CandidateAnswer]


class QuestionFeedback(BaseModel):
    question_id: int
    question: str
    score: int
    feedback: str
    suggested_answer_points: List[str]
    identified_keywords: Optional[List[str]] = []
    technical_accuracy: Optional[int] = 85
    communication_clarity: Optional[int] = 85


class SubmitInterviewResponse(BaseModel):
    interview_id: int
    score: int
    score_percentage: str
    grade: str
    strengths: List[str]
    improvements: List[str]
    detailed_feedback: List[QuestionFeedback]
    overall_summary: str
    technical_score: Optional[int] = 85
    communication_score: Optional[int] = 85
    problem_solving_score: Optional[int] = 85
    identified_keywords: Optional[List[str]] = []


class ScheduleInterviewRequest(BaseModel):
    company: str
    role: str
    date: str
    time: str
    mode: str = "Virtual"


# ---------- Daily Coding Challenges ----------

class ChallengeOut(BaseModel):
    id: int
    title: str
    difficulty: str
    description: str
    starter_code: Optional[str] = None
    time_limit: str
    xp_reward: int


class SolveChallengeRequest(BaseModel):
    challenge_id: int
    code: str
    language: Optional[str] = "javascript"


# ---------- Leaderboard & Jobs ----------

class LeaderboardUser(BaseModel):
    rank: int
    name: str
    role: str
    interviews: int
    avg_score: int
    xp: int
    badge: str


class JobOut(BaseModel):
    id: int
    title: str
    company: str
    location: str
    salary: str
    type: str
    match_score: int
    skills: List[str]
    logo: str


class JobApplyRequest(BaseModel):
    job_id: Optional[str] = None
    company: str
    role: str
    location: Optional[str] = "Remote / Hybrid"
    salary: Optional[str] = "Competitive"
    recipient_email: Optional[EmailStr] = None
    candidate_name: Optional[str] = None


class JobApplyResponse(BaseModel):
    success: bool
    message: str
    job_id: Optional[str] = None
    company: str
    role: str
    email_sent_to: str


TokenResponse.model_rebuild()
