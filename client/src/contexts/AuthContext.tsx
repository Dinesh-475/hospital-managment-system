import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { AuthState, OTPVerification, RegistrationData, ApiResponse, LoginResponse } from '@/types/auth';
// Switch to real backend service
import { authService } from '@/services/authService';
import { toast } from 'sonner';

interface AuthContextType extends AuthState {
  sendOTP: (identifier: string) => Promise<boolean>;
  login: (verification: OTPVerification) => Promise<boolean>;
  loginWithPassword: (identifier: string, password: string) => Promise<boolean>;
  verifyRegistrationOTP: (phoneNumber: string, otp: string) => Promise<boolean>;
  register: (data: RegistrationData) => Promise<boolean>;
  checkSession: () => boolean;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes
const WARNING_TIME = 5 * 60 * 1000; // 5 minutes before expiry

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    currentUser: null,
    isAuthenticated: false,
    sessionExpiry: null,
    isLoading: false
  });

  // Check for existing session (e.g. Google Auth) on mount
  useEffect(() => {
    const initAuth = async () => {
        try {
            const response = await authService.checkAuthSession();
            if (response.success && response.data?.user) {
                const userData = response.data.user;
                setAuthState({
                    currentUser: userData,
                    isAuthenticated: true,
                    sessionExpiry: new Date(Date.now() + SESSION_DURATION),
                    isLoading: false
                });
            }
        } catch {
            // No session
        }
    };
    initAuth();
  }, []);



  // Logout
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore error, just clear local state
    }
    
    setAuthState({
      currentUser: null,
      isAuthenticated: false,
      sessionExpiry: null,
      isLoading: false
    });
    toast.info('Logged out successfully');
  }, []);

  // Check session validity
  const checkSession = useCallback((): boolean => {
    if (!authState.sessionExpiry) return false;
    
    const now = new Date();
    const expiry = new Date(authState.sessionExpiry);
    
    if (now >= expiry) {
      // Session expired
      logout();
      toast.error('Session expired. Please login again.');
      return false;
    }
    
    // Check if warning needed
    const timeRemaining = expiry.getTime() - now.getTime();
    if (timeRemaining <= WARNING_TIME && timeRemaining > WARNING_TIME - 1000) {
      toast.warning('Your session will expire in 5 minutes');
    }
    
    return true;
  }, [authState.sessionExpiry, logout]);

  // Auto-logout on session expiry
  useEffect(() => {
    if (!authState.sessionExpiry) return;
    
    const checkInterval = setInterval(() => {
      checkSession();
    }, 60000); // Check every minute
    
    return () => clearInterval(checkInterval);
  }, [authState.sessionExpiry, checkSession]);

  // Send OTP
  const sendOTP = async (identifier: string): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const response = await authService.sendOTP(identifier);
      
      if (response.success) {
        toast.success(response.message || 'OTP sent successfully');
        
        // Show OTP to user if provided (Dev Mode support from backend)
        // Show OTP to user if provided (Dev Mode support from backend)
        const responseData = response as ApiResponse<{ otp?: string }>;
        if (responseData.data?.otp) {
             const otp = responseData.data.otp;
             console.log('✅ Server OTP:', otp);
             toast.info(`Dev OTP: ${otp}`, { duration: 10000 });
        }
        
        return true;
      } else {
        toast.error(response.error || 'Failed to send OTP');
        return false;
      }
    } catch {
      toast.error('Connection failed. Is the server running?');
      return false;
    } finally {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Login with OTP
  const login = async (verification: OTPVerification): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const response = await authService.verifyOTP(verification);
      
      const data = response as ApiResponse<LoginResponse>;
      
      if (response.success) {
        const userData = data.data?.user;
        
        if (userData) {
            const sessionExpiry = new Date(Date.now() + SESSION_DURATION);
            
            setAuthState({
              currentUser: userData,
              isAuthenticated: true,
              sessionExpiry: sessionExpiry,
              isLoading: false
            });
            
            toast.success(`Welcome back, ${userData.name || 'User'}!`);
            return true;
        }
      } 
      
      toast.error(response.error || 'Login failed');
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return false;

    } catch {
      toast.error('An error occurred. Please try again.');
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  // Login with Password (Staff)
  const loginWithPassword = async (identifier: string, password: string): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
        const response = await authService.loginWithPassword(identifier, password);
        const data = response as ApiResponse<LoginResponse>;

        if (response.success) {
             const userData = data.data?.user;
        
             if (userData) {
                 const sessionExpiry = new Date(Date.now() + SESSION_DURATION);
                 
                 setAuthState({
                   currentUser: userData,
                   isAuthenticated: true,
                   sessionExpiry: sessionExpiry,
                   isLoading: false
                 });
                 
                 toast.success(`Welcome back, ${userData.name || 'User'}!`);
                 return true;
             }
        }

        toast.error(response.error || 'Login failed');
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return false;
    } catch {
        toast.error('An error occurred during login');
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return false;
    }
  };

  // Verify Registration OTP
  const verifyRegistrationOTP = async (phoneNumber: string, otp: string): Promise<boolean> => {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      try {
          const response = await authService.verifyOTPOnly({ identifier: phoneNumber, otp });
          if (response.success) {
              toast.success('Phone verified successfully');
              return true;
          } else {
              toast.error(response.error || 'Verification failed');
              return false;
          }
      } catch {
          toast.error('Verification error');
          return false;
      } finally {
          setAuthState(prev => ({ ...prev, isLoading: false }));
      }
  };

  // Register new user
  const register = async (data: RegistrationData): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const response = await authService.register(data);
      
      if (response.success) {
         toast.success('Registration successful. Please login.');
         return true;
      } else {
        toast.error(response.error || 'Registration failed');
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return false;
      }
    } catch {
      toast.error('An error occurred. Please try again.');
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };



  const value: AuthContextType = {
    ...authState,
    sendOTP,
    login,
    loginWithPassword,
    verifyRegistrationOTP,
    register,
    logout,
    checkSession
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
