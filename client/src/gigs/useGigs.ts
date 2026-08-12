import { useEffect, useState } from 'react';
import type { Gig } from '@shared/types';
import { fetchGigs } from './api.ts';

interface GigsState {
  gigs: Gig[];
  isLoading: boolean;
  error: string | null;
}

/** Loads the listing once on mount. */
export function useGigs(): GigsState {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchGigs()
      .then((loaded) => {
        if (!cancelled) setGigs(loaded);
      })
      .catch((cause: unknown) => {
        if (!cancelled) setError(cause instanceof Error ? cause.message : 'Could not load gigs.');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { gigs, isLoading, error };
}
