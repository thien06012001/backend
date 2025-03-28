// Load User model

import path from 'path';
import logger from 'utils/logger';
import { DB } from '..';
import fs from 'fs';
import initUserModel from '../models/user.model';
const User = initUserModel(DB.sequelize);

// Load mock user data
const usersPath = path.resolve(__dirname, './users.data.json');
const users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));

async function seedDatabase() {
  try {
    await DB.sequelize.authenticate();
    logger.info('Database connected!');

    await User.bulkCreate(users);
    logger.info(`Seeded ${users.length} users successfully!`);

    process.exit(0);
  } catch (error) {
    logger.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
