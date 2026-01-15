import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithPassword, isLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<'patient' | 'staff'>('patient');
  
  // Staff / Password State
  const [staffId, setStaffId] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState<{ staffId?: string; password?: string }>({});

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

  const handleGoogleLogin = () => {
    window.open('http://localhost:5001/api/auth/google', '_self');
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
              {activeTab === 'patient' ? 'Welcome Back' : 'Staff Portal'}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 text-sm font-medium"
            >
              {activeTab === 'patient'
                ? 'Sign in with your Google account'
                : 'Enter your Staff ID and Password'
              }
            </motion.p>
          </div>

          {/* Tabs */}
          <div className="flex p-1 bg-white/40 rounded-xl mb-8 backdrop-blur-sm border border-white/20">
              <button
                onClick={() => { setActiveTab('patient'); setErrors({}); }}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${activeTab === 'patient' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
              >
                  Guest/Patient
              </button>
              <button
                onClick={() => { setActiveTab('staff'); setErrors({}); }}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${activeTab === 'staff' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
              >
                  Hospital Staff
              </button>
          </div>

          {/* Form */}
          <AnimatePresence mode="wait">
            {activeTab === 'patient' ? (
                // PATIENT FLOW - Google OAuth Only
                <motion.div
                    key="patient"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5"
                >
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full h-14 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:shadow-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-3"
                    >
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                        Continue with Google
                    </motion.button>

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
                // STAFF FLOW - Staff ID + Password
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
                                onKeyPress={(e) => e.key === 'Enter' && handleStaffLogin()}
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
                                onKeyPress={(e) => e.key === 'Enter' && handleStaffLogin()}
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
