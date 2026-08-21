import { useCallback, useState } from 'react';
import type { ChatMessage } from '@shared/types';
import { streamChat } from './api.ts';

interface Chat {
  messages: ChatMessage[];
  isSending: boolean;
  error: string | null;
  send: (text: string) => Promise<void>;
}

const EMPTY_REPLY = "Sorry, I didn't catch that. Could you try again?";

/** Owns the conversation and the request lifecycle for a single chat session. */
export function useChat(): Chat {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = useCallback(async (text: string) => {
    const history: ChatMessage[] = [...messages, { role: 'user', content: text }];

    setMessages(history);
    setIsSending(true);
    setError(null);

    // The reply is rebuilt from scratch on every chunk so that the transcript
    // always holds one assistant message, however many chunks arrive.
    let reply = '';

    try {
      await streamChat(history, (chunk) => {
        reply += chunk;
        setMessages([...history, { role: 'assistant', content: reply }]);
      });

      if (!reply) {
        setMessages([...history, { role: 'assistant', content: EMPTY_REPLY }]);
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Something went wrong.');
    } finally {
      setIsSending(false);
    }
  }, [messages]);

  return { messages, isSending, error, send };
}
