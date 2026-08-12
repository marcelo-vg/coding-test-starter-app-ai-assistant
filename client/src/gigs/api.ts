import type { Gig } from '@shared/types';
import { request } from '../api/request.ts';

export function fetchGigs(): Promise<Gig[]> {
  return request<{ gigs: Gig[] }>('/api/gigs').then((body) => body.gigs);
}
