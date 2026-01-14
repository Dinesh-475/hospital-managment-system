import { Channel, ChannelMember } from '@/types/channels';

// Mock channels
let mockChannels: Channel[] = [
  {
    id: 'channel-1',
    name: 'Cardiology Team',
    description: 'Discussions and updates for the cardiology department',
    icon: '❤️',
    category: 'department',
    members: [
      {
        userId: 'user-1',
        userName: 'Dr. Sarah Johnson',
        userAvatar: 'https://i.pravatar.cc/150?img=1',
        userRole: 'doctor',
        channelRole: 'admin',
        joinedAt: new Date(Date.now() - 2592000000)
      },
      {
        userId: 'user-3',
        userName: 'Dr. Michael Brown',
        userAvatar: 'https://i.pravatar.cc/150?img=12',
        userRole: 'doctor',
        channelRole: 'member',
        joinedAt: new Date(Date.now() - 1296000000)
      }
    ],
    memberCount: 12,
    settings: {
      postPermission: 'all',
      canMembersAddOthers: false,
      visibility: 'private',
      allowReactions: true,
      allowFileSharing: true
    },
    pinnedMessages: [
      {
        messageId: 'pin-1',
        content: 'Weekly team meetings every Monday at 9 AM',
        pinnedBy: 'Dr. Sarah Johnson',
        pinnedAt: new Date(Date.now() - 604800000)
      }
    ],
    createdBy: 'user-1',
    createdAt: new Date(Date.now() - 7776000000),
    isMuted: false,
    unreadCount: 3
  },
  {
    id: 'channel-2',
    name: 'Emergency Department',
    description: 'Emergency department coordination and urgent updates',
    icon: '🚨',
    category: 'department',
    members: [
      {
        userId: 'user-2',
        userName: 'Nurse Emily Chen',
        userAvatar: 'https://i.pravatar.cc/150?img=5',
        userRole: 'nurse',
        channelRole: 'moderator',
        joinedAt: new Date(Date.now() - 1296000000)
      }
    ],
    memberCount: 24,
    settings: {
      postPermission: 'all',
      canMembersAddOthers: false,
      visibility: 'private',
      allowReactions: true,
      allowFileSharing: true
    },
    pinnedMessages: [],
    createdBy: 'user-4',
    createdAt: new Date(Date.now() - 5184000000),
    isMuted: false,
    unreadCount: 8
  },
  {
    id: 'channel-3',
    name: 'Hospital Announcements',
    description: 'Official hospital-wide announcements and updates',
    icon: '📢',
    category: 'announcement',
    members: [],
    memberCount: 156,
    settings: {
      postPermission: 'admins_only',
      canMembersAddOthers: false,
      visibility: 'public',
      allowReactions: true,
      allowFileSharing: true
    },
    pinnedMessages: [
      {
        messageId: 'pin-2',
        content: 'New hospital policies effective from next month',
        pinnedBy: 'Admin John Smith',
        pinnedAt: new Date(Date.now() - 86400000)
      }
    ],
    createdBy: 'user-4',
    createdAt: new Date(Date.now() - 15552000000),
    isMuted: false,
    unreadCount: 2
  },
  {
    id: 'channel-4',
    name: 'Nursing Staff',
    description: 'Coordination and support for nursing staff',
    icon: '👩‍⚕️',
    category: 'department',
    members: [
      {
        userId: 'user-2',
        userName: 'Nurse Emily Chen',
        userAvatar: 'https://i.pravatar.cc/150?img=5',
        userRole: 'nurse',
        channelRole: 'admin',
        joinedAt: new Date(Date.now() - 3888000000)
      }
    ],
    memberCount: 45,
    settings: {
      postPermission: 'all',
      canMembersAddOthers: true,
      visibility: 'private',
      allowReactions: true,
      allowFileSharing: true
    },
    pinnedMessages: [],
    createdBy: 'user-2',
    createdAt: new Date(Date.now() - 10368000000),
    isMuted: false,
    unreadCount: 0
  },
  {
    id: 'channel-5',
    name: 'IT Support',
    description: 'Technical support and system updates',
    icon: '💻',
    category: 'general',
    members: [
      {
        userId: 'user-5',
        userName: 'Staff Maria Garcia',
        userAvatar: 'https://i.pravatar.cc/150?img=9',
        userRole: 'staff',
        channelRole: 'admin',
        joinedAt: new Date(Date.now() - 2592000000)
      }
    ],
    memberCount: 8,
    settings: {
      postPermission: 'all',
      canMembersAddOthers: true,
      visibility: 'public',
      allowReactions: true,
      allowFileSharing: true
    },
    pinnedMessages: [],
    createdBy: 'user-5',
    createdAt: new Date(Date.now() - 6480000000),
    isMuted: false,
    unreadCount: 1
  }
];

export async function getChannels(): Promise<Channel[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockChannels;
}

export async function getChannel(channelId: string): Promise<Channel | null> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockChannels.find(c => c.id === channelId) || null;
}

export async function createChannel(
  name: string,
  description: string,
  category: Channel['category'],
  settings: Channel['settings']
): Promise<Channel> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newChannel: Channel = {
    id: `channel-${Date.now()}`,
    name,
    description,
    icon: '📁',
    category,
    members: [{
      userId: 'current-user',
      userName: 'You',
      userRole: 'admin',
      channelRole: 'admin',
      joinedAt: new Date()
    }],
    memberCount: 1,
    settings,
    pinnedMessages: [],
    createdBy: 'current-user',
    createdAt: new Date(),
    isMuted: false,
    unreadCount: 0
  };

  mockChannels.push(newChannel);
  return newChannel;
}

export async function addMemberToChannel(
  channelId: string,
  userId: string,
  userName: string,
  userRole: ChannelMember['userRole']
): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const channel = mockChannels.find(c => c.id === channelId);
  if (channel) {
    channel.members.push({
      userId,
      userName,
      userRole,
      channelRole: 'member',
      joinedAt: new Date()
    });
    channel.memberCount++;
  }
}

export async function removeMemberFromChannel(
  channelId: string,
  userId: string
): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const channel = mockChannels.find(c => c.id === channelId);
  if (channel) {
    channel.members = channel.members.filter(m => m.userId !== userId);
    channel.memberCount--;
  }
}

export async function toggleMuteChannel(channelId: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 100));
  const channel = mockChannels.find(c => c.id === channelId);
  if (channel) {
    channel.isMuted = !channel.isMuted;
  }
}

export async function leaveChannel(channelId: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 300));
  mockChannels = mockChannels.filter(c => c.id !== channelId);
}

export async function updateChannelSettings(
  channelId: string,
  settings: Partial<Channel['settings']>
): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const channel = mockChannels.find(c => c.id === channelId);
  if (channel) {
    channel.settings = { ...channel.settings, ...settings };
  }
}
