import mongoose from 'mongoose';
import env from './env.js';
import logger from '../utils/logger.js';

export async function connectDatabase(uri = env.mongoUri) {
  mongoose.set('strictQuery', true);

  const candidates = [];
  if (uri) candidates.push(uri);

  const localFallback = 'mongodb://127.0.0.1:27017/medgpt';
  if (!candidates.includes(localFallback)) candidates.push(localFallback);

  let lastError;

  for (const candidate of candidates) {
    try {
      await mongoose.connect(candidate);
      logger.info(`MongoDB connected: ${mongoose.connection.name}`);
      return mongoose.connection;
    } catch (error) {
      lastError = error;
      logger.warn('MongoDB connection failed. Trying next target...');
    }
  }

  throw lastError || new Error('Unable to connect to MongoDB');
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
  logger.info('MongoDB disconnected');
}

export default connectDatabase;
