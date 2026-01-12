import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface IconProps {
  icon: LucideIcon;
  size?: number;
  color?: string;
  className?: string;
  animated?: boolean;
}

export default function Icon({ 
  icon: IconComponent, 
  size = 24, 
  color = 'currentColor',
  className = '',
  animated = false 
}: IconProps) {
  const Wrapper = animated ? motion.div : 'div';
  
  return (
    <Wrapper
      {...(animated && {
        whileHover: { scale: 1.1, rotate: 5 },
        whileTap: { scale: 0.9 },
      })}
      className={`inline-flex items-center justify-center ${className}`}
    >
      <IconComponent size={size} color={color} strokeWidth={2} />
    </Wrapper>
  );
}
