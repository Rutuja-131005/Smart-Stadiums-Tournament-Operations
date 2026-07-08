import { validationResult } from 'express-validator';
import { AppError } from '../utils/AppError.js';
import logger from '../utils/logger.js';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array().map((e) => e.msg).join(', '), 400));
  }
  next();
};

export const errorHandler = (err, req, res, _next) => {
  let error = { ...err };
  error.message = err.message;

  // Handle Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already registered`;
    error = new AppError(message, 409);
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((el) => el.message).join(', ');
    error = new AppError(message, 400);
  }

  // Handle Mongoose CastError (e.g. invalid ObjectId)
  if (err.name === 'CastError') {
    error = new AppError(`Invalid ${err.path}: ${err.value}`, 400);
  }

  const statusCode = error.statusCode || 500;
  const message = error.isOperational ? error.message : 'Internal server error';

  if (!error.isOperational) {
    logger.error('Unhandled error:', { message: error.message, stack: error.stack });
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};

export const notFound = (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
};
