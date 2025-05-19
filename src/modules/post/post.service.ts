import { CustomError } from 'utils/error.custom';
import { postRepo } from './post.repo';
import { IPostRequest } from 'interfaces/post.interface';
import { eventRepo } from 'modules/event/event.repo';

// Get a post by its ID
export const getPostById = async (postId: string) => {
  const post = await postRepo.getById(postId);

  if (!post) {
    throw new CustomError('Post not found', 404);
  }

  return post;
};

// Get all posts related to a specific event
export const getPostsByEventId = async (eventId: string) => {
  const event = await eventRepo.getById(eventId);

  if (!event) {
    throw new CustomError('Event not found', 404);
  }

  return await postRepo.getByEventId(eventId);
};

// Get all posts across all events
export const getAllPosts = async () => {
  return await postRepo.getAll();
};

// Create a new post, but ensure the target event exists first
export const createPost = async (post: IPostRequest) => {
  const event = await eventRepo.getById(post.eventId);

  if (!event) {
    throw new CustomError('Event not found', 404);
  }

  return await postRepo.create(post);
};

// Update a post by ID with partial data
export const updatePost = async (
  postId: string,
  post: Partial<IPostRequest>,
) => {
  await getPostById(postId);

  const [updated] = await postRepo.update(postId, post);

  if (!updated) {
    throw new CustomError('Failed to update post', 500);
  }

  // Return the updated post data
  return await getPostById(postId);
};

// Delete a post by ID after verifying its existence
export const deletePost = async (postId: string) => {
  await getPostById(postId);

  const deleted = await postRepo.delete(postId);

  if (!deleted) {
    throw new CustomError('Failed to delete post', 500);
  }

  return deleted;
};
