import { IBase } from './base.interface';
import { User } from './user.interface';

export interface INotificationRequest {
  userId: string;
  title: string;
  description: string;
  isRead?: boolean;
}

export interface Notification extends IBase, INotificationRequest {
  user?: User; // The user this notification belongs to
  isRead: boolean; // Whether the notification has been read
}
