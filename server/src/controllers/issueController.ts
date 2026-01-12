import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma';
import { createIssueSchema, updateIssueSchema } from '../utils/validation/issue';
import { IssueStatus, IssuePriority, IssueType, UserRole } from '@prisma/client';

// Helper to find available staff based on issue type
const findAssigneeForIssue = async (issueType: IssueType): Promise<string | null> => {
    // Simplified logic: find a Manager or specific role.
    // In a real app, map IssueType -> Role (e.g. TECHNICAL -> STAFF (IT_SUPPORT? We assume Role is generic STAFF/DOCTOR/ADMIN))
    // We'll assign to an ADMIN or random active MANAGER for now.
    
    // For this MVP, let's assign to the first available ADMIN or MANAGER
    const assignee = await prisma.user.findFirst({
        where: {
            role: { in: [UserRole.ADMIN, 'MANAGER' as UserRole] },
            isActive: true
        }
    });

    return assignee ? assignee.id : null;
};

export const createIssue = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, description, issueType, priority, location, attachments } = createIssueSchema.parse(req.body);
        const userId = req.user!.userId;

        // Auto-assign logic
        const assignedTo = await findAssigneeForIssue(issueType);

        const issue = await prisma.issue.create({
            data: {
                title,
                description,
                issueType,
                priority,
                location,
                attachments: attachments || [], // Json array
                status: assignedTo ? IssueStatus.IN_PROGRESS : IssueStatus.OPEN,
                reportedBy: userId,
                assignedTo
            }
        });
        
        // Notification
        const io = req.app.get('io');
        if (io && assignedTo) {
            io.to(assignedTo).emit('issue_assigned', issue);
        }

        res.status(201).json({ success: true, data: issue });
    } catch (error) {
        next(error);
    }
};

export const updateIssue = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const updates = updateIssueSchema.parse(req.body);

        // Logic check: if closing, require resolution?
        if (updates.status === IssueStatus.RESOLVED || updates.status === IssueStatus.CLOSED) {
            if (!updates.resolution && !req.body.resolution) { // check payload if not in validated schema partially
               // Ideally enforce in schema, but partial match might skip
            }
        }
        
        const data: any = { ...updates };
        if (updates.status === IssueStatus.RESOLVED) {
            data.resolvedAt = new Date();
        }
        if (updates.status === IssueStatus.REOPENED) {
            data.reopenedAt = new Date();
        }

        const issue = await prisma.issue.update({
            where: { id },
            data
        });

        const io = req.app.get('io');
        if (io) {
            // Notify creator
            io.to(issue.reportedBy).emit('issue_updated', issue);
             // Notify assignee if changed
            if (updates.assignedTo) {
                io.to(updates.assignedTo).emit('issue_assigned', issue);
            }
        }

        res.json({ success: true, data: issue });
    } catch (error) {
        next(error);
    }
};

export const getMyIssues = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        const issues = await prisma.issue.findMany({
            where: { reportedBy: userId },
            orderBy: { createdAt: 'desc' },
            include: { assignee: { select: { firstName: true, lastName: true } } }
        });
        res.json({ success: true, data: issues });
    } catch (error) {
        next(error);
    }
};

export const getAssignedIssues = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        const issues = await prisma.issue.findMany({
            where: { assignedTo: userId },
            orderBy: { priority: 'desc' }, // High priority first
             include: { reporter: { select: { firstName: true, lastName: true, role: true } } }
        });
        res.json({ success: true, data: issues });
    } catch (error) {
        next(error);
    }
};

export const getAllIssues = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Filters
        const { status, priority, type } = req.query;
        let where: any = {};
        if (status) where.status = status;
        if (priority) where.priority = priority;
        if (type) where.issueType = type;

        const issues = await prisma.issue.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: { 
                assignee: { select: { firstName: true, lastName: true } },
                reporter: { select: { firstName: true, lastName: true } }
            }
        });
        res.json({ success: true, data: issues });
    } catch (error) {
        next(error);
    }
};
