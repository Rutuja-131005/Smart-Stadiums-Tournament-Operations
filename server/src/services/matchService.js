import Match from '../models/Match.js';
import { AppError } from '../utils/AppError.js';

/**
 * Service for managing match operations and scores.
 */
class MatchService {
  /**
   * Retrieves a list of matches based on filters.
   * @param {object} [filter={}] - Filter criteria (e.g. stadium, status).
   * @returns {Promise<Array<object>>} Sorted and populated list of matches.
   */
  async getMatches(filter = {}) {
    return Match.find(filter)
      .populate('stadium', 'name city capacity')
      .sort({ scheduledAt: 1 });
  }

  /**
   * Retrieves matches that are currently live or at halftime.
   * @returns {Promise<Array<object>>} Populated list of live matches.
   */
  async getLiveMatches() {
    return Match.find({ status: { $in: ['live', 'halftime'] } })
      .populate('stadium', 'name city capacity');
  }

  /**
   * Retrieves a match by its ID.
   * @param {string} id - Match ID.
   * @returns {Promise<object>} The match object.
   * @throws {AppError} If match is not found.
   */
  async getMatchById(id) {
    const match = await Match.findById(id).populate('stadium');
    if (!match) {
      throw new AppError('Match not found', 404);
    }
    return match;
  }

  /**
   * Updates scores and status for a match.
   * @param {string} id - Match ID.
   * @param {object} updates - Updates object containing homeScore, awayScore, status.
   * @returns {Promise<object>} The updated match.
   * @throws {AppError} If match is not found.
   */
  async updateScore(id, { homeScore, awayScore, status }) {
    const match = await Match.findByIdAndUpdate(
      id,
      { homeScore, awayScore, ...(status && { status }) },
      { new: true }
    ).populate('stadium', 'name city');
    if (!match) {
      throw new AppError('Match not found', 404);
    }
    return match;
  }
}

export default new MatchService();
