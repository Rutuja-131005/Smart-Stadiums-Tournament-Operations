import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import seedDatabase from '../config/seedData.js';
import logger from '../utils/logger.js';

dotenv.config();

const run = async () => {
  try {
    await connectDB();
    await seedDatabase();
    logger.info('Seeding complete.');
  } catch (err) {
    logger.error('Seeding failed:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

run();
