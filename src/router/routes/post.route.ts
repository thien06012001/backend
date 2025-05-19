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

postRouter.get('/', getAllPostsController);
postRouter.get('/:postId', getPostByIdController);
postRouter.post('/', createPostController);
postRouter.put('/:postId', updatePostController);
postRouter.delete('/:postId', deletePostController);
postRouter.get('/event/:eventId', getPostsByEventIdController);

export default postRouter;
