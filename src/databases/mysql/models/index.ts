import logger from 'utils/logger';
import { DB } from '..';

async function syncDatabase() {
  try {
    await DB.sequelize.authenticate();
    logger.info('Database connected successfully!');
    await DB.sequelize.sync({ alter: true }); // optional: use { force: true } for a full reset
    logger.info('Database synchronized successfully!');
    process.exit(0);
  } catch (error) {
    logger.error('Error syncing database:', error);
    process.exit(1);
  }
}

syncDatabase();
