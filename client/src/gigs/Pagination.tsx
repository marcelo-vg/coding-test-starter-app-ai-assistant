interface PaginationProps {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, pageCount, onChange }: PaginationProps) {
  if (pageCount <= 1) return null;

  return (
    <nav className="pagination" aria-label="Listing pages">
      <button
        type="button"
        className="pagination__button"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        Previous
      </button>

      <span className="pagination__position">
        Page {page} of {pageCount}
      </span>

      <button
        type="button"
        className="pagination__button"
        disabled={page >= pageCount}
        onClick={() => onChange(page + 1)}
      >
        Next
      </button>
    </nav>
  );
}
