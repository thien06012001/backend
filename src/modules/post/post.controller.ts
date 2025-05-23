import { NextFunction, Request, Response } from 'express';
import {
  getAllPosts,
  getPostById,
  getPostsByEventId,
  createPost,
  updatePost,
  deletePost,
} from './post.service';

// Controller: Get a specific post by its ID
export const getPostByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const response = await getPostById(req.params.postId);
    res.status(200).json({ message: 'Post data fetched', data: response });
  } catch (error) {
    next(error);
  }
};

// Controller: Get all posts for a specific event
export const getPostsByEventIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const response = await getPostsByEventId(req.params.eventId);
    res.status(200).json({ message: 'Event posts fetched', data: response });
  } catch (error) {
    next(error);
  }
};

// Controller: Get all posts in the system
export const getAllPostsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const response = await getAllPosts();
    res.status(200).json({ message: 'All posts fetched', data: response });
  } catch (error) {
    next(error);
  }
};

// Controller: Create a new post
export const createPostController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const response = await createPost(req.body);
    res.status(201).json({ message: 'Post created', data: response });
  } catch (error) {
    next(error);
  }
};

// Controller: Update an existing post
export const updatePostController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const response = await updatePost(req.params.postId, req.body);
    res.status(200).json({ message: 'Post updated', data: response });
  } catch (error) {
    next(error);
  }
};

// Controller: Delete a post
export const deletePostController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const response = await deletePost(req.params.postId);
    res.status(200).json({ message: 'Post deleted', data: response });
  } catch (error) {
    next(error);
  }
};
