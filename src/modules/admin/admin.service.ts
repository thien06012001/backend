import { DB } from 'databases/mysql';
import { IEventRequest } from 'interfaces/event.interface';
import { IUserRequest } from 'interfaces/user.interface';

// Get all users
export const getAllUsers = async () => {
  await DB.sequelize.sync();
  return await DB.Users.findAll();
};

// Get a user by their ID
export const getUserById = async (userId: string) => {
  await DB.sequelize.sync();
  return await DB.Users.findOne({ where: { id: userId } });
};

// Delete a user by ID
export const deleteUser = async (userId: string) => {
  await DB.sequelize.sync();
  return await DB.Users.destroy({ where: { id: userId } });
};

// Update user data by ID
export const updateUser = async (userId: string, user: IUserRequest) => {
  await DB.sequelize.sync();
  return await DB.Users.update(user, { where: { id: userId } });
};

// Get all events
export const getAllEvents = async () => {
  await DB.sequelize.sync();
  return await DB.Events.findAll();
};

// Get a specific event by ID
export const getEventById = async (eventId: string) => {
  await DB.sequelize.sync();
  return await DB.Events.findOne({ where: { id: eventId } });
};

// Delete an event by ID
export const deleteEvent = async (eventId: string) => {
  await DB.sequelize.sync();
  return await DB.Events.destroy({ where: { id: eventId } });
};

// Update event data by ID
export const updateEvent = async (eventId: string, event: IEventRequest) => {
  await DB.sequelize.sync();
  return await DB.Events.update(event, { where: { id: eventId } });
};
