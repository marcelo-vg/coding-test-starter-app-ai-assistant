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

/** Query parameters for `GET /api/gigs`. */
export interface GigQuery {
  /** `null` means "every category". */
  category: GigCategory | null;
  remoteOnly: boolean;
  /** 1-based. */
  page: number;
  pageSize: number;
}

/** Response body for `GET /api/gigs` — one page of the filtered listing. */
export interface GigPage {
  gigs: Gig[];
  page: number;
  pageSize: number;
  /** Gigs matching the filters across every page, not just this one. */
  total: number;
  /** Every category in the catalogue, regardless of the current filters. */
  categories: GigCategory[];
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

/** Shape of every error response from the API. */
export interface ApiError {
  error: string;
}
