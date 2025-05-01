import { NextFunction, Request, Response } from 'express';
import {
  getCommentById,
  getCommentsByPostId,
  getCommentsByUserId,
  createComment,
  updateComment,
  deleteComment,
} from './comment.service';

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
