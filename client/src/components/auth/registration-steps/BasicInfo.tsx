import React from 'react';
import { motion } from 'framer-motion';
import { UserRole } from '@/types/auth';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RoleSelector } from '@/components/auth/RoleSelector';

interface BasicInfoProps {
  data: {
    name: string;
    email: string;
    phone: string;
    role: UserRole | null;
  };
  onChange: (field: string, value: string | number | boolean | UserRole | null) => void;
  errors: Record<string, string>;
}

export const BasicInfo: React.FC<BasicInfoProps> = ({ 
    data, 
    onChange, 
    errors
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
                className={`h-12 ${errors.phone ? 'border-red-500' : ''}`}
                />
            </div>
            
            
        </div>
        
        {errors.phone && (
          <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
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
