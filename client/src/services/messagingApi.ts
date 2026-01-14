import { Conversation, Message, User, MessageType, FileAttachment } from '@/types/messaging';

// Mock users
const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Dr. Sarah Johnson',
    role: 'doctor',
    avatar: 'https://i.pravatar.cc/150?img=1',
    isOnline: true
  },
  {
    id: 'user-2',
    name: 'Nurse Emily Chen',
    role: 'nurse',
    avatar: 'https://i.pravatar.cc/150?img=5',
    isOnline: true
  },
  {
    id: 'user-3',
    name: 'Dr. Michael Brown',
    role: 'doctor',
    avatar: 'https://i.pravatar.cc/150?img=12',
    isOnline: false,
    lastSeen: new Date(Date.now() - 3600000)
  },
  {
    id: 'user-4',
    name: 'Admin John Smith',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/150?img=8',
    isOnline: true
  },
  {
    id: 'user-5',
    name: 'Staff Maria Garcia',
    role: 'staff',
    avatar: 'https://i.pravatar.cc/150?img=9',
    isOnline: false,
    lastSeen: new Date(Date.now() - 7200000)
  }
];

// Mock conversations
let mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    type: 'direct',
    name: 'Dr. Sarah Johnson',
    avatar: 'https://i.pravatar.cc/150?img=1',
    participants: [mockUsers[0]],
    lastMessage: {
      id: 'msg-1',
      conversationId: 'conv-1',
      senderId: 'user-1',
      senderName: 'Dr. Sarah Johnson',
      type: 'text',
      content: 'Can you review the patient file I sent?',
      reactions: [],
      status: 'delivered',
      timestamp: new Date(Date.now() - 120000),
      isDeleted: false
    },
    unreadCount: 2,
    isPinned: true,
    isArchived: false,
    isMuted: false,
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 120000)
  },
  {
    id: 'conv-2',
    type: 'direct',
    name: 'Nurse Emily Chen',
    avatar: 'https://i.pravatar.cc/150?img=5',
    participants: [mockUsers[1]],
    lastMessage: {
      id: 'msg-2',
      conversationId: 'conv-2',
      senderId: 'current-user',
      senderName: 'You',
      type: 'text',
      content: 'Thanks for the update!',
      reactions: [{ emoji: '👍', userId: 'user-2', userName: 'Nurse Emily Chen', timestamp: new Date() }],
      status: 'read',
      timestamp: new Date(Date.now() - 300000),
      isDeleted: false
    },
    unreadCount: 0,
    isPinned: false,
    isArchived: false,
    isMuted: false,
    createdAt: new Date(Date.now() - 172800000),
    updatedAt: new Date(Date.now() - 300000)
  },
  {
    id: 'conv-3',
    type: 'group',
    name: 'Cardiology Team',
    avatar: '❤️',
    participants: [mockUsers[0], mockUsers[2]],
    lastMessage: {
      id: 'msg-3',
      conversationId: 'conv-3',
      senderId: 'user-3',
      senderName: 'Dr. Michael Brown',
      type: 'text',
      content: 'Team meeting at 3 PM today',
      reactions: [],
      status: 'delivered',
      timestamp: new Date(Date.now() - 3600000),
      isDeleted: false
    },
    unreadCount: 5,
    isPinned: true,
    isArchived: false,
    isMuted: false,
    createdAt: new Date(Date.now() - 259200000),
    updatedAt: new Date(Date.now() - 3600000)
  }
];

