import { Router } from 'express';
import { 
    createIssue, 
    updateIssue, 
    getMyIssues, 
    getAssignedIssues, 
    getAllIssues 
} from '../controllers/issueController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = Router();

router.post('/', authenticateToken, createIssue);
router.patch('/:id', authenticateToken, updateIssue);
router.get('/my', authenticateToken, getMyIssues);
router.get('/assigned', authenticateToken, getAssignedIssues);

// Admin / Manager view
router.get('/all', authenticateToken, authorizeRoles(['ADMIN', 'MANAGER']), getAllIssues);

export default router;
