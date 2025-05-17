import { NextFunction, Request, Response } from 'express';
import { getSettings, updateSettings } from './setting.service';

export const getSettingsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const setting = await getSettings();
    res
      .status(200)
      .json({ message: 'Settings retrieved successfully', setting });
  } catch (error) {
    next(error);
  }
};

export const updateSettingsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const setting = await updateSettings(req.body);
    res.status(200).json({ message: 'Settings updated successfully', setting });
  } catch (error) {
    next(error);
  }
};
