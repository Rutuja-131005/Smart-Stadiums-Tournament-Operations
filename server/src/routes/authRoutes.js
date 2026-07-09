import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { validateBody } from '../validators/index.js';
import { registerSchema, loginSchema, updateAccessibilitySchema, updateLanguageSchema } from '../validators/auth.schema.js';
import { registerUser, loginUser, getUserProfile } from '../services/authService.js';
import User from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import multer from 'multer';
import xlsx from 'xlsx';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/import-excel', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError('Please upload an Excel or CSV file', 400);
    }
    
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);
    
    if (!data.length) {
      throw new AppError('The sheet is empty or in an invalid format', 400);
    }
    
    const importedUsers = [];
    const errors = [];
    
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const name = row.name || row.Name || row.username || row.Username;
      const email = row.email || row.Email || row.mail || row.Mail;
      const password = row.password || row.Password || row.pass || row.Pass;
      const role = row.role || row.Role || 'fan';
      const preferredLanguage = row.preferredLanguage || row.language || row.Language || 'en';
      
      if (!name || !email || !password) {
        errors.push(`Row ${i + 2}: Missing required fields (name, email, password)`);
        continue;
      }
      
      try {
        const existing = await User.findOne({ email: email.toString().toLowerCase().trim() });
        if (existing) {
          errors.push(`Row ${i + 2}: Email ${email} is already registered`);
          continue;
        }
        
        const user = await User.create({
          name: name.toString().trim(),
          email: email.toString().toLowerCase().trim(),
          password: password.toString(),
          role: role.toString().trim(),
          preferredLanguage: preferredLanguage.toString().trim(),
        });
        
        importedUsers.push({ name: user.name, email: user.email, role: user.role });
      } catch (err) {
        errors.push(`Row ${i + 2}: ${err.message}`);
      }
    }
    
    res.status(200).json({
      success: true,
      message: `Successfully processed file. Imported: ${importedUsers.length}, Errors: ${errors.length}`,
      data: {
        importedCount: importedUsers.length,
        importedUsers,
        errors,
      }
    });
  } catch (err) {
    next(err);
  }
});

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
