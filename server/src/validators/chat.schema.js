import { z } from 'zod';

export const chatMessageSchema = z.object({
  message: z.string().trim().min(1, 'Message is required').max(2000),
  stadiumId: z.string().optional(),
  matchId: z.string().optional(),
});

export const translateSchema = z.object({
  text: z.string().trim().min(1, 'Text is required').max(5000),
  targetLanguage: z.string().min(2, 'Target language is required').max(10),
});

export const navigateSchema = z.object({
  from: z.string().trim().min(1, 'Origin is required'),
  to: z.string().trim().min(1, 'Destination is required'),
  stadiumId: z.string().optional(),
  accessibility: z.boolean().optional().default(false),
});
