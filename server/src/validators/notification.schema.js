import { z } from 'zod';

export const notificationQuerySchema = z.object({
  category: z.enum(['match', 'crowd', 'transport', 'general', 'security']).optional(),
  read: z.enum(['true', 'false']).optional(),
  limit: z.string().regex(/^\d+$/).optional(),
});
