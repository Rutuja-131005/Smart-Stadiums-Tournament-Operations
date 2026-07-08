import Stadium from '../models/Stadium.js';
import { AppError } from '../utils/AppError.js';

/**
 * Service for managing stadium operations.
 */
class StadiumService {
  /**
   * Retrieves all stadiums.
   * @returns {Promise<Array<object>>} List of all stadiums.
   */
  async getAllStadiums() {
    return Stadium.find().select('-__v');
  }

  /**
   * Retrieves a stadium by its ID.
   * @param {string} id - Stadium ID.
   * @returns {Promise<object>} The stadium object.
   * @throws {AppError} If stadium is not found.
   */
  async getStadiumById(id) {
    const stadium = await Stadium.findById(id);
    if (!stadium) {
      throw new AppError('Stadium not found', 404);
    }
    return stadium;
  }

  /**
   * Retrieves the zones of a stadium.
   * @param {string} id - Stadium ID.
   * @returns {Promise<Array<object>>} List of zones.
   * @throws {AppError} If stadium is not found.
   */
  async getStadiumZones(id) {
    const stadium = await Stadium.findById(id).select('zones name');
    if (!stadium) {
      throw new AppError('Stadium not found', 404);
    }
    return stadium.zones;
  }

  /**
   * Retrieves stadiums near specified coordinates.
   * @param {number} lng - Longitude.
   * @param {number} lat - Latitude.
   * @param {number} [radius=50000] - Search radius in meters.
   * @returns {Promise<Array<object>>} List of nearby stadiums.
   */
  async getNearbyStadiums(lng, lat, radius = 50000) {
    return Stadium.find({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [lng, lat] },
          $maxDistance: radius,
        },
      },
    });
  }
}

export default new StadiumService();
