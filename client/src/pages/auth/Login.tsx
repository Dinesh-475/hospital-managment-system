import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import { Loader2, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import libAxios from '@/lib/axios';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/store/authSlice';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.warning('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const res = await libAxios.post('/auth/login', { email, password });
      const { user, accessToken, refreshToken } = res.data;

      dispatch(setCredentials({ user, token: accessToken, refreshToken }));
      toast.success('Welcome back!');
      navigate('/');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Login failed');
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-pastel-blue p-4 relative overflow-hidden">
      
      {/* Organic Background Blobs */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-300 blob-shape animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-purple-300 blob-shape animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute top-[40%] left-[10%] w-[400px] h-[400px] bg-indigo-200 blob-shape animate-pulse" style={{ animationDelay: '4s' }} />

      {/* Main Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[1100px] min-h-[650px] flex rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10"
      >
        
        {/* Left Side - 3D Illustration */}
        <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-blue-50 to-purple-50 items-center justify-center p-12 relative">
          <div className="absolute top-6 left-6 flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
            <span className="text-xl">👋</span>
            <span className="text-xs font-semibold text-gray-700">AI-generated</span>
          </div>
          
          <img 
            src="/images/login-illustration.png"
            alt="Login Illustration"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 card-white flex items-center justify-center p-8 md:p-12">
          <div className="w-full max-w-[400px] space-y-8">
            
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-gray-900">Login</h1>
              <p className="text-sm text-gray-500">Welcome back! Please login to your account.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Enter your email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="login-input h-14 pl-12 pr-4 text-base"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input 
                    id="password" 
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="login-input h-14 pl-12 pr-12 text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-14 rounded-xl bg-linear-to-r from-[#4A6FFF] to-[#5E7FFF] hover:from-[#3D5CE0] hover:to-[#4E6FEF] text-white font-semibold text-base shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {loading ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Login
                    <ArrowRight className="w-5 h-5" />
                  </span>
                )}
              </Button>

              {/* Forgot Password Link */}
              <div className="text-center pt-2">
                <button 
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-sm font-medium text-[#4A6FFF] hover:text-[#3D5CE0] transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            </form>

            {/* Sign Up Link */}
            <div className="text-center pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button 
                  onClick={() => navigate('/register')}
                  className="font-semibold text-[#4A6FFF] hover:text-[#3D5CE0] transition-colors"
                >
                  Sign Up
                </button>
              </p>
            </div>

          </div>
        </div>

      </motion.div>
    </div>
  );
};
