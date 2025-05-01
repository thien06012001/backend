import { CustomError } from 'utils/error.custom';
import { postRepo } from './post.repo';
import { IPostRequest } from 'interfaces/post.interface';
import { eventRepo } from 'modules/event/event.repo';

export const getPostById = async (postId: string) => {
  const post = await postRepo.getById(postId);

  if (!post) {
    throw new CustomError('Post not found', 404);
  }

  return post;
};

export const getPostsByEventId = async (eventId: string) => {
  // Check if event exists
  const event = await eventRepo.getById(eventId);
  if (!event) {
    throw new CustomError('Event not found', 404);
  }

  return await postRepo.getByEventId(eventId);
};

export const getAllPosts = async () => {
  return await postRepo.getAll();
};

export const createPost = async (post: IPostRequest) => {
  // Check if event exists
  const event = await eventRepo.getById(post.eventId);
  if (!event) {
    throw new CustomError('Event not found', 404);
  }

  return await postRepo.create(post);
};

export const updatePost = async (
  postId: string,
  post: Partial<IPostRequest>,
) => {
  // Check if post exists
  const existingPost = await getPostById(postId);

  const [updated] = await postRepo.update(postId, post);

  if (!updated) {
    throw new CustomError('Failed to update post', 500);
  }

  return await getPostById(postId);
};

export const deletePost = async (postId: string) => {
  const post = await getPostById(postId);

  const deleted = await postRepo.delete(postId);

  if (!deleted) {
    throw new CustomError('Failed to delete post', 500);
  }

  return deleted;
};
