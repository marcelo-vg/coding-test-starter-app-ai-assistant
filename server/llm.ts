import Anthropic from '@anthropic-ai/sdk';
import type { ChatMessage } from '@shared/types';
import { config } from './config.ts';

const anthropic = new Anthropic({ apiKey: config.anthropicApiKey });

const MAX_TOKENS = 1024;

const SYSTEM_PROMPT = `You are the assistant embedded in a marketplace for shift work and short-term jobs.

Users come here to browse gigs. A gig is a single job posting — it has a title, a category such as Warehouse or Hospitality, an hourly pay rate, a location, and it is either remote or on-site. When someone says "gig" they always mean a job posting, never a unit of data.

You are talking to someone who is looking at a listing of gigs right now, but you cannot see that page or the gigs on it. If you are asked what is on the page, about a specific gig, or to change what is shown, say plainly that you do not have access to the listing. Never guess at a gig's details or claim to have changed the page.

Keep your replies short and conversational.`;

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
