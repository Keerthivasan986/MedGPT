import mongoose from 'mongoose';
import env from './env.js';
import logger from '../utils/logger.js';

export async function connectDatabase(uri = env.mongoUri) {
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
  logger.info(`MongoDB connected: ${mongoose.connection.name}`);
  return mongoose.connection;
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
  logger.info('MongoDB disconnected');
}

export default connectDatabase;
