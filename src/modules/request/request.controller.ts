import { NextFunction, Request, Response } from 'express';
import {
  cancelRequest,
  createRequest,
  approveRequest,
  rejectRequest,
} from './request.service';

// Controller: Handle creation of a new request to join an event
export const createRequestController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await createRequest({ ...req.body, status: 'pending' });
    res.status(201).json({ message: 'Request created' });
  } catch (error) {
    next(error);
  }
};

// Controller: Cancel a request using eventId and userId from query parameters
export const cancelRequestController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { eventId, userId } = req.query;

    // Cancel the request by user and event ID
    await cancelRequest(eventId as string, userId as string);
    res.status(200).json({ message: 'Request cancelled' });
  } catch (error) {
    next(error);
  }
};

// Controller: Approve a request by request ID
export const approveRequestController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;

    await approveRequest(id);
    res.status(200).json({ message: 'Request approved' });
  } catch (error) {
    next(error);
  }
};

// Controller: Reject a request by request ID
export const rejectRequestController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;

    await rejectRequest(id);
    res.status(200).json({ message: 'Request rejected' });
  } catch (error) {
    next(error);
  }
};
