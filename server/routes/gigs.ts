import { Router } from 'express';
import { gigs } from '../data/gigs.ts';

export const gigsRouter = Router();

gigsRouter.get('/', (_req, res) => {
  res.json({ gigs });
});
