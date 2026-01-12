// Apple's spring animation settings
export const appleSpring: any = {
  type: 'spring',
  stiffness: 400,
  damping: 30,
  mass: 0.8,
};

// Cubic bezier matching Apple
export const appleEase = [0.25, 0.1, 0.25, 1];

// Common animation variants
export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { ...appleSpring }
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.4, ease: appleEase } // Updated duration
  },
};

// ... Other utility configs from prompt if needed, but these are core ...
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { ...appleSpring }
  },
};

export const slideInFromRight = {
  hidden: { x: '100%', opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { ...appleSpring }
  },
};

export const slideInFromLeft = {
  hidden: { x: '-100%', opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { ...appleSpring }
  },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const cardHover: any = {
  y: -4,
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
  transition: { duration: 0.3, ease: 'easeOut' }, 
};
