import express from 'express';

import {
  approveRequestController,
  cancelRequestController,
  createRequestController,
  rejectRequestController,
} from 'modules/request/request.controller';

const requestRouter = express.Router();

requestRouter.post('/', createRequestController);
requestRouter.delete('/', cancelRequestController);
requestRouter.post('/:id/approve', approveRequestController);
requestRouter.post('/:id/reject', rejectRequestController);

export default requestRouter;
