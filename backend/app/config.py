import os
from dataclasses import dataclass
from pathlib import Path

from dotenv import load_dotenv

BACKEND_DIR = Path(__file__).resolve().parent.parent

# The .env file lives at the repository root, next to .env.example.
load_dotenv(BACKEND_DIR.parent / ".env")


@dataclass(frozen=True)
class Settings:
    port: int
    anthropic_api_key: str
    model: str
    database_path: Path


def load_settings() -> Settings:
    """Reads settings from the environment. Called at startup, not at import."""
    return Settings(
        port=int(os.environ.get("PORT", "3001")),
        anthropic_api_key=_required("ANTHROPIC_API_KEY"),
        model=os.environ.get("LLM_MODEL", "claude-sonnet-5"),
        database_path=Path(os.environ.get("DATABASE_PATH", BACKEND_DIR / "data" / "app.db")),
    )


def _required(name: str) -> str:
    value = os.environ.get(name)
    if not value:
        raise RuntimeError(
            f"Missing {name}. Copy .env.example to .env and fill it in before starting the server."
        )
    return value
