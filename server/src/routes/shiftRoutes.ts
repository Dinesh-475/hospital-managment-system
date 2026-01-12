import { Router } from 'express';
import { assignShift, getMyShifts, getAllShifts } from '../controllers/shiftController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = Router();

router.get('/my', authenticateToken, getMyShifts);
router.get('/all', authenticateToken, authorizeRoles(['ADMIN', 'MANAGER']), getAllShifts);
router.post('/', authenticateToken, authorizeRoles(['ADMIN', 'MANAGER']), assignShift);

export default router;
