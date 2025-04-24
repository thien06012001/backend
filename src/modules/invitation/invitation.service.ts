import { CustomError } from 'utils/error.custom';
import { invitationRepo } from './invitation.repo';
import {
  IInvitationRequest,
  InvitationStatus,
} from 'interfaces/invitation.interface';
import { eventRepo } from 'modules/event/event.repo';
import { repo as userRepo } from 'modules/user/user.repo';
import { DB } from 'databases/mysql';

export const getInvitationById = async (invitationId: string) => {
  const invitation = await invitationRepo.getById(invitationId);

  if (!invitation) {
    throw new CustomError('Invitation not found', 404);
  }

  return invitation;
};

export const getInvitationsByEvent = async (eventId: string) => {
  // Check if event exists
  const event = await eventRepo.getById(eventId);
  if (!event) {
    throw new CustomError('Event not found', 404);
  }

  return await invitationRepo.getByEventId(eventId);
};

export const getInvitationsByUser = async (userId: string) => {
  // Check if user exists
  const user = await userRepo.getById(userId);
  if (!user) {
    throw new CustomError('User not found', 404);
  }

  return await invitationRepo.getByUserId(userId);
};

export const createInvitation = async (invitation: IInvitationRequest) => {
  // Check if event exists
  const event = await eventRepo.getById(invitation.event_id);
  if (!event) {
    throw new CustomError('Event not found', 404);
  }

  // Check if user exists
  const user = await userRepo.getById(invitation.user_id);
  if (!user) {
    throw new CustomError('User not found', 404);
  }

  // Set status to PENDING if not provided
  if (!invitation.status) {
    invitation.status = InvitationStatus.PENDING;
  }

  return await invitationRepo.create(invitation);
};

export const bulkCreateInvitations = async (
  invitations: IInvitationRequest[],
) => {
  // Set status to PENDING if not provided for each invitation
  const processedInvitations = invitations.map((invitation) => ({
    ...invitation,
    status: invitation.status || InvitationStatus.PENDING,
  }));

  return await invitationRepo.bulkCreate(processedInvitations);
};

export const acceptInvitation = async (invitationId: string) => {
  const invitation = await getInvitationById(invitationId);

  if (invitation.status !== InvitationStatus.PENDING) {
    throw new CustomError('Invitation has already been processed', 400);
  }

  const [updated] = await invitationRepo.updateStatus(
    invitationId,
    InvitationStatus.ACCEPTED,
  );

  if (!updated) {
    throw new CustomError('Failed to update invitation status', 500);
  }

  // Add user to event participants
  await DB.EventParticipants.create({
    event_id: invitation.event_id,
    user_id: invitation.user_id,
  });

  return await getInvitationById(invitationId);
};

export const rejectInvitation = async (invitationId: string) => {
  const invitation = await getInvitationById(invitationId);

  if (invitation.status !== InvitationStatus.PENDING) {
    throw new CustomError('Invitation has already been processed', 400);
  }

  const [updated] = await invitationRepo.updateStatus(
    invitationId,
    InvitationStatus.REJECTED,
  );

  if (!updated) {
    throw new CustomError('Failed to update invitation status', 500);
  }

  return await getInvitationById(invitationId);
};

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
