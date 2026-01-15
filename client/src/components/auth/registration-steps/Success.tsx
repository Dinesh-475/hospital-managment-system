import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SuccessProps {
  userName: string;
  onContinue: () => void;
}

export const Success: React.FC<SuccessProps> = ({ userName, onContinue }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6 py-8"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="relative inline-block"
      >
        <div className="w-32 h-32 bg-linear-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
          <CheckCircle className="w-16 h-16 text-white" />
        </div>
        
        {/* Sparkles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="absolute"
            style={{
              top: `${20 + Math.sin(i * 60 * Math.PI / 180) * 80}px`,
              left: `${20 + Math.cos(i * 60 * Math.PI / 180) * 80}px`
            }}
          >
            <Sparkles className="w-6 h-6 text-yellow-400" />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to Docvista!
        </h2>
        <p className="text-lg text-gray-600">
          Hi {userName}, your account has been created successfully
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-linear-to-r from-blue-50 to-teal-50 rounded-2xl p-6"
      >
        <p className="text-gray-700">
          You're all set! Start exploring your personalized dashboard and manage your healthcare journey with ease.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Button
          onClick={onContinue}
          className="px-8 py-4 text-lg"
          size="lg"
        >
          Go to Dashboard
        </Button>
      </motion.div>
    </motion.div>
  );
};
