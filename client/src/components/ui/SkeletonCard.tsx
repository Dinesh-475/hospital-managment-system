import { motion } from 'framer-motion';

export function SkeletonCard() {
  return (
    <div className="glass-card p-6 space-y-4">
      <motion.div
        className="h-4 bg-ios-gray-200 rounded-full w-3/4"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="h-4 bg-ios-gray-200 rounded-full w-1/2"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
      />
      <motion.div
        className="h-24 bg-ios-gray-200 rounded-2xl w-full"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
      />
    </div>
  );
}
