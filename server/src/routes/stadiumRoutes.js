import { Router } from 'express';
import stadiumService from '../services/stadiumService.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const stadiums = await stadiumService.getAllStadiums();
    res.json({ success: true, data: stadiums });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const stadium = await stadiumService.getStadiumById(req.params.id);
    res.json({ success: true, data: stadium });
  } catch (err) {
    next(err);
  }
});

router.get('/:id/zones', async (req, res, next) => {
  try {
    const zones = await stadiumService.getStadiumZones(req.params.id);
    res.json({ success: true, data: zones });
  } catch (err) {
    next(err);
  }
});

router.get('/nearby/:lng/:lat', async (req, res, next) => {
  try {
    const { lng, lat } = req.params;
    const maxDistance = parseInt(req.query.radius, 10) || 50000;
    const stadiums = await stadiumService.getNearbyStadiums(parseFloat(lng), parseFloat(lat), maxDistance);
    res.json({ success: true, data: stadiums });
  } catch (err) {
    next(err);
  }
});

export default router;
