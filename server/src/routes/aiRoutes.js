import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { validateBody } from '../validators/index.js';
import { chatMessageSchema, translateSchema, navigateSchema } from '../validators/chat.schema.js';
import { generateAIResponse, translateText, generateRouteRecommendation } from '../services/geminiService.js';
import CrowdZone from '../models/CrowdZone.js';
import Match from '../models/Match.js';

const router = Router();

router.post(
  '/chat',
  authenticate,
  validateBody(chatMessageSchema),
  async (req, res, next) => {
    try {
      const { message, stadiumId, matchId } = req.body;

      const context = { role: req.user.role, language: req.user.preferredLanguage };
      if (stadiumId) {
        context.crowdZones = await CrowdZone.find({ stadium: stadiumId }).limit(10);
      }
      if (matchId) {
        context.match = await Match.findById(matchId).populate('stadium', 'name');
      }

      const response = await generateAIResponse(message, context);
      res.json({ success: true, data: { message: response, timestamp: new Date() } });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  '/translate',
  authenticate,
  validateBody(translateSchema),
  async (req, res, next) => {
    try {
      const { text, targetLanguage } = req.body;
      const translation = await translateText(text, targetLanguage);
      res.json({ success: true, data: { original: text, translation, targetLanguage } });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  '/navigate',
  authenticate,
  validateBody(navigateSchema),
  async (req, res, next) => {
    try {
      const { from, to, stadiumId, accessibility } = req.body;
      const zones = stadiumId ? await CrowdZone.find({ stadium: stadiumId }) : [];
      const recommendation = await generateRouteRecommendation(from, to, zones, accessibility);
      res.json({ success: true, data: { route: recommendation } });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
