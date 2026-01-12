import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma';
import { isWithinGeofence, calculateDistanceFromCenter } from '../utils/geo';
import { attendanceMarkSchema } from '../utils/validation/attendance';
import { addMinutes, startOfDay, isAfter } from 'date-fns';
import { AttendanceStatus } from '@prisma/client';

// Default fallback settings if not in DB
const DEFAULT_SETTINGS = {
    geofenceCenterLat: 37.7749, // Example: San Francisco
    geofenceCenterLng: -122.4194,
    geofenceRadiusMeters: 500,
    workingHoursStart: new Date().setHours(9, 0, 0, 0), // 09:00 AM
};

export const markCheckIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { latitude, longitude } = attendanceMarkSchema.parse(req.body);
        const userId = req.user!.userId;

        // 1. Get Hospital Settings
        const settings = await prisma.hospitalSettings.findFirst() || {
            geofenceCenterLat: DEFAULT_SETTINGS.geofenceCenterLat,
            geofenceCenterLng: DEFAULT_SETTINGS.geofenceCenterLng,
            geofenceRadiusMeters: DEFAULT_SETTINGS.geofenceRadiusMeters,
            workingHoursStart: new Date(DEFAULT_SETTINGS.workingHoursStart),
        };

        // 2. Validate Geofence
        // Prisma Decimal to number conversion
        const centerLat = Number(settings.geofenceCenterLat);
        const centerLng = Number(settings.geofenceCenterLng);
        
        const inZone = isWithinGeofence(latitude, longitude, centerLat, centerLng, settings.geofenceRadiusMeters);

        if (!inZone) {
            const distance = calculateDistanceFromCenter(latitude, longitude, centerLat, centerLng);
            return res.status(400).json({ 
                success: false, 
                message: 'You are outside the hospital geofence.',
                distance: `${distance} meters from center`
            });
        }

        // 3. Check existing today
        const today = new Date(); // full timestamp
        const todayStart = startOfDay(today);

        const existing = await prisma.attendance.findFirst({
            where: {
                userId,
                date: todayStart
            }
        });

        if (existing) {
             return res.status(400).json({ success: false, message: 'Attendance already marked for today' });
        }

        // 4. Determine Status (Late vs Present)
        // Find user's assigned shift if any, else default to hospital start time
        const shift = await prisma.shift.findFirst({
            where: {
                assignedTo: userId,
                shiftDate: todayStart
            }
        });

        const startTime = shift ? shift.startTime : settings.workingHoursStart;
        
        // Construct detailed start time for today for comparison
        const expectedStart = new Date(today);
        expectedStart.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0);

        const lateThreshold = addMinutes(expectedStart, 15);
        let status: AttendanceStatus = AttendanceStatus.PRESENT;

        if (isAfter(today, lateThreshold)) {
            status = AttendanceStatus.LATE;
        }

        // 5. Create Record
        const attendance = await prisma.attendance.create({
            data: {
                userId,
                date: todayStart,
                checkInTime: today,
                locationLat: latitude,
                locationLng: longitude,
                isWithinGeofence: true,
                attendanceStatus: status
            }
        });

        res.status(200).json({ success: true, data: attendance });

    } catch (error) {
        next(error);
    }
};

export const markCheckOut = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { latitude, longitude } = attendanceMarkSchema.parse(req.body);
        const userId = req.user!.userId;

        // Geofence check is optional on checkout? Usually yes, but let's enforce it for consistency or warn.
        // Prompt says "Similar geofence validation".
        const settings = await prisma.hospitalSettings.findFirst() || {
            geofenceCenterLat: DEFAULT_SETTINGS.geofenceCenterLat,
            geofenceCenterLng: DEFAULT_SETTINGS.geofenceCenterLng,
            geofenceRadiusMeters: DEFAULT_SETTINGS.geofenceRadiusMeters,
        };

        const centerLat = Number(settings.geofenceCenterLat);
        const centerLng = Number(settings.geofenceCenterLng);
        
        if (!isWithinGeofence(latitude, longitude, centerLat, centerLng, settings.geofenceRadiusMeters)) {
             return res.status(400).json({ success: false, message: 'You must be at hospital to check out.' });
        }

        const todayStart = startOfDay(new Date());

        const existing = await prisma.attendance.findFirst({
            where: {
                userId,
                date: todayStart
            }
        });

        if (!existing) {
            return res.status(404).json({ success: false, message: 'No check-in record found for today' });
        }
        
        if (existing.checkOutTime) {
             return res.status(400).json({ success: false, message: 'Already checked out today' });
        }

        const attendance = await prisma.attendance.update({
            where: { id: existing.id },
            data: {
                checkOutTime: new Date(),
            }
        });

        res.status(200).json({ success: true, data: attendance });

    } catch (error) {
        next(error);
    }
};

export const getMyAttendance = async (req: Request, res: Response, next: NextFunction) => {
    try {
         const attendance = await prisma.attendance.findMany({
            where: { userId: req.user!.userId },
            orderBy: { date: 'desc' },
            take: 30 // Last 30 days default
        });
        res.status(200).json({ success: true, data: attendance });
    } catch (error) {
        next(error);
    }
};

export const getAllAttendance = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Simple filter by date
        const { date } = req.query;
        let whereClause: any = {};
        
        if (date) {
            whereClause.date = new Date(date as string);
        }

        const attendance = await prisma.attendance.findMany({
            where: whereClause,
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        role: true,
                        email: true
                    }
                }
            },
            orderBy: { checkInTime: 'desc' }
        });

        res.status(200).json({ success: true, data: attendance });

    } catch (error) {
        next(error);
    }
};
