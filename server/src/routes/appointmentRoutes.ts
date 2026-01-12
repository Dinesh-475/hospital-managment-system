import { Router } from 'express';
import { 
    getDoctors, 
    getAvailableSlots, 
    bookAppointment, 
    updateAppointmentStatus, 
    getMyAppointments, 
    getCrowdStatus 
} from '../controllers/appointmentController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';
import { UserRole } from '@prisma/client';

const router = Router();

// Public/Protected (Patient)
router.get('/doctors', authenticateToken, getDoctors);
router.get('/slots/:doctorId', authenticateToken, getAvailableSlots);
router.post('/book', authenticateToken, bookAppointment);
router.get('/my', authenticateToken, getMyAppointments);

// Crowd Status (Public)
router.get('/crowd-status', getCrowdStatus);

// Doctor/Admin actions
router.patch('/:id/status', 
    authenticateToken, 
    authorizeRoles([UserRole.DOCTOR as any, UserRole.ADMIN, 'DOCTOR', 'ADMIN']), 
    updateAppointmentStatus
);

export default router;
