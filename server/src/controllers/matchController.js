import matchService from '../services/matchService.js';

/**
 * Controller for managing match HTTP request actions.
 */
class MatchController {
  /**
   * Get matches based on filters and pagination.
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  async getMatches(req, res, next) {
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
  }

  /**
   * Get matches currently live.
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  async getLiveMatches(req, res, next) {
    try {
      const matches = await matchService.getLiveMatches();
      res.json({ success: true, data: matches });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get a match by ID.
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  async getMatchById(req, res, next) {
    try {
      const match = await matchService.getMatchById(req.params.id);
      res.json({ success: true, data: match });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Update match scores and status.
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  async updateScore(req, res, next) {
    try {
      const { homeScore, awayScore, status } = req.body;
      const match = await matchService.updateScore(req.params.id, { homeScore, awayScore, status });
      res.json({ success: true, data: match });
    } catch (err) {
      next(err);
    }
  }
}

export default new MatchController();
