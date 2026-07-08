import jwt from 'jsonwebtoken';
import User, { ROLES } from '../models/User.js';
import { AppError } from '../utils/AppError.js';

const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

export const registerUser = async ({ name, email, password, role = 'fan', preferredLanguage = 'en' }) => {
  const existing = await User.findOne({ email });
  if (existing) throw new AppError('Email already registered', 409);

  const validRole = ROLES.includes(role) ? role : 'fan';
  const user = await User.create({ name, email, password, role: validRole, preferredLanguage });
  const token = generateToken(user._id);
  return { user, token };
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }
  if (!user.isActive) throw new AppError('Account is deactivated', 403);
  const token = generateToken(user._id);
  user.password = undefined;
  return { user, token };
};

export const getUserProfile = async (userId) => {
  const user = await User.findById(userId).populate('assignedStadium', 'name city');
  if (!user) throw new AppError('User not found', 404);
  return user;
};

export default { registerUser, loginUser, getUserProfile, generateToken };
