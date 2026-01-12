import { z } from 'zod';
import { UserRole, Department, StaffShiftType } from '@prisma/client';

export const registerInitiateSchema = z.object({
  email: z.string().email(),
  phoneNumber: z.string().min(10),
});

export const verifyOTPSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
});

export const registerCompleteSchema = z.object({
  registrationToken: z.string(), // Token received after verify OTP
  password: z.string().min(6), // In real app, enforce complexity
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  role: z.nativeEnum(UserRole),
  // Doctor fields
  specialization: z.string().optional(),
  licenseNumber: z.string().optional(),
  // Staff fields
  department: z.nativeEnum(Department).optional(),
  employeeId: z.string().optional(),
  shiftType: z.nativeEnum(StaffShiftType).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(), // Or phone
  password: z.string(),
});

export const loginVerifySchema = z.object({
  userId: z.string(),
  otp: z.string().length(6),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
  newPassword: z.string().min(8).regex(/[A-Z]/, "Must contain one uppercase letter").regex(/[0-9]/, "Must contain one number"),
});
