import { Router } from 'express';
import Stadium from '../models/Stadium.js';
import { authenticate } from '../middleware/auth.js';
import { AppError } from '../utils/AppError.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const stadiums = await Stadium.find().select('-__v');
    res.json({ success: true, data: stadiums });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const stadium = await Stadium.findById(req.params.id);
    if (!stadium) throw new AppError('Stadium not found', 404);
    res.json({ success: true, data: stadium });
  } catch (err) {
    next(err);
  }
});

router.get('/:id/zones', async (req, res, next) => {
  try {
    const stadium = await Stadium.findById(req.params.id).select('zones name');
    if (!stadium) throw new AppError('Stadium not found', 404);
    res.json({ success: true, data: stadium.zones });
  } catch (err) {
    next(err);
  }
});

router.get('/nearby/:lng/:lat', async (req, res, next) => {
  try {
    const { lng, lat } = req.params;
    const maxDistance = parseInt(req.query.radius, 10) || 50000;
    const stadiums = await Stadium.find({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: maxDistance,
        },
      },
    });
    res.json({ success: true, data: stadiums });
  } catch (err) {
    next(err);
  }
});

export default router;
