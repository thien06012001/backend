import express from 'express';
import cors from 'cors';
import { errorHandler } from 'utils/error.handler';
import logger from 'utils/logger';
import router from 'router';
import path from 'path';
import bodyParser from 'body-parser';
import multer from 'multer';

const server = express();

// CORS configuration - allow all origins
const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
};

// Middleware for logging requests and response duration
server.use((req, res, next) => {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const message = `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`;

    // Log based on status code severity
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
server.options('*', cors(corsOptions)); // Handle pre-flight requests

// Parse incoming request bodies
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

// Use all routes under /api
server.use('/api', router);

// Serve static files from /uploads directory
server.use('/uploads', express.static(path.join(__dirname, './uploads')));

// Configure multer for file uploads
const imageUploadPath = path.join(__dirname, './uploads');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imageUploadPath); // Set upload directory
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_dateVal_${Date.now()}_${file.originalname}`); // Generate unique filename
  },
});
const imageUpload = multer({ storage });

// Handle image upload via POST
server.post('/image-upload', imageUpload.array('my-image-file'), (req, res) => {
  console.log('POST request received to /image-upload.');
  console.log('Axios POST body: ', req.body);

  const uploadedFiles = req.files as Express.Multer.File[];

  // Generate accessible file URLs
  const fileUrls = uploadedFiles.map(
    (file) => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`,
  );

  res.status(200).json({ message: 'Upload successful', url: fileUrls[0] });
});

// Use global error handler
server.use(errorHandler);

// Handle unmatched routes with a 404 response
server.all('*', (req, res) => {
  res.status(404).json({ message: 'Sorry! Page not found' });
});

export { server };
