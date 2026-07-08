import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import matchService from '../services/matchService.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.stadium) filter.stadium = req.query.stadium;
    if (req.query.status) filter.status = req.query.status;
    const matches = await matchService.getMatches(filter);
    res.json({ success: true, data: matches });
  } catch (err) {
    next(err);
  }
});

router.get('/live', async (req, res, next) => {
  try {
    const matches = await matchService.getLiveMatches();
    res.json({ success: true, data: matches });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const match = await matchService.getMatchById(req.params.id);
    res.json({ success: true, data: match });
  } catch (err) {
    next(err);
  }
});

router.patch('/:id/score', authenticate, authorize('staff', 'admin'), async (req, res, next) => {
  try {
    const { homeScore, awayScore, status } = req.body;
    const match = await matchService.updateScore(req.params.id, { homeScore, awayScore, status });
    res.json({ success: true, data: match });
  } catch (err) {
    next(err);
  }
});

export default router;
