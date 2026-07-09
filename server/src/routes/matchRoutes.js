import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import matchController from '../controllers/matchController.js';
import apiCache from '../utils/cache.js';

const router = Router();

router.get('/', apiCache.middleware('matches', 10000), matchController.getMatches);
router.get('/live', apiCache.middleware('matches-live', 5000), matchController.getLiveMatches);
router.get('/:id', matchController.getMatchById);
router.patch('/:id/score', authenticate, authorize('staff', 'admin'), matchController.updateScore);

export default router;
