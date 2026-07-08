import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/errorHandler.js';
import { registerUser, loginUser, getUserProfile } from '../services/authService.js';
import User from '../models/User.js';
import { AppError } from '../utils/AppError.js';

const router = Router();

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').optional().isIn(['fan', 'volunteer', 'staff', 'security', 'admin']),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { user, token } = await registerUser(req.body);
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.status(201).json({ success: true, data: { user, token } });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { user, token } = await loginUser(req.body.email, req.body.password);
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.json({ success: true, data: { user, token } });
    } catch (err) {
      next(err);
    }
  }
);

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out successfully' });
});

router.get('/me', authenticate, async (req, res, next) => {
  try {
    const user = await getUserProfile(req.user._id);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

router.patch('/me/accessibility', authenticate, async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { accessibility: { ...req.user.accessibility, ...req.body } },
      { new: true }
    );
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

router.patch('/me/language', authenticate, async (req, res, next) => {
  try {
    const { language } = req.body;
    if (!language) throw new AppError('Language is required', 400);
    const user = await User.findByIdAndUpdate(req.user._id, { preferredLanguage: language }, { new: true });
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

export default router;
