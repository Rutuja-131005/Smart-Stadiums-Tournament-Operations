import { z } from 'zod';
export const dashboardQuerySchema = z.object({ stadiumId: z.string().optional(), period: z.enum(['today', 'week', 'month']).optional() });
