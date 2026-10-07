import pytest

from app import agent


def fake_stream(chunks, fail_after=None):
    async def stream_reply(messages, **_):
        for index, chunk in enumerate(chunks):
            if index == fail_after:
                raise RuntimeError("boom")
            yield chunk

    return stream_reply


def post(client, **body):
    body.setdefault("messages", [{"role": "user", "content": "hello"}])
    return client.post("/api/chat", json=body)


@pytest.mark.parametrize(
    "body",
    [
        {},
        {"messages": []},
        {"messages": "hi"},
        {"messages": [{"role": "system", "content": "hi"}]},
        {"messages": [{"role": "user"}]},
    ],
)
def test_invalid_bodies_are_rejected(client, body):
    response = client.post("/api/chat", json=body)

    assert response.status_code == 400
    assert response.json() == {"error": "Expected a non-empty array of chat messages."}


def test_reply_is_streamed_as_plain_text(client, monkeypatch):
    monkeypatch.setattr(agent, "stream_reply", fake_stream(["Hel", "lo"]))

    response = post(client)

    assert response.status_code == 200
    assert response.headers["content-type"].startswith("text/plain")
    assert response.text == "Hello"


def test_failure_before_the_first_chunk_is_json(client, monkeypatch):
    monkeypatch.setattr(agent, "stream_reply", fake_stream(["never"], fail_after=0))

    response = post(client)

    assert response.status_code == 502
    assert response.json() == {"error": "The assistant is unavailable right now. Please try again."}


def test_failure_mid_stream_ends_the_response_early(client, monkeypatch):
    monkeypatch.setattr(agent, "stream_reply", fake_stream(["Hel", "lo"], fail_after=1))

    response = post(client)

    assert response.status_code == 200
    assert response.text == "Hel"


def test_exchange_is_stored_under_the_returned_conversation(client, monkeypatch):
    monkeypatch.setattr(agent, "stream_reply", fake_stream(["Hi ", "there"]))

    first = post(client)
    conversation_id = first.headers["x-conversation-id"]
    history = [
        {"role": "user", "content": "hello"},
        {"role": "assistant", "content": "Hi there"},
        {"role": "user", "content": "and again"},
    ]
    post(client, messages=history, conversationId=conversation_id)

    stored = client.get(f"/api/chat/{conversation_id}").json()
    assert [(m["role"], m["content"]) for m in stored["messages"]] == [
        ("user", "hello"),
        ("assistant", "Hi there"),
        ("user", "and again"),
        ("assistant", "Hi there"),
    ]


def test_unknown_conversation_is_a_404(client, monkeypatch):
    monkeypatch.setattr(agent, "stream_reply", fake_stream(["x"]))

    assert post(client, conversationId="nope").status_code == 404
    assert client.get("/api/chat/nope").status_code == 404
