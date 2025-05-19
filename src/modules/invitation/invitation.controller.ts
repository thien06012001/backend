import { NextFunction, Request, Response } from 'express';
import {
  getInvitationById,
  getInvitationsByEvent,
  getInvitationsByUser,
  createInvitation,
  bulkCreateInvitations,
  acceptInvitation,
  rejectInvitation,
  deleteInvitation,
} from './invitation.service';

// Get a single invitation by ID
export const getInvitationByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const response = await getInvitationById(req.params.invitationId);
    res
      .status(200)
      .json({ message: 'Invitation data fetched', data: response });
  } catch (error) {
    next(error);
  }
};

// Get all invitations for a specific event
export const getInvitationsByEventController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const response = await getInvitationsByEvent(req.params.eventId);
    res
      .status(200)
      .json({ message: 'Event invitations fetched', data: response });
  } catch (error) {
    next(error);
  }
};

// Get all invitations for a specific user
export const getInvitationsByUserController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const response = await getInvitationsByUser(req.params.userId);
    res
      .status(200)
      .json({ message: 'User invitations fetched', data: response });
  } catch (error) {
    next(error);
  }
};

// Create a new invitation
export const createInvitationController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const response = await createInvitation(req.body);
    res.status(201).json({ message: 'Invitation created', data: response });
  } catch (error) {
    next(error);
  }
};

// Create multiple invitations in bulk
export const bulkCreateInvitationsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const response = await bulkCreateInvitations(req.body.invitations);
    res.status(201).json({ message: 'Invitations created', data: response });
  } catch (error) {
    next(error);
  }
};

// Accept an invitation
export const acceptInvitationController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const response = await acceptInvitation(req.params.invitationId);
    res.status(200).json({ message: 'Invitation accepted', data: response });
  } catch (error) {
    next(error);
  }
};

// Reject an invitation
export const rejectInvitationController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const response = await rejectInvitation(req.params.invitationId);
    res.status(200).json({ message: 'Invitation rejected', data: response });
  } catch (error) {
    next(error);
  }
};

// Delete an invitation
export const deleteInvitationController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const response = await deleteInvitation(req.params.invitationId);
    res.status(200).json({ message: 'Invitation deleted', data: response });
  } catch (error) {
    next(error);
  }
};
