import { CustomError } from 'utils/error.custom';
import { repo } from './user.repo';
import { IUserRequest } from 'interfaces/user.interface';

export const getUserById = async (userId: string) => {
  const user = await repo.getById(userId);

  if (!user) {
    throw new CustomError('User not found', 404);
  }

  return user;
};

export const getAllUsers = async () => {
  return await repo.getAll();
};

export const createUser = async (user: IUserRequest) => {
  return await repo.create(user);
};

export const updateUser = async (userId: string, user: IUserRequest) => {
  const [updated] = await repo.update(userId, user);

  if (!updated) {
    throw new CustomError('User not found', 404);
  }

  return user;
};

export const deleteUser = async (userId: string) => {
  const deleted = await repo.delete(userId);

  if (!deleted) {
    throw new CustomError('User not found', 404);
  }

  return deleted;
};

export const getUserByEmail = async (email: string) => {
  return await repo.getByEmail(email);
};

export const getEventsByUserId = async (userId: string) => {
  const events = await repo.getEventsByUserId(userId);

  if (!events) {
    throw new CustomError('No events found for this user', 404);
  }

  return events;
};
