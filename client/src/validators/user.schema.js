import { z } from 'zod';
export const updateProfileSchema = z.object({ name: z.string().min(1).max(100).optional(), preferredLanguage: z.string().min(2).optional() });
export const accessibilitySchema = z.object({ highContrast: z.boolean().optional(), screenReader: z.boolean().optional(), voiceGuidance: z.boolean().optional(), wheelchairAccess: z.boolean().optional() });
