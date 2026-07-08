import { Router } from 'express';
import Match from '../models/Match.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { AppError } from '../utils/AppError.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.stadium) filter.stadium = req.query.stadium;
    if (req.query.status) filter.status = req.query.status;
    const matches = await Match.find(filter)
      .populate('stadium', 'name city capacity')
      .sort({ scheduledAt: 1 });
    res.json({ success: true, data: matches });
  } catch (err) {
    next(err);
  }
});

router.get('/live', async (req, res, next) => {
  try {
    const matches = await Match.find({ status: { $in: ['live', 'halftime'] } })
      .populate('stadium', 'name city capacity');
    res.json({ success: true, data: matches });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const match = await Match.findById(req.params.id).populate('stadium');
    if (!match) throw new AppError('Match not found', 404);
    res.json({ success: true, data: match });
  } catch (err) {
    next(err);
  }
});

router.patch('/:id/score', authenticate, authorize('staff', 'admin'), async (req, res, next) => {
  try {
    const { homeScore, awayScore, status } = req.body;
    const match = await Match.findByIdAndUpdate(
      req.params.id,
      { homeScore, awayScore, ...(status && { status }) },
      { new: true }
    ).populate('stadium', 'name city');
    if (!match) throw new AppError('Match not found', 404);
    res.json({ success: true, data: match });
  } catch (err) {
    next(err);
  }
});

export default router;
