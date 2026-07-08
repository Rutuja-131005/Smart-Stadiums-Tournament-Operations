import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { generateAIResponse } from '../services/geminiService.js';
import transportService from '../services/transportService.js';

const router = Router();

router.get('/stadium/:stadiumId', async (req, res, next) => {
  try {
    const routes = await transportService.getRoutesByStadium(req.params.stadiumId);
    res.json({ success: true, data: routes });
  } catch (err) {
    next(err);
  }
});

router.get('/stadium/:stadiumId/plan', authenticate, async (req, res, next) => {
  try {
    const routes = await transportService.getRoutesByStadium(req.params.stadiumId);
    const { origin, preferences } = req.query;

    const available = routes.filter((r) => r.status !== 'closed');
    const sorted = available.sort((a, b) => {
      const loadA = a.capacity ? a.currentLoad / a.capacity : 0;
      const loadB = b.capacity ? b.currentLoad / b.capacity : 0;
      return loadA - loadB;
    });

    const aiPlan = await generateAIResponse(
      `Create a transport plan from "${origin || 'city center'}" to the stadium. Preferences: ${preferences || 'fastest'}. Available routes: ${JSON.stringify(sorted.slice(0, 5))}`,
      { type: 'transport_plan' }
    );

    res.json({
      success: true,
      data: { routes: sorted, recommended: sorted[0], aiPlan },
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const route = await transportService.getRouteById(req.params.id);
    res.json({ success: true, data: route });
  } catch (err) {
    next(err);
  }
});

export default router;
