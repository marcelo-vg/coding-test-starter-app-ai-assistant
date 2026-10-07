import logging
from typing import AsyncIterator

from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import ValidationError

from app import agent, conversations
from app.errors import ApiError
from app.models import ChatMessage, ChatRequest, Conversation

router = APIRouter()
logger = logging.getLogger(__name__)

INVALID_MESSAGES = "Expected a non-empty array of chat messages."


async def parse_chat_request(request: Request) -> ChatRequest:
    try:
        return ChatRequest.model_validate(await request.json())
    except (ValueError, ValidationError):
        raise ApiError(400, INVALID_MESSAGES) from None


@router.post("", response_model=None)
async def chat(request: Request) -> StreamingResponse | JSONResponse:
    body = await parse_chat_request(request)

    if body.conversation_id is None:
        conversation_id = conversations.create_conversation()
    elif conversations.conversation_exists(body.conversation_id):
        conversation_id = body.conversation_id
    else:
        raise ApiError(404, f'Unknown conversation "{body.conversation_id}".')

    # The caller sends the whole transcript each time; only its newest message
    # is new to the stored conversation.
    conversations.append_message(conversation_id, body.messages[-1])

    history = [{"role": m.role, "content": m.content} for m in body.messages]
    stream = agent.stream_reply(history)

    # The status is held back until the first chunk arrives so that a request that
    # fails immediately can still be reported as a JSON error. Once streaming has
    # started the status is already sent, so a mid-stream failure can only end the
    # response early.
    try:
        first = await anext(stream, None)
    except Exception:
        logger.exception("[chat] LLM request failed")
        return JSONResponse(
            {"error": "The assistant is unavailable right now. Please try again."},
            status_code=502,
        )

    async def body_stream() -> AsyncIterator[str]:
        reply: list[str] = []
        if first is not None:
            reply.append(first)
            yield first
        try:
            async for chunk in stream:
                reply.append(chunk)
                yield chunk
        except Exception:
            logger.exception("[chat] LLM stream failed part-way through")
            return
        if reply:
            conversations.append_message(
                conversation_id, ChatMessage(role="assistant", content="".join(reply))
            )

    return StreamingResponse(
        body_stream(),
        media_type="text/plain",
        headers={"Cache-Control": "no-store", "X-Conversation-Id": conversation_id},
    )


@router.get("/{conversation_id}", response_model=Conversation)
def get_conversation(conversation_id: str) -> Conversation:
    conversation = conversations.get_conversation(conversation_id)
    if conversation is None:
        raise ApiError(404, f'Unknown conversation "{conversation_id}".')
    return conversation
