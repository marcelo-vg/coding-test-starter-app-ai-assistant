import type { ApiError } from '../types';

/**
 * Thin wrapper around fetch for our JSON API. Rejects with the server's error
 * message when there is one, so callers can surface it directly.
 */
export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as ApiError | null;
    throw new Error(body?.error ?? `Request to ${path} failed (${response.status})`);
  }

  return response.json() as Promise<T>;
}
