// User roles
export type UserRole = 'patient' | 'doctor' | 'staff' | 'manager' | 'admin';

// Base user interface
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  profilePhoto?: string;
  createdAt: Date;
  
  // Role-specific data
  patientData?: PatientData;
  doctorData?: DoctorData;
  staffData?: StaffData;
}

// Role-specific interfaces
export interface PatientData {
  age: number;
  bloodGroup: string;
  emergencyContact: string;
  medicalHistory: string;
}

export interface DoctorData {
  employeeId: string;
  specialization: string;
  qualifications: string;
  roomNumber: string;
}

export interface StaffData {
  employeeId: string;
  department: string;
  position: string;
}

// Auth state
export interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  sessionExpiry: Date | null;
  isLoading: boolean;
}

// Registration form data
export interface RegistrationData {
  // Step 1: Basic Info
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  
  // Step 2: Role-specific
  patientData?: Partial<PatientData>;
  doctorData?: Partial<DoctorData>;
  staffData?: Partial<StaffData>;
  
  // Step 3: Profile Photo
  profilePhoto?: string;
}

// OTP verification
export interface OTPVerification {
  identifier: string; // phone or email
  otp: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface LoginResponse {
  user: User;
  sessionExpiry: Date;
}
