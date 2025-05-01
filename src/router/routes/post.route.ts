import express from 'express';
import {
  createPostController,
  deletePostController,
  getAllPostsController,
  getPostByIdController,
  getPostsByEventIdController,
  updatePostController,
} from 'modules/post/post.controller';

const postRouter = express.Router();

// Post CRUD routes
postRouter.get('/', getAllPostsController);
postRouter.get('/:postId', getPostByIdController);
postRouter.post('/', createPostController);
postRouter.put('/:postId', updatePostController);
postRouter.delete('/:postId', deletePostController);

// Posts by event
postRouter.get('/event/:eventId', getPostsByEventIdController);

export default postRouter;
