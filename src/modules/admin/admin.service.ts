import { DB } from 'databases/mysql';
import { IEventRequest } from 'interfaces/event.interface';
import { IUserRequest } from 'interfaces/user.interface';

export const getAllUsers = async () => {
  await DB.sequelize.sync();
  return await DB.Users.findAll();
};

export const getUserById = async (userId: string) => {
  await DB.sequelize.sync();
  return await DB.Users.findOne({ where: { id: userId } });
};

export const deleteUser = async (userId: string) => {
  await DB.sequelize.sync();
  return await DB.Users.destroy({ where: { id: userId } });
};

export const updateUser = async (userId: string, user: IUserRequest) => {
  await DB.sequelize.sync();
  return await DB.Users.update(user, { where: { id: userId } });
};

export const getAllEvents = async () => {
  await DB.sequelize.sync();
  return await DB.Events.findAll();
};
export const getEventById = async (eventId: string) => {
  await DB.sequelize.sync();
  return await DB.Events.findOne({ where: { id: eventId } });
};

export const deleteEvent = async (eventId: string) => {
  await DB.sequelize.sync();
  return await DB.Events.destroy({ where: { id: eventId } });
};

export const updateEvent = async (eventId: string, event: IEventRequest) => {
  await DB.sequelize.sync();
  return await DB.Events.update(event, { where: { id: eventId } });
};
