import { z } from 'zod';
export const transportQuerySchema = z.object({ stadiumId: z.string().min(1) });
