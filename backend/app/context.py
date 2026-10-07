from typing import Any

# How many of the most recent messages are sent to the model.
MAX_HISTORY_MESSAGES = 20


def trim_history(messages: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Keeps the conversation inside the model's context budget."""
    return messages[-MAX_HISTORY_MESSAGES:]
