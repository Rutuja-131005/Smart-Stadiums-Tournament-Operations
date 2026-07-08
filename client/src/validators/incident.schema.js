import { z } from 'zod';
export const incidentSchema = z.object({ title: z.string().min(1).max(200), description: z.string().min(1), type: z.string().min(1), severity: z.string().min(1) });
