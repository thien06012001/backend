import { DB } from 'databases/mysql';
import logger from 'utils/logger';
import { server } from 'server';
import { PORT, HOST_NAME } from 'config';
import { connectMongoDB } from 'databases/mongodb';
const port = parseInt(PORT as string, 10) || 3000;
const host_name = HOST_NAME || 'localhost';

const startServer = async () => {
  try {
    await DB.sequelize.authenticate();
    logger.info('MySQL connected successfully!');

    await connectMongoDB();

    server.listen(port, host_name, () => {
      logger.info(`Server is running on http://${host_name}:${port}`);
    });
  } catch (error) {
    logger.error('Failed to start server due to DB connection error:', error);
  }
};

startServer();
