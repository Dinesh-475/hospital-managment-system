export type NotificationType = 
  | 'message'
  | 'leave_request'
  | 'leave_approved'
  | 'leave_rejected'
  | 'shift_change'
  | 'appointment_reminder'
  | 'announcement'
  | 'attendance_alert'
  | 'system'
  | 'mention';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  description: string;
  icon?: string;
  actionUrl?: string;
  actionLabel?: string;
  senderId?: string;
  senderName?: string;
  senderAvatar?: string;
  isRead: boolean;
  createdAt: Date;
  readAt?: Date;
}

export interface NotificationPreferences {
  userId: string;
  emailNotifications: {
    enabled: boolean;
    types: NotificationType[];
  };
  smsNotifications: {
    enabled: boolean;
    types: NotificationType[];
  };
  inAppNotifications: {
    enabled: boolean;
    types: NotificationType[];
  };
  soundAlerts: boolean;
  quietHours: {
    enabled: boolean;
    startTime: string; // HH:MM format
    endTime: string;   // HH:MM format
  };
  digestMode: {
    enabled: boolean;
    frequency: 'hourly' | 'daily' | 'weekly';
  };
}

export interface NotificationGroup {
  date: string; // YYYY-MM-DD
  notifications: Notification[];
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<NotificationType, number>;
  byPriority: Record<NotificationPriority, number>;
}
