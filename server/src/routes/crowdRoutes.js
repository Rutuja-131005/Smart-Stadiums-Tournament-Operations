import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import crowdController from '../controllers/crowdController.js';

const router = Router();

router.get('/stadium/:stadiumId', crowdController.getStadiumCrowd);
router.get('/stadium/:stadiumId/heatmap', crowdController.getStadiumHeatmap);
router.post('/stadium/:stadiumId/simulate', authenticate, authorize('staff', 'admin'), crowdController.simulateCrowd);
router.post('/route-recommendation', authenticate, crowdController.getRouteRecommendation);

export default router;
