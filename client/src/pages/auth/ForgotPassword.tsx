import { useState } from 'react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import { Loader2, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import libAxios from '@/lib/axios';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await libAxios.post('/auth/forgot-password', { email });
      toast.success('Reset code sent to your email');
      setStep('otp');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Failed to send OTP');
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await libAxios.post('/auth/reset-password', { email, otp, newPassword });
      toast.success('Password reset successfully');
      navigate('/login');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Failed to reset password');
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title={step === 'email' ? "Forgot Password?" : step === 'otp' ? "Verify Account" : "Reset Password"} 
      subtitle={
        step === 'email' ? "No worries! Enter your email and we'll send a reset code." :
        step === 'otp' ? `We've sent a 6-digit code to ${email}` :
        "Enter your new strong password below. Use numbers and uppercase for security."
      }
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {step === 'email' && (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-2xl h-12 bg-white/5 border-white/10"
                />
              </div>
              
              <Button type="submit" className="w-full h-12 bg-linear-to-r from-ios-blue to-ios-indigo text-white font-semibold rounded-2xl shadow-lg" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Send Reset Code'}
              </Button>
            </form>
          )}

          {(step === 'otp' || step === 'reset') && (
            <form onSubmit={step === 'otp' ? (e) => { e.preventDefault(); setStep('reset'); } : handleResetPassword} className="space-y-6">
              {step === 'otp' && (
                <div className="space-y-2 text-center">
                  <div className="flex justify-center mb-4">
                    <ShieldCheck className="w-12 h-12 text-ios-blue" />
                  </div>
                  <Label htmlFor="otp" className="text-sm font-medium">Enter 6-Digit Code</Label>
                  <Input 
                    id="otp" 
                    type="text" 
                    maxLength={6}
                    placeholder="123456" 
                    required 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="rounded-2xl h-14 text-center text-2xl tracking-[0.5em] bg-white/5 border-white/10"
                  />
                  <Button type="submit" className="w-full h-12 bg-ios-blue text-white font-semibold rounded-2xl" disabled={loading}>
                    Verify Code
                  </Button>
                </div>
              )}

              {step === 'reset' && (
                <div className="space-y-6">
                   <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input 
                      id="newPassword" 
                      type="password" 
                      required 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="rounded-2xl h-12 bg-white/5 border-white/10"
                      placeholder="••••••••"
                    />
                    <div className="text-[10px] text-muted-foreground mt-1">
                        Must be 8+ chars, include an uppercase letter and a number.
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full h-12 bg-linear-to-r from-ios-green to-ios-teal text-white font-semibold rounded-2xl shadow-lg" disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Update Password'}
                  </Button>
                </div>
              )}
            </form>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 text-center">
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Login
        </Link>
      </div>
    </AuthLayout>
  );
};
