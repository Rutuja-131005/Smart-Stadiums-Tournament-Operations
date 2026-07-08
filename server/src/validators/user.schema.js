import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  preferredLanguage: z.string().min(2).max(10).optional(),
});
