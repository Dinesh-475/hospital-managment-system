import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, MessageCircle, Eye, Pin, Calendar, Download, ChevronRight } from 'lucide-react';
import { Announcement } from '@/types/announcements';
import { formatDistanceToNow } from 'date-fns';

interface AnnouncementCardProps {
  announcement: Announcement;
  onReaction: (id: string, emoji: string, hasReacted: boolean) => void;
  delay?: number;
}

const CATEGORY_COLORS = {
  urgent: 'bg-red-100 text-red-800 border-red-300',
  info: 'bg-blue-100 text-blue-800 border-blue-300',
  event: 'bg-purple-100 text-purple-800 border-purple-300',
  policy: 'bg-green-100 text-green-800 border-green-300',
  general: 'bg-gray-100 text-gray-800 border-gray-300'
};

export const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  announcement,
  onReaction,
  delay = 0
}) => {
  const [showFullContent, setShowFullContent] = useState(false);

  const hasUserReacted = (emoji: string) => {
    const reaction = announcement.reactions.find(r => r.emoji === emoji);
    return reaction?.userIds.includes('current-user') || false;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
    >
      {/* Cover Image */}
      {announcement.coverImage && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={announcement.coverImage}
            alt={announcement.title}
            className="w-full h-full object-cover"
          />
          {announcement.isPinned && (
            <div className="absolute top-3 right-3 bg-yellow-500 text-white p-2 rounded-full shadow-lg">
              <Pin className="w-4 h-4 fill-white" />
            </div>
          )}
        </div>
      )}

      <div className="p-6">
        {/* Category Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border-2 ${CATEGORY_COLORS[announcement.category]}`}>
            {announcement.category.toUpperCase()}
          </span>
          {announcement.isPinned && !announcement.coverImage && (
            <Pin className="w-4 h-4 text-yellow-600 fill-yellow-600" />
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {announcement.title}
        </h3>

        {/* Author & Date */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            {announcement.authorAvatar ? (
              <img
                src={announcement.authorAvatar}
                alt={announcement.authorName}
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <div className="w-6 h-6 bg-linear-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {announcement.authorName.charAt(0)}
              </div>
            )}
            <span className="font-medium">{announcement.authorName}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDistanceToNow(announcement.publishedAt, { addSuffix: true })}</span>
          </div>
        </div>

        {/* Excerpt */}
        <p className="text-gray-700 mb-4 line-clamp-3">
          {announcement.excerpt}
        </p>

        {/* Tags */}
        {announcement.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {announcement.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
            {announcement.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                +{announcement.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Attachments */}
        {announcement.attachments && announcement.attachments.length > 0 && (
          <div className="mb-4 space-y-2">
            {announcement.attachments.map((attachment, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Download className="w-4 h-4 text-gray-600 shrink-0" />
                  <span className="text-sm text-gray-700 truncate">{attachment.name}</span>
                </div>
                <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                  <Download className="w-4 h-4 text-blue-600" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{announcement.viewCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <ThumbsUp className="w-4 h-4" />
            <span>{announcement.totalReactions}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            <span>{announcement.commentCount}</span>
          </div>
        </div>

        {/* Reactions */}
        <div className="flex items-center gap-2 mb-4">
          {['👍', '❤️', '🎉', '👏'].map((emoji) => {
            const hasReacted = hasUserReacted(emoji);
            const reaction = announcement.reactions.find(r => r.emoji === emoji);
            const count = reaction?.count || 0;

            return (
              <button
                key={emoji}
                onClick={() => onReaction(announcement.id, emoji, hasReacted)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-all ${
                  hasReacted
                    ? 'bg-blue-100 border-2 border-blue-500'
                    : 'bg-gray-100 hover:bg-gray-200 border-2 border-transparent'
                }`}
              >
                <span className="text-lg">{emoji}</span>
                {count > 0 && (
                  <span className={`text-xs font-semibold ${hasReacted ? 'text-blue-700' : 'text-gray-600'}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Read More Button */}
        <button
          onClick={() => setShowFullContent(!showFullContent)}
          className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          Read More
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};
