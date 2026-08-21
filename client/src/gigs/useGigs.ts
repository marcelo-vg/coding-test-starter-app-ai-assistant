import { useEffect, useState } from 'react';
import type { GigPage } from '@shared/types';
import { fetchGigPage, PAGE_SIZE } from './api.ts';
import type { GigFilters } from './filters.ts';

interface GigsState {
  page: GigPage | null;
  /** True until the first response arrives; false for later page changes. */
  isLoading: boolean;
  /** True whenever a request is in flight, including refetches. */
  isFetching: boolean;
  error: string | null;
}

/** Fetches one page of the listing, refetching whenever the query changes. */
export function useGigs(filters: GigFilters, page: number): GigsState {
  const [gigPage, setGigPage] = useState<GigPage | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setIsFetching(true);

    fetchGigPage({ ...filters, page, pageSize: PAGE_SIZE }, controller.signal)
      .then((loaded) => {
        setGigPage(loaded);
        setError(null);
        setIsFetching(false);
      })
      .catch((cause: unknown) => {
        // An aborted request has been superseded by a newer one, so its result
        // and its failure are both irrelevant.
        if (controller.signal.aborted) return;
        setError(cause instanceof Error ? cause.message : 'Could not load gigs.');
        setIsFetching(false);
      });

    return () => controller.abort();
  }, [filters, page]);

  return {
    page: gigPage,
    isLoading: gigPage === null && error === null,
    isFetching,
    error,
  };
}
