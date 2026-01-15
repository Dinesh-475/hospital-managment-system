import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

interface ChatBubbleProps {
  onClick: () => void;
  isOpen: boolean;
  unreadCount?: number;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ onClick, isOpen, unreadCount = 0 }) => {
  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 1,
            transition: { type: 'spring', stiffness: 200 }
          }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClick}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-linear-to-br from-blue-600 to-teal-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-blue-500/50 transition-shadow"
        >
          <MessageCircle className="w-7 h-7" />
          
          {/* Pulse animation */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="absolute inset-0 bg-blue-500 rounded-full"
          />
          
          {/* Unread badge */}
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold"
            >
              {unreadCount}
            </motion.div>
          )}
        </motion.button>
      )}
    </AnimatePresence>
  );
};
