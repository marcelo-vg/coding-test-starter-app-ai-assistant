"""The tools the assistant can call.

To add a tool: describe its input as a Pydantic model, write a handler that
takes that model, and register both with a name and a description the model
can read. Whatever the handler returns is sent back to the model as the
tool's result; if it raises, the model is told the call failed.
"""

from datetime import date

from pydantic import BaseModel

from app.tools import Tool, registry


class NoInput(BaseModel):
    """For tools that take no arguments."""


def get_current_date(_: NoInput) -> str:
    return date.today().isoformat()


registry.register(
    Tool(
        name="get_current_date",
        description="Returns today's date in YYYY-MM-DD format.",
        input_model=NoInput,
        handler=get_current_date,
    )
)
