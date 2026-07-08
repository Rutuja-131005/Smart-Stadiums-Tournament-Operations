import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(128),
  role: z.enum(['fan', 'volunteer', 'staff', 'security', 'admin']).optional().default('fan'),
  preferredLanguage: z.string().optional().default('en'),
});

export const loginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(1, 'Password is required'),
});

export const updateAccessibilitySchema = z.object({
  highContrast: z.boolean().optional(),
  screenReader: z.boolean().optional(),
  voiceGuidance: z.boolean().optional(),
  wheelchairAccess: z.boolean().optional(),
});

export const updateLanguageSchema = z.object({
  language: z.string().min(2, 'Language is required').max(10),
});
