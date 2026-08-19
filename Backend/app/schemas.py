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


# ---------- Users ----------

class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    bio: Optional[str] = "Aspiring Software Engineer preparing for top tech interviews."
    target_role: Optional[str] = "Full Stack Developer"
    skills: Optional[str] = "DSA, JavaScript, React.js, Node.js, Python, System Design"
    is_admin: bool
    is_active: bool
    progress: int
    xp: int = 250
    created_at: datetime

    class Config:
        from_attributes = True


class UserProfileUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=120)
    bio: Optional[str] = Field(default=None, max_length=500)
    target_role: Optional[str] = Field(default=None, max_length=120)
    skills: Optional[str] = Field(default=None, max_length=500)


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
    feedback: Optional[str] = None


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
    sender: str  # "You" or "AI"
    text: str


class AIChatRequest(BaseModel):
    message: str = Field(min_length=1)
    history: Optional[List[ChatMessage]] = []
    category: Optional[str] = "general"  # technical, behavioral, system_design, resume, general


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
    formatting_score: int
    technical_depth_score: int


# ---------- Mock Interview Engine ----------

class StartInterviewRequest(BaseModel):
    company: str = "Google"
    role: str = "Software Engineer"
    difficulty: str = "Medium"  # Easy, Medium, Hard
    duration_minutes: int = 45


class InterviewQuestion(BaseModel):
    id: int
    category: str  # Coding, System Design, Behavioral, CS Fundamentals
    question: str
    hint: Optional[str] = None
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
    mode: str = "Virtual"  # Virtual, Online Coding, In-Person


# ---------- Daily Coding Challenges ----------

class ChallengeOut(BaseModel):
    id: int
    title: str
    difficulty: str
    description: str
    time_limit: str
    xp_reward: int
    tags: str
    sample_input: Optional[str] = None
    sample_output: Optional[str] = None
    is_solved: bool = False


class SolveChallengeRequest(BaseModel):
    challenge_id: int
    code: Optional[str] = ""
    approach_explanation: Optional[str] = ""


class SolveChallengeResponse(BaseModel):
    success: bool
    message: str
    xp_awarded: int
    new_total_xp: int
    new_progress: int


# ---------- Companies ----------

class CompanyQuestionOut(BaseModel):
    title: str
    difficulty: str
    topic: str
    frequency: str
    leetcode: Optional[str] = None


class CompanyRoundOut(BaseModel):
    round: str
    title: str
    focus: str
    tips: str


class CompanyPreparationOut(BaseModel):
    overview: str
    topics: str
    strategy: str
    tips: str


class CompanyDetailOut(BaseModel):
    name: str
    stats: List[str]
    questions: List[CompanyQuestionOut]
    mostAsked: List[str]
    preparation: CompanyPreparationOut
    rounds: List[CompanyRoundOut]
    solved_count: int = 0
    solved_titles: List[str] = []


# ---------- Leaderboard & Jobs ----------

class LeaderboardUserOut(BaseModel):
    rank: int
    name: str
    score: str
    badge: str
    xp: int
    is_current_user: bool = False


class JobOut(BaseModel):
    id: int
    company: str
    role: str
    location: str
    salary: str
    color: str
    logo_letter: str
    tags: List[str]
    apply_url: Optional[str] = "#"


TokenResponse.model_rebuild()