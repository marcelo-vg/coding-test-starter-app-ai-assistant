import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { useChat } from './useChat.ts';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const { messages, isSending, error, send } = useChat();
  const transcriptRef = useRef<HTMLDivElement>(null);

  // Keep the newest message in view as the conversation grows.
  useEffect(() => {
    const transcript = transcriptRef.current;
    if (transcript) transcript.scrollTop = transcript.scrollHeight;
  }, [messages, isSending]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text || isSending) return;

    setDraft('');
    void send(text);
  }

  if (!isOpen) {
    return (
      <button type="button" className="chat-launcher" onClick={() => setIsOpen(true)}>
        Ask the assistant
      </button>
    );
  }

  return (
    <section className="chat" aria-label="Assistant">
      <header className="chat__header">
        <h2 className="chat__title">Assistant</h2>
        <button
          type="button"
          className="chat__close"
          aria-label="Close assistant"
          onClick={() => setIsOpen(false)}
        >
          ×
        </button>
      </header>

      <div className="chat__transcript" ref={transcriptRef}>
        {messages.length === 0 && (
          <p className="chat__empty">Ask me anything to get started.</p>
        )}

        {messages.map((message, index) => (
          <div key={index} className={`bubble bubble--${message.role}`}>
            {message.content}
          </div>
        ))}

        {isSending && <div className="bubble bubble--assistant chat__typing">Thinking…</div>}
        {error && <p className="chat__error">{error}</p>}
      </div>

      <form className="chat__composer" onSubmit={handleSubmit}>
        <input
          className="chat__input"
          value={draft}
          placeholder="Send a message…"
          onChange={(event) => setDraft(event.target.value)}
        />
        <button type="submit" className="chat__send" disabled={isSending || !draft.trim()}>
          Send
        </button>
      </form>
    </section>
  );
}
