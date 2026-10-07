import json
from dataclasses import dataclass
from typing import Any, Callable

from pydantic import BaseModel, ValidationError


@dataclass(frozen=True)
class Tool:
    name: str
    description: str
    input_model: type[BaseModel]
    handler: Callable[[Any], Any]

    def schema(self) -> dict[str, Any]:
        """The tool definition in the shape the Anthropic API expects."""
        return {
            "name": self.name,
            "description": self.description,
            "input_schema": self.input_model.model_json_schema(),
        }


@dataclass(frozen=True)
class ToolResult:
    content: str
    is_error: bool = False


class ToolRegistry:
    """The tools the assistant may call. Empty by default."""

    def __init__(self) -> None:
        self._tools: dict[str, Tool] = {}

    def register(self, tool: Tool) -> None:
        self._tools[tool.name] = tool

    def schemas(self) -> list[dict[str, Any]]:
        return [tool.schema() for tool in self._tools.values()]

    def run(self, name: str, raw_input: Any) -> ToolResult:
        """Validates the model's input and runs the tool.

        Failures come back as error results rather than exceptions, so the
        model can see what went wrong and try again.
        """
        tool = self._tools.get(name)
        if tool is None:
            return ToolResult(f"Unknown tool {name!r}.", is_error=True)

        try:
            parsed = tool.input_model.model_validate(raw_input)
        except ValidationError as error:
            return ToolResult(f"Invalid input for {name!r}: {error}", is_error=True)

        try:
            result = tool.handler(parsed)
        except Exception as error:  # noqa: BLE001 - reported to the model, not raised
            return ToolResult(f"Tool {name!r} failed: {error}", is_error=True)

        return ToolResult(result if isinstance(result, str) else json.dumps(result))


registry = ToolRegistry()
