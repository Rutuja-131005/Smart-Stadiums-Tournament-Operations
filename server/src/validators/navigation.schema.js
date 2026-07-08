import { z } from 'zod';

export const routeRequestSchema = z.object({
  from: z.string().trim().min(1, 'Origin is required'),
  to: z.string().trim().min(1, 'Destination is required'),
  stadiumId: z.string().optional(),
  accessibility: z.boolean().optional().default(false),
});
