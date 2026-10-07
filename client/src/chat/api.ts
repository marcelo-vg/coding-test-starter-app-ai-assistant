import type { ApiError, ChatMessage, ChatRequest } from '../types';

/**
 * Posts a conversation to the API and invokes `onText` with each chunk of the
 * reply as it streams in. Resolves once the reply is complete.
 */
export async function streamChat(
  messages: ChatMessage[],
  onText: (chunk: string) => void,
): Promise<void> {
  const body: ChatRequest = { messages };

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as ApiError | null;
    throw new Error(error?.error ?? `Chat request failed (${response.status})`);
  }

  if (!response.body) throw new Error('The assistant sent an empty response.');

  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) onText(value);
  }
}
