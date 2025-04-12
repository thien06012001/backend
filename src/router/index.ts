import express from 'express';

import userRouter from './routes/user.route';
import authRouter from './routes/auth.route';
import eventRouter from './routes/event.route';

const router = express.Router();

router.use('/users', userRouter);
router.use('/auth', authRouter);
router.use('/events', eventRouter);

export default router;
