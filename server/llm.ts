import Anthropic from '@anthropic-ai/sdk';
import type { ChatMessage } from '@shared/types';
import { config } from './config.ts';

const anthropic = new Anthropic({ apiKey: config.anthropicApiKey });

const MAX_TOKENS = 1024;

const SYSTEM_PROMPT = 'You are a helpful assistant. Keep your replies short and conversational.';

/**
 * Sends a conversation to the LLM and returns its reply.
 *
 * Throws if the request fails — callers are responsible for turning that into
 * an HTTP response.
 */
export async function completeChat(messages: ChatMessage[]): Promise<ChatMessage> {
  const response = await anthropic.messages.create({
    model: config.model,
    max_tokens: MAX_TOKENS,
    system: SYSTEM_PROMPT,
    messages: messages.map(({ role, content }) => ({ role, content })),
  });

  const text = response.content
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('\n')
    .trim();

  return {
    role: 'assistant',
    content: text || "Sorry, I didn't catch that. Could you try again?",
  };
}
