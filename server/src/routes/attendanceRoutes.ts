import { Router } from 'express';
import { 
    markCheckIn, 
    markCheckOut, 
    getMyAttendance, 
    getAllAttendance 
} from '../controllers/attendanceController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';
import { UserRole } from '@prisma/client';

const router = Router();

router.post('/check-in', authenticateToken, markCheckIn);
router.post('/check-out', authenticateToken, markCheckOut);

router.get('/me', authenticateToken, getMyAttendance);

router.get('/all', 
    authenticateToken, 
    authorizeRoles(['ADMIN', 'MANAGER']), 
    getAllAttendance
);

export default router;
