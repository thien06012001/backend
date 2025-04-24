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
} from 'modules/event/event.controller';

const eventRouter = express.Router();

eventRouter.get('/:eventId', getEventByIdController);
eventRouter.get('/', getAllEventsController);
eventRouter.post('/', createEventController);
eventRouter.put('/:eventId', updateEventController);
eventRouter.delete('/:eventId', deleteEventController);

// Event invitation routes
eventRouter.get('/:eventId/invitations', getEventInvitationsController);
eventRouter.post('/:eventId/invitations', sendEventInvitationController);
eventRouter.post('/:eventId/invitations/bulk', sendEventInvitationsController);

export default eventRouter;
