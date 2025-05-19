import { DB } from 'databases/mysql';
import { IRequest, Request } from 'interfaces/request.interface';

export const requestRepo = {
  // Create a new join request for an event
  create: async (request: IRequest): Promise<Request> => {
    await DB.sequelize.sync();
    return await DB.Requests.create({ ...request });
  },
  // Get all request for a specific event and user
  findByEventAndUser: async (
    eventId: string,
    userId: string,
  ): Promise<Request | null> => {
    await DB.sequelize.sync();
    return await DB.Requests.findOne({
      where: { eventId, userId },
    });
  },

  // Cancel (delete) a request by userId and eventId
  cancel: async (userId: string, eventId: string): Promise<number> => {
    await DB.sequelize.sync();
    return await DB.Requests.destroy({ where: { userId, eventId } });
  },

  // Get a request by its ID, including related user and event
  getById: async (requestId: string): Promise<Request | null> => {
    await DB.sequelize.sync();
    return await DB.Requests.findOne({
      where: { id: requestId },
      include: [
        { model: DB.Users, as: 'user' },
        { model: DB.Events, as: 'event' },
      ],
    });
  },
};
