import { z } from 'zod';
export const reportSchema = z.object({ type: z.string().min(1), stadiumId: z.string().min(1), title: z.string().min(1).max(200) });
