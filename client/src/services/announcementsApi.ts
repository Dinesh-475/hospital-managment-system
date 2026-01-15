import { Announcement, AnnouncementCategory } from '@/types/announcements';

// Mock announcements
const mockAnnouncements: Announcement[] = [
  {
    id: 'ann-1',
    title: 'New Safety Protocols Effective Immediately',
    content: `Dear Hospital Staff,

We are implementing new safety protocols to ensure the well-being of our patients and staff. These changes are effective immediately and include:

1. **Enhanced Sanitization**: All common areas will be sanitized every 2 hours
2. **Mask Policy**: N95 masks are now mandatory in all patient areas
3. **Visitor Restrictions**: Limited to 1 visitor per patient, visiting hours 2-6 PM only
4. **Temperature Checks**: All staff must complete temperature checks at entry points

Please review the full guidelines document attached below. Compliance is mandatory.

Thank you for your cooperation.`,
    excerpt: 'New safety protocols including enhanced sanitization, updated mask policy, and visitor restrictions are now in effect.',
    category: 'urgent',
    status: 'published',
    authorId: 'user-4',
    authorName: 'Admin John Smith',
    authorRole: 'Hospital Administrator',
    authorAvatar: 'https://i.pravatar.cc/150?img=8',
    coverImage: 'https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=800',
    attachments: [{
      name: 'safety_protocols_2026.pdf',
      url: '/mock/safety_protocols.pdf',
      size: 1024000,
      type: 'application/pdf'
    }],
    reactions: [
      { emoji: '👍', count: 45, userIds: ['user-1', 'user-2'] },
      { emoji: '❤️', count: 23, userIds: ['user-3'] }
    ],
    totalReactions: 68,
    viewCount: 142,
    commentCount: 12,
    isPinned: true,
    tags: ['safety', 'protocols', 'mandatory'],
    publishedAt: new Date(Date.now() - 7200000),
    createdAt: new Date(Date.now() - 10800000),
    updatedAt: new Date(Date.now() - 7200000)
  },
  {
    id: 'ann-2',
    title: 'Annual Hospital Gala - Save the Date!',
    content: `Join us for our Annual Hospital Gala on March 15th, 2026!

This year's theme is "Celebrating Healthcare Heroes" and will feature:
- Dinner and entertainment
- Awards ceremony recognizing outstanding staff
- Networking opportunities
- Silent auction to benefit hospital programs

**Date**: March 15, 2026
**Time**: 6:00 PM - 11:00 PM
**Venue**: Grand Ballroom, City Center Hotel
**Dress Code**: Formal

RSVP by February 28th. Tickets are complimentary for all staff members. Guests welcome at $50 per ticket.

We look forward to celebrating with you!`,
    excerpt: 'Annual Hospital Gala on March 15th - celebrating healthcare heroes with dinner, awards, and entertainment.',
    category: 'event',
    status: 'published',
    authorId: 'user-4',
    authorName: 'Admin John Smith',
    authorRole: 'Hospital Administrator',
    authorAvatar: 'https://i.pravatar.cc/150?img=8',
    coverImage: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800',
    reactions: [
      { emoji: '🎉', count: 67, userIds: ['user-1', 'user-2', 'user-3'] },
      { emoji: '❤️', count: 34, userIds: [] }
    ],
    totalReactions: 101,
    viewCount: 89,
    commentCount: 24,
    isPinned: false,
    tags: ['event', 'gala', 'celebration'],
    publishedAt: new Date(Date.now() - 172800000),
    createdAt: new Date(Date.now() - 259200000),
    updatedAt: new Date(Date.now() - 172800000)
  },
  {
    id: 'ann-3',
    title: 'Updated Leave Policy for 2026',
    content: `We are pleased to announce updates to our leave policy for 2026:

**Key Changes:**
- Annual leave increased from 18 to 20 days
- Sick leave can now be carried over (max 5 days)
- New parental leave: 12 weeks paid
- Emergency leave quota increased to 3 days

**Application Process:**
- Submit requests at least 2 weeks in advance
- Manager approval required
- System will auto-check team coverage

The updated policy handbook is available in the HR portal. Please review and acknowledge by January 31st.

Questions? Contact HR at hr@docvista.com`,
    excerpt: 'Updated leave policy includes increased annual leave, sick leave carryover, and enhanced parental leave benefits.',
    category: 'policy',
    status: 'published',
    authorId: 'user-5',
    authorName: 'Staff Maria Garcia',
    authorRole: 'HR Manager',
    authorAvatar: 'https://i.pravatar.cc/150?img=9',
    attachments: [{
      name: 'leave_policy_2026.pdf',
      url: '/mock/leave_policy.pdf',
      size: 756000,
      type: 'application/pdf'
    }],
    reactions: [
      { emoji: '👍', count: 89, userIds: [] },
      { emoji: '❤️', count: 45, userIds: [] }
    ],
    totalReactions: 134,
    viewCount: 156,
    commentCount: 18,
    isPinned: true,
    tags: ['policy', 'leave', 'hr', 'benefits'],
    publishedAt: new Date(Date.now() - 432000000),
    createdAt: new Date(Date.now() - 518400000),
    updatedAt: new Date(Date.now() - 432000000)
  },
  {
    id: 'ann-4',
    title: 'New EMR System Training Sessions',
    content: `We are rolling out a new Electronic Medical Records (EMR) system next month. Mandatory training sessions are scheduled:

**Training Schedule:**
- Doctors: Feb 1-5, 2-4 PM
- Nurses: Feb 8-12, 10 AM-12 PM
- Admin Staff: Feb 15-19, 3-5 PM

**What to Expect:**
- Hands-on training with the new system
- Q&A sessions
- Practice scenarios
- Certification upon completion

Please register for your session through the training portal. Attendance is mandatory.

IT support will be available 24/7 during the transition period.`,
    excerpt: 'Mandatory training for new EMR system scheduled for February - register now through the training portal.',
    category: 'info',
    status: 'published',
    authorId: 'user-5',
    authorName: 'Staff Maria Garcia',
    authorRole: 'IT Manager',
    authorAvatar: 'https://i.pravatar.cc/150?img=9',
    coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
    reactions: [
      { emoji: '👍', count: 34, userIds: [] }
    ],
    totalReactions: 34,
    viewCount: 78,
    commentCount: 9,
    isPinned: false,
    tags: ['training', 'emr', 'technology', 'mandatory'],
    publishedAt: new Date(Date.now() - 604800000),
    createdAt: new Date(Date.now() - 691200000),
    updatedAt: new Date(Date.now() - 604800000)
  }
];

