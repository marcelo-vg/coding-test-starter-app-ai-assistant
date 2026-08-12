import type { ChatMessage, ChatRequest, ChatResponse } from '@shared/types';
import { request } from '../api/request.ts';

export function sendChat(messages: ChatMessage[]): Promise<ChatMessage> {
  const body: ChatRequest = { messages };

  return request<ChatResponse>('/api/chat', {
    method: 'POST',
    body: JSON.stringify(body),
  }).then((response) => response.message);
}
