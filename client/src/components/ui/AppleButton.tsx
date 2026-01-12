import { motion } from 'framer-motion';
import { appleSpring } from '@/utils/animations';

interface AppleButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export default function AppleButton({ 
  children, 
  variant = 'primary', 
  size = 'md',
  onClick,
  className = '',
  type = 'button',
  disabled = false
}: AppleButtonProps) {
  const baseClasses = 'font-text font-semibold rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-ios-blue text-white hover:bg-ios-blue/90 focus:ring-ios-blue shadow-lg hover:shadow-xl',
    secondary: 'bg-ios-gray-100 text-ios-gray-900 hover:bg-ios-gray-200 focus:ring-ios-gray-300',
    ghost: 'bg-transparent text-ios-blue hover:bg-ios-blue/10 focus:ring-ios-blue/30',
    destructive: 'bg-ios-red text-white hover:bg-ios-red/90 focus:ring-ios-red shadow-lg'
  };
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      transition={appleSpring}
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </motion.button>
  );
}
