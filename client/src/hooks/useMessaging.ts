import { useState, useEffect } from 'react';
import { Conversation, Message, MessageType, FileAttachment } from '@/types/messaging';
import * as messagingApi from '@/services/messagingApi';

export function useMessaging() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Load conversations
  useEffect(() => {
    loadConversations();
  }, []);

  // Load messages when active conversation changes
  useEffect(() => {
    if (activeConversation) {
      loadMessages(activeConversation.id);
      messagingApi.markAsRead(activeConversation.id);
    }
  }, [activeConversation]);

  const loadConversations = async () => {
    setIsLoading(true);
    try {
      const data = await messagingApi.getConversations();
      setConversations(data);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    setIsLoading(true);
    try {
      const data = await messagingApi.getMessages(conversationId);
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (
    content: string,
    type: MessageType = 'text',
    attachments?: FileAttachment[],
    replyTo?: Message
  ) => {
    if (!activeConversation || !content.trim()) return;

    try {
      const newMessage = await messagingApi.sendMessage(
        activeConversation.id,
        content,
        type,
        attachments,
        replyTo ? {
          messageId: replyTo.id,
          content: replyTo.content,
          senderName: replyTo.senderName
        } : undefined
      );

      setMessages(prev => [...prev, newMessage]);
      
      // Update conversation last message
      setConversations(prev =>
        prev.map(conv =>
          conv.id === activeConversation.id
            ? { ...conv, lastMessage: newMessage, updatedAt: new Date() }
            : conv
        )
      );
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const uploadFile = async (file: File): Promise<FileAttachment | null> => {
    try {
      return await messagingApi.uploadFile(file);
    } catch (error) {
      console.error('Failed to upload file:', error);
      return null;
    }
  };

  const addReaction = async (messageId: string, emoji: string) => {
    try {
      await messagingApi.addReaction(messageId, emoji);
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId
            ? {
                ...msg,
                reactions: [
                  ...msg.reactions.filter(r => r.userId !== 'current-user'),
                  { emoji, userId: 'current-user', userName: 'You', timestamp: new Date() }
                ]
              }
            : msg
        )
      );
    } catch (error) {
      console.error('Failed to add reaction:', error);
    }
  };

  const togglePin = async (conversationId: string) => {
    try {
      await messagingApi.togglePin(conversationId);
      setConversations(prev =>
        prev.map(conv =>
          conv.id === conversationId
            ? { ...conv, isPinned: !conv.isPinned }
            : conv
        )
      );
    } catch (error) {
      console.error('Failed to toggle pin:', error);
    }
  };

  const archiveConversation = async (conversationId: string) => {
    try {
      await messagingApi.archiveConversation(conversationId);
      setConversations(prev =>
        prev.map(conv =>
          conv.id === conversationId
            ? { ...conv, isArchived: true }
            : conv
        )
      );
      if (activeConversation?.id === conversationId) {
        setActiveConversation(null);
      }
    } catch (error) {
      console.error('Failed to archive conversation:', error);
    }
  };

  const searchConversations = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      loadConversations();
      return;
    }

    try {
      const results = await messagingApi.searchConversations(query);
      setConversations(results);
    } catch (error) {
      console.error('Failed to search conversations:', error);
    }
  };

  const simulateTyping = () => {
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 3000);
  };

  return {
    conversations,
    activeConversation,
    messages,
    isLoading,
    isTyping,
    searchQuery,
    setActiveConversation,
    sendMessage,
    uploadFile,
    addReaction,
    togglePin,
    archiveConversation,
    searchConversations,
    simulateTyping,
    refreshConversations: loadConversations
  };
}
