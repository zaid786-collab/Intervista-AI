import os
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

load_dotenv()

PROJECT_ROOT = Path(__file__).resolve().parents[2]
DEFAULT_DATABASE_PATH = PROJECT_ROOT / "Backend" / "intervista_ai_v2.db"
configured_database_url = os.getenv("DATABASE_URL")

if configured_database_url and configured_database_url.startswith("sqlite:///./"):
    database_path = PROJECT_ROOT / configured_database_url.removeprefix("sqlite:///./")
    DATABASE_URL = f"sqlite:///{database_path}"
else:
    DATABASE_URL = configured_database_url or f"sqlite:///{DEFAULT_DATABASE_PATH}"

is_sqlite = DATABASE_URL.startswith("sqlite")
connect_args = {"check_same_thread": False} if is_sqlite else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args, pool_pre_ping=not is_sqlite)


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """FastAPI dependency that yields a DB session and always closes it."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()