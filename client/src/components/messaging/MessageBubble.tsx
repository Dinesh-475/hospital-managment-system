import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Reply, Smile, MoreVertical, FileText, Image as ImageIcon, Download } from 'lucide-react';
import { Message } from '@/types/messaging';

interface MessageBubbleProps {
  message: Message;
  onReact: (messageId: string, emoji: string) => void;
  onReply: (message: Message) => void;
}

const QUICK_REACTIONS = ['👍', '❤️', '😊', '🎉', '👏'];

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onReact,
  onReply
}) => {
  const [showActions, setShowActions] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const isSent = message.senderId === 'current-user';

  const renderAttachment = (attachment: typeof message.attachments[0]) => {
    const isImage = attachment.type.startsWith('image/');
    
    return (
      <div
        key={attachment.id}
        className={`mt-2 rounded-lg overflow-hidden ${
          isImage ? 'max-w-xs' : 'bg-white/20 p-3'
        }`}
      >
        {isImage ? (
          <img
            src={attachment.url}
            alt={attachment.name}
            className="w-full h-auto rounded-lg"
          />
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/30 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{attachment.name}</p>
              <p className="text-xs opacity-75">
                {(attachment.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-2 mb-4 ${isSent ? 'justify-end' : 'justify-start'}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => {
        setShowActions(false);
        setShowReactions(false);
      }}
    >
      {/* Avatar for received messages */}
      {!isSent && message.senderAvatar && (
        <img
          src={message.senderAvatar}
          alt={message.senderName}
          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
        />
      )}

      <div className={`flex flex-col ${isSent ? 'items-end' : 'items-start'} max-w-[70%]`}>
        {/* Sender name for received messages */}
        {!isSent && (
          <span className="text-xs text-gray-600 mb-1 px-2">{message.senderName}</span>
        )}

        {/* Reply preview */}
        {message.replyTo && (
          <div className={`mb-1 px-3 py-2 rounded-lg text-xs ${
            isSent ? 'bg-blue-100 text-blue-900' : 'bg-gray-100 text-gray-900'
          }`}>
            <p className="font-semibold">{message.replyTo.senderName}</p>
            <p className="opacity-75 truncate">{message.replyTo.content}</p>
          </div>
        )}

        {/* Message bubble */}
        <div className="relative group">
          <div
            className={`px-4 py-2 rounded-2xl ${
              isSent
                ? 'bg-blue-600 text-white rounded-br-sm'
                : 'bg-gray-200 text-gray-900 rounded-bl-sm'
            }`}
          >
            <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
            
            {/* Attachments */}
            {message.attachments && message.attachments.length > 0 && (
              <div className="space-y-2">
                {message.attachments.map(renderAttachment)}
              </div>
            )}

            {/* Timestamp */}
            <div className={`text-xs mt-1 ${isSent ? 'text-blue-100' : 'text-gray-500'}`}>
              {message.timestamp.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>

          {/* Quick Actions */}
          {showActions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`absolute top-0 flex gap-1 ${
                isSent ? 'right-full mr-2' : 'left-full ml-2'
              }`}
            >
              <button
                onClick={() => setShowReactions(!showReactions)}
                className="p-1.5 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors shadow-sm"
              >
                <Smile className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={() => onReply(message)}
                className="p-1.5 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors shadow-sm"
              >
                <Reply className="w-4 h-4 text-gray-600" />
              </button>
            </motion.div>
          )}

          {/* Reaction Picker */}
          {showReactions && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`absolute ${isSent ? 'right-0' : 'left-0'} -top-12 bg-white border border-gray-300 rounded-full px-2 py-1 shadow-lg flex gap-1`}
            >
              {QUICK_REACTIONS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    onReact(message.id, emoji);
                    setShowReactions(false);
                  }}
                  className="text-lg hover:scale-125 transition-transform"
                >
                  {emoji}
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {/* Reactions */}
        {message.reactions.length > 0 && (
          <div className="flex gap-1 mt-1 px-2">
            {message.reactions.map((reaction, index) => (
              <div
                key={index}
                className="bg-white border border-gray-300 rounded-full px-2 py-0.5 text-xs flex items-center gap-1 shadow-sm"
              >
                <span>{reaction.emoji}</span>
                <span className="text-gray-600">{reaction.userName}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};
