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

    # Overall progress percentage (0-100). Placeholder for the progress-bar
    # feature that will be built out later on both the profile page and the
    # admin portal.
    progress = Column(Integer, default=0, nullable=False)

    is_active = Column(Boolean, default=True, nullable=False)

    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False)