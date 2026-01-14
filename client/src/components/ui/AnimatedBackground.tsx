import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Stethoscope, Activity, Pill, Syringe, Thermometer } from 'lucide-react';

const medicalIcons = [
  { Icon: Heart, color: '#EF4444', delay: 0 },
  { Icon: Stethoscope, color: '#3B82F6', delay: 1 },
  { Icon: Activity, color: '#10B981', delay: 2 },
  { Icon: Pill, color: '#F59E0B', delay: 3 },
  { Icon: Syringe, color: '#8B5CF6', delay: 4 },
  { Icon: Thermometer, color: '#EC4899', delay: 5 }
];

export const AnimatedBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-blue-400/30 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-teal-400/30 rounded-full blur-3xl"
      />

      {/* Floating Medical Icons */}
      {medicalIcons.map(({ Icon, color, delay }, index) => (
        <motion.div
          key={index}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            rotate: [0, 10, 0]
          }}
          transition={{
            duration: 6 + index,
            repeat: Infinity,
            ease: "easeInOut",
            delay
          }}
          className="absolute opacity-20"
          style={{
            top: `${10 + index * 15}%`,
            left: `${5 + index * 15}%`
          }}
        >
          <Icon size={48} color={color} />
        </motion.div>
      ))}
    </div>
  );
};
