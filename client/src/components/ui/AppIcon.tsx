import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface AppIconProps {
  icon: LucideIcon;
  gradient?: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export default function AppIcon({ icon: IconComponent, gradient = 'from-ios-blue to-ios-indigo', size = 'md', onClick }: AppIconProps) {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
  };
  
  const iconSizes = {
    sm: 20,
    md: 28,
    lg: 40,
  };
  
  return (
    <motion.div
      whileHover={{ scale: 1.05, rotate: 2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        ${sizeClasses[size]}
        rounded-2xl bg-gradient-to-br ${gradient}
        shadow-xl
        flex items-center justify-center
        cursor-pointer
      `}
    >
      <IconComponent size={iconSizes[size]} className="text-white" strokeWidth={2.5} />
    </motion.div>
  );
}
