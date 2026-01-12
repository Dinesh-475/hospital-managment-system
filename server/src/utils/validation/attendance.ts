import { z } from 'zod';

export const attendanceMarkSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

export const attendanceUpdateSchema = z.object({
    status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'HALF_DAY']),
});
