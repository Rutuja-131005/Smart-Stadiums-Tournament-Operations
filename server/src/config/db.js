import mongoose from 'mongoose';
import logger from '../utils/logger.js';

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-stadiums';

  // First try connecting to the configured MongoDB URI
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
    logger.info('MongoDB connected successfully');
    return;
  } catch (error) {
    logger.warn(`Could not connect to MongoDB at ${uri}: ${error.message}`);
    logger.info('Falling back to in-memory MongoDB server...');
  }

  // Fallback: use mongodb-memory-server for local development without MongoDB installed
  try {
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
