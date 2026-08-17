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


TokenResponse.model_rebuild()