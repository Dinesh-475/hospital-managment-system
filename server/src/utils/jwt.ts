import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';

export const generateTokens = (user: User) => {
  const accessTokenPayload = {
    userId: user.id,
    role: user.role,
    email: user.email,
  };

  const refreshTokenPayload = {
    userId: user.id,
    tokenVersion: user.tokenVersion,
  };

  const accessToken = jwt.sign(
    accessTokenPayload,
    process.env.JWT_SECRET || 'access_secret',
    { expiresIn: (process.env.JWT_EXPIRE || '15m') as any }
  );

  const refreshToken = jwt.sign(
    refreshTokenPayload,
    process.env.JWT_REFRESH_SECRET || 'refresh_secret',
    { expiresIn: (process.env.JWT_REFRESH_EXPIRE || '7d') as any }
  );

  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET || 'access_secret');
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'refresh_secret');
};

export const generateRegistrationToken = (email: string, phone: string) => {
  return jwt.sign(
    { email, phone, purpose: 'registration' },
    process.env.JWT_SECRET || 'access_secret',
    { expiresIn: '30m' }
  );
};
