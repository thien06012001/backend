import { DB } from 'databases/mysql';
import { IRequest, Request } from 'interfaces/request.interface';

export const requestRepo = {
  create: async (post: IRequest): Promise<Request> => {
    await DB.sequelize.sync();
    return await DB.Requests.create({ ...post });
  },
  cancel: async (userId: string, eventId: string): Promise<number> => {
    await DB.sequelize.sync();
    return await DB.Requests.destroy({ where: { userId, eventId } });
  },
  getById: async (requestId: string): Promise<Request | null> => {
    await DB.sequelize.sync();
    return await DB.Requests.findOne({
      where: { id: requestId },
      include: [
        { model: DB.Users, as: 'user' },
        {
          model: DB.Events,
          as: 'event',
        },
      ],
    });
  },
};
