import React from 'react';
import { motion } from 'framer-motion';
import { Message } from '@/types/chatbot';
import { User, Bot } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  isUser: boolean;
  delay?: number;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isUser, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: isUser ? 50 : -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, type: 'spring', stiffness: 300, damping: 30 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser ? 'bg-blue-600' : 'bg-gray-300'
      }`}>
        {isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-gray-700" />
        )}
      </div>

      {/* Message */}
      <div className={`max-w-[75%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div className={`rounded-2xl px-4 py-2 ${
          isUser 
            ? 'bg-blue-600 text-white rounded-tr-none' 
            : 'bg-white text-gray-900 shadow-md rounded-tl-none'
        }`}>
          <p className="text-sm whitespace-pre-wrap wrap-break-word">{message.content}</p>
        </div>
        
        {/* Timestamp */}
        <span className="text-xs text-gray-500 px-2">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>

        {/* Emergency badge */}
        {message.metadata?.isEmergency && (
          <div className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-semibold">
            ⚠️ Emergency
          </div>
        )}
      </div>
    </motion.div>
  );
};
