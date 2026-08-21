import { Router } from 'express';
import type { ChatMessage } from '@shared/types';
import { streamChat } from '../llm.ts';

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

  // Headers are held back until the first chunk arrives so that a request that
  // fails immediately can still be reported as a JSON error. Once streaming has
  // started the status is already sent, so a mid-stream failure can only end
  // the response early.
  try {
    for await (const chunk of streamChat(messages)) {
      if (!res.headersSent) {
        res.writeHead(200, {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-store',
        });
      }
      res.write(chunk);
    }
    res.end();
  } catch (error) {
    console.error('[chat] LLM request failed:', error);
    if (res.headersSent) {
      res.end();
    } else {
      res.status(502).json({ error: 'The assistant is unavailable right now. Please try again.' });
    }
  }
});
