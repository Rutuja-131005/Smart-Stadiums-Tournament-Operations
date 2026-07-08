import TransportRoute from '../models/TransportRoute.js';
import { AppError } from '../utils/AppError.js';

/**
 * Service for managing transport routes and planning travel.
 */
class TransportService {
  /**
   * Retrieves transit routes for a stadium.
   * @param {string} stadiumId - Stadium ID.
   * @returns {Promise<Array<object>>} List of transport routes.
   */
  async getRoutesByStadium(stadiumId) {
    return TransportRoute.find({ stadium: stadiumId });
  }

  /**
   * Retrieves a transport route by its ID.
   * @param {string} id - Transport route ID.
   * @returns {Promise<object>} The transport route.
   * @throws {AppError} If transport route is not found.
   */
  async getRouteById(id) {
    const route = await TransportRoute.findById(id);
    if (!route) {
      throw new AppError('Transport route not found', 404);
    }
    return route;
  }
}

export default new TransportService();
