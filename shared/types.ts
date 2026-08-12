/**
 * Types shared by the Express server and the React client.
 *
 * This file must stay type-only — it is imported with `import type` on both
 * sides, so anything with a runtime value would not survive the client build.
 */

export type GigCategory =
  | 'Warehouse'
  | 'Hospitality'
  | 'Retail'
  | 'Delivery'
  | 'Events'
  | 'Customer Support'
  | 'Cleaning'
  | 'Admin';

export interface Gig {
  id: string;
  title: string;
  category: GigCategory;
  /** Pay rate in USD per hour. */
  payRate: number;
  /** City and state, or "Remote" for fully remote gigs. */
  location: string;
  remote: boolean;
  /** ISO 8601 date the gig was listed. */
  postedAt: string;
  description: string;
}

export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

/** Request body for `POST /api/chat`. */
export interface ChatRequest {
  messages: ChatMessage[];
}

/** Success response from `POST /api/chat`. */
export interface ChatResponse {
  message: ChatMessage;
}

/** Shape of every error response from the API. */
export interface ApiError {
  error: string;
}
