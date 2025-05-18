import { DB } from 'databases/mysql';
import logger from 'utils/logger';
import { server } from 'server';
import { PORT, HOST_NAME } from 'config';
import { connectMongoDB } from 'databases/mongodb';
const port = parseInt(PORT as string, 10) || 3000;
const host_name = HOST_NAME || 'localhost';
import http from 'http';

// Define the ping function
const pingReminder = () => {
  const options = {
    hostname: host_name,
    port,
    path: '/api/events/reminder', // adjust if your API prefix differs
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const req = http.request(options, (res) => {
    logger.info(
      `[Reminder] Pinged at ${new Date().toISOString()} - Status: ${res.statusCode}`,
    );
  });

  req.on('error', (error) => {
    logger.error(`[Reminder] Ping failed: ${error.message}`);
  });

  req.end();
};

const startServer = async () => {
  try {
    await DB.sequelize.authenticate();
    logger.info('MySQL connected successfully!');

    await connectMongoDB();

    server.listen(port, host_name, () => {
      logger.info(`Server is running on http://${host_name}:${port}`);
    });

    pingReminder(); // run once immediately
    setInterval(pingReminder, 5 * 60 * 60 * 1000); // every 5 hours
  } catch (error) {
    logger.error('Failed to start server due to DB connection error:', error);
  }
};

startServer();
