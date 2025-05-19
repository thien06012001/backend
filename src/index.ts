import { DB } from 'databases/mysql';
import logger from 'utils/logger';
import { server } from 'server';
import { PORT, HOST_NAME } from 'config';
const port = parseInt(PORT as string, 10) || 3000;
const host_name = HOST_NAME || 'localhost';
import http from 'http';

// Function to ping the event reminder endpoint
const pingReminder = () => {
  const options = {
    hostname: host_name,
    port,
    path: '/api/events/reminder',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Send HTTP request
  const req = http.request(options, (res) => {
    logger.info(
      `[Reminder] Pinged at ${new Date().toISOString()} - Status: ${res.statusCode}`,
    );
  });

  // Handle request errors
  req.on('error', (error) => {
    logger.error(`[Reminder] Ping failed: ${error.message}`);
  });

  req.end(); // Finalize the request
};

const startServer = async () => {
  try {
    // Authenticate MySQL connection
    await DB.sequelize.authenticate();
    logger.info('MySQL connected successfully!');

    server.listen(port, host_name, () => {
      logger.info(`Server is running on http://${host_name}:${port}`);
    });

    // Trigger a reminder ping immediately
    pingReminder();

    // Schedule reminder ping every 5 hours (5 * 60 * 60 * 1000 ms)
    setInterval(pingReminder, 5 * 60 * 60 * 1000);
  } catch (error) {
    logger.error('Failed to start server due to DB connection error:', error);
  }
};

startServer();
