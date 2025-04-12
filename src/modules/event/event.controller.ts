import { NextFunction, Request, Response } from 'express';
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from './event.service';

export const getEventByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const response = await getEventById(req.params.eventId);
    res.status(200).json({ message: 'Event data fetched', data: response });
  } catch (error) {
    next(error);
  }
};

export const getAllEventsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const response = await getAllEvents();
    res.status(200).json({ message: 'All events fetched', data: response });
  } catch (error) {
    next(error);
  }
};

export const createEventController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const response = await createEvent(req.body);
    res.status(201).json({ message: 'Event created', data: response });
  } catch (error) {
    next(error);
  }
};

export const updateEventController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const response = await updateEvent(req.params.eventId, req.body);
    res.status(200).json({ message: 'Event updated', data: response });
  } catch (error) {
    next(error);
  }
};

export const deleteEventController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const response = await deleteEvent(req.params.eventId);
    res.status(200).json({ message: 'Event deleted', data: response });
  } catch (error) {
    next(error);
  }
};
