import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import User, { ROLES } from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import logger from '../utils/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const credentialsPath = path.join(__dirname, '../config/credentials.json');

const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

export const registerUser = async ({ name, email, password, role = 'fan', preferredLanguage = 'en' }) => {
  logger.info(`[Auth] Registration attempt for: ${email}`);
  const existing = await User.findOne({ email });
  if (existing) {
    logger.warn(`[Auth] Registration failed — email already exists: ${email}`);
    throw new AppError('Email already registered', 409);
  }

  const validRole = ROLES.includes(role) ? role : 'fan';
  const user = await User.create({ name, email, password, role: validRole, preferredLanguage });
  const token = generateToken(user._id);
  logger.info(`[Auth] User registered successfully: ${email} (${validRole})`);

  // Persist to credentials.json if not in testing/production filesystem restrictions
  if (process.env.NODE_ENV !== 'test') {
    try {
      if (fs.existsSync(credentialsPath)) {
        const content = fs.readFileSync(credentialsPath, 'utf8');
        const data = JSON.parse(content);
        if (!data.demoAccounts) {
          data.demoAccounts = [];
        }
        if (!data.demoAccounts.some((acc) => acc.email === email)) {
          data.demoAccounts.push({
            name,
            email,
            password,
            role: validRole,
            preferredLanguage,
          });
          fs.writeFileSync(credentialsPath, JSON.stringify(data, null, 2), 'utf8');
          logger.info(`[Auth] Saved registered credentials to credentials.json: ${email}`);
        }
      }
    } catch (err) {
      logger.warn(`[Auth] Failed to write to credentials.json: ${err.message}`);
    }
  }

  return { user, token };
};

export const loginUser = async (email, password) => {
  logger.info(`[Auth] Login attempt for: ${email}`);
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    logger.warn(`[Auth] Login failed — invalid credentials for: ${email}`);
    throw new AppError('Invalid email or password', 401);
  }
  if (!user.isActive) {
    logger.warn(`[Auth] Login failed — account deactivated: ${email}`);
    throw new AppError('Account is deactivated', 403);
  }
  const token = generateToken(user._id);
  user.password = undefined;
  logger.info(`[Auth] Login successful: ${email}`);
  return { user, token };
};

export const getUserProfile = async (userId) => {
  const user = await User.findById(userId).populate('assignedStadium', 'name city');
  if (!user) throw new AppError('User not found', 404);
  return user;
};

export default { registerUser, loginUser, getUserProfile, generateToken };
