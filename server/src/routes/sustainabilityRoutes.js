import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { generateSustainabilitySuggestions } from '../services/geminiService.js';
import sustainabilityService from '../services/sustainabilityService.js';

const router = Router();

router.get('/stadium/:stadiumId', async (req, res, next) => {
  try {
    const metrics = await sustainabilityService.getMetricsByStadium(req.params.stadiumId);
    res.json({ success: true, data: metrics });
  } catch (err) {
    next(err);
  }
});

router.get('/stadium/:stadiumId/latest', async (req, res, next) => {
  try {
    const metric = await sustainabilityService.getLatestMetric(req.params.stadiumId);
    res.json({ success: true, data: metric });
  } catch (err) {
    next(err);
  }
});

router.post('/stadium/:stadiumId/suggestions', authenticate, authorize('staff', 'admin'), async (req, res, next) => {
  try {
    const metric = await sustainabilityService.getLatestMetric(req.params.stadiumId);
    const suggestions = await generateSustainabilitySuggestions(metric);
    res.json({ success: true, data: { suggestions, basedOn: metric.timestamp } });
  } catch (err) {
    next(err);
  }
});

export default router;
