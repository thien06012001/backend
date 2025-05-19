import express from 'express';

import {
  deleteEventController,
  deleteUserController,
  getAllEventsController,
  getAllUserController,
  getEventByIdController,
  getUserByIdController,
  updateEventController,
  updateUserController,
} from 'modules/admin/admin.controller';

const adminRouter = express.Router();

adminRouter.get('/users/all', getAllUserController);
adminRouter.get('/users/:userId', getUserByIdController);
adminRouter.delete('/users/:userId', deleteUserController);
adminRouter.put('/users/:userId', updateUserController);
adminRouter.get('/events/all', getAllEventsController);
adminRouter.get('/events/:eventId', getEventByIdController);
adminRouter.delete('/events/:eventId', deleteEventController);
adminRouter.put('/events/:eventId', updateEventController);

export default adminRouter;
