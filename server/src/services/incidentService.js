import Incident from '../models/Incident.js';
import { generateIncidentSummary } from './geminiService.js';
import { AppError } from '../utils/AppError.js';

/**
 * Service for managing security incidents and AI-assisted analysis.
 */
class IncidentService {
  /**
   * Retrieves count of open or investigating incidents for a stadium.
   * @param {string} stadiumId - Stadium ID.
   * @returns {Promise<number>} Count of open incidents.
   */
  async countOpenIncidents(stadiumId) {
    return Incident.countDocuments({
      stadium: stadiumId,
      status: { $in: ['open', 'investigating'] },
    });
  }

  /**
   * Retrieves high or critical severity incidents for a stadium.
   * @param {string} stadiumId - Stadium ID.
   * @returns {Promise<Array<object>>} List of active high severity incidents.
   */
  async getActiveSecurityIncidents(stadiumId) {
    return Incident.find({
      stadium: stadiumId,
      status: { $in: ['open', 'investigating'] },
      severity: { $in: ['high', 'critical'] },
    }).sort({ createdAt: -1 });
  }

  /**
   * Retrieves recent incidents for a stadium.
   * @param {string} stadiumId - Stadium ID.
   * @param {number} [limit=5] - Number of items to retrieve.
   * @returns {Promise<Array<object>>} List of recent incidents.
   */
  async getRecentIncidents(stadiumId, limit = 5) {
    return Incident.find({ stadium: stadiumId }).sort({ createdAt: -1 }).limit(limit);
  }

  /**
   * Retrieves incidents matching filter criteria.
   * @param {object} [filter={}] - Filter criteria (e.g. stadium, status).
   * @returns {Promise<Array<object>>} Populated list of incidents.
   */
  async getIncidents(filter = {}) {
    return Incident.find(filter)
      .populate('stadium', 'name')
      .populate('reportedBy', 'name')
      .sort({ createdAt: -1 });
  }

  /**
   * Creates a new incident and optionally generates AI summary/recommendations.
   * @param {object} incidentData - Incident fields.
   * @param {string} userId - ID of the user reporting.
   * @param {boolean} [aiAnalysis=true] - Whether to generate AI summary.
   * @returns {Promise<object>} The created incident.
   */
  async createIncident(incidentData, userId, aiAnalysis = true) {
    let aiSummary = '';
    let aiRecommendations = [];

    if (aiAnalysis !== false) {
      try {
        const analysis = await generateIncidentSummary(incidentData);
        aiSummary = analysis.summary || '';
        aiRecommendations = analysis.recommendations || [];
      } catch {
        // Fallback silently if AI fails
      }
    }

    return Incident.create({
      ...incidentData,
      reportedBy: userId,
      aiSummary,
      aiRecommendations,
    });
  }

  /**
   * Updates an existing incident.
   * @param {string} id - Incident ID.
   * @param {object} updates - Updates object.
   * @returns {Promise<object>} The updated incident.
   * @throws {AppError} If incident is not found.
   */
  async updateIncident(id, updates) {
    const updatedFields = { ...updates };
    if (updatedFields.status === 'resolved') {
      updatedFields.resolvedAt = new Date();
    }
    const incident = await Incident.findByIdAndUpdate(id, updatedFields, { new: true });
    if (!incident) {
      throw new AppError('Incident not found', 404);
    }
    return incident;
  }
}

export default new IncidentService();
