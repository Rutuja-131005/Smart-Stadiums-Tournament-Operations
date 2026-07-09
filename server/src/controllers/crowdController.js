import CrowdZone from '../models/CrowdZone.js';
import { simulateCrowdUpdate, getCongestionAlerts } from '../services/crowdService.js';
import { generateRouteRecommendation } from '../services/geminiService.js';
import { AppError } from '../utils/AppError.js';

/**
 * Controller for managing crowd control and simulation request actions.
 */
class CrowdController {
  /**
   * Get crowd zones and active congestion alerts by stadium ID.
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  async getStadiumCrowd(req, res, next) {
    try {
      const zones = await CrowdZone.find({ stadium: req.params.stadiumId }).sort({ zoneName: 1 });
      const alerts = getCongestionAlerts(zones);
      res.json({ success: true, data: { zones, alerts } });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get stadium crowd heatmap coordinates and status.
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  async getStadiumHeatmap(req, res, next) {
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
  }

  /**
   * Simulate a crowd update event.
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  async simulateCrowd(req, res, next) {
    try {
      const updates = await simulateCrowdUpdate(req.params.stadiumId);
      res.json({ success: true, data: updates });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Generate an optimized navigation route recommendation using Gemini.
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  async getRouteRecommendation(req, res, next) {
    try {
      const { from, to, stadiumId, accessibility } = req.body;
      if (!from || !to || !stadiumId) {
        throw new AppError('from, to, and stadiumId are required', 400);
      }
      const zones = await CrowdZone.find({ stadium: stadiumId });
      const recommendation = await generateRouteRecommendation(from, to, zones, accessibility);
      res.json({ success: true, data: { recommendation, crowdZones: zones } });
    } catch (err) {
      next(err);
    }
  }
}

export default new CrowdController();
