import type { Gig, GigCategory } from '@shared/types';

export interface GigFilters {
  /** `null` means "every category". */
  category: GigCategory | null;
  remoteOnly: boolean;
}

export const NO_FILTERS: GigFilters = {
  category: null,
  remoteOnly: false,
};

export function applyFilters(gigs: Gig[], filters: GigFilters): Gig[] {
  return gigs.filter((gig) => {
    if (filters.category && gig.category !== filters.category) return false;
    if (filters.remoteOnly && !gig.remote) return false;
    return true;
  });
}

/** Categories present in the listing, in alphabetical order. */
export function availableCategories(gigs: Gig[]): GigCategory[] {
  return [...new Set(gigs.map((gig) => gig.category))].sort();
}
