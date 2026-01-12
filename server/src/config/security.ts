import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { Express } from 'express';

export const configureSecurity = (app: Express) => {
  // 1. Helmet for Security Headers (optimized for performance)
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"], // Allow inline for MVP dev; tighten in prod
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "ws:", "wss:"], // Allow WebSocket
      },
    },
    crossOriginEmbedderPolicy: false,
    // Performance: Disable unnecessary features
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }));

  // 2. Rate Limiting (optimized for e-commerce level traffic)
  const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Increased for high traffic (e-commerce level)
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests, please try again later.',
    // Performance: Skip successful requests from rate limit
    skipSuccessfulRequests: false,
    // Performance: Skip failed requests (they're already handled)
    skipFailedRequests: false,
  });

  // Strict rate limiting for OTP endpoints (prevent abuse)
  const otpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Max 10 OTP requests per 15 minutes per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many OTP requests. Please try again later.',
    skipSuccessfulRequests: false,
  });

  // Auth rate limiter
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30, // Increased slightly for better UX
    message: 'Too many login attempts, please try again later.',
    skipSuccessfulRequests: true, // Don't count successful logins
  });

  // Apply rate limiters
  app.use('/api', generalLimiter);
  app.use('/api/auth/send-otp', otpLimiter);
  app.use('/api/auth/verify-otp', otpLimiter);
  app.use('/api/auth/login', authLimiter);
};
