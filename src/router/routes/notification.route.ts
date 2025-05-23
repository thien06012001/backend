import express from 'express';
import {
  getNotificationByIdController,
  getNotificationsByUserIdController,
  getUnreadNotificationsByUserIdController,
  createNotificationController,
  bulkCreateNotificationsController,
  markNotificationAsReadController,
  markAllNotificationsAsReadController,
  deleteNotificationController,
  deleteAllNotificationsByUserIdController,
} from 'modules/notification/notification.controller';

const notificationRouter = express.Router();

notificationRouter.get('/:notificationId', getNotificationByIdController);
notificationRouter.get('/user/:userId', getNotificationsByUserIdController);
notificationRouter.get(
  '/user/:userId/unread',
  getUnreadNotificationsByUserIdController,
);
notificationRouter.post('/', createNotificationController);
notificationRouter.post('/bulk', bulkCreateNotificationsController);
notificationRouter.put(
  '/:notificationId/read',
  markNotificationAsReadController,
);
notificationRouter.put(
  '/user/:userId/read/all',
  markAllNotificationsAsReadController,
);
notificationRouter.delete('/:notificationId', deleteNotificationController);
notificationRouter.delete(
  '/user/:userId/all',
  deleteAllNotificationsByUserIdController,
);

export default notificationRouter;
