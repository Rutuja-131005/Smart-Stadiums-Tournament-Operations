import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import matchService from '../services/matchService.js';
import apiCache from '../utils/cache.js';

const router = Router();

router.get('/', apiCache.middleware('matches', 10000), async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.stadium) filter.stadium = req.query.stadium;
    if (req.query.status) filter.status = req.query.status;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const matches = await matchService.getMatches(filter, page, limit);
    res.json({ success: true, data: matches });
  } catch (err) {
    next(err);
  }
});

router.get('/live', apiCache.middleware('matches-live', 5000), async (req, res, next) => {
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
