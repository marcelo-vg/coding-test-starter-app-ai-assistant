import json
import sqlite3
from contextlib import contextmanager
from pathlib import Path
from typing import Iterator

SEED_FILE = Path(__file__).resolve().parent / "seed_gigs.json"

SCHEMA = """
CREATE TABLE IF NOT EXISTS gigs (
    id          TEXT PRIMARY KEY,
    title       TEXT NOT NULL,
    category    TEXT NOT NULL,
    pay_rate    NUMERIC NOT NULL,
    location    TEXT NOT NULL,
    remote      INTEGER NOT NULL,
    posted_at   TEXT NOT NULL,
    description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS conversations (
    id         TEXT PRIMARY KEY,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS messages (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    conversation_id TEXT NOT NULL REFERENCES conversations(id),
    role            TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content         TEXT NOT NULL,
    created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id, id);
"""

_database_path: Path | None = None


def init_db(path: Path) -> None:
    """Creates the schema and loads the seed gigs on first run."""
    global _database_path
    _database_path = path
    path.parent.mkdir(parents=True, exist_ok=True)

    with connect() as db:
        db.executescript(SCHEMA)
        if db.execute("SELECT COUNT(*) FROM gigs").fetchone()[0] == 0:
            seed_gigs(db)


def seed_gigs(db: sqlite3.Connection) -> None:
    gigs = json.loads(SEED_FILE.read_text())
    db.executemany(
        """
        INSERT INTO gigs (id, title, category, pay_rate, location, remote, posted_at, description)
        VALUES (:id, :title, :category, :payRate, :location, :remote, :postedAt, :description)
        """,
        gigs,
    )


@contextmanager
def connect() -> Iterator[sqlite3.Connection]:
    """A connection that commits on success and always closes."""
    if _database_path is None:
        raise RuntimeError("Database not initialised. Call init_db() first.")
    db = sqlite3.connect(_database_path)
    db.row_factory = sqlite3.Row
    db.execute("PRAGMA foreign_keys = ON")
    try:
        with db:
            yield db
    finally:
        db.close()
