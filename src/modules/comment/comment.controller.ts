import { NextFunction, Request, Response } from 'express';
import {
  getCommentById,
  getCommentsByPostId,
  getCommentsByUserId,
  createComment,
  updateComment,
  deleteComment,
} from './comment.service';

// Get a single comment by ID
export const getCommentByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const response = await getCommentById(req.params.commentId);
    res.status(200).json({ message: 'Comment data fetched', data: response });
  } catch (error) {
    next(error);
  }
};

// Get all comments for a specific post
export const getCommentsByPostIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const response = await getCommentsByPostId(req.params.postId);
    res.status(200).json({ message: 'Post comments fetched', data: response });
  } catch (error) {
    next(error);
  }
};

// Get all comments made by a specific user
export const getCommentsByUserIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const response = await getCommentsByUserId(req.params.userId);
    res.status(200).json({ message: 'User comments fetched', data: response });
  } catch (error) {
    next(error);
  }
};

// Create a new comment
export const createCommentController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const response = await createComment(req.body);
    res.status(201).json({ message: 'Comment created', data: response });
  } catch (error) {
    next(error);
  }
};

// Update an existing comment
export const updateCommentController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const response = await updateComment(req.params.commentId, req.body);
    res.status(200).json({ message: 'Comment updated', data: response });
  } catch (error) {
    next(error);
  }
};

// Delete a comment by ID
export const deleteCommentController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const response = await deleteComment(req.params.commentId);
    res.status(200).json({ message: 'Comment deleted', data: response });
  } catch (error) {
    next(error);
  }
};
