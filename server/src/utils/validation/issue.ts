import { z } from 'zod';
import { IssueType, IssuePriority, IssueStatus } from '@prisma/client';

export const createIssueSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  issueType: z.nativeEnum(IssueType),
  priority: z.nativeEnum(IssuePriority),
  location: z.string().optional(),
  attachments: z.array(z.string().url()).optional()
});

export const updateIssueSchema = z.object({
  status: z.nativeEnum(IssueStatus).optional(),
  priority: z.nativeEnum(IssuePriority).optional(),
  assignedTo: z.string().uuid().optional(),
  resolution: z.string().optional()
});
