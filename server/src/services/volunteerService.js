import VolunteerTask from '../models/VolunteerTask.js';
import { AppError } from '../utils/AppError.js';

/**
 * Service for managing volunteer tasks and schedules.
 */
class VolunteerService {
  /**
   * Counts pending or in progress tasks for a stadium.
   * @param {string} stadiumId - Stadium ID.
   * @returns {Promise<number>} Count of pending tasks.
   */
  async countPendingTasks(stadiumId) {
    return VolunteerTask.countDocuments({
      stadium: stadiumId,
      status: { $in: ['pending', 'in_progress'] },
    });
  }

  /**
   * Retrieves volunteer tasks matching filter criteria.
   * @param {object} [filter={}] - Filter criteria.
   * @returns {Promise<Array<object>>} Populated list of tasks.
   */
  async getTasks(filter = {}) {
    return VolunteerTask.find(filter)
      .populate('stadium', 'name city')
      .populate('assignedTo', 'name email')
      .sort({ priority: -1, dueAt: 1 });
  }

  /**
   * Updates status of a task.
   * @param {string} id - Task ID.
   * @param {string} status - New task status.
   * @returns {Promise<object>} The updated task.
   * @throws {AppError} If task is not found.
   */
  async updateTaskStatus(id, status) {
    const task = await VolunteerTask.findByIdAndUpdate(
      id,
      { status, ...(status === 'completed' && { completedAt: new Date() }) },
      { new: true }
    );
    if (!task) {
      throw new AppError('Task not found', 404);
    }
    return task;
  }
}

export default new VolunteerService();
