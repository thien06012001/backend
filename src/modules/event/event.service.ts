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
import { EventModel } from 'databases/mysql/models/event.model';
import { EventParticipantModel } from 'databases/mysql/models/eventParticipant.model';
import { InvitationModel } from 'databases/mysql/models/invitation.model';
import { NotificationModel } from 'databases/mysql/models/notification.model';

// Get a single event by ID
export const getEventById = async (eventId: string) => {
  const event = await eventRepo.getById(eventId);
  if (!event) throw new CustomError('Event not found', 404);
  return event;
};

// Get all events
export const getAllEvents = async (role: string) => {
  if (role === 'admin') {
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
      attributes: ['id', 'name', 'start_time', 'end_time', 'location'],
    });
  }

  return await eventRepo.getAll();
};

// Create a new event with validation and capacity checks
export const createEvent = async (event: IEventRequest) => {
  const userId = event.owner_id;
  const startTime = new Date(event.start_time);
  const endTime = new Date(event.end_time);
  const now = new Date();

  // Validate time inputs
  if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
    throw new CustomError('Invalid start or end time format.', 400);
  }

  if (startTime <= now) {
    throw new CustomError('Start time must be in the future.', 400);
  }

  if (endTime <= startTime) {
    throw new CustomError('End time must be after start time.', 400);
  }

  // Check active events for the user
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

  if (currentEvents.length >= settings.maxActiveEvents) {
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

// Update an event and notify all participants
export const updateEvent = async (eventId: string, event: IEventRequest) => {
  const [updated] = await eventRepo.update(eventId, event);
  if (!updated) throw new CustomError('Event not found', 404);

  const participants = await EventParticipantModel.findAll({
    where: { event_id: eventId },
  });

  const notifications = participants.map((participant) => ({
    userId: participant.user_id,
    eventId,
    title: 'Event Updated',
    description: `The event "${event.name}" has been updated.`,
    isRead: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));

  await NotificationModel.bulkCreate(notifications);
  return event;
};

// Delete an event by ID
export const deleteEvent = async (eventId: string) => {
  const deleted = await eventRepo.delete(eventId);
  if (!deleted) throw new CustomError('Event not found', 404);
  return deleted;
};

// Send invitation to one user via email
export const sendEventInvitation = async (eventId: string, email: string) => {
  const user = await repo.getByEmail(email);
  const event = await eventRepo.getById(eventId);

  if (!event) throw new CustomError('Event not found', 404);
  if (!user) throw new CustomError('User not found', 404);

  await notificationRepo.create({
    description: `invited you to event ${event.name}`,
    userId: user.id,
    title: `You have been invited to event ${event.name}`,
    isRead: false,
    eventId: event.id,
  });

  return await invitationRepo.create({
    event_id: eventId,
    user_id: user.id,
    status: InvitationStatus.PENDING,
  });
};

// Send invitations to multiple users
export const sendEventInvitations = async (
  eventId: string,
  userIds: string[],
  message?: string,
) => {
  const invitations = userIds.map((userId) => ({
    event_id: eventId,
    user_id: userId,
    status: InvitationStatus.PENDING,
    message,
  }));

  return await invitationRepo.bulkCreate(invitations);
};

// Get all invitations for an event
export const getEventInvitations = async (eventId: string) => {
  return await invitationRepo.getByEventId(eventId);
};

// Leave an event (remove self as participant)
export const leaveEvent = async (eventId: string, userId: string) => {
  await eventRepo.removeParticipant(eventId, userId);
  return { message: 'User left the event successfully' };
};

// Kick a user from an event
export const kickUserFromEvent = async (eventId: string, userId: string) => {
  const removed = await eventRepo.removeParticipant(eventId, userId);
  if (!removed) throw new CustomError('User not found in event', 404);
  return { message: 'User kicked from the event successfully' };
};

// Get pending join requests for a specific event
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

// Get all discussions (posts & comments) for an event
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

// Alias for getEventInvitations (can be removed if redundant)
export const getInvitationsByEventId = async (eventId: string) => {
  return await invitationRepo.getByEventId(eventId);
};

// Update reminder settings for an event
export const updateEventReminders = async (
  eventId: string,
  participantReminder: number,
  invitationReminder: number,
) => {
  const event = await eventRepo.getById(eventId);
  if (!event) throw new CustomError('Event not found', 404);

  await DB.Events.update(
    {
      invitationReminder,
      participantReminder,
    },
    { where: { id: eventId } },
  );

  return event;
};

// Helper to calculate date difference in days
const calculateDaysUntil = (from: Date, to: Date) => {
  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const end = new Date(to.getFullYear(), to.getMonth(), to.getDate());
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.floor((end.getTime() - start.getTime()) / msPerDay);
};

// Ping events for reminder notifications
export const pingEventReminder = async () => {
  // Get the current date
  const today = new Date();

  // Fetch all events that haven't started yet
  const events = await EventModel.findAll({
    where: {
      start_time: {
        [Op.gt]: today,
      },
    },
  });

  // Iterate through each upcoming event
  await Promise.all(
    events.map(async (event) => {
      // Calculate how many days remain until the event starts
      const daysUntilEvent = calculateDaysUntil(
        new Date(event.start_time),
        today,
      );

      const notifications: any[] = [];

      // If today matches the participant reminder offset
      if (daysUntilEvent === event.participantReminder) {
        // Fetch all participants of this event
        const participants = await EventParticipantModel.findAll({
          where: { event_id: event.id },
        });

        // Create a reminder notification for each participant
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

      // If today matches the invitation reminder offset
      if (daysUntilEvent === event.invitationReminder) {
        // Fetch all pending invitations for this event
        const invitations = await InvitationModel.findAll({
          where: {
            event_id: event.id,
            status: 'pending',
          },
        });

        // Create a reminder notification for each invited user
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

      // ========== Send Notifications ==========
      // Only insert notifications if we have any to send
      if (notifications.length > 0) {
        await NotificationModel.bulkCreate(notifications);
      }
    }),
  );
};
