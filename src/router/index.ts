import express from 'express';

import userRouter from './routes/user.route';
import authRouter from './routes/auth.route';
import eventRouter from './routes/event.route';
import invitationRouter from './routes/invitation.route';

const router = express.Router();

router.use('/users', userRouter);
router.use('/auth', authRouter);
router.use('/events', eventRouter);
router.use('/invitations', invitationRouter);

export default router;
