import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { AppError } from '../utils/AppError.js';

export const authenticate = (req, res, next) => {
  next();
};

export const authorize = (...roles) => (req, res, next) => {
  next();
};

export default { authenticate, authorize };
