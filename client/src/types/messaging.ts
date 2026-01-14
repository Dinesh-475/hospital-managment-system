export type MessageType = 'text' | 'file' | 'image' | 'voice';
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
export type ConversationType = 'direct' | 'group' | 'channel';

export interface User {
  id: string;
  name: string;
  role: 'patient' | 'doctor' | 'nurse' | 'staff' | 'manager' | 'admin';
  avatar?: string;
  isOnline: boolean;
  lastSeen?: Date;
}

export interface FileAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  thumbnail?: string;
  uploadProgress?: number;
}

export interface EmojiReaction {
  emoji: string;
  userId: string;
  userName: string;
  timestamp: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  type: MessageType;
  content: string;
  attachments?: FileAttachment[];
  replyTo?: {
    messageId: string;
    content: string;
    senderName: string;
  };
  reactions: EmojiReaction[];
  status: MessageStatus;
  timestamp: Date;
  editedAt?: Date;
  isDeleted: boolean;
}

export interface Conversation {
  id: string;
  type: ConversationType;
  name: string;
  avatar?: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  isPinned: boolean;
  isArchived: boolean;
  isMuted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TypingIndicator {
  conversationId: string;
  userId: string;
  userName: string;
  isTyping: boolean;
}

export interface ConversationFilter {
  searchQuery?: string;
  showArchived?: boolean;
  showPinned?: boolean;
  type?: ConversationType;
}

export interface MessageDraft {
  conversationId: string;
  content: string;
  attachments: FileAttachment[];
  replyTo?: Message;
}

export interface ReadReceipt {
  messageId: string;
  userId: string;
  userName: string;
  readAt: Date;
}
