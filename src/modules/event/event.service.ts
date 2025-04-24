import { CustomError } from 'utils/error.custom';
import { eventRepo } from './event.repo';
import { IEventRequest } from 'interfaces/event.interface';
import { invitationRepo } from 'modules/invitation/invitation.repo';
import { InvitationStatus } from 'interfaces/invitation.interface';

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
export const sendEventInvitation = async (eventId: string, userId: string) => {
  const event = await getEventById(eventId);

  // Create invitation
  return await invitationRepo.create({
    event_id: eventId,
    user_id: userId,
    status: InvitationStatus.PENDING,
  });
};

export const sendEventInvitations = async (
  eventId: string,
  userIds: string[],
  message?: string,
) => {
  const event = await getEventById(eventId);

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
  const event = await getEventById(eventId);

  return await invitationRepo.getByEventId(eventId);
};
