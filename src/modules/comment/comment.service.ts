import { CustomError } from 'utils/error.custom';
import { commentRepo } from './comment.repo';
import { ICommentRequest } from 'interfaces/comment.interface';
import { postRepo } from 'modules/post/post.repo';
import { repo as userRepo } from 'modules/user/user.repo';

// Get a comment by its ID
export const getCommentById = async (commentId: string) => {
  const comment = await commentRepo.getById(commentId);

  if (!comment) {
    throw new CustomError('Comment not found', 404);
  }

  return comment;
};

// Get all comments under a specific post
export const getCommentsByPostId = async (postId: string) => {
  // Check if post exists
  const post = await postRepo.getById(postId);
  if (!post) {
    throw new CustomError('Post not found', 404);
  }

  return await commentRepo.getByPostId(postId);
};

// Get all comments made by a specific user
export const getCommentsByUserId = async (userId: string) => {
  // Check if user exists
  const user = await userRepo.getById(userId);
  if (!user) {
    throw new CustomError('User not found', 404);
  }

  return await commentRepo.getByUserId(userId);
};

// Create a new comment under a post
export const createComment = async (comment: ICommentRequest) => {
  // Check if post exists
  const post = await postRepo.getById(comment.postId);
  if (!post) {
    throw new CustomError('Post not found', 404);
  }

  // Check if user exists
  const user = await userRepo.getById(comment.userId);
  if (!user) {
    throw new CustomError('User not found', 404);
  }

  return await commentRepo.create(comment);
};

// Update an existing comment
export const updateComment = async (
  commentId: string,
  comment: Partial<ICommentRequest>,
) => {
  const [updated] = await commentRepo.update(commentId, comment);

  if (!updated) {
    throw new CustomError('Failed to update comment', 500);
  }

  return await getCommentById(commentId);
};

// Delete a comment by ID
export const deleteComment = async (commentId: string) => {
  const comment = await getCommentById(commentId);

  const deleted = await commentRepo.delete(commentId);

  if (!deleted) {
    throw new CustomError('Failed to delete comment', 500);
  }

  return deleted;
};
