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

commentRouter.get('/:commentId', getCommentByIdController);
commentRouter.post('/', createCommentController);
commentRouter.put('/:commentId', updateCommentController);
commentRouter.delete('/:commentId', deleteCommentController);
commentRouter.get('/post/:postId', getCommentsByPostIdController);
commentRouter.get('/user/:userId', getCommentsByUserIdController);

export default commentRouter;
