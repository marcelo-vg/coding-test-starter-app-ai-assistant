import type { GigCategory } from '@shared/types';

export interface GigFilters {
  /** `null` means "every category". */
  category: GigCategory | null;
  remoteOnly: boolean;
}

export const NO_FILTERS: GigFilters = {
  category: null,
  remoteOnly: false,
};
