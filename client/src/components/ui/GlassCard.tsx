import { motion } from 'framer-motion';
import { cardHover, fadeInUp } from '@/utils/animations';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export default function GlassCard({ children, className = '', hoverable = true, onClick }: GlassCardProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      whileHover={hoverable ? cardHover : {}}
      onClick={onClick}
      className={`glass-card p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
}
