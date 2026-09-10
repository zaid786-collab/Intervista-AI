import os
from pathlib import Path
from dotenv import load_dotenv

# Explicit path to Backend/.env
BACKEND_DIR = Path(__file__).resolve().parent.parent
ENV_FILE = BACKEND_DIR / ".env"

def reload_env():
    """
    Explicitly loads or re-loads Backend/.env into os.environ with override=True.
    Ensures that modifications to Backend/.env are reflected immediately.
    """
    if ENV_FILE.exists():
        load_dotenv(dotenv_path=ENV_FILE, override=True)
    else:
        load_dotenv(override=True)

# Load immediately on module import
reload_env()

def get_env(key: str, default: str = "") -> str:
    """
    Retrieves an environment variable with live reloading from Backend/.env.
    """
    reload_env()
    val = os.getenv(key)
    return val.strip() if val is not None else default
