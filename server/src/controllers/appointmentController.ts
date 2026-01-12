import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma';
import { bookAppointmentSchema, updateStatusSchema } from '../utils/validation/appointment';
import { AppointmentStatus, UserRole } from '@prisma/client';
import { format, addMinutes, parse, isBefore, startOfDay, endOfDay } from 'date-fns';

// Helper to generate booking number
const generateBookingNumber = async () => {
    const today = format(new Date(), 'yyyyMMdd');
    const count = await prisma.appointment.count({
        where: { createdAt: { gte: startOfDay(new Date()) } }
    });
    const sequence = (count + 1).toString().padStart(3, '0');
    return `BK${today}${sequence}`;
};

// Helper to generate time slots
const generateTimeSlots = (startStr: string, endStr: string, durationMinutes: number) => {
    const slots = [];
    let current = parse(startStr, 'HH:mm', new Date());
    const end = parse(endStr, 'HH:mm', new Date());

    while (isBefore(current, end)) {
        slots.push(format(current, 'HH:mm'));
        current = addMinutes(current, durationMinutes);
    }
    return slots;
};

export const getDoctors = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { search, specialization } = req.query;
        
        let where: any = {
            role: UserRole.DOCTOR,
            isActive: true
        };

        if (search) {
            where.OR = [
                { firstName: { contains: search as string, mode: 'insensitive' } },
                { lastName: { contains: search as string, mode: 'insensitive' } },
            ];
        }

        // Since Doctor profile is separate, we need to filter on User then include Doctor
        // Or find Doctor then include User.
        // Let's query User with role DOCTOR and include doctorProfile
        
        const doctors = await prisma.user.findMany({
            where,
            include: {
                doctorProfile: true
            }
        });

        // Client side filtering for specialization if needed, or refine query
        // Since specialization is in doctorProfile, we can't easily filter top-level User on nested relation property in strict prisma without 'some'.
        
        let results = doctors.map(u => ({
             id: u.doctorProfile?.doctorId, // Use doctorId for booking
             userId: u.id,
             name: `${u.firstName} ${u.lastName}`,
             specialization: u.doctorProfile?.specialization,
             roomNumber: u.doctorProfile?.roomNumber,
             fee: u.doctorProfile?.consultationFee,
             experience: u.doctorProfile?.yearsOfExperience,
             avatar: u.profilePictureUrl,
             description: u.doctorProfile?.description
        })).filter(d => d.id); // Valid doctors only

        if (specialization) {
            results = results.filter(d => 
                d.specialization?.toLowerCase().includes((specialization as string).toLowerCase())
            );
        }

        res.json({ success: true, data: results });
    } catch (error) {
        next(error);
    }
};

export const getAvailableSlots = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { doctorId } = req.params;
        const { date } = req.query;

        if (!date) return res.status(400).json({ message: 'Date is required' });

        const doctor = await prisma.doctor.findUnique({
            where: { doctorId },
        });

        if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

        const targetDate = new Date(date as string);
        const dayOfWeek = format(targetDate, 'EEEE'); // Monday, Tuesday...

        const availableDays = (doctor.availableDays as string[]) || [];
        if (!availableDays.includes(dayOfWeek)) {
            return res.json({ success: true, slots: [], message: 'Doctor not available on this day' });
        }

        // Get slots config
        // Assuming structure: { "Monday": { "start": "09:00", "end": "17:00" } }
        const timeSlotsConfig = (doctor.availableTimeSlots as any)?.[dayOfWeek];
        if (!timeSlotsConfig) {
            return res.json({ success: true, slots: [] });
        }
        
        // Get settings for duration
        const settings = await prisma.hospitalSettings.findFirst() || { slotDurationMinutes: 30 };

        const allSlots = generateTimeSlots(
            timeSlotsConfig.start,
            timeSlotsConfig.end,
            settings.slotDurationMinutes
        );

        // Fetch booked slots
        const booked = await prisma.appointment.findMany({
            where: {
                doctorId,
                appointmentDate: targetDate,
                status: { in: [AppointmentStatus.SCHEDULED, AppointmentStatus.COMPLETED] }
            },
            select: { appointmentTime: true }
        });

        const bookedTimes = booked.map(b => format(b.appointmentTime, 'HH:mm'));

        const availableSlots = allSlots.filter(slot => !bookedTimes.includes(slot));

        res.json({ success: true, slots: availableSlots });

    } catch (error) {
        next(error);
    }
};

