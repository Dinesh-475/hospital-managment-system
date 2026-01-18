import { Router } from 'express';
import { 
  refreshToken,
  login,
  register 
} from '../controllers/authController';

const router = Router();

// Email/Password Routes (Standard Auth)
router.post('/register', register);
router.post('/login', login);

// Token Management
router.post('/refresh-token', refreshToken);
// Google Auth Routes
import passport from 'passport';

router.get('/google',
  (req, res, next) => {
    console.log('🔵 Initiating Google OAuth flow');
    next();
  },
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  (req, res, next) => {
    console.log('🔵 Google OAuth callback received');
    next();
  },
  passport.authenticate('google', {
    failureRedirect: '/api/auth/login/failed',
    session: true
  }),
  (req, res) => {
    console.log('✅ Google OAuth successful, user:', req.user);
    // Successful authentication, redirect to client with success flag
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    res.redirect(`${clientUrl}/login?google_auth=success`);
  }
);

router.get('/login/success', (req, res) => {
  console.log('🔍 Checking login status, user:', req.user);
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
  console.log('❌ Google OAuth login failed');
  res.status(401).json({
    success: false,
    message: "Google authentication failed",
  });
});

router.get('/logout', (req, res, next) => {
  console.log('🔵 Logging out user');
  req.logout((err) => {
      if (err) {
        console.error('❌ Logout error:', err);
        return next(err);
      }
      console.log('✅ User logged out successfully');
      res.redirect(process.env.CLIENT_URL || 'http://localhost:5173');
  });
});

export default router;
