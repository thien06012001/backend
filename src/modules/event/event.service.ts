import { notificationRepo } from './../notification/notification.repo';
import { CustomError } from 'utils/error.custom';
import { eventRepo } from './event.repo';
import { IEventRequest } from 'interfaces/event.interface';
import { invitationRepo } from 'modules/invitation/invitation.repo';
import { InvitationStatus } from 'interfaces/invitation.interface';
import { repo } from 'modules/user/user.repo';
import { DB } from 'databases/mysql';
import { getSettings } from 'modules/setting/setting.service';
import { Op } from 'sequelize';

export const getEventById = async (eventId: string) => {
  const event = await eventRepo.getById(eventId);

  if (!event) {
    throw new CustomError('Event not found', 404);
  }

  return event;
};

export const getAllEvents = async () => {
  return await eventRepo.getAll();
};

export const createEvent = async (event: IEventRequest) => {
  const userId = event.owner_id;

  const currentEvents = await DB.Events.findAll({
    where: {
      owner_id: userId,
      [Op.or]: [
        { start_time: { [Op.gte]: new Date() } },
        { end_time: { [Op.gte]: new Date() } },
      ],
    },
  });

  const settings = await getSettings();
  const activeEvents = currentEvents.length;

  if (activeEvents >= settings.maxActiveEvents) {
    throw new CustomError(
      `You can only create up to ${settings.maxActiveEvents} active events.`,
      400,
    );
  }

  if (event.capacity > settings.maxEventCapacity) {
    throw new CustomError(
      `Event capacity cannot exceed ${settings.maxEventCapacity}.`,
      400,
    );
  }

  return await eventRepo.create(event);
};

export const updateEvent = async (eventId: string, event: IEventRequest) => {
  const [updated] = await eventRepo.update(eventId, event);

  if (!updated) {
    throw new CustomError('Event not found', 404);
  }

  return event;
};

export const deleteEvent = async (eventId: string) => {
  const deleted = await eventRepo.delete(eventId);

  if (!deleted) {
    throw new CustomError('Event not found', 404);
  }

  return deleted;
};

// New methods for invitation functionality
export const sendEventInvitation = async (eventId: string, email: string) => {
  const user = await repo.getByEmail(email);

  const event = await eventRepo.getById(eventId);

  if (!event) {
    throw new CustomError('Event not found', 404);
  }

  if (!user) {
    throw new CustomError('User not found', 404);
  }

  await notificationRepo.create({
    description: `invited you to event ${event.name}`,
    userId: user.id,
    title: `You have been invited to event ${event.name}`,
    isRead: false,
  });

  // Create invitation
  return await invitationRepo.create({
    event_id: eventId,
    user_id: user.id,
    status: InvitationStatus.PENDING,
  });
};

export const sendEventInvitations = async (
  eventId: string,
  userIds: string[],
  message?: string,
) => {
  // Create invitations for all users
  const invitations = userIds.map((userId) => ({
    event_id: eventId,
    user_id: userId,
    status: InvitationStatus.PENDING,
    message,
  }));

  return await invitationRepo.bulkCreate(invitations);
};

export const getEventInvitations = async (eventId: string) => {
  return await invitationRepo.getByEventId(eventId);
};

export const leaveEvent = async (eventId: string, userId: string) => {
  // Remove user from participants
  await eventRepo.removeParticipant(eventId, userId);

  return { message: 'User left the event successfully' };
};

export const kickUserFromEvent = async (eventId: string, userId: string) => {
  // Remove user from participants
  const removed = await eventRepo.removeParticipant(eventId, userId);

  if (!removed) {
    throw new CustomError('User not found in event', 404);
  }

  return { message: 'User kicked from the event successfully' };
};

export const getRequestsByEventId = async (eventId: string) => {
  return await DB.Requests.findAll({
    where: {
      eventId,
      status: 'PENDING',
    },
    include: [
      {
        model: DB.Users,
        as: 'user',
        attributes: ['id', 'name', 'email', 'phone'],
      },
    ],
  });
};

export const getDiscussionsByEventId = async (eventId: string) => {
  return await DB.Posts.findAll({
    where: {
      eventId,
    },
    include: [
      {
        model: DB.Comments,
        as: 'comments',
        include: [
          {
            model: DB.Users,
            as: 'user',
            attributes: ['id', 'name'],
          },
        ],
      },
      { model: DB.Users, as: 'author', attributes: ['id', 'name'] },
    ],
  });
};

export const getInvitationsByEventId = async (eventId: string) => {
  return await invitationRepo.getByEventId(eventId);
};
