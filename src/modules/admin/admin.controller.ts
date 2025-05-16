import { NextFunction, Request, Response } from 'express';
import {
  deleteEvent,
  deleteUser,
  getAllEvents,
  getAllUsers,
  getEventById,
  getUserById,
  updateEvent,
  updateUser,
} from './admin.service';

export const getAllUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const response = await getAllUsers();
    res.status(200).json({ message: 'All users fetched', data: response });
  } catch (error) {
    next(error);
  }
};

export const getUserByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const response = await getUserById(req.params.userId);
    res.status(200).json({ message: 'User data fetched', data: response });
  } catch (error) {
    next(error);
  }
};

export const deleteUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const response = await deleteUser(req.params.userId);
    res.status(200).json({ message: 'User deleted', data: response });
  } catch (error) {
    next(error);
  }
};

export const updateUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const response = await updateUser(req.params.userId, req.body);
    res.status(200).json({ message: 'User updated', data: response });
  } catch (error) {
    next(error);
  }
};

export const getAllEventsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const response = await getAllEvents();
    res.status(200).json({ message: 'All events fetched', data: response });
  } catch (error) {
    next(error);
  }
};

export const getEventByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const response = await getEventById(req.params.eventId);
    res.status(200).json({ message: 'Event data fetched', data: response });
  } catch (error) {
    next(error);
  }
};

export const deleteEventController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const response = await deleteEvent(req.params.eventId);
    res.status(200).json({ message: 'Event deleted', data: response });
  } catch (error) {
    next(error);
  }
};

export const updateEventController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const response = await updateEvent(req.params.eventId, req.body);
    res.status(200).json({ message: 'Event updated', data: response });
  } catch (error) {
    next(error);
  }
};
