import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma';
import { leaveRequestSchema, leaveResponseSchema } from '../utils/validation/communication';
import { LeaveStatus } from '@prisma/client';

export const requestLeave = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { leaveType, startDate, endDate, reason, approverId } = leaveRequestSchema.parse(req.body);
        const userId = req.user!.userId;

        const leave = await prisma.leaveRequest.create({
            data: {
                userId,
                approverId,
                leaveType,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                reason,
                status: LeaveStatus.PENDING
            }
        });

        // Notify Approver
        const io = req.app.get('io');
        if (io) {
            io.to(approverId).emit('leave_request_new', {
                id: leave.id,
                requesterId: userId,
                type: leaveType
            });
        }

        res.status(201).json({ success: true, data: leave });
    } catch (error) {
        next(error);
    }
};

export const respondToLeave = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { status, comments } = leaveResponseSchema.parse(req.body);
        const approverId = req.user!.userId;

        // Verify approver matches
        const existing = await prisma.leaveRequest.findUnique({ where: { id } });
        if (!existing || existing.approverId !== approverId) {
            return res.status(403).json({ success: false, message: 'Not authorized to approve this request' });
        }

        const updated = await prisma.leaveRequest.update({
            where: { id },
            data: {
                status: status as LeaveStatus,
                rejectionReason: comments // Using rejectionReason for comments generally if 'comments' not in schema
            }
        });

        // Notify Requester
        const io = req.app.get('io');
        if (io) {
            io.to(existing.userId).emit('leave_request_update', {
                id: updated.id,
                status: updated.status,
                comments
            });
        }

        res.json({ success: true, data: updated });
    } catch (error) {
        next(error);
    }
};

export const getMyLeaves = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const leaves = await prisma.leaveRequest.findMany({
            where: { userId: req.user!.userId },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, data: leaves });
    } catch (error) {
        next(error);
    }
};

export const getPendingApprovals = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const leaves = await prisma.leaveRequest.findMany({
            where: { 
                approverId: req.user!.userId,
                status: LeaveStatus.PENDING
            },
            include: {
                user: { select: { firstName: true, lastName: true, role: true } }
            }
        });
        res.json({ success: true, data: leaves });
    } catch (error) {
        next(error);
    }
};