// Mock messages for each conversation
const mockMessages: Record<string, Message[]> = {
  'conv-1': [
    {
      id: 'msg-1-1',
      conversationId: 'conv-1',
      senderId: 'user-1',
      senderName: 'Dr. Sarah Johnson',
      senderAvatar: 'https://i.pravatar.cc/150?img=1',
      type: 'text',
      content: 'Hi! I need your help with a patient case.',
      reactions: [],
      status: 'read',
      timestamp: new Date(Date.now() - 600000),
      isDeleted: false
    },
    {
      id: 'msg-1-2',
      conversationId: 'conv-1',
      senderId: 'current-user',
      senderName: 'You',
      type: 'text',
      content: 'Sure, what do you need?',
      reactions: [],
      status: 'read',
      timestamp: new Date(Date.now() - 540000),
      isDeleted: false
    },
    {
      id: 'msg-1-3',
      conversationId: 'conv-1',
      senderId: 'user-1',
      senderName: 'Dr. Sarah Johnson',
      senderAvatar: 'https://i.pravatar.cc/150?img=1',
      type: 'file',
      content: 'Here is the patient file',
      attachments: [{
        id: 'file-1',
        name: 'patient_report.pdf',
        size: 2048000,
        type: 'application/pdf',
        url: '/mock/patient_report.pdf',
        thumbnail: '📄'
      }],
      reactions: [],
      status: 'read',
      timestamp: new Date(Date.now() - 480000),
      isDeleted: false
    },
    {
      id: 'msg-1-4',
      conversationId: 'conv-1',
      senderId: 'user-1',
      senderName: 'Dr. Sarah Johnson',
      senderAvatar: 'https://i.pravatar.cc/150?img=1',
      type: 'text',
      content: 'Can you review the patient file I sent?',
      reactions: [],
      status: 'delivered',
      timestamp: new Date(Date.now() - 120000),
      isDeleted: false
    }
  ],
  'conv-2': [
    {
      id: 'msg-2-1',
      conversationId: 'conv-2',
      senderId: 'user-2',
      senderName: 'Nurse Emily Chen',
      senderAvatar: 'https://i.pravatar.cc/150?img=5',
      type: 'text',
      content: 'Patient in room 304 needs attention',
      reactions: [],
      status: 'read',
      timestamp: new Date(Date.now() - 900000),
      isDeleted: false
    },
    {
      id: 'msg-2-2',
      conversationId: 'conv-2',
      senderId: 'current-user',
      senderName: 'You',
      type: 'text',
      content: 'On my way!',
      reactions: [],
      status: 'read',
      timestamp: new Date(Date.now() - 840000),
      isDeleted: false
    },
    {
      id: 'msg-2-3',
      conversationId: 'conv-2',
      senderId: 'user-2',
      senderName: 'Nurse Emily Chen',
      senderAvatar: 'https://i.pravatar.cc/150?img=5',
      type: 'text',
      content: 'All good now, patient is stable',
      reactions: [],
      status: 'read',
      timestamp: new Date(Date.now() - 360000),
      isDeleted: false
    },
    {
      id: 'msg-2-4',
      conversationId: 'conv-2',
      senderId: 'current-user',
      senderName: 'You',
      type: 'text',
      content: 'Thanks for the update!',
      reactions: [{ emoji: '👍', userId: 'user-2', userName: 'Nurse Emily Chen', timestamp: new Date() }],
      status: 'read',
      timestamp: new Date(Date.now() - 300000),
      isDeleted: false
    }
  ]
};

// API Functions
export async function getConversations(): Promise<Conversation[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockConversations.sort((a, b) => {
    // Pinned first
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    // Then by last message time
    const aTime = a.lastMessage?.timestamp.getTime() || 0;
    const bTime = b.lastMessage?.timestamp.getTime() || 0;
    return bTime - aTime;
  });
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockMessages[conversationId] || [];
}

export async function sendMessage(
  conversationId: string,
  content: string,
  type: MessageType = 'text',
  attachments?: FileAttachment[],
  replyTo?: { messageId: string; content: string; senderName: string }
): Promise<Message> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newMessage: Message = {
    id: `msg-${Date.now()}`,
    conversationId,
    senderId: 'current-user',
    senderName: 'You',
    type,
    content,
    attachments,
    replyTo,
    reactions: [],
    status: 'sent',
    timestamp: new Date(),
    isDeleted: false
  };

  // Add to mock messages
  if (!mockMessages[conversationId]) {
    mockMessages[conversationId] = [];
  }
  mockMessages[conversationId].push(newMessage);

  // Update conversation last message
  const convIndex = mockConversations.findIndex(c => c.id === conversationId);
  if (convIndex !== -1) {
    mockConversations[convIndex].lastMessage = newMessage;
    mockConversations[convIndex].updatedAt = new Date();
  }

  // Simulate status updates
  setTimeout(() => {
    newMessage.status = 'delivered';
  }, 1000);
  setTimeout(() => {
    newMessage.status = 'read';
  }, 3000);

  return newMessage;
}

export async function markAsRead(conversationId: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 100));
  const convIndex = mockConversations.findIndex(c => c.id === conversationId);
  if (convIndex !== -1) {
    mockConversations[convIndex].unreadCount = 0;
  }
}

export async function togglePin(conversationId: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 100));
  const convIndex = mockConversations.findIndex(c => c.id === conversationId);
  if (convIndex !== -1) {
    mockConversations[convIndex].isPinned = !mockConversations[convIndex].isPinned;
  }
}

export async function archiveConversation(conversationId: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 100));
  const convIndex = mockConversations.findIndex(c => c.id === conversationId);
  if (convIndex !== -1) {
    mockConversations[convIndex].isArchived = true;
  }
}

export async function searchConversations(query: string): Promise<Conversation[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  const lowerQuery = query.toLowerCase();
  return mockConversations.filter(conv =>
    conv.name.toLowerCase().includes(lowerQuery) ||
    conv.lastMessage?.content.toLowerCase().includes(lowerQuery)
  );
}

export async function addReaction(messageId: string, emoji: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 100));
  // Find and update message
  Object.values(mockMessages).forEach(messages => {
    const msg = messages.find(m => m.id === messageId);
    if (msg) {
      const existingReaction = msg.reactions.find(r => r.userId === 'current-user');
      if (existingReaction) {
        existingReaction.emoji = emoji;
      } else {
        msg.reactions.push({
          emoji,
          userId: 'current-user',
          userName: 'You',
          timestamp: new Date()
        });
      }
    }
  });
}

export async function uploadFile(file: File): Promise<FileAttachment> {
  // Simulate upload with progress
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    id: `file-${Date.now()}`,
    name: file.name,
    size: file.size,
    type: file.type,
    url: URL.createObjectURL(file),
    uploadProgress: 100
  };
}

export function getMockUsers(): User[] {
  return mockUsers;
}
