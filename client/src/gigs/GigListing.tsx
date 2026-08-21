import { useState } from 'react';
import { GigCard } from './GigCard.tsx';
import { GigFilterBar } from './GigFilterBar.tsx';
import { Pagination } from './Pagination.tsx';
import { NO_FILTERS, type GigFilters } from './filters.ts';
import { useGigs } from './useGigs.ts';

export function GigListing() {
  const [filters, setFilters] = useState(NO_FILTERS);
  const [page, setPage] = useState(1);
  const { page: gigPage, isLoading, isFetching, error } = useGigs(filters, page);

  // A narrower filter can leave the current page beyond the end of the results,
  // so any change to the filters sends the user back to the first page.
  function handleFiltersChange(next: GigFilters) {
    setFilters(next);
    setPage(1);
  }

  if (isLoading) {
    return <p className="listing__status">Loading gigs…</p>;
  }

  if (error && !gigPage) {
    return <p className="listing__status listing__status--error">{error}</p>;
  }

  if (!gigPage) return null;

  const { gigs, total, pageSize, categories } = gigPage;
  const pageCount = Math.ceil(total / pageSize);
  const firstOnPage = (gigPage.page - 1) * pageSize + 1;
  const lastOnPage = firstOnPage + gigs.length - 1;

  return (
    <section className="listing" aria-busy={isFetching}>
      <GigFilterBar filters={filters} categories={categories} onChange={handleFiltersChange} />

      {error && <p className="listing__status listing__status--error">{error}</p>}

      <p className="listing__count">
        {total === 0 ? 'No gigs match these filters' : `Showing ${firstOnPage}–${lastOnPage} of ${total} gigs`}
      </p>

      {gigs.length > 0 && (
        <ul className={`listing__items ${isFetching ? 'listing__items--stale' : ''}`}>
          {gigs.map((gig) => (
            <GigCard key={gig.id} gig={gig} />
          ))}
        </ul>
      )}

      <Pagination page={gigPage.page} pageCount={pageCount} onChange={setPage} />
    </section>
  );
}
