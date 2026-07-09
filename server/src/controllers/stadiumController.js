import stadiumService from '../services/stadiumService.js';

/**
 * Controller for managing stadium HTTP request actions.
 */
class StadiumController {
  /**
   * Get all stadiums.
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  async getAllStadiums(req, res, next) {
    try {
      const stadiums = await stadiumService.getAllStadiums();
      res.json({ success: true, data: stadiums });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get a stadium by ID.
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  async getStadiumById(req, res, next) {
    try {
      const stadium = await stadiumService.getStadiumById(req.params.id);
      res.json({ success: true, data: stadium });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get zones of a stadium by ID.
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  async getStadiumZones(req, res, next) {
    try {
      const zones = await stadiumService.getStadiumZones(req.params.id);
      res.json({ success: true, data: zones });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get nearby stadiums based on geo-coordinates.
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  async getNearbyStadiums(req, res, next) {
    try {
      const { lng, lat } = req.params;
      const maxDistance = parseInt(req.query.radius, 10) || 50000;
      const stadiums = await stadiumService.getNearbyStadiums(parseFloat(lng), parseFloat(lat), maxDistance);
      res.json({ success: true, data: stadiums });
    } catch (err) {
      next(err);
    }
  }
}

export default new StadiumController();
