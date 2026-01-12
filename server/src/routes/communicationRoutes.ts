import { Router } from 'express';
import { 
    sendMessage, 
    getConversation, 
    getContacts, 
    createAnnouncement, 
    getAnnouncements 
} from '../controllers/messagingController';
import { 
    requestLeave, 
    respondToLeave, 
    getMyLeaves, 
    getPendingApprovals 
} from '../controllers/leaveController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = Router();

// Messaging
router.get('/contacts', authenticateToken, getContacts);
router.get('/messages/:userId', authenticateToken, getConversation);
router.post('/messages', authenticateToken, sendMessage);

// Announcements
router.get('/announcements', authenticateToken, getAnnouncements);
router.post('/announcements', authenticateToken, authorizeRoles(['ADMIN', 'MANAGER']), createAnnouncement);

// Leaves
router.post('/leaves', authenticateToken, requestLeave);
router.get('/leaves/my', authenticateToken, getMyLeaves);
router.get('/leaves/pending', authenticateToken, getPendingApprovals);
router.patch('/leaves/:id/respond', authenticateToken, respondToLeave);

export default router;
