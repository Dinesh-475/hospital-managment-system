import Redis from 'ioredis';

// In-memory fallback store (for development when Redis is unavailable)
const memoryStore = new Map<string, { value: string; expiresAt: number }>();
let redisAvailable = false;

// Create Redis client with optimized settings for performance
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  enableOfflineQueue: false, // Don't queue commands when offline for faster failures
  connectTimeout: 10000,
  lazyConnect: true,
  // Performance optimizations
  keepAlive: 30000,
  family: 4, // Use IPv4
});

// Handle connection events
redis.on('connect', () => {
  redisAvailable = true;
  console.log('✅ Redis connected');
});

redis.on('ready', () => {
  redisAvailable = true;
  console.log('✅ Redis ready');
});

redis.on('error', (err) => {
  redisAvailable = false;
  console.warn('⚠️ Redis error:', err.message);
  // Don't crash the app if Redis is unavailable
});

redis.on('close', () => {
  redisAvailable = false;
  console.log('⚠️ Redis connection closed');
});

// Connect to Redis
redis.connect().catch((err) => {
  redisAvailable = false;
  console.warn('⚠️ Redis connection failed, using in-memory fallback:', err.message);
});

// Clean up expired entries from memory store periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of memoryStore.entries()) {
    if (data.expiresAt < now) {
      memoryStore.delete(key);
    }
  }
}, 60000); // Clean every minute

// Helper functions for OTP operations with atomic operations
export const otpCache = {
  // Store OTP with expiry (atomic operation)
  async setOTP(phoneNumber: string, otp: string, expiresIn: number = 300): Promise<boolean> {
    if (redisAvailable) {
      try {
        const key = `otp:${phoneNumber}`;
        const attemptsKey = `otp:attempts:${phoneNumber}`;
        const resendKey = `otp:resend:${phoneNumber}`;
        
        // Use pipeline for atomic operations
        const pipeline = redis.pipeline();
        pipeline.setex(key, expiresIn, otp);
        pipeline.setex(attemptsKey, expiresIn, '0');
        pipeline.setex(resendKey, expiresIn, '0');
        
        await pipeline.exec();
        return true;
      } catch (error) {
        console.error('Redis setOTP error:', error);
        redisAvailable = false;
        // Fall through to memory store
      }
    }
    
    // Fallback to in-memory store
    const expiresAt = Date.now() + (expiresIn * 1000);
    memoryStore.set(`otp:${phoneNumber}`, { value: otp, expiresAt });
    memoryStore.set(`otp:attempts:${phoneNumber}`, { value: '0', expiresAt });
    memoryStore.set(`otp:resend:${phoneNumber}`, { value: '0', expiresAt });
    return true;
  },

  // Get OTP
  async getOTP(phoneNumber: string): Promise<string | null> {
    if (redisAvailable) {
      try {
        const key = `otp:${phoneNumber}`;
        return await redis.get(key);
      } catch (error) {
        console.error('Redis getOTP error:', error);
        redisAvailable = false;
        // Fall through to memory store
      }
    }
    
    // Fallback to in-memory store
    const data = memoryStore.get(`otp:${phoneNumber}`);
    if (data && data.expiresAt > Date.now()) {
      return data.value;
    }
    return null;
  },

  // Increment attempts atomically
  async incrementAttempts(phoneNumber: string): Promise<number> {
    if (redisAvailable) {
      try {
        const key = `otp:attempts:${phoneNumber}`;
        const attempts = await redis.incr(key);
        await redis.expire(key, 300); // Reset expiry
        return attempts;
      } catch (error) {
        console.error('Redis incrementAttempts error:', error);
        redisAvailable = false;
        // Fall through to memory store
      }
    }
    
    // Fallback to in-memory store
    const key = `otp:attempts:${phoneNumber}`;
    const data = memoryStore.get(key);
    const attempts = data ? parseInt(data.value, 10) + 1 : 1;
    const expiresAt = Date.now() + (300 * 1000);
    memoryStore.set(key, { value: attempts.toString(), expiresAt });
    return attempts;
  },

  // Increment resend count atomically
  async incrementResend(phoneNumber: string): Promise<number> {
    if (redisAvailable) {
      try {
        const key = `otp:resend:${phoneNumber}`;
        const count = await redis.incr(key);
        await redis.expire(key, 600); // 10 min window
        return count;
      } catch (error) {
        console.error('Redis incrementResend error:', error);
        redisAvailable = false;
        // Fall through to memory store
      }
    }
    
    // Fallback to in-memory store
    const key = `otp:resend:${phoneNumber}`;
    const data = memoryStore.get(key);
    const count = data ? parseInt(data.value, 10) + 1 : 1;
    const expiresAt = Date.now() + (600 * 1000);
    memoryStore.set(key, { value: count.toString(), expiresAt });
    return count;
  },

  // Get resend count
  async getResendCount(phoneNumber: string): Promise<number> {
    if (redisAvailable) {
      try {
        const key = `otp:resend:${phoneNumber}`;
        const count = await redis.get(key);
        return count ? parseInt(count, 10) : 0;
      } catch (error) {
        console.error('Redis getResendCount error:', error);
        redisAvailable = false;
        // Fall through to memory store
      }
    }
    
    // Fallback to in-memory store
    const data = memoryStore.get(`otp:resend:${phoneNumber}`);
    if (data && data.expiresAt > Date.now()) {
      return parseInt(data.value, 10);
    }
    return 0;
  },

  // Delete OTP and related data
  async deleteOTP(phoneNumber: string): Promise<void> {
    if (redisAvailable) {
      try {
        const pipeline = redis.pipeline();
        pipeline.del(`otp:${phoneNumber}`);
        pipeline.del(`otp:attempts:${phoneNumber}`);
        pipeline.del(`otp:resend:${phoneNumber}`);
        await pipeline.exec();
        return;
      } catch (error) {
        console.error('Redis deleteOTP error:', error);
        redisAvailable = false;
        // Fall through to memory store
      }
    }
    
    // Fallback to in-memory store
    memoryStore.delete(`otp:${phoneNumber}`);
    memoryStore.delete(`otp:attempts:${phoneNumber}`);
    memoryStore.delete(`otp:resend:${phoneNumber}`);
  },

  // Check if OTP exists
  async exists(phoneNumber: string): Promise<boolean> {
    if (redisAvailable) {
      try {
        const key = `otp:${phoneNumber}`;
        const exists = await redis.exists(key);
        return exists === 1;
      } catch (error) {
        console.error('Redis exists error:', error);
        redisAvailable = false;
        // Fall through to memory store
      }
    }
    
    // Fallback to in-memory store
    const data = memoryStore.get(`otp:${phoneNumber}`);
    return data ? data.expiresAt > Date.now() : false;
  },
};

// General cache helpers
export const cache = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      return null;
    }
  },

  async set(key: string, value: any, expiresIn: number = 3600): Promise<boolean> {
    try {
      await redis.setex(key, expiresIn, JSON.stringify(value));
      return true;
    } catch (error) {
      return false;
    }
  },

  async del(key: string): Promise<void> {
    try {
      await redis.del(key);
    } catch (error) {
      // Ignore errors
    }
  },

  async delPattern(pattern: string): Promise<void> {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (error) {
      // Ignore errors
    }
  },
};

export default redis;

