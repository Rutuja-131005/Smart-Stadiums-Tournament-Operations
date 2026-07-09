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
  // Start with the original error — avoid spreading Error objects
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let isOperational = err.isOperational || false;

  // Handle Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already registered`;
    statusCode = 409;
    isOperational = true;
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError' && err.errors) {
    message = Object.values(err.errors).map((el) => el.message).join(', ');
    statusCode = 400;
    isOperational = true;
  }

  // Handle Mongoose CastError (e.g. invalid ObjectId)
  if (err.name === 'CastError') {
    message = `Invalid ${err.path}: ${err.value}`;
    statusCode = 400;
    isOperational = true;
  }

  if (!isOperational) {
    logger.error('Unhandled error:', { message, stack: err.stack });
  }

  res.status(statusCode).json({
    success: false,
    message: isOperational ? message : 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export const notFound = (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
};

