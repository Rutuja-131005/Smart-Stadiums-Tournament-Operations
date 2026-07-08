import Notification from '../models/Notification.js';
import Report from '../models/Report.js';
import { AppError } from '../utils/AppError.js';

/**
 * Service for managing user/role notifications and report generation.
 */
class NotificationService {
  /**
   * Retrieves notifications for a specific user and role.
   * @param {string} userId - User ID.
   * @param {string} role - User role.
   * @returns {Promise<Array<object>>} List of recent notifications.
   */
  async getNotificationsForUser(userId, role) {
    const filter = {
      $or: [
        { user: userId },
        { role: role },
        { role: 'all' },
      ],
    };
    return Notification.find(filter).sort({ createdAt: -1 }).limit(50);
  }

  /**
   * Marks a single notification as read.
   * @param {string} id - Notification ID.
   * @returns {Promise<object>} The updated notification.
   * @throws {AppError} If notification is not found.
   */
  async markNotificationAsRead(id) {
    const notification = await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
    if (!notification) {
      throw new AppError('Notification not found', 404);
    }
    return notification;
  }

  /**
   * Marks all notifications for a user/role as read.
   * @param {string} userId - User ID.
   * @param {string} role - User role.
   * @returns {Promise<void>}
   */
  async markAllNotificationsAsRead(userId, role) {
    await Notification.updateMany(
      { $or: [{ user: userId }, { role: role }, { role: 'all' }], isRead: false },
      { isRead: true }
    );
  }

  /**
   * Retrieves generated reports.
   * @param {object} [filter={}] - Filter criteria (e.g. stadium, type).
   * @returns {Promise<Array<object>>} List of reports.
   */
  async getReports(filter = {}) {
    return Report.find(filter).sort({ createdAt: -1 });
  }

  /**
   * Creates a new generated report.
   * @param {object} reportData - Report fields.
   * @returns {Promise<object>} The created report.
   */
  async createReport(reportData) {
    return Report.create(reportData);
  }
}

export default new NotificationService();
