import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Phone, Stethoscope } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { OTPInput } from '@/components/auth/OTPInput';
import { Input } from '@/components/ui/input';
import { validators } from '@/utils/validators';

type LoginStep = 'phone' | 'otp';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { sendOTP, login, loginWithPassword, isLoading } = useAuth(); // Extended hook

  const [activeTab, setActiveTab] = useState<'patient' | 'staff'>('patient');

  // Patient / OTP State
  const [step, setStep] = useState<LoginStep>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOTP] = useState('');
  
  // Staff / Password State
  const [staffId, setStaffId] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState<{ phone?: string; otp?: string; staffId?: string; password?: string }>({});

  const handleSendOTP = async () => {
    const phoneError = validators.phone(phoneNumber);
    if (phoneError) {
      setErrors({ phone: phoneError });
      return;
    }
    setErrors({});
    const success = await sendOTP(phoneNumber);
    if (success) {
      setStep('otp');
    }
  };

  const handleVerifyOTP = async () => {
    const otpError = validators.otp(otp);
    if (otpError) {
      setErrors({ otp: otpError });
      return;
    }
    setErrors({});
    const success = await login({ identifier: phoneNumber, otp });
    if (success) {
      navigate('/dashboard');
    }
  };

  const handleOTPComplete = (value: string) => {
    setOTP(value);
    setTimeout(() => {
      if (value.length === 6) {
        handleVerifyOTP();
      }
    }, 300);
  };

  const handleStaffLogin = async () => {
      if (!staffId || !password) {
          setErrors({
              staffId: !staffId ? 'Staff ID is required' : undefined,
              password: !password ? 'Password is required' : undefined
          });
          return;
      }
      setErrors({});
      const success = await loginWithPassword(staffId, password);
      if (success) {
          navigate('/dashboard');
      }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden font-sans">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 w-full h-full">
        <img 
          src="/images/login-bg.jpg" 
          alt="Medical background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-br from-blue-900/40 via-blue-800/20 to-transparent backdrop-blur-[2px]" />
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="bg-linear-to-b from-white/10 to-transparent backdrop-blur-3xl rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.1),inset_0_1px_0_0_rgba(255,255,255,0.2)] p-8 md:p-10 border border-white/20 ring-1 ring-white/10">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 20 }}
            className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.1),0_0_20px_rgba(34,211,238,0.15)] border-2 border-cyan-400/30 backdrop-blur-md"
          >
            <Stethoscope className="w-10 h-10 text-white drop-shadow-md" />
          </motion.div>

          {/* Header */}
          <div className="text-center mb-8">
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-gray-900 mb-2 tracking-tight"
            >
              {activeTab === 'patient' 
                ? (step === 'phone' ? 'Welcome Back' : 'Verify Access')
                : 'Staff Portal'
              }
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 text-sm font-medium"
            >
              {activeTab === 'patient'
                ? (step === 'phone' ? 'Sign in to access your dashboard' : `We sent a code to ${phoneNumber}`)
                : 'Enter your Staff ID and Password'
              }
            </motion.p>
          </div>

          {/* Tabs */}
          <div className="flex p-1 bg-white/40 rounded-xl mb-8 backdrop-blur-sm border border-white/20">
              <button
                onClick={() => { setActiveTab('patient'); setErrors({}); }}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${activeTab === 'patient' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
              >
                  Guest/Patient
              </button>
              <button
                onClick={() => { setActiveTab('staff'); setErrors({}); }}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${activeTab === 'staff' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
              >
                  Hospital Staff
              </button>
          </div>

          {/* Form */}
          <AnimatePresence mode="wait">
            {activeTab === 'patient' ? (
                // PATIENT FLOW
                step === 'phone' ? (
                <motion.div
                    key="phone"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5"
                >
                    <div>
                    <div className="relative group">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                        <Input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => {
                            setPhoneNumber(e.target.value);
                            setErrors({});
                        }}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendOTP()}
                        placeholder="Mobile Number"
                        className={`h-14 pl-12 bg-white/50 border-gray-200/60 focus:bg-white transition-all ring-offset-0 focus:ring-2 focus:ring-blue-500/20 rounded-xl ${errors.phone ? 'border-red-500 focus:ring-red-500/20' : ''}`}
                        />
                    </div>
                    {errors.phone && (
                        <p className="text-sm text-red-600 mt-2 font-medium ml-1">{errors.phone}</p>
                    )}
                    </div>

                    <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSendOTP}
                    disabled={isLoading || !phoneNumber}
                    className="w-full h-14 bg-linear-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                    >
                    {isLoading ? 'Sending...' : 'Get OTP'}
                    </motion.button>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300/20"></div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <button
                            type="button"
                            onClick={() => window.open('http://localhost:5001/api/auth/google', '_self')}
                            className="w-full h-14 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:shadow-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-3"
                        >
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                            Continue with Google
                        </button>
                    </div>

                    <div className="text-center text-sm text-gray-600 mt-6">
                        New to Docvista?{' '}
                        <button
                            onClick={() => navigate('/register')}
                            className="text-blue-600 font-bold hover:text-blue-700 transition-colors hover:underline decoration-2 underline-offset-4"
                        >
                            Create Account
                        </button>
                    </div>
                </motion.div>
                ) : (
                <motion.div
                    key="otp"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                >
                    <div>
                    <div className="flex justify-center">
                        <OTPInput
                        value={otp}
                        onChange={setOTP}
                        onComplete={handleOTPComplete}
                        error={!!errors.otp}
                        />
                    </div>
                    {errors.otp && (
                        <p className="text-sm text-red-600 mt-4 text-center font-medium">{errors.otp}</p>
                    )}
                    </div>

                    <div className="flex gap-3">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                        setStep('phone');
                        setOTP('');
                        setErrors({});
                        }}
                        disabled={isLoading}
                        className="flex-1 h-12 border border-gray-200/60 rounded-xl font-medium text-gray-700 hover:bg-white/60 transition-colors bg-white/40"
                    >
                        Change
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleVerifyOTP}
                        disabled={isLoading || otp.length !== 6}
                        className="flex-1 h-12 bg-linear-to-r from-gray-900 to-gray-800 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                    >
                        {isLoading ? 'Verifying...' : 'Verify'}
                    </motion.button>
                    </div>

                    <div className="text-center">
                    <button
                        type="button"
                        onClick={handleSendOTP}
                        disabled={isLoading}
                        className="text-sm text-gray-600 hover:text-gray-900 font-semibold hover:underline decoration-2 underline-offset-4 disabled:opacity-50"
                    >
                        Resend Code
                    </button>
                    </div>
                </motion.div>
                )
            ) : (
                // STAFF FLOW
                <motion.div
                    key="staff"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5"
                >
                    <div className="space-y-4">
                        <div>
                             <Input
                                type="text"
                                value={staffId}
                                onChange={(e) => setStaffId(e.target.value)}
                                placeholder="Staff ID / Employee ID"
                                className={`h-14 pl-4 bg-white/50 border-gray-200/60 focus:bg-white transition-all ring-offset-0 focus:ring-2 focus:ring-blue-500/20 rounded-xl ${errors.staffId ? 'border-red-500 focus:ring-red-500/20' : ''}`}
                            />
                            {errors.staffId && <p className="text-sm text-red-600 mt-1 ml-1">{errors.staffId}</p>}
                        </div>
                        <div>
                             <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className={`h-14 pl-4 bg-white/50 border-gray-200/60 focus:bg-white transition-all ring-offset-0 focus:ring-2 focus:ring-blue-500/20 rounded-xl ${errors.password ? 'border-red-500 focus:ring-red-500/20' : ''}`}
                            />
                            {errors.password && <p className="text-sm text-red-600 mt-1 ml-1">{errors.password}</p>}
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleStaffLogin}
                        disabled={isLoading}
                        className="w-full h-14 bg-linear-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-50"
                    >
                        {isLoading ? 'Logging in...' : 'Login to Dashboard'}
                    </motion.button>
                </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