export const bookAppointment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { doctorId, date, time, symptoms } = bookAppointmentSchema.parse(req.body);
        const patientUserId = req.user!.userId;

        // Verify Patient Profile exists
        let patient = await prisma.patient.findUnique({ where: { patientId: patientUserId } });
        
        // Auto-create patient profile if missing (fallback mechanism)
        if (!patient) {
            patient = await prisma.patient.create({
                data: {
                    patientId: patientUserId,
                    dateOfBirth: new Date(), // Warning: placeholder
                    patientUniqueId: (await generateBookingNumber()) + 'P' // Quick patch 
                }
            });
        }

        // Check availability again (race condition mitigation would require locking, skipping for MVP)
        const appointmentDate = new Date(date);
        const appointmentTimeDate = parse(time, 'HH:mm', appointmentDate);

        const existing = await prisma.appointment.findFirst({
            where: {
                doctorId,
                appointmentDate,
                appointmentTime: appointmentTimeDate,
                status: { not: AppointmentStatus.CANCELLED }
            }
        });

        if (existing) {
            return res.status(409).json({ success: false, message: 'Slot already booked' });
        }

        const bookingNumber = await generateBookingNumber();

        // Calculate queue position
        const queueCount = await prisma.appointment.count({
            where: {
                doctorId,
                appointmentDate,
                status: AppointmentStatus.SCHEDULED
            }
        });
        const queuePosition = queueCount + 1;

        const appointment = await prisma.appointment.create({
            data: {
                bookingNumber,
                patientId: patient.patientId,
                doctorId,
                appointmentDate,
                appointmentTime: appointmentTimeDate,
                queuePosition,
                symptoms,
                status: AppointmentStatus.SCHEDULED
            }
        });

        // Emit Socket Event
        const io = req.app.get('io');
        if (io) {
            // Notify doctor
            io.to(`doctor_${doctorId}`).emit('new_appointment', appointment);
            // Notify admin/dashboard
            io.emit('queue_update', { doctorId, date, queuePosition });
        }

        res.status(201).json({ success: true, data: appointment });

    } catch (error) {
        next(error);
    }
};

export const updateAppointmentStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { status } = updateStatusSchema.parse(req.body);

        const appointment = await prisma.appointment.update({
            where: { id },
            data: { status }
        });

        // Emit update
        const io = req.app.get('io');
        if (io) {
            io.to(`appointment_${id}`).emit('status_change', { id, status });
            // If completed, update queue for others? 
            // Simplified: Broadcast refresh signal
            io.emit('appointments_refresh');
        }

        res.json({ success: true, data: appointment });
    } catch (error) {
        next(error);
    }
};

export const getMyAppointments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const patient = await prisma.patient.findUnique({ where: { patientId: req.user!.userId } });
        if (!patient) return res.json({ success: true, data: [] });

        const appointments = await prisma.appointment.findMany({
            where: { patientId: patient.patientId },
            include: {
                doctor: {
                    include: {
                        user: { select: { firstName: true, lastName: true } }
                    }
                }
            },
            orderBy: { appointmentDate: 'desc' }
        });

        res.json({ success: true, data: appointments });
    } catch (error) {
        next(error);
    }
};

export const getCrowdStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const today = startOfDay(new Date());
        
        // Count today's appointments
        const totalToday = await prisma.appointment.count({
            where: { appointmentDate: today, status: { not: AppointmentStatus.CANCELLED } }
        });

        // Group by Doctor (Queue Lengths)
        const queues = await prisma.appointment.groupBy({
            by: ['doctorId'],
            where: { appointmentDate: today, status: AppointmentStatus.SCHEDULED },
            _count: { id: true }
        });

        // Determine Level
        let status = 'Low';
        if (totalToday > 50) status = 'Moderate';
        if (totalToday > 150) status = 'High';

        res.json({ 
            success: true, 
            data: {
                totalAppointments: totalToday,
                crowdLevel: status,
                queues
            } 
        });
    } catch (error) {
        next(error);
    }
};
