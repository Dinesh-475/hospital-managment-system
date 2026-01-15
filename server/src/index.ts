import dotenv from 'dotenv';
dotenv.config();

// Validate environment variables before starting server
import validateEnv from './config/validateEnv';
validateEnv();

import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import { setupSocket } from './socket';
import connectDB from './config/database';
import mongoose from 'mongoose';

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
    // Connect to MongoDB
    await connectDB();
    
    // Start Express server
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 API: http://localhost:${PORT}/api`);
      console.log(`🏥 Health: http://localhost:${PORT}/health`);
    });

    // Graceful shutdown function
    const shutdown = async () => {
      console.log('\n🛑 Shutting down gracefully...');
      
      server.close(async () => {
        console.log('✅ HTTP server closed');
        
        // Close MongoDB connection
        await mongoose.connection.close();
        console.log('✅ MongoDB connection closed');
        
        process.exit(0);
      });
    };

    // Listen for termination signals
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
