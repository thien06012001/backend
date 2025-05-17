import express from 'express';

import {
  createEventController,
  getAllEventsController,
  getEventByIdController,
  updateEventController,
  deleteEventController,
  sendEventInvitationController,
  sendEventInvitationsController,
  getEventInvitationsController,
  leaveEventController,
  kickUserFromEventController,
  getRequestsByEventIdController,
  getDiscussionsByEventIdController,
  getInvitationsByEventIdController,
} from 'modules/event/event.controller';

const eventRouter = express.Router();

eventRouter.get('/:eventId', getEventByIdController);
eventRouter.get('/', getAllEventsController);
eventRouter.post('/', createEventController);
eventRouter.put('/:eventId', updateEventController);
eventRouter.delete('/:eventId', deleteEventController);
eventRouter.post('/:eventId/leave', leaveEventController);
eventRouter.post('/:eventId/kick', kickUserFromEventController);
// Event invitation routes
eventRouter.get('/:eventId/invitations', getEventInvitationsController);
eventRouter.post('/:eventId/invitations', sendEventInvitationController);
eventRouter.post('/:eventId/invitations/bulk', sendEventInvitationsController);

eventRouter.get('/:eventId/requests', getRequestsByEventIdController);
eventRouter.get('/:eventId/discussions', getDiscussionsByEventIdController);
eventRouter.get('/:eventId/invitations', getInvitationsByEventIdController);

export default eventRouter;
