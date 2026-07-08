import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { validateBody } from '../validators/index.js';
import { registerSchema, loginSchema, updateAccessibilitySchema, updateLanguageSchema } from '../validators/auth.schema.js';
import { registerUser, loginUser, getUserProfile } from '../services/authService.js';
import User from '../models/User.js';
import { AppError } from '../utils/AppError.js';

const router = Router();

router.post(
  '/register',
  validateBody(registerSchema),
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
  validateBody(loginSchema),
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

router.patch(
  '/me/accessibility',
  authenticate,
  validateBody(updateAccessibilitySchema),
  async (req, res, next) => {
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
  }
);

router.patch(
  '/me/language',
  authenticate,
  validateBody(updateLanguageSchema),
  async (req, res, next) => {
    try {
      const { language } = req.body;
      const user = await User.findByIdAndUpdate(req.user._id, { preferredLanguage: language }, { new: true });
      res.json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
