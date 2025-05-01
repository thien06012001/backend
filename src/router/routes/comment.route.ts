import express from 'express';
import {
  createCommentController,
  deleteCommentController,
  getCommentByIdController,
  getCommentsByPostIdController,
  getCommentsByUserIdController,
  updateCommentController,
} from 'modules/comment/comment.controller';

const commentRouter = express.Router();

// Comment CRUD routes
commentRouter.get('/:commentId', getCommentByIdController);
commentRouter.post('/', createCommentController);
commentRouter.put('/:commentId', updateCommentController);
commentRouter.delete('/:commentId', deleteCommentController);

// Comments by post
commentRouter.get('/post/:postId', getCommentsByPostIdController);

// Comments by user
commentRouter.get('/user/:userId', getCommentsByUserIdController);

export default commentRouter;
