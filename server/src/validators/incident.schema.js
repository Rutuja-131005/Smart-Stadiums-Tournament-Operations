import { z } from 'zod';

export const incidentSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  description: z.string().trim().min(1, 'Description is required').max(2000),
  type: z.enum(['medical', 'security', 'technical', 'crowd', 'weather', 'other']),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  stadiumId: z.string().optional(),
  matchId: z.string().optional(),
  location: z.object({
    zone: z.string().optional(),
    coordinates: z.object({ lat: z.number(), lng: z.number() }).optional(),
    floor: z.number().optional(),
  }).optional(),
});

export const updateIncidentSchema = z.object({
  status: z.enum(['open', 'investigating', 'resolved', 'closed']).optional(),
  severity: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  description: z.string().max(2000).optional(),
});
