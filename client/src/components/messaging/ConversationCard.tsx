import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Pin, Archive, MoreVertical, Check, CheckCheck } from 'lucide-react';
import { Conversation } from '@/types/messaging';
import { formatDistanceToNow } from 'date-fns';

interface ConversationCardProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
  onTogglePin: () => void;
  onArchive: () => void;
}

export const ConversationCard: React.FC<ConversationCardProps> = ({
  conversation,
  isActive,
  onClick,
  onTogglePin,
  onArchive
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60);
      return `${minutes}m ago`;
    } else if (diffInHours < 24) {
      return formatDistanceToNow(date, { addSuffix: true });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const getStatusIcon = () => {
    if (!conversation.lastMessage || conversation.lastMessage.senderId !== 'current-user') {
      return null;
    }

    switch (conversation.lastMessage.status) {
      case 'sent':
        return <Check className="w-4 h-4 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="w-4 h-4 text-gray-400" />;
      case 'read':
        return <CheckCheck className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      whileHover={{ backgroundColor: '#f9fafb' }}
      className={`relative p-4 border-b border-gray-200 cursor-pointer transition-colors ${
        isActive ? 'bg-blue-50' : 'bg-white'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          {conversation.avatar && conversation.avatar.startsWith('http') ? (
            <img
              src={conversation.avatar}
              alt={conversation.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
              {conversation.avatar || conversation.name.charAt(0)}
            </div>
          )}
          
          {/* Online Status */}
          {conversation.participants[0]?.isOnline && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900 truncate">{conversation.name}</h3>
              {conversation.isPinned && (
                <Pin className="w-4 h-4 text-blue-600 fill-blue-600" />
              )}
            </div>
            <span className="text-xs text-gray-500 flex-shrink-0">
              {conversation.lastMessage && formatTimestamp(conversation.lastMessage.timestamp)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 min-w-0 flex-1">
              {getStatusIcon()}
              <p className="text-sm text-gray-600 truncate">
                {conversation.lastMessage?.content || 'No messages yet'}
              </p>
            </div>

            {conversation.unreadCount > 0 && (
              <div className="ml-2 flex-shrink-0 w-5 h-5 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {conversation.unreadCount}
              </div>
            )}
          </div>
        </div>

        {/* Menu */}
        <div className="relative flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
          >
            <MoreVertical className="w-4 h-4 text-gray-500" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                }}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute right-0 top-8 z-20 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[150px]"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTogglePin();
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                >
                  <Pin className="w-4 h-4" />
                  {conversation.isPinned ? 'Unpin' : 'Pin'}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onArchive();
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 text-red-600"
                >
                  <Archive className="w-4 h-4" />
                  Archive
                </button>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};
