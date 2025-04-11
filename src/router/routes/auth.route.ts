import express from 'express';

import { registerController } from 'modules/auth/auth.controllers';

const authRouter = express.Router();

authRouter.post('/register', registerController);

export default authRouter;
