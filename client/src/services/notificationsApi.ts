import { Notification, NotificationPreferences, NotificationType } from '@/types/notifications';

// Mock notifications
let mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'message',
    priority: 'medium',
    title: 'New message from Dr. Sarah Johnson',
    description: 'Can you review the patient file I sent?',
    icon: '💬',
    actionUrl: '/messages/conv-1',
    senderId: 'user-1',
    senderName: 'Dr. Sarah Johnson',
    senderAvatar: 'https://i.pravatar.cc/150?img=1',
    isRead: false,
    createdAt: new Date(Date.now() - 120000)
  },
  {
    id: 'notif-2',
    type: 'leave_approved',
    priority: 'high',
    title: 'Leave Request Approved',
    description: 'Your vacation leave from Feb 15-20 has been approved',
    icon: '✅',
    actionUrl: '/leave/requests',
    senderId: 'user-4',
    senderName: 'Admin John Smith',
    isRead: false,
    createdAt: new Date(Date.now() - 3600000)
  },
  {
    id: 'notif-3',
    type: 'announcement',
    priority: 'urgent',
    title: 'Hospital-wide Announcement',
    description: 'New safety protocols effective immediately',
    icon: '📢',
    actionUrl: '/announcements/ann-1',
    senderId: 'user-4',
    senderName: 'Admin John Smith',
    isRead: true,
    createdAt: new Date(Date.now() - 7200000),
    readAt: new Date(Date.now() - 3600000)
  },
  {
    id: 'notif-4',
    type: 'shift_change',
    priority: 'high',
    title: 'Shift Change Request',
    description: 'Dr. Michael Brown requested to swap shifts with you',
    icon: '🔄',
    actionUrl: '/schedule',
    senderId: 'user-3',
    senderName: 'Dr. Michael Brown',
    isRead: true,
    createdAt: new Date(Date.now() - 86400000),
    readAt: new Date(Date.now() - 82800000)
  },
  {
    id: 'notif-5',
    type: 'appointment_reminder',
    priority: 'medium',
    title: 'Upcoming Appointment',
    description: 'Patient consultation in 30 minutes - Room 204',
    icon: '📅',
    actionUrl: '/appointments',
    isRead: false,
    createdAt: new Date(Date.now() - 1800000)
  }
];

// Mock preferences
let mockPreferences: NotificationPreferences = {
  userId: 'current-user',
  emailNotifications: {
    enabled: true,
    types: ['leave_approved', 'leave_rejected', 'announcement', 'shift_change']
  },
  smsNotifications: {
    enabled: false,
    types: []
  },
  inAppNotifications: {
    enabled: true,
    types: ['message', 'leave_request', 'leave_approved', 'leave_rejected', 'shift_change', 'appointment_reminder', 'announcement', 'attendance_alert', 'system', 'mention']
  },
  soundAlerts: true,
  quietHours: {
    enabled: true,
    startTime: '22:00',
    endTime: '07:00'
  },
  digestMode: {
    enabled: false,
    frequency: 'daily'
  }
};

export async function getNotifications(): Promise<Notification[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockNotifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function getUnreadCount(): Promise<number> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockNotifications.filter(n => !n.isRead).length;
}

export async function markAsRead(notificationId: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 100));
  const notif = mockNotifications.find(n => n.id === notificationId);
  if (notif && !notif.isRead) {
    notif.isRead = true;
    notif.readAt = new Date();
  }
}

export async function markAllAsRead(): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 200));
  mockNotifications.forEach(n => {
    if (!n.isRead) {
      n.isRead = true;
      n.readAt = new Date();
    }
  });
}

export async function deleteNotification(notificationId: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 100));
  mockNotifications = mockNotifications.filter(n => n.id !== notificationId);
}

export async function clearAllNotifications(): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 200));
  mockNotifications = [];
}

export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockPreferences;
}

export async function updateNotificationPreferences(
  preferences: Partial<NotificationPreferences>
): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 300));
  mockPreferences = { ...mockPreferences, ...preferences };
}

export async function sendNotification(
  type: NotificationType,
  title: string,
  description: string,
  options?: {
    priority?: Notification['priority'];
    actionUrl?: string;
    senderId?: string;
    senderName?: string;
  }
): Promise<Notification> {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const newNotif: Notification = {
    id: `notif-${Date.now()}`,
    type,
    priority: options?.priority || 'medium',
    title,
    description,
    actionUrl: options?.actionUrl,
    senderId: options?.senderId,
    senderName: options?.senderName,
    isRead: false,
    createdAt: new Date()
  };

  mockNotifications.unshift(newNotif);
  return newNotif;
}

// Simulate real-time notification
export function simulateNotification(): void {
  const types: NotificationType[] = ['message', 'appointment_reminder', 'shift_change'];
  const randomType = types[Math.floor(Math.random() * types.length)];
  
  sendNotification(
    randomType,
    'New Notification',
    'This is a simulated real-time notification',
    { priority: 'medium' }
  );
}
