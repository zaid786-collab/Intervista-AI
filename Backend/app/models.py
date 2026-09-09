from datetime import datetime, timezone
from sqlalchemy import Boolean, Column, DateTime, Integer, String, Text
from app.database import Base


def utcnow():
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=True)

    # OAuth & Provider information
    google_id = Column(String(120), nullable=True, index=True)
    github_id = Column(String(120), nullable=True, index=True)
    auth_provider = Column(String(50), default="local", nullable=False)

    # The very first user to sign up becomes an admin automatically.
    is_admin = Column(Boolean, default=False, nullable=False)

    # Overall progress percentage (0-100).
    progress = Column(Integer, default=0, nullable=False)
    xp = Column(Integer, default=1250, nullable=False)
    target_role = Column(String(120), default="Software Engineer", nullable=True)
    bio = Column(String(500), default="Passionate software engineer practicing for top tech interviews.", nullable=True)
    skills = Column(String(500), default="React, Node.js, Python, System Design, SQL", nullable=True)
    avatar = Column(String(500), nullable=True)

    is_active = Column(Boolean, default=True, nullable=False)
    
    # Subscription fields
    subscription_plan = Column(String(50), default="free", nullable=False)  # free, starter, pro, team
    subscription_cycle = Column(String(20), default="monthly", nullable=False)  # monthly, yearly
    subscription_expires_at = Column(DateTime(timezone=True), nullable=True)

    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False)


class EmailVerificationOTP(Base):
    __tablename__ = "email_verification_otps"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True, nullable=False)
    code_hash = Column(String(64), nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)


class DSATopic(Base):
    __tablename__ = "dsa_topics"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(120), nullable=False, unique=True, index=True)
    description = Column(String(500), nullable=True)
    icon = Column(String(20), nullable=True)
    problem_count = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)


class Resource(Base):
    __tablename__ = "resources"

    id = Column(Integer, primary_key=True, index=True)
    topic_id = Column(Integer, index=True, nullable=True)
    topic_title = Column(String(120), index=True, nullable=True)
    title = Column(String(255), nullable=False, index=True)
    difficulty = Column(String(20), nullable=False, default="Easy")  # Easy, Medium, Hard
    leetcode_url = Column(String(500), nullable=True)
    category = Column(String(100), default="DSA", nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)


class UserSolvedResource(Base):
    __tablename__ = "user_solved_resources"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True, nullable=False)
    resource_id = Column(Integer, index=True, nullable=True)
    resource_title = Column(String(255), index=True, nullable=False)
    solved_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)


class Interview(Base):
    __tablename__ = "interviews"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True, nullable=True)
    role = Column(String(120), nullable=False)
    company = Column(String(120), nullable=False)
    score = Column(String(20), nullable=True)
    score_num = Column(Integer, nullable=True)  # Numeric score for AVG/MAX SQL aggregations
    technical_score = Column(Integer, nullable=True)
    communication_score = Column(Integer, nullable=True)
    problem_solving_score = Column(Integer, nullable=True)
    grade = Column(String(50), nullable=True)
    duration_minutes = Column(Integer, default=45, nullable=False)
    status = Column(String(50), nullable=False, default="Completed")  # Completed, Pending, Scheduled
    date = Column(String(50), nullable=True)
    time = Column(String(50), nullable=True)
    mode = Column(String(50), nullable=True)  # Virtual, Online Coding, In-Person
    feedback = Column(Text, nullable=True)
    report_data = Column(Text, nullable=True)  # JSON string of detailed feedback & marks
    warning_count = Column(Integer, default=0, nullable=True)
    termination_reason = Column(String(255), nullable=True)
    candidate_answers = Column(Text, nullable=True)  # JSON string of immutable candidate responses
    question_count = Column(Integer, default=0, nullable=True)
    answered_count = Column(Integer, default=0, nullable=True)
    skipped_count = Column(Integer, default=0, nullable=True)
    correct_count = Column(Integer, default=0, nullable=True)
    partial_count = Column(Integer, default=0, nullable=True)
    incorrect_count = Column(Integer, default=0, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)


