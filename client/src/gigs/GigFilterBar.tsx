import type { GigCategory } from '../types';
import type { GigFilters } from './filters.ts';

interface GigFilterBarProps {
  filters: GigFilters;
  categories: GigCategory[];
  onChange: (filters: GigFilters) => void;
}

export function GigFilterBar({ filters, categories, onChange }: GigFilterBarProps) {
  return (
    <div className="filter-bar">
      <label className="filter-bar__field">
        <span className="filter-bar__label">Category</span>
        <select
          className="filter-bar__select"
          value={filters.category ?? ''}
          onChange={(event) =>
            onChange({
              ...filters,
              category: (event.target.value || null) as GigCategory | null,
            })
          }
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>

      <label className="filter-bar__toggle">
        <input
          type="checkbox"
          checked={filters.remoteOnly}
          onChange={(event) => onChange({ ...filters, remoteOnly: event.target.checked })}
        />
        <span>Remote only</span>
      </label>
    </div>
  );
}
