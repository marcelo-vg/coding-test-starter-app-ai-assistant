import type { GigCategory, GigPage, GigQuery } from '@shared/types';
import { gigs } from './data/gigs.ts';

export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 50;

/** Every category present in the catalogue, alphabetically. */
export const gigCategories: GigCategory[] = [...new Set(gigs.map((gig) => gig.category))].sort();

export function isGigCategory(value: string): value is GigCategory {
  return (gigCategories as string[]).includes(value);
}

/** Filters the catalogue, then returns the requested page of the result. */
export function queryGigs({ category, remoteOnly, page, pageSize }: GigQuery): GigPage {
  const matching = gigs.filter((gig) => {
    if (category && gig.category !== category) return false;
    if (remoteOnly && !gig.remote) return false;
    return true;
  });

  const start = (page - 1) * pageSize;

  return {
    gigs: matching.slice(start, start + pageSize),
    page,
    pageSize,
    total: matching.length,
    categories: gigCategories,
  };
}
