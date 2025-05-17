import { NextFunction, Request, Response } from 'express';
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  sendEventInvitation,
  sendEventInvitations,
  getEventInvitations,
  leaveEvent,
  kickUserFromEvent,
  getRequestsByEventId,
  getDiscussionsByEventId,
  getInvitationsByEventId,
  updateEventReminders,
  pingEventReminder,
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
    console.log('Request body:', req.body);

    const response = await createEvent(req.body);
    console.log('Response:', response);
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

// New controllers for event invitations
export const sendEventInvitationController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email } = req.body;
    const response = await sendEventInvitation(req.params.eventId, email);
    res.status(201).json({ message: 'Invitation sent', data: response });
  } catch (error) {
    next(error);
  }
};

export const sendEventInvitationsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { userIds, message } = req.body;
    const response = await sendEventInvitations(
      req.params.eventId,
      userIds,
      message,
    );
    res.status(201).json({ message: 'Invitations sent', data: response });
  } catch (error) {
    next(error);
  }
};

export const getEventInvitationsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const response = await getEventInvitations(req.params.eventId);
    res
      .status(200)
      .json({ message: 'Event invitations fetched', data: response });
  } catch (error) {
    next(error);
  }
};

export const leaveEventController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { userId } = req.body;
    const response = await leaveEvent(req.params.eventId, userId);
    res.status(200).json({ message: 'Left event', data: response });
  } catch (error) {
    next(error);
  }
};

export const kickUserFromEventController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { userId } = req.body;
    const response = await kickUserFromEvent(req.params.eventId, userId);
    res.status(200).json({ message: 'User kicked from event', data: response });
  } catch (error) {
    next(error);
  }
};

export const getRequestsByEventIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { eventId } = req.params;
    const response = await getRequestsByEventId(eventId);
    res.status(200).json({ message: 'Requests fetched', data: response });
  } catch (error) {
    next(error);
  }
};

export const getDiscussionsByEventIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { eventId } = req.params;
    const response = await getDiscussionsByEventId(eventId);
    res.status(200).json({ message: 'Discussions fetched', data: response });
  } catch (error) {
    next(error);
  }
};

export const getInvitationsByEventIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { eventId } = req.params;
    const response = await getInvitationsByEventId(eventId);
    res.status(200).json({ message: 'Invitations fetched', data: response });
  } catch (error) {
    next(error);
  }
};

export const updateEventReminderController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { eventId } = req.params;
    const { participantReminder, invitationReminder } = req.body;

    // Validate the input
    if (
      typeof participantReminder !== 'number' ||
      typeof invitationReminder !== 'number'
    ) {
      res.status(400).json({
        message: 'Invalid input',
        data: null,
      });
    }

    // Update the event reminder
    const response = await updateEventReminders(
      eventId,
      participantReminder,
      invitationReminder,
    );

    res.status(200).json({
      message: 'Event reminder updated successfully',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

export const pingEventReminderController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await pingEventReminder();

    res.status(200).json({
      message: 'Event reminder pinged successfully',
    });
  } catch (error) {
    next(error);
  }
};
