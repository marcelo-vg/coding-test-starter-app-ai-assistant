import type { GigPage, GigQuery } from '@shared/types';
import { request } from '../api/request.ts';

export const PAGE_SIZE = 10;

export function fetchGigPage(query: GigQuery, signal?: AbortSignal): Promise<GigPage> {
  const params = new URLSearchParams({
    page: String(query.page),
    pageSize: String(query.pageSize),
  });

  if (query.category) params.set('category', query.category);
  if (query.remoteOnly) params.set('remoteOnly', 'true');

  return request<GigPage>(`/api/gigs?${params}`, { signal });
}
