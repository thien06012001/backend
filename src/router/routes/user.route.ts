import express from 'express';

import {
  createUserController,
  getAllUsersController,
  getUserByIdController,
  updateUserController,
  deleteUserController,
  getEventsByUserIdController,
  getJoinedEventsByUserIdController,
} from 'modules/user/user.controller';

const userRouter = express.Router();

userRouter.get('/:id', getUserByIdController);
userRouter.get('/', getAllUsersController);
userRouter.post('/', createUserController);
userRouter.put('/:id', updateUserController);
userRouter.delete('/:id', deleteUserController);
userRouter.get('/:id/events', getEventsByUserIdController);
userRouter.get('/:id/joined-events', getJoinedEventsByUserIdController);

export default userRouter;
