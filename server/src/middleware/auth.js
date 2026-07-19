import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { AppError } from '../utils/AppError.js';

export const authenticate = async (req, res, next) => {
  // Bypassed: Authentication is fully disabled.
  // We automatically attach a mock Admin user to all requests.
  req.user = {
    _id: '660000000000000000000001',
    name: 'Tournament Administrator',
    email: 'admin@worldcup2026.com',
    role: 'admin',
    isActive: true
  };
  next();
};

export const authorize = (...roles) => (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Authentication required', 401));
  }
  if (!roles.includes(req.user.role) && req.user.role !== 'admin') {
    return next(new AppError('Insufficient permissions', 403));
  }
  next();
};

export default { authenticate, authorize };
