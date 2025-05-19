import { DB } from 'databases/mysql';
import { IEventRequest, Event } from 'interfaces/event.interface';

export const eventRepo = {
  // Get an event by its ID, including participants and requests
  getById: async (eventId: string): Promise<Event | null> => {
    await DB.sequelize.sync();
    return await DB.Events.findOne({
      where: { id: eventId },
      include: [
        {
          model: DB.Users,
          as: 'participants',
          attributes: ['id', 'email', 'name', 'phone'],
          required: false,
        },
        {
          model: DB.Requests,
          as: 'requests',
        },
      ],
    });
  },

  // Get all public events with owner, participants, and requests info
  getAll: async (): Promise<Event[]> => {
    await DB.sequelize.sync();
    return await DB.Events.findAll({
      include: [
        { model: DB.Users, as: 'owner', attributes: ['id', 'email'] },
        {
          model: DB.Users,
          as: 'participants',
          attributes: ['id'],
          required: false,
        },
        {
          model: DB.Requests,
          as: 'requests',
          attributes: ['id', 'user_id', 'event_id', 'status'],
          required: false,
        },
      ],
      where: {
        is_public: true,
      },
      attributes: ['id', 'name', 'start_time', 'end_time', 'location'],
    });
  },

  // Create a new event with default reminder values
  create: async (event: IEventRequest): Promise<Event> => {
    await DB.sequelize.sync();
    return await DB.Events.create({
      ...event,
      participantReminder: 2,
      invitationReminder: 2,
    });
  },

  // Update an event by ID
  update: async (eventId: string, event: IEventRequest): Promise<[number]> => {
    await DB.sequelize.sync();
    return await DB.Events.update(event, { where: { id: eventId } });
  },

  // Delete an event by ID
  delete: async (eventId: string): Promise<number> => {
    await DB.sequelize.sync();
    return await DB.Events.destroy({ where: { id: eventId } });
  },

  // Remove a participant from an event
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

  // Add a participant to an event
  addParticipant: async (eventId: string, userId: string) => {
    await DB.sequelize.sync();
    return await DB.EventParticipants.create({
      event_id: eventId,
      user_id: userId,
    });
  },
};
