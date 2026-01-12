import { Request } from 'express';
import { UserRole } from '@prisma/client';

export interface TokenPayload {
  userId: string;
  role: UserRole | string;
  email: string;
  tokenVersion?: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}
