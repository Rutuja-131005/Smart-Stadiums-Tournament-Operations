import { Router } from 'express';
import SustainabilityMetric from '../models/SustainabilityMetric.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { generateSustainabilitySuggestions } from '../services/geminiService.js';
import { AppError } from '../utils/AppError.js';

const router = Router();

router.get('/stadium/:stadiumId', async (req, res, next) => {
  try {
    const metrics = await SustainabilityMetric.find({ stadium: req.params.stadiumId })
      .sort({ timestamp: -1 })
      .limit(24);
    res.json({ success: true, data: metrics });
  } catch (err) {
    next(err);
  }
});

router.get('/stadium/:stadiumId/latest', async (req, res, next) => {
  try {
    const metric = await SustainabilityMetric.findOne({ stadium: req.params.stadiumId })
      .sort({ timestamp: -1 });
    if (!metric) throw new AppError('No sustainability data found', 404);
    res.json({ success: true, data: metric });
  } catch (err) {
    next(err);
  }
});

router.post('/stadium/:stadiumId/suggestions', authenticate, authorize('staff', 'admin'), async (req, res, next) => {
  try {
    const metric = await SustainabilityMetric.findOne({ stadium: req.params.stadiumId })
      .sort({ timestamp: -1 });
    if (!metric) throw new AppError('No sustainability data found', 404);
    const suggestions = await generateSustainabilitySuggestions(metric);
    res.json({ success: true, data: { suggestions, basedOn: metric.timestamp } });
  } catch (err) {
    next(err);
  }
});

export default router;
