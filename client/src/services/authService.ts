
import axios from 'axios';
import { OTPVerification, RegistrationData, ApiResponse, LoginResponse } from '@/types/auth';

// Direct connection to backend (bypass proxy for debugging)
const API_URL = 'http://127.0.0.1:5001/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for CORS
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authService = {
  // Send OTP
  sendOTP: async (identifier: string): Promise<ApiResponse<{ otp?: string }>> => {
    try {
      // Use the high-performance mobile OTP endpoint
      const response = await api.post('/auth/send-otp', {
        phoneNumber: identifier
      });
      return response.data;
    } catch (error: any) {
      console.error('Send OTP Error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to send OTP'
      };
    }
  },

  // Verify OTP for Login
  verifyOTP: async (verification: OTPVerification): Promise<ApiResponse<LoginResponse>> => {
    try {
      const response = await api.post('/auth/verify-otp', {
        phoneNumber: verification.identifier,
        otp: verification.otp
      });
      return response.data;
    } catch (error: any) {
      console.error('Verify OTP Error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to verify OTP'
      };
    }
  },

  // Verify OTP for Registration
  verifyOTPOnly: async (verification: OTPVerification): Promise<ApiResponse<{ message: string }>> => {
    try {
        const response = await api.post('/auth/verify-otp-registration', {
            phoneNumber: verification.identifier,
            otp: verification.otp
        });
        return response.data;
    } catch (error: any) {
        console.error('Verify OTP Only Error:', error);
        return {
            success: false,
            error: error.response?.data?.message || 'Failed to verify OTP'
        };
    }
  },

  // Login with Password (Staff)
  loginWithPassword: async (identifier: string, password: string): Promise<ApiResponse<LoginResponse>> => {
      try {
          const response = await api.post('/auth/login', {
              identifier,
              password
          });
          return response.data;
      } catch (error: any) {
          console.error('Login Error:', error);
          return {
              success: false,
              error: error.response?.data?.message || 'Login failed'
          };
      }
  },

  // Register
  register: async (data: RegistrationData): Promise<ApiResponse<any>> => {
    try {
      const response = await api.post('/auth/register', data);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed'
      };
    }
  },
  
  // Check Google Auth Session
  checkAuthSession: async (): Promise<ApiResponse<LoginResponse>> => {
      try {
          const response = await api.get('/auth/login/success');
          return response.data;
      } catch (error: any) {
          // Silent fail usually
          return { success: false, error: 'Not authenticated' };
      }
  },
  
  // Logout
  logout: async (): Promise<ApiResponse<{ message: string }>> => {
      try {
          const response = await api.get('/auth/logout');
          return response.data;
      } catch (error: any) {
          return { success: false, error: 'Logout failed' };
      }
  }
};
