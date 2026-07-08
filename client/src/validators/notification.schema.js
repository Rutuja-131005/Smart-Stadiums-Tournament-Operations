import { z } from 'zod';
export const notificationQuerySchema = z.object({ category: z.string().optional(), read: z.boolean().optional() });
