from typing import Any, AsyncIterator

from anthropic import AsyncAnthropic, omit

from app.config import Settings
from app.context import trim_history
from app.tools import ToolRegistry, registry

MAX_TOKENS = 1024
# Upper bound on model -> tool -> model round trips for a single reply.
MAX_TOOL_ROUNDS = 5

SYSTEM_PROMPT = """You are the assistant embedded in a marketplace for shift work and short-term jobs.

Users come here to browse gigs. A gig is a single job posting — it has a title, a category such as Warehouse or Hospitality, an hourly pay rate, a location, and it is either remote or on-site. When someone says "gig" they always mean a job posting, never a unit of data.

You are talking to someone who is looking at a listing of gigs right now, but you cannot see that page or the gigs on it. If you are asked what is on the page, about a specific gig, or to change what is shown, say plainly that you do not have access to the listing. Never guess at a gig's details or claim to have changed the page.

Keep your replies short and conversational."""

_client: AsyncAnthropic | None = None
_settings: Settings | None = None


def configure(settings: Settings) -> None:
    global _client, _settings
    _settings = settings
    _client = AsyncAnthropic(api_key=settings.anthropic_api_key)


async def stream_reply(
    messages: list[dict[str, Any]],
    tools: ToolRegistry = registry,
) -> AsyncIterator[str]:
    """Sends a conversation to the LLM and yields the reply as it arrives.

    When the model calls a tool, the call is run and its result is sent back so
    the model can carry on, until it produces a reply with no further calls.

    Raises if a request fails — callers are responsible for turning that into an
    HTTP response.
    """
    if _client is None or _settings is None:
        raise RuntimeError("Agent not configured. Call configure() at startup.")

    history = trim_history(messages)
    tool_schemas = tools.schemas()

    for _ in range(MAX_TOOL_ROUNDS):
        async with _client.messages.stream(
            model=_settings.model,
            max_tokens=MAX_TOKENS,
            system=SYSTEM_PROMPT,
            messages=history,
            tools=tool_schemas or omit,
        ) as stream:
            async for text in stream.text_stream:
                yield text
            final = await stream.get_final_message()

        if final.stop_reason != "tool_use":
            return

        results = []
        for block in final.content:
            if block.type != "tool_use":
                continue
            outcome = tools.run(block.name, block.input)
            results.append(
                {
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": outcome.content,
                    "is_error": outcome.is_error,
                }
            )

        history = [
            *history,
            {"role": "assistant", "content": final.content},
            {"role": "user", "content": results},
        ]
