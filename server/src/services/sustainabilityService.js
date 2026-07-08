import SustainabilityMetric from '../models/SustainabilityMetric.js';
import { AppError } from '../utils/AppError.js';

/**
 * Service for managing sustainability records and optimization recommendations.
 */
class SustainabilityService {
  /**
   * Retrieves a list of sustainability metric records for a stadium.
   * @param {string} stadiumId - Stadium ID.
   * @param {number} [limit=24] - Maximum number of metrics to fetch.
   * @returns {Promise<Array<object>>} List of metrics.
   */
  async getMetricsByStadium(stadiumId, limit = 24) {
    return SustainabilityMetric.find({ stadium: stadiumId })
      .sort({ timestamp: -1 })
      .limit(limit);
  }

  /**
   * Retrieves the latest sustainability metric for a stadium.
   * @param {string} stadiumId - Stadium ID.
   * @returns {Promise<object>} The latest metric.
   * @throws {AppError} If no data is found.
   */
  async getLatestMetric(stadiumId) {
    const metric = await SustainabilityMetric.findOne({ stadium: stadiumId })
      .sort({ timestamp: -1 });
    if (!metric) {
      throw new AppError('No sustainability data found', 404);
    }
    return metric;
  }
}

export default new SustainabilityService();
