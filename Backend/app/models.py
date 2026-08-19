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
    hashed_password = Column(String(255), nullable=False)

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

    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False)


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
    duration_minutes = Column(Integer, default=45, nullable=False)
    status = Column(String(50), nullable=False, default="Completed")  # Completed, Pending, Scheduled
    date = Column(String(50), nullable=True)
    time = Column(String(50), nullable=True)
    mode = Column(String(50), nullable=True)  # Virtual, Online Coding, In-Person
    feedback = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)


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