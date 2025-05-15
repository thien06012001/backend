import express from 'express';

import userRouter from './routes/user.route';
import authRouter from './routes/auth.route';
import eventRouter from './routes/event.route';
import invitationRouter from './routes/invitation.route';
import postRouter from './routes/post.route';
import commentRouter from './routes/comment.route';
import notificationRouter from './routes/notification.route';
import requestRouter from './routes/request.route';

const router = express.Router();

router.use('/users', userRouter);
router.use('/auth', authRouter);
router.use('/events', eventRouter);
router.use('/invitations', invitationRouter);
router.use('/posts', postRouter);
router.use('/comments', commentRouter);
router.use('/notifications', notificationRouter);
router.use('/requests', requestRouter);

export default router;
