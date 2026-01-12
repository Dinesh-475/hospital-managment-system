import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

interface SocketUser {
  userId: string;
  role: string;
  email: string;
  department?: string; // If available in token
}

export const setupSocket = (io: Server) => {
  // Middleware for Auth
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'access_secret') as SocketUser;
      socket.data.user = decoded;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const user = socket.data.user as SocketUser;
    
    console.log(`User connected: ${user.userId}`);
    
    // Join personal room
    socket.join(user.userId);
    
    // Join role room
    socket.join(user.role);
    
    // Join department room if applicable
    if (user.department) {
        socket.join(user.department);
    }

    socket.on('join_chat', (chatId) => {
        socket.join(chatId);
    });

    socket.on('typing', (data) => {
        socket.to(data.to).emit('typing', { from: user.userId });
    });
    
    socket.on('stop_typing', (data) => {
        socket.to(data.to).emit('stop_typing', { from: user.userId });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
};
