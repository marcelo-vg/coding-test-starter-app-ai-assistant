from contextlib import asynccontextmanager
from typing import AsyncIterator

from fastapi import FastAPI

from app import agent, assistant_tools  # noqa: F401 - registers the assistant's tools
from app.config import load_settings
from app.db import init_db
from app.errors import register_error_handlers
from app.routes import chat, gigs


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    settings = load_settings()
    init_db(settings.database_path)
    agent.configure(settings)
    yield


app = FastAPI(title="assistant-listing", lifespan=lifespan)
register_error_handlers(app)
app.include_router(gigs.router, prefix="/api/gigs")
app.include_router(chat.router, prefix="/api/chat")
