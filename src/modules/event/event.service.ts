import { notificationRepo } from './../notification/notification.repo';
import { CustomError } from 'utils/error.custom';
import { eventRepo } from './event.repo';
import { IEventRequest } from 'interfaces/event.interface';
import { invitationRepo } from 'modules/invitation/invitation.repo';
import { InvitationStatus } from 'interfaces/invitation.interface';
import { repo } from 'modules/user/user.repo';

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
