import { DB } from 'databases/mysql';
import {
  IInvitationRequest,
  Invitation,
  InvitationStatus,
} from 'interfaces/invitation.interface';

export const invitationRepo = {
  // Get a single invitation by its ID with user and event included
  getById: async (invitationId: string): Promise<Invitation | null> => {
    await DB.sequelize.sync();
    return await DB.Invitations.findOne({
      where: { id: invitationId },
      include: [
        { model: DB.Users, as: 'user' },
        { model: DB.Events, as: 'event' },
      ],
    });
  },

  // Get all invitations for a specific event, include user info
  getByEventId: async (eventId: string): Promise<Invitation[]> => {
    await DB.sequelize.sync();
    return await DB.Invitations.findAll({
      where: { event_id: eventId },
      attributes: ['id', 'status', 'created_at'],
      include: [{ model: DB.Users, as: 'user', attributes: ['id', 'email'] }],
      order: [['created_at', 'DESC']],
    });
  },

  // Get all invitations for a specific user, include event info
  getByUserId: async (userId: string): Promise<Invitation[]> => {
    await DB.sequelize.sync();
    return await DB.Invitations.findAll({
      where: { user_id: userId },
      include: [{ model: DB.Events, as: 'event' }],
    });
  },

  // Create a new invitation with default status as PENDING
  create: async (invitation: IInvitationRequest): Promise<Invitation> => {
    await DB.sequelize.sync();
    return await DB.Invitations.create({
      ...invitation,
      status: invitation.status ?? InvitationStatus.PENDING,
    });
  },

  // Create multiple invitations in bulk with default status
  bulkCreate: async (
    invitations: IInvitationRequest[],
  ): Promise<Invitation[]> => {
    await DB.sequelize.sync();
    const invitationsWithDefaults = invitations.map((invitation) => ({
      ...invitation,
      status: invitation.status ?? InvitationStatus.PENDING,
    }));
    return await DB.Invitations.bulkCreate(invitationsWithDefaults);
  },

  // Update the status of a specific invitation
  updateStatus: async (
    invitationId: string,
    status: InvitationStatus,
  ): Promise<[number, Invitation[]]> => {
    await DB.sequelize.sync();
    return await DB.Invitations.update(
      { status },
      {
        where: { id: invitationId },
        returning: true,
      },
    );
  },

  // Delete an invitation by its ID
  delete: async (invitationId: string): Promise<number> => {
    await DB.sequelize.sync();
    return await DB.Invitations.destroy({ where: { id: invitationId } });
  },
};
