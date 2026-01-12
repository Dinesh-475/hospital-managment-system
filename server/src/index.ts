import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import { setupSocket } from './socket';
import prisma from './prisma';
import redis from './config/redis';

const PORT = process.env.PORT || 5001;
const server = http.createServer(app);

// Optimize HTTP server for performance
server.keepAliveTimeout = 65000; // 65 seconds
server.headersTimeout = 66000; // 66 seconds

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  },
  // Performance optimizations
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Setup Socket.io
setupSocket(io);

// Make io accessible in routes
app.set('io', io);

const startServer = async () => {
  try {
    // Connect to database with retry logic
    let dbConnected = false;
    let retries = 3;
    
    while (!dbConnected && retries > 0) {
      try {
        await prisma.$connect();
        console.log('✅ Database connected successfully');
        dbConnected = true;
      } catch (error: any) {
        retries--;
        if (retries === 0) {
          console.error('❌ Database connection failed after retries');
          console.error('💡 Make sure PostgreSQL is running and DATABASE_URL is correct');
          console.error('💡 Run: docker compose up -d (in server directory)');
          // Don't exit - allow server to start for development
          // In production, you might want to exit here
        } else {
          console.log(`⏳ Database connection failed, retrying... (${retries} attempts left)`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }

    // Redis connection is handled in redis.ts with graceful degradation
    
    // Start server
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 API: http://localhost:${PORT}/api`);
      console.log(`🏥 Health: http://localhost:${PORT}/health`);
      if (!dbConnected) {
        console.log('⚠️  Running without database connection');
      }
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    prisma.$disconnect();
    redis.quit();
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...');
  server.close(() => {
    prisma.$disconnect();
    redis.quit();
    process.exit(0);
  });
});

startServer();
