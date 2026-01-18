import prisma from '../prisma';
import { otpCache } from '../config/redis';
import crypto from 'crypto';

// Cryptographically secure OTP generation
export const generateOTP = (): string => {
  // Use crypto for secure random generation (better than Math.random)
  const buffer = crypto.randomBytes(3); // 3 bytes = 6 hex digits
  const otp = (buffer.readUIntBE(0, 3) % 900000) + 100000;
  return otp.toString();
};

// Fast OTP generation alternative (for high throughput)
export const generateOTPFast = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via SMS/Email (integrate with Twilio/SES in production)
export const sendOTP = async (contact: string, otp: string, method: 'SMS' | 'EMAIL') => {
  // In production, integrate with:
  // - Twilio for SMS
  // - AWS SES or Nodemailer for Email
  // For now, we simulate sending by logging
  console.log(`[${method}] Sending OTP ${otp} to ${contact}`);
  
  // Simulate async SMS/Email sending (non-blocking)
  // In production, this would be:
  // if (method === 'SMS') {
  //   await twilioClient.messages.create({
  //     body: `Your DocVista OTP is: ${otp}. Valid for 5 minutes.`,
  //     to: contact,
  //     from: process.env.TWILIO_PHONE_NUMBER
  //   });
  // }
  
  return true;
};

// Create OTP verification in database (for audit trail)
export const createOTPVerification = async (userId: string, otp: string) => {
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + 5); // 5 minutes expiry

  try {
  await prisma.otpVerification.create({
    data: {
      userId,
      otpCode: otp,
      otpExpiry: expiry,
    },
  });
  } catch (error) {
    console.error('Error creating OTP verification:', error);
    // Don't throw - OTP is cached in Redis, DB is just for audit
  }
};

// Verify OTP from database (fallback if Redis fails)
export const verifyOTPFromDB = async (userId: string, otp: string): Promise<boolean> => {
  try {
    const verification = await prisma.otpVerification.findFirst({
      where: {
        userId,
        otpCode: otp,
        isUsed: false,
        otpExpiry: {
          gt: new Date(),
        },
      },
      orderBy: {
        otpExpiry: 'desc',
      },
    });

    if (verification) {
      // Mark as used
      await prisma.otpVerification.update({
        where: { id: verification.id },
        data: { isUsed: true },
      });
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error verifying OTP from DB:', error);
    return false;
  }
};
