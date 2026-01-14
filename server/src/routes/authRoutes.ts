import { Router } from 'express';
import { 
  sendMobileOTP, 
  verifyMobileOTP, 
  verifyOTPOnly,
  refreshToken,
  login,
  register 
} from '../controllers/authController';

const router = Router();

// Mobile OTP Routes (Primary Auth) - High Performance
router.post('/send-otp', sendMobileOTP);
router.post('/verify-otp', verifyMobileOTP); // Login
router.post('/verify-otp-registration', verifyOTPOnly); // Verification only

// Email/Password Routes (Standard Auth)
router.post('/register', register);
router.post('/login', login);

// Legacy routes for backward compatibility
router.post('/mobile/send-otp', sendMobileOTP);
router.post('/mobile/verify-otp', verifyMobileOTP);

// Token Management
// Google Auth Routes
import passport from 'passport';

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback', 
  passport.authenticate('google', { 
    successRedirect: process.env.CLIENT_URL || 'http://localhost:5173',
    failureRedirect: '/api/auth/login/failed'
  })
);

router.get('/login/success', (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "successful",
      user: req.user,
    });
  } else {
    res.status(401).json({
      success: false,
      message: "User not authenticated"
    });
  }
});

router.get('/login/failed', (req, res) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
});

router.get('/logout', (req, res, next) => {
  req.logout((err) => {
      if (err) { return next(err); }
      res.redirect(process.env.CLIENT_URL || 'http://localhost:5173');
  });
});

export default router;
