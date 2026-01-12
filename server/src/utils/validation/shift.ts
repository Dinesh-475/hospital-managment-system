import { z } from 'zod';

export const createShiftSchema = z.object({
  assignedToId: z.string().uuid(),
  startTime: z.string().datetime(), // ISO 8601
  endTime: z.string().datetime(),
  location: z.string().optional(),
  notes: z.string().optional()
});
