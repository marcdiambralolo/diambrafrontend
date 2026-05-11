export type NotificationType =
  | 'CONSULTATION_RESULT'
  | 'CONSULTATION_ASSIGNED'
  | 'PAYMENT_CONFIRMED'
  | 'SYSTEM_ANNOUNCEMENT'
  | 'GRADE_CHANGE';

export interface NotificationMetadata {
  consultationId?: string;
  knowledgeId?: string;
  paymentId?: string;
  url?: string;
  [key: string]: unknown;
}

export interface Notification {
  _id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  metadata?: NotificationMetadata;
  readAt?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface NotificationResponse {
  notifications: Notification[];
  unreadCount: number;
  total: number;
}

export interface NotificationPreferences {
  consultationReady: boolean;
  newKnowledge: boolean;
  systemUpdates: boolean;
  promotions: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
}
