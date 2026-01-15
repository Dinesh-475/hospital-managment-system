import React from 'react';
import { motion } from 'framer-motion';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  totalSteps,
  steps
}) => {
  return (
    <div className="w-full mb-8">
      {/* Progress Bar */}
      <div className="relative">
        <div className="flex justify-between mb-2">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                  transition-all duration-300 relative z-10
                  ${index < currentStep
                    ? 'bg-green-500 text-white'
                    : index === currentStep
                      ? 'bg-blue-600 text-white ring-4 ring-blue-500/20'
                      : 'bg-gray-200 text-gray-500'
                  }
                `}
              >
                {index < currentStep ? '✓' : index + 1}
              </motion.div>
              <span className={`
                text-xs mt-2 font-medium text-center
                ${index === currentStep ? 'text-blue-600' : 'text-gray-500'}
              `}>
                {step}
              </span>
            </div>
          ))}
        </div>

        {/* Connecting Line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 z-0" style={{ width: 'calc(100% - 40px)', marginLeft: '20px' }}>
          <motion.div
            className="h-full bg-linear-to-r from-green-500 to-blue-600"
            initial={{ width: '0%' }}
            animate={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
};
