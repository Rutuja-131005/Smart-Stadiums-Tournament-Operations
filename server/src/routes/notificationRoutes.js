import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { generateMatchDayReport } from '../services/geminiService.js';
import Match from '../models/Match.js';
import CrowdZone from '../models/CrowdZone.js';
import Incident from '../models/Incident.js';
import notificationService from '../services/notificationService.js';

const router = Router();

router.get('/', authenticate, async (req, res, next) => {
  try {
    const notifications = await notificationService.getNotificationsForUser(req.user._id, req.user.role);
    res.json({ success: true, data: notifications });
  } catch (err) {
    next(err);
  }
});

router.patch('/:id/read', authenticate, async (req, res, next) => {
  try {
    const notification = await notificationService.markNotificationAsRead(req.params.id);
    res.json({ success: true, data: notification });
  } catch (err) {
    next(err);
  }
});

router.patch('/read-all', authenticate, async (req, res, next) => {
  try {
    await notificationService.markAllNotificationsAsRead(req.user._id, req.user.role);
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    next(err);
  }
});

router.get('/reports', authenticate, authorize('staff', 'admin'), async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.stadium) filter.stadium = req.query.stadium;
    if (req.query.type) filter.type = req.query.type;
    const reports = await notificationService.getReports(filter);
    res.json({ success: true, data: reports });
  } catch (err) {
    next(err);
  }
});

router.post('/reports/generate', authenticate, authorize('staff', 'admin'), async (req, res, next) => {
  try {
    const { matchId, stadiumId, type = 'match_day' } = req.body;
    const match = matchId ? await Match.findById(matchId).populate('stadium') : null;
    const [crowdZones, incidents] = await Promise.all([
      CrowdZone.find({ stadium: stadiumId || match?.stadium?._id }),
      Incident.find({ stadium: stadiumId || match?.stadium?._id }).limit(10),
    ]);

    const content = await generateMatchDayReport(match, { crowdZones, incidents });
    const report = await notificationService.createReport({
      stadium: stadiumId || match.stadium._id,
      match: matchId,
      type,
      title: `Match Day Report - ${match ? `${match.homeTeam} vs ${match.awayTeam}` : 'Operations'}`,
      content,
      generatedBy: 'ai',
      author: req.user._id,
    });
    res.status(201).json({ success: true, data: report });
  } catch (err) {
    next(err);
  }
});

export default router;
