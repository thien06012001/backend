import { NextFunction, Request, Response } from 'express';
import {
  getNotificationById,
  getNotificationsByUserId,
  getUnreadNotificationsByUserId,
  createNotification,
  bulkCreateNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotificationsByUserId,
} from './notification.service';

export const getNotificationByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const response = await getNotificationById(req.params.notificationId);
    res
      .status(200)
      .json({ message: 'Notification data fetched', data: response });
  } catch (error) {
    next(error);
  }
};

export const getNotificationsByUserIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const response = await getNotificationsByUserId(req.params.userId);
    res
      .status(200)
      .json({ message: 'User notifications fetched', data: response });
  } catch (error) {
    next(error);
  }
};

export const getUnreadNotificationsByUserIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const response = await getUnreadNotificationsByUserId(req.params.userId);
    res
      .status(200)
      .json({ message: 'Unread notifications fetched', data: response });
  } catch (error) {
    next(error);
  }
};

export const createNotificationController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const response = await createNotification(req.body);
    res.status(201).json({ message: 'Notification created', data: response });
  } catch (error) {
    next(error);
  }
};

export const bulkCreateNotificationsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const response = await bulkCreateNotifications(req.body.notifications);
    res.status(201).json({ message: 'Notifications created', data: response });
  } catch (error) {
    next(error);
  }
};

export const markNotificationAsReadController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const response = await markNotificationAsRead(req.params.notificationId);
    res
      .status(200)
      .json({ message: 'Notification marked as read', data: response });
  } catch (error) {
    next(error);
  }
};

export const markAllNotificationsAsReadController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const response = await markAllNotificationsAsRead(req.params.userId);
    res
      .status(200)
      .json({ message: 'All notifications marked as read', data: response });
  } catch (error) {
    next(error);
  }
};

export const deleteNotificationController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const response = await deleteNotification(req.params.notificationId);
    res.status(200).json({ message: 'Notification deleted', data: response });
  } catch (error) {
    next(error);
  }
};

export const deleteAllNotificationsByUserIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const response = await deleteAllNotificationsByUserId(req.params.userId);
    res
      .status(200)
      .json({ message: 'All user notifications deleted', data: response });
  } catch (error) {
    next(error);
  }
};
