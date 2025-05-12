import { DB } from 'databases/mysql';
import {
  INotificationRequest,
  Notification,
} from 'interfaces/notification.interface';

export const notificationRepo = {
  getById: async (notificationId: string): Promise<Notification | null> => {
    await DB.sequelize.sync();
    return await DB.Notifications.findOne({
      where: { id: notificationId },
      include: [{ model: DB.Users, as: 'user' }],
    });
  },

  getByUserId: async (userId: string): Promise<Notification[]> => {
    await DB.sequelize.sync();
    return await DB.Notifications.findAll({
      where: { userId },
      order: [['created_at', 'DESC']],
    });
  },

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

  create: async (notification: INotificationRequest): Promise<Notification> => {
    await DB.sequelize.sync();
    return await DB.Notifications.create({
      ...notification,
      isRead: notification.isRead ?? false,
    });
  },

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

  markAsRead: async (notificationId: string): Promise<[number]> => {
    await DB.sequelize.sync();
    return await DB.Notifications.update(
      { isRead: true },
      { where: { id: notificationId } },
    );
  },

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

  delete: async (notificationId: string): Promise<number> => {
    await DB.sequelize.sync();
    return await DB.Notifications.destroy({ where: { id: notificationId } });
  },

  deleteAllByUserId: async (userId: string): Promise<number> => {
    await DB.sequelize.sync();
    return await DB.Notifications.destroy({ where: { userId } });
  },
};
