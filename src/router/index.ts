import express from 'express';

import userRouter from './routes/user.route';
import authRouter from './routes/auth.route';
import eventRouter from './routes/event.route';
import invitationRouter from './routes/invitation.route';
import postRouter from './routes/post.route';
import commentRouter from './routes/comment.route';
import notificationRouter from './routes/notification.route';
import requestRouter from './routes/request.route';
import adminRouter from './routes/admin.route';
import settingRouter from './routes/setting.route';

const router = express.Router();

// Mount all routers under corresponding API paths
router.use('/users', userRouter);
router.use('/auth', authRouter);
router.use('/events', eventRouter);
router.use('/invitations', invitationRouter);
router.use('/posts', postRouter);
router.use('/comments', commentRouter);
router.use('/notifications', notificationRouter);
router.use('/requests', requestRouter);
router.use('/admin', adminRouter);
router.use('/settings', settingRouter);

export default router;
