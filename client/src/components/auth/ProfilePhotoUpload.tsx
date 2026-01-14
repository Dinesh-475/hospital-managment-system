import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, User } from 'lucide-react';

interface ProfilePhotoUploadProps {
  value: string | null;
  onChange: (photo: string | null) => void;
}

export const ProfilePhotoUpload: React.FC<ProfilePhotoUploadProps> = ({ value, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (file: File | null) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      onChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Preview or Upload Area */}
      <AnimatePresence mode="wait">
        {value ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="relative"
          >
            <img
              src={value}
              alt="Profile preview"
              className="w-40 h-40 rounded-full object-cover border-4 border-blue-500 shadow-xl"
            />
            <button
              type="button"
              onClick={() => onChange(null)}
              className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="upload"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`
              w-40 h-40 rounded-full border-4 border-dashed cursor-pointer
              flex flex-col items-center justify-center gap-2
              transition-all duration-200
              ${isDragging
                ? 'border-blue-600 bg-blue-50 scale-105'
                : 'border-gray-300 bg-gray-50 hover:border-blue-500 hover:bg-blue-50'
              }
            `}
          >
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
              {isDragging ? (
                <Upload className="w-8 h-8 text-blue-600" />
              ) : (
                <User className="w-8 h-8 text-blue-600" />
              )}
            </div>
            <span className="text-sm font-medium text-gray-600 text-center px-4">
              {isDragging ? 'Drop here' : 'Upload Photo'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
        className="hidden"
      />

      {/* Instructions */}
      <p className="text-xs text-gray-500 text-center max-w-xs">
        Click to upload or drag and drop<br />
        PNG, JPG or GIF (max 5MB)
      </p>
    </div>
  );
};
