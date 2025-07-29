export interface NotificationItem {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  category: 'system' | 'user' | 'company' | 'finance';
  actionUrl?: string;
} 