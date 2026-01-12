import { Router } from 'express';
import { 
  sendMobileOTP, 
  verifyMobileOTP, 
  refreshToken 
} from '../controllers/authController';

const router = Router();

// Mobile OTP Routes (Primary Auth) - High Performance
router.post('/send-otp', sendMobileOTP);
router.post('/verify-otp', verifyMobileOTP);

// Legacy routes for backward compatibility
router.post('/mobile/send-otp', sendMobileOTP);
router.post('/mobile/verify-otp', verifyMobileOTP);

// Token Management
router.post('/refresh-token', refreshToken);

export default router;
