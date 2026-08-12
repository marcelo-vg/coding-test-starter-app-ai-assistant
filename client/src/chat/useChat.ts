import { useCallback, useState } from 'react';
import type { ChatMessage } from '@shared/types';
import { sendChat } from './api.ts';

interface Chat {
  messages: ChatMessage[];
  isSending: boolean;
  error: string | null;
  send: (text: string) => Promise<void>;
}

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

    try {
      const reply = await sendChat(history);
      setMessages([...history, reply]);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Something went wrong.');
    } finally {
      setIsSending(false);
    }
  }, [messages]);

  return { messages, isSending, error, send };
}
