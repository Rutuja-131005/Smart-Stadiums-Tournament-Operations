import { z } from 'zod';
export const routeRequestSchema = z.object({ from: z.string().min(1), to: z.string().min(1), stadiumId: z.string().optional() });
