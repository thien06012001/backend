import { config } from 'dotenv';
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
config({ path: envFile });

export const { PORT, HOST_NAME, NODE_ENV } = process.env;
export const {
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_NAME,
  DB_HOST,
  DB_DIALECT,
} = process.env;
export const { MONGO_URI } = process.env;
