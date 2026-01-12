import { Router } from 'express';
import authRoutes from './authRoutes';
import attendanceRoutes from './attendanceRoutes';
import appointmentRoutes from './appointmentRoutes';
import aiRoutes from './aiRoutes';
import communicationRoutes from './communicationRoutes';
import issueRoutes from './issueRoutes';
import shiftRoutes from './shiftRoutes';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.use('/auth', authRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/ai', aiRoutes);
router.use('/communication', communicationRoutes);
router.use('/issues', issueRoutes);
router.use('/shifts', shiftRoutes);

export default router;
