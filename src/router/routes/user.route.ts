import express from 'express';
import { createUserController, getAllUsersController, getUserByIdController, updateUserController, deleteUserController } from 'modules/user/user.controller';

const userRouter = express.Router();
userRouter.get('/:id', getUserByIdController);
userRouter.get('/', getAllUsersController)
userRouter.post('/', createUserController);
userRouter.put('/:id', updateUserController);
userRouter.delete('/:id', deleteUserController);
export default userRouter;