export type ChannelVisibility = 'public' | 'private';
export type ChannelMemberRole = 'admin' | 'moderator' | 'member';
export type PostPermission = 'all' | 'admins_only' | 'moderators_and_admins';

export interface ChannelMember {
  userId: string;
  userName: string;
  userAvatar?: string;
  userRole: 'patient' | 'doctor' | 'nurse' | 'staff' | 'manager' | 'admin';
  channelRole: ChannelMemberRole;
  joinedAt: Date;
}

export interface PinnedMessage {
  messageId: string;
  content: string;
  pinnedBy: string;
  pinnedAt: Date;
}

export interface ChannelSettings {
  postPermission: PostPermission;
  canMembersAddOthers: boolean;
  visibility: ChannelVisibility;
  allowReactions: boolean;
  allowFileSharing: boolean;
}

export interface Channel {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'department' | 'project' | 'announcement' | 'general';
  members: ChannelMember[];
  memberCount: number;
  settings: ChannelSettings;
  pinnedMessages: PinnedMessage[];
  createdBy: string;
  createdAt: Date;
  isMuted: boolean;
  unreadCount: number;
}

export interface ChannelInvite {
  id: string;
  channelId: string;
  channelName: string;
  invitedBy: string;
  invitedByName: string;
  invitedUser: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date;
}
