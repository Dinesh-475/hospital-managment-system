import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import session from 'express-session';
import passport from 'passport';
import { errorHandler } from './middleware/errorMiddleware';
import routes from './routes';
import { configureSecurity } from './config/security';
import './utils/passport';

const app = express();

// Performance: Compression middleware (gzip responses for faster transfer)
app.use(compression({
  level: 6, // Balance between compression and CPU usage
  threshold: 1024, // Only compress responses > 1KB
  filter: (req: express.Request, res: express.Response) => {
    // Don't compress if client doesn't support it
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

// Security Headers & Rate Limiting
configureSecurity(app);

// Performance: Trust proxy for accurate IP addresses (important for rate limiting)
app.set('trust proxy', 1);

// Middleware
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // Allow any localhost port during development
        if (origin.match(/^http:\/\/localhost:\d+$/)) {
            return callback(null, true);
        }
        
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
}));

// Performance: Optimize JSON parsing
app.use(express.json({ 
  limit: '10mb', // Prevent DoS with large payloads
  strict: true // Only parse arrays and objects
}));
app.use(cookieParser());
app.use(express.urlencoded({ 
  extended: true,
  limit: '10mb'
}));

// Performance: Add response time header for monitoring
app.use((req, res, next) => {
  const start = Date.now();
  
  // Use 'once' and set header before response is sent
  const originalSend = res.send;
  res.send = function(data) {
    const duration = Date.now() - start;
    res.setHeader('X-Response-Time', `${duration}ms`);
    return originalSend.call(this, data);
  };
  
  next();
});

// Auth Middleware (Must be before routes)
app.use(session({
  secret: process.env.SESSION_SECRET || 'docvista_secret_key_change_in_production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api', routes);

// Health check endpoint (fast, no DB queries)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error Handling
app.use(errorHandler);

export default app;
