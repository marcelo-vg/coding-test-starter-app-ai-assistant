import { useMemo, useState } from 'react';
import { GigCard } from './GigCard.tsx';
import { GigFilterBar } from './GigFilterBar.tsx';
import { applyFilters, availableCategories, NO_FILTERS } from './filters.ts';
import { useGigs } from './useGigs.ts';

export function GigListing() {
  const { gigs, isLoading, error } = useGigs();
  const [filters, setFilters] = useState(NO_FILTERS);

  const categories = useMemo(() => availableCategories(gigs), [gigs]);
  const visibleGigs = useMemo(() => applyFilters(gigs, filters), [gigs, filters]);

  if (isLoading) {
    return <p className="listing__status">Loading gigs…</p>;
  }

  if (error) {
    return <p className="listing__status listing__status--error">{error}</p>;
  }

  return (
    <section className="listing">
      <GigFilterBar filters={filters} categories={categories} onChange={setFilters} />

      <p className="listing__count">
        {visibleGigs.length} of {gigs.length} gigs
      </p>

      {visibleGigs.length === 0 ? (
        <p className="listing__status">No gigs match these filters.</p>
      ) : (
        <ul className="listing__items">
          {visibleGigs.map((gig) => (
            <GigCard key={gig.id} gig={gig} />
          ))}
        </ul>
      )}
    </section>
  );
}
