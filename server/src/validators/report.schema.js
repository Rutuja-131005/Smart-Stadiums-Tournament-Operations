import { z } from 'zod';

export const reportSchema = z.object({
  type: z.enum(['match_day', 'crowd', 'incident', 'sustainability', 'operational']),
  stadiumId: z.string().min(1, 'Stadium is required'),
  matchId: z.string().optional(),
  title: z.string().trim().min(1, 'Title is required').max(200),
});
