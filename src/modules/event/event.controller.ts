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

// Get event by ID
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

// Get all public events
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

// Create a new event
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

// Update an existing event
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

// Delete an event
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

// Send invitation to a single user
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

// Send invitations to multiple users
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

// Get all invitations for an event
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

// Leave an event as a participant
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

// Kick a user from an event
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

// Get all join requests for a specific event
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

// Get all discussions (posts and comments) for an event
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

// Get invitations by event ID (redundant alias support)
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

// Update event reminder settings
export const updateEventReminderController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { eventId } = req.params;
    const { participantReminder, invitationReminder } = req.body;

    if (
      typeof participantReminder !== 'number' ||
      typeof invitationReminder !== 'number'
    ) {
      res.status(400).json({
        message: 'Invalid input',
        data: null,
      });
      return;
    }

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

// Trigger event reminder checks and dispatch notifications
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
