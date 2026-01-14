import { User, RegistrationData, OTPVerification, ApiResponse, LoginResponse } from '@/types/auth';

// Simulated database
let users: User[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@docvista.com',
    phone: '+1234567890',
    role: 'doctor',
    createdAt: new Date('2024-01-01'),
    doctorData: {
      employeeId: 'DOC001',
      specialization: 'Cardiology',
      qualifications: 'MD, FACC',
      roomNumber: '301'
    }
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1987654321',
    role: 'patient',
    createdAt: new Date('2024-01-15'),
    patientData: {
      age: 35,
      bloodGroup: 'O+',
      emergencyContact: '+1555123456',
      medicalHistory: 'No known allergies'
    }
  }
];

// OTP storage (identifier -> OTP)
const otpStore = new Map<string, string>();

// Session duration (30 minutes)
const SESSION_DURATION = 30 * 60 * 1000;

// Simulate API delay (faster for better UX)
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Generate 6-digit OTP
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP (simulated)
export const sendOTP = async (identifier: string): Promise<ApiResponse<{ otp: string }>> => {
  await delay();
  
  // Validate identifier
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
  const isPhone = /^\+?[\d\s-()]+$/.test(identifier);
  
  if (!isEmail && !isPhone) {
    return {
      success: false,
      error: 'Invalid email or phone number'
    };
  }
  
  // Generate and store OTP
  const otp = generateOTP();
  otpStore.set(identifier, otp);
  
  // Auto-expire OTP after 5 minutes
  setTimeout(() => {
    otpStore.delete(identifier);
  }, 5 * 60 * 1000);
  
  console.log(`[Mock Backend] OTP for ${identifier}: ${otp}`);
  
  return {
    success: true,
    data: { otp }, // In production, don't return OTP
    message: 'OTP sent successfully'
  };
};

// Verify OTP and login
export const verifyOTP = async (verification: OTPVerification): Promise<ApiResponse<LoginResponse>> => {
  await delay();
  
  const storedOTP = otpStore.get(verification.identifier);
  
  if (!storedOTP) {
    return {
      success: false,
      error: 'OTP expired or not found. Please request a new one.'
    };
  }
  
  if (storedOTP !== verification.otp) {
    return {
      success: false,
      error: 'Invalid OTP. Please try again.'
    };
  }
  
  // Find user by phone or email
  const user = users.find(
    u => u.phone === verification.identifier || u.email === verification.identifier
  );
  
  if (!user) {
    return {
      success: false,
      error: 'User not found. Please register first.'
    };
  }
  
  // Clear OTP
  otpStore.delete(verification.identifier);
  
  // Create session
  const sessionExpiry = new Date(Date.now() + SESSION_DURATION);
  
  return {
    success: true,
    data: {
      user,
      sessionExpiry
    },
    message: 'Login successful'
  };
};

// Register new user
export const registerUser = async (data: RegistrationData): Promise<ApiResponse<User>> => {
  await delay();
  
  // Check if user already exists
  const existingUser = users.find(
    u => u.email === data.email || u.phone === data.phone
  );
  
  if (existingUser) {
    return {
      success: false,
      error: 'User with this email or phone already exists'
    };
  }
  
  // Create new user
  const newUser: User = {
    id: `user_${Date.now()}`,
    name: data.name,
    email: data.email,
    phone: data.phone,
    role: data.role,
    profilePhoto: data.profilePhoto,
    createdAt: new Date(),
    patientData: data.patientData as any,
    doctorData: data.doctorData as any,
    staffData: data.staffData as any
  };
  
  users.push(newUser);
  
  return {
    success: true,
    data: newUser,
    message: 'Registration successful'
  };
};

// Get user by ID
export const getUserById = async (id: string): Promise<ApiResponse<User>> => {
  await delay(200);
  
  const user = users.find(u => u.id === id);
  
  if (!user) {
    return {
      success: false,
      error: 'User not found'
    };
  }
  
  return {
    success: true,
    data: user
  };
};

// Check if identifier exists
export const checkIdentifierExists = async (identifier: string): Promise<boolean> => {
  await delay(300);
  return users.some(u => u.email === identifier || u.phone === identifier);
};
