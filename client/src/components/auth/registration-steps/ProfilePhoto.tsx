import React from 'react';
import { motion } from 'framer-motion';
import { ProfilePhotoUpload } from '@/components/auth/ProfilePhotoUpload';

interface ProfilePhotoProps {
  photo: string | null;
  onChange: (photo: string | null) => void;
}

export const ProfilePhoto: React.FC<ProfilePhotoProps> = ({ photo, onChange }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Photo</h2>
        <p className="text-gray-600">Add a photo to personalize your profile</p>
      </div>

      <div className="flex justify-center py-8">
        <ProfilePhotoUpload value={photo} onChange={onChange} />
      </div>

      <p className="text-sm text-gray-500 text-center">
        You can skip this step and add a photo later from your profile settings
      </p>
    </motion.div>
  );
};
