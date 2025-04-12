import express from 'express';

import {
  createEventController,
  getAllEventsController,
  getEventByIdController,
  updateEventController,
  deleteEventController,
} from 'modules/event/event.controller';

const eventRouter = express.Router();

eventRouter.get('/:eventId', getEventByIdController);
eventRouter.get('/', getAllEventsController);
eventRouter.post('/', createEventController);
eventRouter.put('/:eventId', updateEventController);
eventRouter.delete('/:eventId', deleteEventController);

export default eventRouter;
