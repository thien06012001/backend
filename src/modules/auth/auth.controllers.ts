import { register } from './auth.service';
import { NextFunction, Request, Response } from 'express';
import { getUserByEmail } from 'modules/user/user.service';

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const response = await register(req.body);

    res.status(201).json({
      message: 'User registered successfully',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};
