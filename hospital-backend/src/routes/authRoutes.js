const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const authenticate = require('../middleware/authenticate');
const validateRequest = require('../middleware/validateRequest');
const { authLimiter } = require('../middleware/rateLimiter');

// Register
router.post('/register',
  authLimiter,
  [
    body('email').isEmail().withMessage('Invalid email').normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('fullName').notEmpty().withMessage('Full name is required').trim()
  ],
  validateRequest,
  authController.register
);

// Login
router.post('/login',
  authLimiter,
  [
    body('email').isEmail().withMessage('Invalid email').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validateRequest,
  authController.login
);

// Forgot password
router.post('/forgot-password',
  authLimiter,
  [body('email').isEmail().withMessage('Invalid email').normalizeEmail()],
  validateRequest,
  authController.forgotPassword
);

// Reset password
router.post('/reset-password',
  authLimiter,
  [
    body('token').notEmpty().withMessage('Token is required'),
    body('newPassword').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
  ],
  validateRequest,
  authController.resetPassword
);

// Protected routes
router.get('/me', authenticate, authController.getCurrentUser);
router.post('/logout', authenticate, authController.logout);

module.exports = router;
