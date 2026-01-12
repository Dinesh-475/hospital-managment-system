import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { useEffect } from 'react';

interface ToastProps {
  type: 'success' | 'error' | 'info';
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

export default function Toast({ type, message, isVisible, onClose }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  const config = {
    success: { icon: CheckCircle, bg: 'bg-ios-green', color: 'text-white' },
    error: { icon: AlertCircle, bg: 'bg-ios-red', color: 'text-white' },
    info: { icon: Info, bg: 'bg-ios-blue', color: 'text-white' },
  };

  const { icon: Icon, bg, color } = config[type];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 400 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <div className={`${bg} ${color} rounded-2xl shadow-2xl px-5 py-4 flex items-center space-x-3 max-w-sm`}>
            <Icon size={20} />
            <p className="font-text font-medium flex-1">{message}</p>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="hover:bg-white/20 rounded-lg p-1"
            >
              <X size={16} />
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
