import React from 'react';
import { motion } from 'framer-motion';
import { UserRole } from '@/types/auth';
import { User, Stethoscope, Users, Briefcase, Shield } from 'lucide-react';

interface RoleSelectorProps {
  selectedRole: UserRole | null;
  onSelect: (role: UserRole) => void;
}

const roles = [
  {
    value: 'patient' as UserRole,
    label: 'Patient',
    description: 'Book appointments and manage health records',
    icon: User,
    color: 'blue'
  },
  {
    value: 'doctor' as UserRole,
    label: 'Doctor',
    description: 'Manage patients and appointments',
    icon: Stethoscope,
    color: 'teal'
  },
  {
    value: 'staff' as UserRole,
    label: 'Staff',
    description: 'Support hospital operations',
    icon: Users,
    color: 'purple'
  },
  {
    value: 'manager' as UserRole,
    label: 'Manager',
    description: 'Oversee departments and staff',
    icon: Briefcase,
    color: 'orange'
  },
  {
    value: 'admin' as UserRole,
    label: 'Admin',
    description: 'Full system access and control',
    icon: Shield,
    color: 'red'
  }
];

const colorClasses = {
  blue: {
    border: 'border-blue-500',
    bg: 'bg-blue-50',
    ring: 'ring-blue-500/20',
    icon: 'text-blue-600',
    gradient: 'from-blue-500 to-blue-600'
  },
  teal: {
    border: 'border-teal-500',
    bg: 'bg-teal-50',
    ring: 'ring-teal-500/20',
    icon: 'text-teal-600',
    gradient: 'from-teal-500 to-teal-600'
  },
  purple: {
    border: 'border-purple-500',
    bg: 'bg-purple-50',
    ring: 'ring-purple-500/20',
    icon: 'text-purple-600',
    gradient: 'from-purple-500 to-purple-600'
  },
  orange: {
    border: 'border-orange-500',
    bg: 'bg-orange-50',
    ring: 'ring-orange-500/20',
    icon: 'text-orange-600',
    gradient: 'from-orange-500 to-orange-600'
  },
  red: {
    border: 'border-red-500',
    bg: 'bg-red-50',
    ring: 'ring-red-500/20',
    icon: 'text-red-600',
    gradient: 'from-red-500 to-red-600'
  }
};

export const RoleSelector: React.FC<RoleSelectorProps> = ({ selectedRole, onSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {roles.map((role, index) => {
        const isSelected = selectedRole === role.value;
        const colors = colorClasses[role.color as keyof typeof colorClasses];
        const Icon = role.icon;

        return (
          <motion.button
            key={role.value}
            type="button"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(role.value)}
            className={`
              p-6 rounded-2xl border-2 transition-all duration-200 text-left
              ${isSelected
                ? `${colors.border} ${colors.bg} ring-4 ${colors.ring}`
                : 'border-gray-200 bg-white hover:border-gray-300'
              }
            `}
          >
            <div className="flex items-start gap-4">
              <div className={`
                p-3 rounded-xl bg-linear-to-br ${colors.gradient}
                ${isSelected ? 'shadow-lg' : ''}
              `}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900 mb-1">
                  {role.label}
                </h3>
                <p className="text-sm text-gray-600">
                  {role.description}
                </p>
              </div>

              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`w-6 h-6 rounded-full bg-linear-to-br ${colors.gradient} flex items-center justify-center`}
                >
                  <span className="text-white text-xs font-bold">✓</span>
                </motion.div>
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};
