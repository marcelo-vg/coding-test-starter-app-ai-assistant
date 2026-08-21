import { Router } from 'express';
import type { GigCategory } from '@shared/types';
import {
  DEFAULT_PAGE_SIZE,
  isGigCategory,
  MAX_PAGE_SIZE,
  queryGigs,
} from '../gigQuery.ts';

export const gigsRouter = Router();

function parseCount(value: unknown, fallback: number, max: number): number {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) return fallback;
  return Math.min(parsed, max);
}

gigsRouter.get('/', (req, res) => {
  const requestedCategory = req.query.category;
  let category: GigCategory | null = null;

  // An unknown category is rejected rather than ignored, so a bad value shows up
  // as an error instead of silently returning the unfiltered listing.
  if (typeof requestedCategory === 'string' && requestedCategory !== '') {
    if (!isGigCategory(requestedCategory)) {
      res.status(400).json({ error: `Unknown category "${requestedCategory}".` });
      return;
    }
    category = requestedCategory;
  }

  res.json(
    queryGigs({
      category,
      remoteOnly: req.query.remoteOnly === 'true',
      page: parseCount(req.query.page, 1, Number.MAX_SAFE_INTEGER),
      pageSize: parseCount(req.query.pageSize, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE),
    }),
  );
});
