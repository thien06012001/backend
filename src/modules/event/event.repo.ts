import { DB } from 'databases/mysql';
import { IEventRequest, Event } from 'interfaces/event.interface';

export const eventRepo = {
  getById: async (eventId: string): Promise<Event | null> => {
    await DB.sequelize.sync();
    return await DB.Events.findOne({
      where: { id: eventId },
      include: [
        { model: DB.Users, as: 'owner' },
        { model: DB.Users, as: 'participants' },
        {
          model: DB.Posts,
          as: 'posts',
          include: [
            {
              model: DB.Comments,
              as: 'comments',
              include: [{ model: DB.Users, as: 'user' }], // comment.user
            },
            { model: DB.Users, as: 'author' }, // post.user
          ],
        },
      ],
    });
  },

  getAll: async (): Promise<Event[]> => {
    await DB.sequelize.sync();
    return await DB.Events.findAll({
      include: [
        { model: DB.Users, as: 'owner' },
        { model: DB.Users, as: 'participants' },
      ],
    });
  },

  create: async (event: IEventRequest): Promise<Event> => {
    await DB.sequelize.sync();
    return await DB.Events.create(event);
  },

  update: async (eventId: string, event: IEventRequest): Promise<[number]> => {
    await DB.sequelize.sync();
    return await DB.Events.update(event, { where: { id: eventId } });
  },

  delete: async (eventId: string): Promise<number> => {
    await DB.sequelize.sync();
    return await DB.Events.destroy({ where: { id: eventId } });
  },
};