export async function getAnnouncements(): Promise<Announcement[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockAnnouncements.filter(a => a.status === 'published');
}

export async function getAnnouncement(id: string): Promise<Announcement | null> {
  await new Promise(resolve => setTimeout(resolve, 200));
  const announcement = mockAnnouncements.find(a => a.id === id);
  if (announcement) {
    announcement.viewCount++;
  }
  return announcement || null;
}

export async function createAnnouncement(
  title: string,
  content: string,
  category: AnnouncementCategory,
  options?: {
    coverImage?: string;
    attachments?: File[];
    tags?: string[];
    isPinned?: boolean;
  }
): Promise<Announcement> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newAnnouncement: Announcement = {
    id: `ann-${Date.now()}`,
    title,
    content,
    excerpt: content.substring(0, 150) + '...',
    category,
    status: 'published',
    authorId: 'current-user',
    authorName: 'You',
    authorRole: 'Administrator',
    coverImage: options?.coverImage,
    attachments: options?.attachments?.map(file => ({
      name: file.name,
      url: URL.createObjectURL(file),
      size: file.size,
      type: file.type
    })),
    reactions: [],
    totalReactions: 0,
    viewCount: 0,
    commentCount: 0,
    isPinned: options?.isPinned || false,
    tags: options?.tags || [],
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  };

  mockAnnouncements.unshift(newAnnouncement);
  return newAnnouncement;
}

export async function addReaction(announcementId: string, emoji: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const announcement = mockAnnouncements.find(a => a.id === announcementId);
  if (announcement) {
    const existingReaction = announcement.reactions.find(r => r.emoji === emoji);
    if (existingReaction) {
      if (!existingReaction.userIds.includes('current-user')) {
        existingReaction.count++;
        existingReaction.userIds.push('current-user');
        announcement.totalReactions++;
      }
    } else {
      announcement.reactions.push({
        emoji,
        count: 1,
        userIds: ['current-user']
      });
      announcement.totalReactions++;
    }
  }
}

export async function removeReaction(announcementId: string, emoji: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const announcement = mockAnnouncements.find(a => a.id === announcementId);
  if (announcement) {
    const reaction = announcement.reactions.find(r => r.emoji === emoji);
    if (reaction && reaction.userIds.includes('current-user')) {
      reaction.count--;
      reaction.userIds = reaction.userIds.filter(id => id !== 'current-user');
      announcement.totalReactions--;
      
      if (reaction.count === 0) {
        announcement.reactions = announcement.reactions.filter(r => r.emoji !== emoji);
      }
    }
  }
}

export async function searchAnnouncements(query: string): Promise<Announcement[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  const lowerQuery = query.toLowerCase();
  return mockAnnouncements.filter(a =>
    a.title.toLowerCase().includes(lowerQuery) ||
    a.content.toLowerCase().includes(lowerQuery) ||
    a.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

export async function filterByCategory(category: AnnouncementCategory): Promise<Announcement[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockAnnouncements.filter(a => a.category === category);
}
