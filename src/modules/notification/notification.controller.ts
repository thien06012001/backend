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

// Get a single notification by ID
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

// Get all notifications for a specific user
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

// Get unread notifications for a specific user
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

// Create a new notification
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

// Create multiple notifications in bulk
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

// Mark a notification as read
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

// Mark all notifications as read for a user
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

// Delete a single notification by ID
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

// Delete all notifications for a specific user
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
