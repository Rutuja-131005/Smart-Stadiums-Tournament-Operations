import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { validateBody } from '../validators/index.js';
import { registerSchema, loginSchema, updateAccessibilitySchema, updateLanguageSchema } from '../validators/auth.schema.js';
import authController from '../controllers/authController.js';

const router = Router();

router.post('/register', validateBody(registerSchema), authController.register);
router.post('/login', validateBody(loginSchema), authController.login);
router.post('/logout', authController.logout);
router.get('/me', authenticate, authController.getMe);
router.patch('/me/accessibility', authenticate, validateBody(updateAccessibilitySchema), authController.updateAccessibility);
router.patch('/me/language', authenticate, validateBody(updateLanguageSchema), authController.updateLanguage);

export default router;
