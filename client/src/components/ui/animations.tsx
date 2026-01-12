import { motion } from 'framer-motion';

export const fadeIn = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.3 }
};

export const slideIn = {
  initial: { x: -20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { type: 'spring', stiffness: 300, damping: 30 }
};

export const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export const PageTransition = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={fadeIn}
        className={className}
    >
        {children}
    </motion.div>
);
