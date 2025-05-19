import { login, register } from './auth.service';
import { NextFunction, Request, Response } from 'express';

// Handle user registration request
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

// Handle user login request
export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const response = await login(req.body);
    res.status(200).json({
      message: 'User logged in successfully',
      data: response,
    });
  } catch (error) {
    next(error);
  }
};