class InterviewAnswer(Base):
    __tablename__ = "interview_answers"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(100), index=True, nullable=True)
    interview_id = Column(Integer, index=True, nullable=True)
    user_id = Column(Integer, index=True, nullable=True)
    question_id = Column(Integer, nullable=False)
    question = Column(Text, nullable=False)
    candidate_answer = Column(Text, nullable=True)
    status = Column(String(50), default="SUBMITTED", nullable=False)  # SUBMITTED, SKIPPED, NO_ANSWER
    submitted_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)


class WeeklyPerformance(Base):
    __tablename__ = "weekly_performance"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True, nullable=True)
    day_name = Column(String(20), nullable=False)  # Mon, Tue, Wed, Thu, Fri, Sat, Sun
    score = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)


class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True, nullable=True)
    title = Column(String(255), nullable=False)
    company = Column(String(255), nullable=True)
    time = Column(String(100), nullable=True)
    color = Column(String(50), default="#2563eb", nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True, nullable=True)
    title = Column(String(255), nullable=False)
    desc = Column(String(500), nullable=True)
    color = Column(String(50), default="#2563eb", nullable=False)
    time = Column(String(100), nullable=True)
    is_read = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)


class DailyChallenge(Base):
    __tablename__ = "daily_challenges"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    difficulty = Column(String(50), default="Medium")
    description = Column(Text, nullable=False)
    starter_code = Column(Text, nullable=True)
    time_limit = Column(String(50), default="30 mins")
    xp_reward = Column(Integer, default=150)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)


class UserSolvedChallenge(Base):
    __tablename__ = "user_solved_challenges"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True, nullable=False)
    challenge_id = Column(Integer, index=True, nullable=False)
    solved_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)


class ResumeAnalysisRecord(Base):
    __tablename__ = "resume_analysis_records"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True, nullable=True)
    target_role = Column(String(120), nullable=False)
    ats_score = Column(Integer, nullable=False)
    verdict = Column(String(255), nullable=False)
    matched_skills = Column(Text, nullable=True)
    missing_skills = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)


class CompanyTopicSolved(Base):
    __tablename__ = "user_company_solved"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True, nullable=False)
    company = Column(String(100), index=True, nullable=False)
    topic = Column(String(100), nullable=False)
    solved_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)


class PaymentTransaction(Base):
    __tablename__ = "payment_transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True, nullable=False)
    user_email = Column(String(255), nullable=True)
    user_name = Column(String(120), nullable=True)
    plan_name = Column(String(50), nullable=False)  # starter, pro, team
    billing_cycle = Column(String(20), default="monthly", nullable=False)  # monthly, yearly
    amount = Column(Integer, nullable=False)  # Amount in paise / smallest currency unit or integer rupee
    currency = Column(String(10), default="INR", nullable=False)
    payment_method = Column(String(50), default="card", nullable=False)  # card, upi, netbanking, paypal, apple_pay
    payment_status = Column(String(50), default="succeeded", nullable=False)  # succeeded, pending, failed
    transaction_id = Column(String(100), unique=True, index=True, nullable=False)
    invoice_id = Column(String(100), unique=True, index=True, nullable=False)
    promo_code = Column(String(50), nullable=True)
    discount_amount = Column(Integer, default=0, nullable=False)
    card_last4 = Column(String(10), nullable=True)
    card_brand = Column(String(30), nullable=True)
    receipt_url = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)


class Feedback(Base):
    __tablename__ = "feedbacks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True, nullable=True)
    name = Column(String(120), nullable=True)
    email = Column(String(255), nullable=True)
    feedback_type = Column(String(50), default="General Feedback", nullable=False)
    rating = Column(Integer, nullable=True)
    message = Column(Text, nullable=False)
    page_context = Column(String(100), default="Home Page", nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)


class LoginEvent(Base):
    __tablename__ = "login_events"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True, nullable=False)
    event_id = Column(String(64), unique=True, index=True, nullable=False)
    email_status = Column(String(50), default="queued", nullable=False)  # queued, sent, failed, duplicate_suppressed, dev_logged
    email_sent_at = Column(DateTime(timezone=True), nullable=True)
    error_message = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)


