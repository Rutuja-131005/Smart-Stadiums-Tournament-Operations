import { Router } from 'express';
import CrowdZone from '../models/CrowdZone.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { simulateCrowdUpdate, getCongestionAlerts } from '../services/crowdService.js';
import { generateRouteRecommendation } from '../services/geminiService.js';
import { AppError } from '../utils/AppError.js';

const router = Router();

router.get('/stadium/:stadiumId', async (req, res, next) => {
  try {
    const zones = await CrowdZone.find({ stadium: req.params.stadiumId }).sort({ zoneName: 1 });
    const alerts = getCongestionAlerts(zones);
    res.json({ success: true, data: { zones, alerts } });
  } catch (err) {
    next(err);
  }
});

router.get('/stadium/:stadiumId/heatmap', async (req, res, next) => {
  try {
    const zones = await CrowdZone.find({ stadium: req.params.stadiumId });
    const heatmap = zones.map((z) => ({
      zoneId: z.zoneId,
      zoneName: z.zoneName,
      density: z.density,
      coordinates: z.coordinates,
      floor: z.floor,
      status: z.status,
    }));
    res.json({ success: true, data: heatmap });
  } catch (err) {
    next(err);
  }
});

router.post('/stadium/:stadiumId/simulate', authenticate, authorize('staff', 'admin'), async (req, res, next) => {
  try {
    const updates = await simulateCrowdUpdate(req.params.stadiumId);
    res.json({ success: true, data: updates });
  } catch (err) {
    next(err);
  }
});

router.post('/route-recommendation', authenticate, async (req, res, next) => {
  try {
    const { from, to, stadiumId, accessibility } = req.body;
    if (!from || !to || !stadiumId) throw new AppError('from, to, and stadiumId are required', 400);
    const zones = await CrowdZone.find({ stadium: stadiumId });
    const recommendation = await generateRouteRecommendation(from, to, zones, accessibility);
    res.json({ success: true, data: { recommendation, crowdZones: zones } });
  } catch (err) {
    next(err);
  }
});

export default router;
