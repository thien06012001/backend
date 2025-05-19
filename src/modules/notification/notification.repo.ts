import { DB } from 'databases/mysql';
import {
  INotificationRequest,
  Notification,
} from 'interfaces/notification.interface';

export const notificationRepo = {
  // Get a notification by ID (includes user info)
  getById: async (notificationId: string): Promise<Notification | null> => {
    await DB.sequelize.sync();
    return await DB.Notifications.findOne({
      where: { id: notificationId },
      include: [{ model: DB.Users, as: 'user' }],
    });
  },

  // Get all notifications for a user (most recent first)
  getByUserId: async (userId: string): Promise<Notification[]> => {
    await DB.sequelize.sync();
    return await DB.Notifications.findAll({
      where: { userId },
      order: [['created_at', 'DESC']],
    });
  },

  // Get unread notifications for a user (most recent first)
  getUnreadByUserId: async (userId: string): Promise<Notification[]> => {
    await DB.sequelize.sync();
    return await DB.Notifications.findAll({
      where: {
        userId,
        isRead: false,
      },
      order: [['created_at', 'DESC']],
    });
  },

  // Create a new notification (defaults isRead to false)
  create: async (notification: INotificationRequest): Promise<Notification> => {
    await DB.sequelize.sync();
    return await DB.Notifications.create({
      ...notification,
      isRead: notification.isRead ?? false,
    });
  },

  // Bulk create multiple notifications (defaults isRead to false)
  bulkCreate: async (
    notifications: INotificationRequest[],
  ): Promise<Notification[]> => {
    await DB.sequelize.sync();
    return await DB.Notifications.bulkCreate(
      notifications.map((notification) => ({
        ...notification,
        isRead: notification.isRead ?? false,
      })),
    );
  },

  // Mark a single notification as read
  markAsRead: async (notificationId: string): Promise<[number]> => {
    await DB.sequelize.sync();
    return await DB.Notifications.update(
      { isRead: true },
      { where: { id: notificationId } },
    );
  },

  // Mark all unread notifications for a user as read
  markAllAsRead: async (userId: string): Promise<[number]> => {
    await DB.sequelize.sync();
    return await DB.Notifications.update(
      { isRead: true },
      {
        where: {
          userId,
          isRead: false,
        },
      },
    );
  },

  // Delete a single notification by ID
  delete: async (notificationId: string): Promise<number> => {
    await DB.sequelize.sync();
    return await DB.Notifications.destroy({ where: { id: notificationId } });
  },

  // Delete all notifications for a specific user
  deleteAllByUserId: async (userId: string): Promise<number> => {
    await DB.sequelize.sync();
    return await DB.Notifications.destroy({ where: { userId } });
  },
};
