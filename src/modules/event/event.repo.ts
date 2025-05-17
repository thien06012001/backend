import { DB } from 'databases/mysql';
import { IEventRequest, Event } from 'interfaces/event.interface';

export const eventRepo = {
  getById: async (eventId: string): Promise<Event | null> => {
    await DB.sequelize.sync();
    return await DB.Events.findOne({
      where: { id: eventId },
      include: [
        {
          model: DB.Users,
          as: 'participants',
          attributes: ['id', 'email', 'name', 'phone'],
        },
      ],
    });
  },

  getAll: async (): Promise<Event[]> => {
    await DB.sequelize.sync();

    return await DB.Events.findAll({
      include: [
        { model: DB.Users, as: 'owner', attributes: ['id', 'email'] },
        {
          model: DB.Users,
          as: 'participants',
          attributes: ['id'],
        },
        {
          model: DB.Requests,
          as: 'requests',
          attributes: ['id', 'user_id', 'event_id', 'status'],
        },
      ],
      where: {
        is_public: true,
      },
      attributes: ['id', 'name', 'start_time', 'end_time', 'location'],
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

  removeParticipant: async (
    eventId: string,
    userId: string,
  ): Promise<number> => {
    await DB.sequelize.sync();
    return await DB.EventParticipants.destroy({
      where: {
        event_id: eventId,
        user_id: userId,
      },
    });
  },

  addParticipant: async (eventId: string, userId: string) => {
    await DB.sequelize.sync();
    return await DB.EventParticipants.create({
      event_id: eventId,
      user_id: userId,
    });
  },
};
