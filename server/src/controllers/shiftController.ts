import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma';
import { createShiftSchema } from '../utils/validation/shift';
import { LeaveStatus } from '@prisma/client';
import { logAudit } from '../services/auditService';

export const assignShift = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { assignedToId, startTime: startTimeStr, endTime: endTimeStr, location, notes } = createShiftSchema.parse(req.body);
        const startTime = new Date(startTimeStr);
        const endTimeDate = new Date(endTimeStr);
        const creatorId = req.user!.userId;

        // 1. Check for Conflicts: Overlapping Shifts
        const conflict = await prisma.shift.findFirst({
            where: {
                assignedTo: assignedToId,
                OR: [
                    { startTime: { lte: endTimeDate }, endTime: { gte: startTime } }
                ]
            }
        });

        if (conflict) {
            return res.status(409).json({ success: false, message: 'Shift conflict detected' });
        }

        // 2. Check for Leaves
        const hasLeave = await prisma.leaveRequest.findFirst({
            where: {
                userId: assignedToId,
                status: LeaveStatus.APPROVED,
                startDate: { lte: endTimeDate },
                endDate: { gte: startTime }
            }
        });

        if (hasLeave) {
             return res.status(409).json({ success: false, message: 'Staff is on approved leave' });
        }

        // 3. Create Shift
        const shift = await prisma.shift.create({
            data: {
                assignedTo: assignedToId,
                createdBy: creatorId,
                startTime,
                endTime: endTimeDate,
                shiftDate: startTime, // Assuming shift date is start date
                shiftType: 'MORNING', // TODO: Logic to determine shift type
                // location, // Schema doesn't have location in preserved Shift model? Let's check.
                // preserved Shift (283) has: shiftDate, shiftType, startTime, endTime. NO Location in preserved model!
                // We'll ignore location for now or add it to schema. Let's stick to preserved schema.
            },
            include: { user: { select: { firstName: true, email: true } } }
        });

        // 4. Audit & Notify
        await logAudit(creatorId, 'ASSIGN_SHIFT', 'SHIFT', shift.id, { assignedTo: assignedToId }, req);
        
        // Notify Staff via Socket
        const io = req.app.get('io');
        if (io) {
            io.to(assignedToId).emit('shift_assigned', shift);
        }

        res.status(201).json({ success: true, data: shift });

    } catch (error) {
        next(error);
    }
};

export const getMyShifts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const shifts = await prisma.shift.findMany({
            where: { assignedTo: req.user!.userId },
            orderBy: { startTime: 'asc' }
        });
        res.json({ success: true, data: shifts });
    } catch (error) {
        next(error);
    }
};

export const getAllShifts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { start, end } = req.query;
        let where: any = {};
        
        if (start && end) {
            where.startTime = {
                gte: new Date(start as string),
                lte: new Date(end as string)
            };
        }

        const shifts = await prisma.shift.findMany({
            where,
            include: { user: { select: { firstName: true, lastName: true, role: true } } },
            orderBy: { startTime: 'asc' }
        });
        res.json({ success: true, data: shifts });
    } catch (error) {
         next(error);
    }
};
