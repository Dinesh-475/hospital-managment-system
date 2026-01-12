import { z } from 'zod';
import { MessageType, AnnouncementPriority, LeaveType } from '@prisma/client';

export const sendMessageSchema = z.object({
  receiverId: z.string().uuid(),
  content: z.string().min(1),
  messageType: z.nativeEnum(MessageType).optional(),
});

export const createAnnouncementSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  priority: z.nativeEnum(AnnouncementPriority),
  department: z.string().optional(), // 'ALL' or specific
});

export const leaveRequestSchema = z.object({
  leaveType: z.nativeEnum(LeaveType),
  startDate: z.string(),
  endDate: z.string(),
  reason: z.string().min(1),
  approverId: z.string().uuid(),
});

export const leaveResponseSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
  comments: z.string().optional(),
});
