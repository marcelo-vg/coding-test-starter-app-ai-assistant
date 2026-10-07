import uuid

from app.db import connect
from app.models import ChatMessage, Conversation


def create_conversation() -> str:
    conversation_id = str(uuid.uuid4())
    with connect() as db:
        db.execute("INSERT INTO conversations (id) VALUES (?)", (conversation_id,))
    return conversation_id


def conversation_exists(conversation_id: str) -> bool:
    with connect() as db:
        row = db.execute("SELECT 1 FROM conversations WHERE id = ?", (conversation_id,)).fetchone()
    return row is not None


def append_message(conversation_id: str, message: ChatMessage) -> None:
    with connect() as db:
        db.execute(
            "INSERT INTO messages (conversation_id, role, content) VALUES (?, ?, ?)",
            (conversation_id, message.role, message.content),
        )


def get_conversation(conversation_id: str) -> Conversation | None:
    if not conversation_exists(conversation_id):
        return None
    with connect() as db:
        rows = db.execute(
            "SELECT role, content FROM messages WHERE conversation_id = ? ORDER BY id",
            (conversation_id,),
        ).fetchall()
    return Conversation(
        id=conversation_id,
        messages=[ChatMessage(role=row["role"], content=row["content"]) for row in rows],
    )
