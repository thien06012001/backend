import { notificationRepo } from './../notification/notification.repo';
import { CustomError } from 'utils/error.custom';
import { eventRepo } from './event.repo';
import { IEventRequest } from 'interfaces/event.interface';
import { invitationRepo } from 'modules/invitation/invitation.repo';
import { InvitationStatus } from 'interfaces/invitation.interface';
import { repo } from 'modules/user/user.repo';
import { DB } from 'databases/mysql';
import { getSettings } from 'modules/setting/setting.service';
import { Op, where } from 'sequelize';
import { EventModel } from 'databases/mysql/models/event.model';
import { EventParticipantModel } from 'databases/mysql/models/eventParticipant.model';
import { InvitationModel } from 'databases/mysql/models/invitation.model';
import { NotificationModel } from 'databases/mysql/models/notification.model';

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
    eventId: event.id,
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

export const updateEventReminders = async (
  eventId: string,
  participantReminder: number,
  invitationReminder: number,
) => {
  const event = await eventRepo.getById(eventId);

  if (!event) {
    throw new CustomError('Event not found', 404);
  }

  await DB.Events.update(
    {
      invitationReminder,
      participantReminder,
    },
    {
      where: { id: eventId },
    },
  );

  return event;
};

const calculateDaysUntil = (from: Date, to: Date) => {
  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const end = new Date(to.getFullYear(), to.getMonth(), to.getDate());

  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.floor((end.getTime() - start.getTime()) / msPerDay);
};

export const pingEventReminder = async () => {
  const today = new Date();

  const events = await EventModel.findAll({
    where: {
      start_time: {
        [Op.gt]: today,
      },
    },
  });

  await Promise.all(
    events.map(async (event) => {
      const daysUntilEvent = calculateDaysUntil(
        new Date(event.start_time),
        today,
      );

      const notifications: any[] = [];

      // 1. Participant reminders
      if (daysUntilEvent === event.participantReminder) {
        const participants = await EventParticipantModel.findAll({
          where: {
            event_id: event.id,
          },
        });

        for (const participant of participants) {
          notifications.push({
            userId: participant.user_id,
            title: 'Event Reminder',
            description: `The event "${event.name}" is happening in ${event.participantReminder} day(s).`,
            isRead: false,
            eventId: event.id,
            created_at: new Date(),
            updated_at: new Date(),
          });
        }
      }

      // 2. Invitation reminders
      if (daysUntilEvent === event.invitationReminder) {
        const invitations = await InvitationModel.findAll({
          where: {
            event_id: event.id,
            status: 'pending',
          },
        });

        for (const invitation of invitations) {
          notifications.push({
            userId: invitation.user_id,
            title: 'Pending Invitation Reminder',
            description: `You have not responded to the invitation for "${event.name}", which starts in ${event.invitationReminder} day(s).`,
            isRead: false,
            eventId: event.id,
            created_at: new Date(),
            updated_at: new Date(),
          });
        }
      }

      if (notifications.length > 0) {
        await NotificationModel.bulkCreate(notifications);
      }
    }),
  );
};
