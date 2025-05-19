// Import custom error class, repository, user interface, and bcrypt for password hashing
import { CustomError } from 'utils/error.custom';
import { repo } from './user.repo';
import { IUserRequest } from 'interfaces/user.interface';
import { hash } from 'bcrypt';

// Get a user by their ID
export const getUserById = async (userId: string) => {
  const user = await repo.getById(userId);

  if (!user) {
    throw new CustomError('User not found', 404);
  }

  return user;
};

// Retrieve all users from the database
export const getAllUsers = async () => {
  return await repo.getAll();
};

// Create a new user
export const createUser = async (user: IUserRequest) => {
  return await repo.create(user);
};

// Update an existing user
export const updateUser = async (userId: string, user: IUserRequest) => {
  const { password, ...rest } = user;

  const updatedData: IUserRequest = { ...rest, password };

  // If password is provided, hash it before saving
  if (password) {
    updatedData.password = await hash(password, 12);
  }

  // Attempt to update user in the database
  const [updated] = await repo.update(userId, updatedData);

  if (!updated) {
    throw new CustomError('User not found', 404);
  }

  return updatedData;
};

// Delete a user by ID
export const deleteUser = async (userId: string) => {
  const deleted = await repo.delete(userId);

  if (!deleted) {
    throw new CustomError('User not found', 404);
  }

  return deleted;
};

// Find a user by their email address
export const getUserByEmail = async (email: string) => {
  return await repo.getByEmail(email);
};

// Get events created by a specific user
export const getEventsByUserId = async (userId: string) => {
  const events = await repo.getEventsByUserId(userId);

  if (!events) {
    throw new CustomError('No events found for this user', 404);
  }

  return events;
};

// Get events the user has joined (but not created)
export const getJoinedEventsByUserId = async (userId: string) => {
  const events = await repo.getJoinedEventsByUserId(userId);

  if (!events) {
    throw new CustomError('No joined events found for this user', 404);
  }

  return events;
};
