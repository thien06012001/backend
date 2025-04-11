import express from 'express';

import userRouter from './routes/user.route';
import authRouter from './routes/auth.route';

const router = express.Router();

router.use('/users', userRouter);
router.use('/auth', authRouter);

export default router;
