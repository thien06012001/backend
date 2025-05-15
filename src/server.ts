import express from 'express';
import cors from 'cors';
import { errorHandler } from 'utils/error.handler';
import logger from 'utils/logger';
import router from 'router';
import path from 'path';
import bodyParser from 'body-parser';
import multer from 'multer';
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
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

// Use the router with the /api prefix
server.use('/api', router);

server.use('/uploads', express.static(path.join(__dirname, './uploads')));

const imageUploadPath = path.join(__dirname, './uploads');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imageUploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}_dateVal_${Date.now()}_${file.originalname}`);
  },
});

const imageUpload = multer({ storage: storage });

server.post('/image-upload', imageUpload.array('my-image-file'), (req, res) => {
  console.log('POST request received to /image-upload.');
  console.log('Axios POST body: ', req.body);
  const uploadedFiles = req.files as Express.Multer.File[];
  const fileUrls = uploadedFiles.map(
    (file) => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`,
  );

  res.status(200).json({ message: 'Upload successful', url: fileUrls[0] });
});

server.use(errorHandler);
server.all('*', (req, res) => {
  res.status(404).json({ message: 'Sorry! Page not found' });
});
export { server };
