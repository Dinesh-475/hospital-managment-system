import React from 'react';
import { motion } from 'framer-motion';
import { UserRole } from '@/types/auth';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RoleSelector } from '@/components/auth/RoleSelector';
import { Button } from '@/components/ui/button';
import { Check, Loader2 } from 'lucide-react';
import { OTPInput } from '@/components/auth/OTPInput';

interface BasicInfoProps {
  data: {
    name: string;
    email: string;
    phone: string;
    role: UserRole | null;
  };
  onChange: (field: string, value: any) => void;
  errors: Record<string, string>;
  
  // OTP Props
  isPhoneVerified?: boolean;
  otpSent?: boolean;
  otp?: string;
  onOtpChange?: (otp: string) => void;
  onSendOTP?: () => void;
  onVerifyOTP?: () => void;
  isLoading?: boolean;
}

export const BasicInfo: React.FC<BasicInfoProps> = ({ 
    data, 
    onChange, 
    errors,
    isPhoneVerified,
    otpSent,
    otp,
    onOtpChange,
    onSendOTP,
    onVerifyOTP,
    isLoading
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Information</h2>
        <p className="text-gray-600">Let's start with your basic details</p>
      </div>

      <div>
        <Label className="text-sm font-semibold text-gray-700 mb-2 block">
          Full Name
        </Label>
        <Input
          type="text"
          value={data.name}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="John Doe"
          className={`h-12 ${errors.name ? 'border-red-500' : ''}`}
        />
        {errors.name && (
          <p className="text-sm text-red-600 mt-1">{errors.name}</p>
        )}
      </div>

      <div>
        <Label className="text-sm font-semibold text-gray-700 mb-2 block">
          Email Address
        </Label>
        <Input
          type="email"
          value={data.email}
          onChange={(e) => onChange('email', e.target.value)}
          placeholder="your.email@example.com"
          className={`h-12 ${errors.email ? 'border-red-500' : ''}`}
        />
        {errors.email && (
          <p className="text-sm text-red-600 mt-1">{errors.email}</p>
        )}
      </div>

      <div>
        <Label className="text-sm font-semibold text-gray-700 mb-2 block">
          Phone Number
        </Label>
        <div className="flex gap-3">
            <div className="relative flex-1">
                <Input
                type="tel"
                value={data.phone}
                onChange={(e) => onChange('phone', e.target.value)}
                placeholder="9876543210"
                disabled={isPhoneVerified}
                className={`h-12 ${errors.phone ? 'border-red-500' : ''} ${isPhoneVerified ? 'bg-green-50 text-green-700 border-green-200' : ''}`}
                />
                {isPhoneVerified && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600">
                        <Check className="w-5 h-5" />
                    </div>
                )}
            </div>
            
            {!isPhoneVerified && onSendOTP && !otpSent && (
                <Button 
                    type="button" 
                    onClick={onSendOTP}
                    disabled={!data.phone || data.phone.length < 10 || isLoading}
                    className="h-12 px-6"
                >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify'}
                </Button>
            )}
        </div>
        
        {errors.phone && (
          <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
        )}
        
        {/* OTP Input Section */}
        {otpSent && !isPhoneVerified && onVerifyOTP && onOtpChange && (
            <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 bg-blue-50/50 p-4 rounded-xl border border-blue-100"
            >
                <Label className="text-sm font-semibold text-blue-900 mb-3 block text-center">
                    Enter Verification Code
                </Label>
                <div className="flex justify-center mb-4">
                    <OTPInput
                        value={otp || ''}
                        onChange={onOtpChange}
                        onComplete={() => {}}
                        error={!!errors.otp}
                    />
                </div>
                {errors.otp && (
                    <p className="text-sm text-red-600 text-center mb-3 font-medium">{errors.otp}</p>
                )}
                
                <Button 
                    type="button" 
                    onClick={onVerifyOTP}
                    disabled={!otp || otp.length !== 6 || isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                >
                    {isLoading ? 'Verifying...' : 'Verify Phone Number'}
                </Button>
            </motion.div>
        )}
      </div>

      <div>
        <Label className="text-sm font-semibold text-gray-700 mb-3 block">
          Select Your Role
        </Label>
        <RoleSelector
          selectedRole={data.role}
          onSelect={(role) => onChange('role', role)}
        />
        {errors.role && (
          <p className="text-sm text-red-600 mt-2">{errors.role}</p>
        )}
      </div>
    </motion.div>
  );
};
