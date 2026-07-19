import mongoose from 'mongoose';
import logger from '../utils/logger.js';

export let globalDbError = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smart-stadiums';
  const maskedUri = uri.replace(/:([^@]+)@/, ':***@');

  // First try connecting to the configured MongoDB URI
  try {
    logger.info(`Attempting MongoDB connection to: ${maskedUri}`);
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    logger.info('MongoDB connected successfully');
    globalDbError = null;
    return;
  } catch (error) {
    logger.warn(`Could not connect to MongoDB at ${maskedUri}: ${error.message}`);
    globalDbError = error.message;
  }

  // On Vercel, don't attempt in-memory server — it won't work in serverless
  if (process.env.VERCEL) {
    logger.warn('Running on Vercel without MONGODB_URI. API routes requiring DB will fail.');
    return;
  }

  // Fallback: use mongodb-memory-server for local development without MongoDB installed
  try {
    logger.info('Falling back to in-memory MongoDB server...');
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    const memUri = mongod.getUri();
    await mongoose.connect(memUri);
    logger.info(`In-memory MongoDB started at ${memUri}`);

    // Auto-seed when using in-memory DB since it starts empty
    process.env.__MEMORY_DB__ = 'true';
  } catch (memError) {
    logger.error('Failed to start in-memory MongoDB:', memError.message);
    logger.error('Please install MongoDB or Docker to run this application.');
    process.exit(1);
  }
};

export default connectDB;
