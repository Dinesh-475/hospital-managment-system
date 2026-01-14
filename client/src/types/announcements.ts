export type AnnouncementCategory = 'urgent' | 'info' | 'event' | 'policy' | 'general';
export type AnnouncementStatus = 'draft' | 'published' | 'archived';

export interface AnnouncementReaction {
  emoji: string;
  count: number;
  userIds: string[];
}

export interface AnnouncementComment {
  id: string;
  announcementId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: Date;
  editedAt?: Date;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: AnnouncementCategory;
  status: AnnouncementStatus;
  authorId: string;
  authorName: string;
  authorRole: string;
  authorAvatar?: string;
  coverImage?: string;
  attachments?: {
    name: string;
    url: string;
    size: number;
    type: string;
  }[];
  reactions: AnnouncementReaction[];
  totalReactions: number;
  viewCount: number;
  commentCount: number;
  isPinned: boolean;
  tags: string[];
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
}

export interface AnnouncementFilter {
  category?: AnnouncementCategory;
  searchQuery?: string;
  tags?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface AnnouncementSort {
  field: 'publishedAt' | 'viewCount' | 'totalReactions' | 'commentCount';
  order: 'asc' | 'desc';
}
