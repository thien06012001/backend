import { DB } from 'databases/mysql';
import logger from 'utils/logger';
import { server } from 'server';
import { PORT } from 'config';
const port = PORT;
DB.sequelize
  .authenticate()
  .then(() => {
    logger.info('Database connected successfully!');
    server.listen(port, () => {
      logger.info(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    logger.error('Unable to connect to the database:', error);
  });
