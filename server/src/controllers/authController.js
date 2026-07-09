import { registerUser, loginUser, getUserProfile } from '../services/authService.js';
import User from '../models/User.js';

/**
 * Controller for managing user authentication and profile HTTP request actions.
 */
class AuthController {
  /**
   * Register a new user.
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  async register(req, res, next) {
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

  /**
   * Login user with email and password.
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  async login(req, res, next) {
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

  /**
   * Log out active user.
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  logout(req, res) {
    res.clearCookie('token');
    res.json({ success: true, message: 'Logged out successfully' });
  }

  /**
   * Get logged-in user profile.
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  async getMe(req, res, next) {
    try {
      const user = await getUserProfile(req.user._id);
      res.json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Update accessibility settings.
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  async updateAccessibility(req, res, next) {
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

  /**
   * Update preferred language.
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  async updateLanguage(req, res, next) {
    try {
      const { language } = req.body;
      const user = await User.findByIdAndUpdate(req.user._id, { preferredLanguage: language }, { new: true });
      res.json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  }
}

export default new AuthController();
