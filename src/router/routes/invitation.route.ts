import express from 'express';

import {
  getInvitationByIdController,
  getInvitationsByEventController,
  getInvitationsByUserController,
  createInvitationController,
  bulkCreateInvitationsController,
  acceptInvitationController,
  rejectInvitationController,
  deleteInvitationController,
} from 'modules/invitation/invitation.controller';

const invitationRouter = express.Router();

// Get a specific invitation
invitationRouter.get('/:invitationId', getInvitationByIdController);

// Get all invitations for an event
invitationRouter.get('/event/:eventId', getInvitationsByEventController);

// Get all invitations for a user
invitationRouter.get('/user/:userId', getInvitationsByUserController);

// Create a single invitation
invitationRouter.post('/', createInvitationController);

// Create multiple invitations at once
invitationRouter.post('/bulk', bulkCreateInvitationsController);

// Accept an invitation
invitationRouter.put('/:invitationId/accept', acceptInvitationController);

// Reject an invitation
invitationRouter.put('/:invitationId/reject', rejectInvitationController);

// Delete an invitation
invitationRouter.delete('/:invitationId', deleteInvitationController);

export default invitationRouter;
