import { Router } from 'express';
import multer from 'multer';
import { uploadMedicalRecord, getMedicalRecords } from '../controllers/medicalRecordController';
import { chatWithAI } from '../controllers/chatController';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const upload = multer({ dest: 'uploads/' }); // Temp local storage

// Medical Records
router.post('/upload', 
    authenticateToken, 
    upload.single('file'), 
    uploadMedicalRecord
);

router.get('/records', authenticateToken, getMedicalRecords);

// Chat
router.post('/chat', authenticateToken, chatWithAI);

export default router;
