import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Video, MoreVertical, Info } from 'lucide-react';
import { ConversationList } from '@/components/messaging/ConversationList';
import { MessageThread } from '@/components/messaging/MessageThread';
import { MessageInput } from '@/components/messaging/MessageInput';
import { useMessaging } from '@/hooks/useMessaging';
import { Message } from '@/types/messaging';

export const MessagesPage: React.FC = () => {
  const {
    conversations,
    activeConversation,
    messages,
    isTyping,
    searchQuery,
    setActiveConversation,
    sendMessage,
    uploadFile,
    addReaction,
    togglePin,
    archiveConversation,
    searchConversations
  } = useMessaging();

  const [showContactInfo, setShowContactInfo] = useState(false);
  const [replyTo, setReplyTo] = useState<Message | null>(null);

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Left Sidebar - Conversation List */}
      <div className="w-80 shrink-0">
        <ConversationList
          conversations={conversations}
          activeConversation={activeConversation}
          searchQuery={searchQuery}
          onSelectConversation={setActiveConversation}
          onSearch={searchConversations}
          onNewMessage={() => {/* TODO: Implement new message modal */}}
          onTogglePin={togglePin}
          onArchive={archiveConversation}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Avatar */}
                {activeConversation.avatar && activeConversation.avatar.startsWith('http') ? (
                  <img
                    src={activeConversation.avatar}
                    alt={activeConversation.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {activeConversation.avatar || activeConversation.name.charAt(0)}
                  </div>
                )}

                <div>
                  <h2 className="font-semibold text-gray-900">{activeConversation.name}</h2>
                  <p className="text-xs text-gray-500">
                    {activeConversation.participants[0]?.isOnline ? (
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full" />
                        Online
                      </span>
                    ) : (
                      `Last seen ${activeConversation.participants[0]?.lastSeen?.toLocaleTimeString() || 'recently'}`
                    )}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Phone className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Video className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={() => setShowContactInfo(!showContactInfo)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Info className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <MessageThread
              messages={messages}
              isTyping={isTyping}
              onReact={addReaction}
              onReply={setReplyTo}
            />

            {/* Input */}
            <MessageInput
              onSend={(content, attachments) => {
                sendMessage(content, 'text', attachments, replyTo || undefined);
                setReplyTo(null);
              }}
              onFileUpload={uploadFile}
              replyTo={replyTo}
              onCancelReply={() => setReplyTo(null)}
            />
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-500">Choose a conversation from the list to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar - Contact Info */}
      <AnimatePresence>
        {showContactInfo && activeConversation && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="bg-white border-l border-gray-200 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900">Contact Info</h3>
                <button
                  onClick={() => setShowContactInfo(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Avatar */}
              <div className="flex flex-col items-center mb-6">
                {activeConversation.avatar && activeConversation.avatar.startsWith('http') ? (
                  <img
                    src={activeConversation.avatar}
                    alt={activeConversation.name}
                    className="w-24 h-24 rounded-full object-cover mb-3"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold mb-3">
                    {activeConversation.avatar || activeConversation.name.charAt(0)}
                  </div>
                )}
                <h4 className="font-semibold text-gray-900">{activeConversation.name}</h4>
                <p className="text-sm text-gray-500">
                  {activeConversation.participants[0]?.role || 'Member'}
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <button className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">
                  View Profile
                </button>
                <button className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">
                  Mute Notifications
                </button>
                <button className="w-full py-2 px-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition-colors">
                  Block Contact
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
