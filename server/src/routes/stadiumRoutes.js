import { Router } from 'express';
import stadiumController from '../controllers/stadiumController.js';
import apiCache from '../utils/cache.js';

const router = Router();

router.get('/', apiCache.middleware('stadiums', 15000), stadiumController.getAllStadiums);
router.get('/:id', stadiumController.getStadiumById);
router.get('/:id/zones', stadiumController.getStadiumZones);
router.get('/nearby/:lng/:lat', stadiumController.getNearbyStadiums);

export default router;
