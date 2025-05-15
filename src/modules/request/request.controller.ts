import { NextFunction, Request, Response } from 'express';

import {
  cancelRequest,
  createRequest,
  approveRequest,
  rejectRequest,
} from './request.service';

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

export const cancelRequestController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { eventId, userId } = req.query;
    await cancelRequest(eventId as string, userId as string);
    res.status(200).json({ message: 'Request cancelled' });
  } catch (error) {
    next(error);
  }
};

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
