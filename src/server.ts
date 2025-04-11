import express from 'express';
import cors from 'cors';
import { errorHandler } from 'utils/error.handler';
import logger from 'utils/logger';
import router from 'router';
const server = express();
const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
};
server.use((req, res, next) => {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const message = `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`;

    if (res.statusCode >= 500) {
      logger.error(message);
    } else if (res.statusCode >= 400) {
      logger.warn(message);
    } else {
      logger.info(message);
    }
  });

  next();
});

// Enable CORS
server.use(cors(corsOptions));
server.options('*', cors(corsOptions));

// Middleware for parsing JSON and URL-encoded bodies
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// Use the router with the /api prefix
server.use('/api', router);
server.use(errorHandler);
server.all('*', (req, res) => {
  res.status(404).json({ message: 'Sorry! Page not found' });
});
export { server };
