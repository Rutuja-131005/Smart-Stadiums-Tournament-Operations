import { z } from 'zod';

export const transportQuerySchema = z.object({
  stadiumId: z.string().min(1, 'Stadium ID is required'),
});

export const transportPlanSchema = z.object({
  origin: z.string().optional(),
  accessibility: z.boolean().optional().default(false),
});
