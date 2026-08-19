from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, DateTime, Integer, String

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


class DashboardMetric(Base):
    __tablename__ = "dashboard_metrics"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, unique=True, index=True, nullable=False)
    total_interviews = Column(Integer, default=24, nullable=False)
    avg_score = Column(String(20), default="78%", nullable=False)
    best_score = Column(String(20), default="92%", nullable=False)
    practice_time = Column(String(20), default="18 hrs", nullable=False)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False)
