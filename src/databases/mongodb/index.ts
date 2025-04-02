import { MONGO_URI } from 'config';
import mongoose from 'mongoose';
import logger from 'utils/logger';

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(MONGO_URI as string); // No extra options needed
    logger.info('MongoDB connected successfully!');
  } catch (error) {
    logger.error('Unable to connect to MongoDB:', error);
    throw error;
  }
};
