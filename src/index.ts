import { DB } from 'databases/mysql';
import logger from 'utils/logger';
import { server } from 'server';
import { PORT, HOST_NAME } from 'config';
const port = parseInt(PORT as string, 10) || 3000;
const host_name = HOST_NAME || 'localhost';

DB.sequelize
  .authenticate()
  .then(() => {
    logger.info('Database connected successfully!');
    server.listen(port, () => {
      logger.info(`Server is running on http://${host_name}:${port}`);
    });
  })
  .catch((error) => {
    logger.error('Unable to connect to the database:', error);
  });
