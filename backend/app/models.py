from typing import Literal

from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel


class ApiModel(BaseModel):
    """Base for API payloads. Python fields are snake_case, the JSON is camelCase."""

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


class Gig(ApiModel):
    id: str
    title: str
    category: str
    # Pay rate in USD per hour.
    pay_rate: int | float
    # City and state, or "Remote" for fully remote gigs.
    location: str
    remote: bool
    # ISO 8601 date the gig was listed.
    posted_at: str
    description: str


class GigPage(ApiModel):
    """One page of the filtered listing."""

    gigs: list[Gig]
    page: int
    page_size: int
    # Gigs matching the filters across every page, not just this one.
    total: int
    # Every category in the catalogue, regardless of the current filters.
    categories: list[str]


class ChatMessage(ApiModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(ApiModel):
    messages: list[ChatMessage] = Field(min_length=1)
    # Continue an existing conversation; omit to start a new one.
    conversation_id: str | None = None


class Conversation(ApiModel):
    id: str
    messages: list[ChatMessage]
