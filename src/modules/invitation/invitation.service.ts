import { CustomError } from 'utils/error.custom';
import { invitationRepo } from './invitation.repo';
import {
  IInvitationRequest,
  InvitationStatus,
} from 'interfaces/invitation.interface';
import { eventRepo } from 'modules/event/event.repo';
import { repo as userRepo } from 'modules/user/user.repo';
import { DB } from 'databases/mysql';
import { NotificationModel } from 'databases/mysql/models/notification.model';

// Get a single invitation by ID
export const getInvitationById = async (invitationId: string) => {
  const invitation = await invitationRepo.getById(invitationId);

  if (!invitation) {
    throw new CustomError('Invitation not found', 404);
  }

  return invitation;
};

// Get all invitations for a specific event
export const getInvitationsByEvent = async (eventId: string) => {
  const event = await eventRepo.getById(eventId);
  if (!event) {
    throw new CustomError('Event not found', 404);
  }

  return await invitationRepo.getByEventId(eventId);
};

// Get all invitations for a specific user
export const getInvitationsByUser = async (userId: string) => {
  const user = await userRepo.getById(userId);
  if (!user) {
    throw new CustomError('User not found', 404);
  }

  return await invitationRepo.getByUserId(userId);
};

// Create a new invitation and notify the invited user
export const createInvitation = async (invitation: IInvitationRequest) => {
  const event = await eventRepo.getById(invitation.event_id);
  if (!event) {
    throw new CustomError('Event not found', 404);
  }

  const user = await userRepo.getById(invitation.user_id);
  if (!user) {
    throw new CustomError('User not found', 404);
  }

  // Set default status to PENDING if not provided
  if (!invitation.status) {
    invitation.status = InvitationStatus.PENDING;
  }

  const created = await invitationRepo.create(invitation);

  // Create a notification for the invited user
  await NotificationModel.create({
    userId: invitation.user_id,
    eventId: invitation.event_id,
    title: 'New Invitation',
    description: `You have been invited to join the event "${event.name}".`,
    isRead: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  return created;
};

// Create multiple invitations in bulk
export const bulkCreateInvitations = async (
  invitations: IInvitationRequest[],
) => {
  const processedInvitations = invitations.map((invitation) => ({
    ...invitation,
    status: invitation.status || InvitationStatus.PENDING,
  }));

  return await invitationRepo.bulkCreate(processedInvitations);
};

// Accept an invitation and add the user to event participants
export const acceptInvitation = async (invitationId: string) => {
  const invitation = await getInvitationById(invitationId);

  await DB.Invitations.update(
    { status: InvitationStatus.ACCEPTED },
    { where: { id: invitationId } },
  );

  await DB.EventParticipants.create({
    event_id: invitation.event_id,
    user_id: invitation.user_id,
  });

  return await getInvitationById(invitationId);
};

// Reject an invitation
export const rejectInvitation = async (invitationId: string) => {
  await DB.Invitations.update(
    { status: InvitationStatus.REJECTED },
    { where: { id: invitationId } },
  );

  return await getInvitationById(invitationId);
};

// Delete an invitation
export const deleteInvitation = async (invitationId: string) => {
  const invitation = await getInvitationById(invitationId);

  if (!invitation) {
    throw new CustomError('Invitation not found', 404);
  }

  const deleted = await invitationRepo.delete(invitationId);

  if (!deleted) {
    throw new CustomError('Failed to delete invitation', 500);
  }

  return deleted;
};
