import { Router } from 'express';
import type { ChatMessage } from '@shared/types';
import { completeChat } from '../llm.ts';

export const chatRouter = Router();

function isChatMessage(value: unknown): value is ChatMessage {
  if (typeof value !== 'object' || value === null) return false;
  const { role, content } = value as Partial<ChatMessage>;
  return (role === 'user' || role === 'assistant') && typeof content === 'string';
}

chatRouter.post('/', async (req, res) => {
  const messages: unknown = req.body?.messages;

  if (!Array.isArray(messages) || messages.length === 0 || !messages.every(isChatMessage)) {
    res.status(400).json({ error: 'Expected a non-empty array of chat messages.' });
    return;
  }

  try {
    const message = await completeChat(messages);
    res.json({ message });
  } catch (error) {
    console.error('[chat] LLM request failed:', error);
    res.status(502).json({ error: 'The assistant is unavailable right now. Please try again.' });
  }
});
