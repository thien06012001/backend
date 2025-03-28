import { NextFunction, Request, Response } from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser,
} from './user.service';
export const getUserByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const response = await getUserById(req.params.userId);
    res.status(200).json({ message: 'User data fetched', data: response });
  } catch (error) {
    next(error);
  }
};
export const getAllUsersController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const response = await getAllUsers();
    res.status(200).json({ message: 'All users fetched', data: response });
  } catch (error) {
    next(error);
  }
};
export const createUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const response = await createUser(req.body);
    res.status(201).json({ message: 'User created', data: response });
  } catch (error) {
    next(error);
  }
};
export const updateUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const response = await updateUser(req.params.userId, req.body);
    res.status(200).json({ message: 'User updated', data: response });
  } catch (error) {
    next(error);
  }
};
export const deleteUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const response = await deleteUser(req.params.userId);
    res.status(200).json({ message: 'User deleted', data: response });
  } catch (error) {
    next(error);
  }
};
