import asyncio
from types import SimpleNamespace

from pydantic import BaseModel

from app import agent
from app.config import Settings
from app.tools import Tool, ToolRegistry


class Echo(BaseModel):
    text: str


def echo_registry():
    registry = ToolRegistry()
    registry.register(Tool("echo", "Echoes text.", Echo, lambda args: f"echo: {args.text}"))
    return registry


def test_registry_runs_a_valid_call():
    result = echo_registry().run("echo", {"text": "hi"})

    assert (result.content, result.is_error) == ("echo: hi", False)


def test_registry_reports_bad_input_back_to_the_model():
    result = echo_registry().run("echo", {"text": 5})

    assert result.is_error and "Invalid input for 'echo'" in result.content


def test_registry_reports_unknown_tools_and_handler_failures():
    registry = ToolRegistry()
    registry.register(Tool("fail", "Always fails.", Echo, lambda _: 1 / 0))

    assert registry.run("missing", {}).is_error
    assert registry.run("fail", {"text": "x"}).is_error


class FakeStream:
    def __init__(self, texts, message):
        self._texts, self._message = texts, message

    async def __aenter__(self):
        return self

    async def __aexit__(self, *exc):
        return False

    @property
    def text_stream(self):
        async def gen():
            for text in self._texts:
                yield text

        return gen()

    async def get_final_message(self):
        return self._message


def fake_client(scripted):
    calls = []

    def stream(**kwargs):
        calls.append(kwargs)
        return scripted.pop(0)

    return SimpleNamespace(messages=SimpleNamespace(stream=stream)), calls


def run(messages, registry):
    async def collect():
        return [chunk async for chunk in agent.stream_reply(messages, registry)]

    return asyncio.run(collect())


def configure(monkeypatch, client):
    monkeypatch.setattr(agent, "_client", client)
    monkeypatch.setattr(agent, "_settings", Settings(3001, "k", "m", None))


def test_plain_reply_makes_one_call_without_tools(monkeypatch):
    done = SimpleNamespace(stop_reason="end_turn", content=[])
    client, calls = fake_client([FakeStream(["Hi", "!"], done)])
    configure(monkeypatch, client)

    chunks = run([{"role": "user", "content": "hello"}], ToolRegistry())

    assert chunks == ["Hi", "!"]
    assert len(calls) == 1 and "tools" in calls[0]


def test_tool_call_is_run_and_its_result_sent_back(monkeypatch):
    call = SimpleNamespace(type="tool_use", id="t1", name="echo", input={"text": "yo"})
    asks = SimpleNamespace(stop_reason="tool_use", content=[call])
    done = SimpleNamespace(stop_reason="end_turn", content=[])
    client, calls = fake_client([FakeStream(["Let me check. "], asks), FakeStream(["Done."], done)])
    configure(monkeypatch, client)

    chunks = run([{"role": "user", "content": "echo yo"}], echo_registry())

    assert chunks == ["Let me check. ", "Done."]
    sent = calls[1]["messages"]
    assert sent[-1]["content"] == [
        {"type": "tool_result", "tool_use_id": "t1", "content": "echo: yo", "is_error": False}
    ]
    assert calls[0]["tools"][0]["name"] == "echo"


def test_assistant_ships_with_a_date_tool():
    from datetime import date

    from app import assistant_tools  # noqa: F401
    from app.tools import registry

    result = registry.run("get_current_date", {})

    assert (result.content, result.is_error) == (date.today().isoformat(), False)
    assert "get_current_date" in [schema["name"] for schema in registry.schemas()]
