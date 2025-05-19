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

invitationRouter.get('/:invitationId', getInvitationByIdController);
invitationRouter.get('/event/:eventId', getInvitationsByEventController);
invitationRouter.get('/user/:userId', getInvitationsByUserController);
invitationRouter.post('/', createInvitationController);
invitationRouter.put('/:invitationId/accept', acceptInvitationController);
invitationRouter.put('/:invitationId/reject', rejectInvitationController);
invitationRouter.delete('/:invitationId', deleteInvitationController);

export default invitationRouter;
