import React from 'react';
import { Search, Plus } from 'lucide-react';
import { ConversationCard } from './ConversationCard';
import { Conversation } from '@/types/messaging';

interface ConversationListProps {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  searchQuery: string;
  onSelectConversation: (conversation: Conversation) => void;
  onSearch: (query: string) => void;
  onNewMessage: () => void;
  onTogglePin: (conversationId: string) => void;
  onArchive: (conversationId: string) => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  activeConversation,
  searchQuery,
  onSelectConversation,
  onSearch,
  onNewMessage,
  onTogglePin,
  onArchive
}) => {
  const pinnedConversations = conversations.filter(c => c.isPinned && !c.isArchived);
  const regularConversations = conversations.filter(c => !c.isPinned && !c.isArchived);

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Messages</h2>
          <button
            onClick={onNewMessage}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {/* Pinned Conversations */}
        {pinnedConversations.length > 0 && (
          <div>
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
              <span className="text-xs font-semibold text-gray-600 uppercase">Pinned</span>
            </div>
            {pinnedConversations.map((conversation) => (
              <ConversationCard
                key={conversation.id}
                conversation={conversation}
                isActive={activeConversation?.id === conversation.id}
                onClick={() => onSelectConversation(conversation)}
                onTogglePin={() => onTogglePin(conversation.id)}
                onArchive={() => onArchive(conversation.id)}
              />
            ))}
          </div>
        )}

        {/* Regular Conversations */}
        {regularConversations.length > 0 && (
          <div>
            {pinnedConversations.length > 0 && (
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                <span className="text-xs font-semibold text-gray-600 uppercase">All Messages</span>
              </div>
            )}
            {regularConversations.map((conversation) => (
              <ConversationCard
                key={conversation.id}
                conversation={conversation}
                isActive={activeConversation?.id === conversation.id}
                onClick={() => onSelectConversation(conversation)}
                onTogglePin={() => onTogglePin(conversation.id)}
                onArchive={() => onArchive(conversation.id)}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {conversations.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium">No conversations found</p>
            <p className="text-gray-400 text-sm mt-1">
              {searchQuery ? 'Try a different search term' : 'Start a new conversation'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
