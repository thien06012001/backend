import { CustomError } from 'utils/error.custom';
import { notificationRepo } from './notification.repo';
import { INotificationRequest } from 'interfaces/notification.interface';
import { repo as userRepo } from 'modules/user/user.repo';

export const getNotificationById = async (notificationId: string) => {
  const notification = await notificationRepo.getById(notificationId);

  if (!notification) {
    throw new CustomError('Notification not found', 404);
  }

  return notification;
};

export const getNotificationsByUserId = async (userId: string) => {
  // Check if user exists
  const user = await userRepo.getById(userId);

  if (!user) {
    throw new CustomError('User not found', 404);
  }
  await notificationRepo.markAllAsRead(userId);
  return await notificationRepo.getByUserId(userId);
};

export const getUnreadNotificationsByUserId = async (userId: string) => {
  // Check if user exists
  const user = await userRepo.getById(userId);
  if (!user) {
    throw new CustomError('User not found', 404);
  }

  return await notificationRepo.getUnreadByUserId(userId);
};

export const createNotification = async (
  notification: INotificationRequest,
) => {
  // Check if user exists
  const user = await userRepo.getById(notification.userId);
  if (!user) {
    throw new CustomError('User not found', 404);
  }

  return await notificationRepo.create(notification);
};

export const bulkCreateNotifications = async (
  notifications: INotificationRequest[],
) => {
  // Check if all users exist
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

export const markNotificationAsRead = async (notificationId: string) => {
  const notification = await getNotificationById(notificationId);

  if (notification.isRead) {
    return notification; // Already read, no need to update
  }

  const [updated] = await notificationRepo.markAsRead(notificationId);

  if (!updated) {
    throw new CustomError('Failed to mark notification as read', 500);
  }

  return await getNotificationById(notificationId);
};

export const markAllNotificationsAsRead = async (userId: string) => {
  // Check if user exists
  const user = await userRepo.getById(userId);
  if (!user) {
    throw new CustomError('User not found', 404);
  }

  const [updated] = await notificationRepo.markAllAsRead(userId);

  return { count: updated };
};

export const deleteNotification = async (notificationId: string) => {
  const notification = await getNotificationById(notificationId);

  const deleted = await notificationRepo.delete(notificationId);

  if (!deleted) {
    throw new CustomError('Failed to delete notification', 500);
  }

  return deleted;
};

export const deleteAllNotificationsByUserId = async (userId: string) => {
  // Check if user exists
  const user = await userRepo.getById(userId);
  if (!user) {
    throw new CustomError('User not found', 404);
  }

  const deleted = await notificationRepo.deleteAllByUserId(userId);

  return { count: deleted };
};
