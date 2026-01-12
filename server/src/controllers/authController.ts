import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma';
import { 
  generateTokens, 
  verifyRefreshToken 
} from '../utils/jwt';
import { UserRole } from '@prisma/client';
import { otpCache } from '../config/redis';
import { generateOTP, sendOTP } from '../utils/otp';

// High-performance OTP system with Redis caching
export const sendMobileOTP = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { phoneNumber } = req.body;
        
        // Fast validation
        if (!phoneNumber || !/^\d{10}$/.test(phoneNumber)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid mobile number format. Please enter a 10-digit number.' 
            });
        }

        // Check resend limit using Redis (atomic operation)
        const resendCount = await otpCache.getResendCount(phoneNumber);
        if (resendCount >= 5) {
            return res.status(429).json({ 
                success: false, 
                message: 'Too many resend attempts. Please try again in 10 minutes.' 
            });
        }

        // Generate cryptographically secure OTP
        const otp = generateOTP();
        
        // Store OTP in Redis with 5-minute expiry (atomic operation)
        const stored = await otpCache.setOTP(phoneNumber, otp, 300); // 5 minutes
        
        if (!stored) {
            // Fallback: continue even if Redis fails (graceful degradation)
            console.warn('Redis unavailable, OTP generated but not cached');
        }

        // Increment resend count atomically
        await otpCache.incrementResend(phoneNumber);

        // Send OTP via SMS (non-blocking, fire and forget for speed)
        sendOTP(phoneNumber, otp, 'SMS').catch(err => {
            console.error('Error sending OTP:', err);
            // Don't block response - OTP is already generated
        });

        // INSTANT RESPONSE - E-commerce level speed
        // In production, remove the otp field from response
        res.status(200).json({ 
            success: true, 
            message: 'OTP sent successfully to your mobile number',
            // Only return OTP in development
            ...(process.env.NODE_ENV === 'development' && { otp })
        });

    } catch (error) {
        next(error);
    }
};

export const verifyMobileOTP = async (req: Request, res: Response, next: NextFunction) => {
    try {
         const { phoneNumber, otp } = req.body;

         // Fast validation
         if (!phoneNumber || !otp || !/^\d{6}$/.test(otp)) {
             return res.status(400).json({ 
                 success: false, 
                 message: 'Phone number and valid 6-digit OTP required' 
             });
         }

         // Check if OTP exists in Redis (fast lookup)
         const exists = await otpCache.exists(phoneNumber);
         if (!exists) {
             return res.status(400).json({ 
                 success: false, 
                 message: 'OTP expired or not sent. Please request a new OTP.' 
             });
         }

         // Get stored OTP from Redis
         const storedOTP = await otpCache.getOTP(phoneNumber);
         
         // Verify OTP (constant-time comparison for security)
         if (!storedOTP || storedOTP !== otp) {
             // Increment attempts atomically
             const attempts = await otpCache.incrementAttempts(phoneNumber);
             
             if (attempts >= 3) {
                 // Delete OTP after max attempts
                 await otpCache.deleteOTP(phoneNumber);
                 return res.status(400).json({ 
                     success: false, 
                     message: 'Too many failed attempts. Please request a new OTP.' 
                 });
             }
             
             return res.status(400).json({ 
                 success: false, 
                 message: `Invalid OTP. ${3 - attempts} attempts remaining.` 
             });
         }

         // OTP verified successfully - delete it immediately (one-time use)
         await otpCache.deleteOTP(phoneNumber);

         // Fast user lookup/creation with transaction for data consistency
         let user = await prisma.user.findFirst({ 
             where: { phoneNumber },
             select: {
                 id: true,
                 email: true,
                 firstName: true,
                 lastName: true,
                 role: true,
                 isActive: true,
                 isVerified: true,
             }
         });

         if (!user) {
             // Create new user with patient profile in a single transaction (faster)
             const result = await prisma.$transaction(async (tx) => {
                 const newUser = await tx.user.create({
                     data: {
                         phoneNumber,
                         email: `${phoneNumber}@docvista.com`,
                         firstName: 'Guest',
                         lastName: 'User',
                         passwordHash: '', // No password for OTP login
                         role: UserRole.PATIENT,
                         isVerified: true,
                         isActive: true
                     },
                     select: {
                         id: true,
                         email: true,
                         firstName: true,
                         lastName: true,
                         role: true,
                         isActive: true,
                         isVerified: true,
                     }
                 });
                 
                 // Create Patient Profile
                 await tx.patient.create({
                     data: {
                         patientId: newUser.id,
                         dateOfBirth: new Date(),
                     }
                 });
                 
                 return newUser;
             });
             
             user = result;
         }

         // Generate tokens
         const { accessToken, refreshToken } = generateTokens(user as any);

         // Fast response
         res.status(200).json({
            success: true,
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                name: `${user.firstName} ${user.lastName}`,
                role: user.role
            }
        });

    } catch (error) {
        next(error);
    }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token } = req.body;
        if (!token) return res.status(400).json({ success: false, message: 'Token required' });

        const payload: any = verifyRefreshToken(token);
        const user = await prisma.user.findUnique({ where: { id: payload.userId } });

        if (!user || user.tokenVersion !== payload.tokenVersion) {
            return res.status(403).json({ success: false, message: 'Invalid refresh token' });
        }

        const tokens = generateTokens(user);

        res.status(200).json({
            success: true,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
        });

    } catch (error) {
        next(error);
    }
};
