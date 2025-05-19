import { CustomError } from 'utils/error.custom';
import { notificationRepo } from './notification.repo';
import { INotificationRequest } from 'interfaces/notification.interface';
import { repo as userRepo } from 'modules/user/user.repo';

// Get a notification by ID
export const getNotificationById = async (notificationId: string) => {
  const notification = await notificationRepo.getById(notificationId);

  if (!notification) {
    throw new CustomError('Notification not found', 404);
  }

  return notification;
};

// Get all notifications for a user (marks all as read)
export const getNotificationsByUserId = async (userId: string) => {
  const user = await userRepo.getById(userId);
  if (!user) {
    throw new CustomError('User not found', 404);
  }

  await notificationRepo.markAllAsRead(userId);
  return await notificationRepo.getByUserId(userId);
};

// Get only unread notifications for a user
export const getUnreadNotificationsByUserId = async (userId: string) => {
  const user = await userRepo.getById(userId);
  if (!user) {
    throw new CustomError('User not found', 404);
  }

  return await notificationRepo.getUnreadByUserId(userId);
};

// Create a notification after verifying user exists
export const createNotification = async (
  notification: INotificationRequest,
) => {
  const user = await userRepo.getById(notification.userId);
  if (!user) {
    throw new CustomError('User not found', 404);
  }

  return await notificationRepo.create(notification);
};

// Create multiple notifications (validates each user)
export const bulkCreateNotifications = async (
  notifications: INotificationRequest[],
) => {
  for (const notification of notifications) {
    const user = await userRepo.getById(notification.userId);
    if (!user) {
      throw new CustomError(
        `User with ID ${notification.userId} not found`,
        404,
      );
    }
  }

  return await notificationRepo.bulkCreate(notifications);
};

// Mark a notification as read if it hasn't been read
export const markNotificationAsRead = async (notificationId: string) => {
  const notification = await getNotificationById(notificationId);

  if (notification.isRead) {
    return notification;
  }

  const [updated] = await notificationRepo.markAsRead(notificationId);
  if (!updated) {
    throw new CustomError('Failed to mark notification as read', 500);
  }

  return await getNotificationById(notificationId);
};

// Mark all notifications for a user as read
export const markAllNotificationsAsRead = async (userId: string) => {
  const user = await userRepo.getById(userId);
  if (!user) {
    throw new CustomError('User not found', 404);
  }

  const [updated] = await notificationRepo.markAllAsRead(userId);
  return { count: updated };
};

// Delete a single notification by ID
export const deleteNotification = async (notificationId: string) => {
  await getNotificationById(notificationId);

  const deleted = await notificationRepo.delete(notificationId);
  if (!deleted) {
    throw new CustomError('Failed to delete notification', 500);
  }

  return deleted;
};

// Delete all notifications for a specific user
export const deleteAllNotificationsByUserId = async (userId: string) => {
  const user = await userRepo.getById(userId);
  if (!user) {
    throw new CustomError('User not found', 404);
  }

  const deleted = await notificationRepo.deleteAllByUserId(userId);
  return { count: deleted };
};
