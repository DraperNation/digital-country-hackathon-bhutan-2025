import dotenv from 'dotenv';
dotenv.config();


export const environment = {
  MONGO_URI:process.env.MONGO_URI,
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  JWT_COOKIE_EXPIRE: process.env.JWT_COOKIE_EXPIRE || '30d',
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRE: process.env.JWT_EXPIRE || '30d',
};
