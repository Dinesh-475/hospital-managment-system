import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface AppleInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  value: string;
  onChange: any; // Allow relaxed type for event handling flexibility
  error?: string;
}

export default function AppleInput({ label, type = 'text', placeholder, value, onChange, error, ...props }: AppleInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // If parent expects string, pass value. If it expects event, pass event.
      // This is a common pattern to support both (val) => ... and (e) => ...
      // But strictly following prompt: "onChange: (value: string) => void"
      if (typeof onChange === 'function') {
           onChange(e.target.value);
      }
  };

  return (
    <div className="space-y-2">
      <label className="block font-text font-medium text-sm text-ios-gray-700">
        {label}
      </label>
      <div className="relative">
        <input
          {...props}
          type={type}
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`
            w-full px-4 py-3 
            bg-ios-gray-50 
            border-2 
            ${error ? 'border-ios-red' : isFocused ? 'border-ios-blue' : 'border-transparent'}
            rounded-2xl 
            font-text text-base 
            text-ios-gray-900 
            placeholder-ios-gray-400
            transition-all duration-200
            focus:outline-none 
            focus:bg-white
            focus:shadow-lg
          `}
        />
        <AnimatePresence>
          {isFocused && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute inset-0 border-2 border-ios-blue rounded-2xl pointer-events-none"
              style={{ boxShadow: '0 0 0 4px rgba(0, 122, 255, 0.1)' }}
            />
          )}
        </AnimatePresence>
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-ios-red font-text"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
