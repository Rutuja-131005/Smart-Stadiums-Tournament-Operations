import { Router } from 'express';
import Incident from '../models/Incident.js';
import CrowdZone from '../models/CrowdZone.js';
import Match from '../models/Match.js';
import SustainabilityMetric from '../models/SustainabilityMetric.js';
import VolunteerTask from '../models/VolunteerTask.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { generateOperationalSummary, generateIncidentSummary } from '../services/geminiService.js';
import { getCongestionAlerts } from '../services/crowdService.js';
import { AppError } from '../utils/AppError.js';

const router = Router();

router.get('/kpis/:stadiumId', authenticate, authorize('staff', 'security', 'admin'), async (req, res, next) => {
  try {
    const stadiumId = req.params.stadiumId;
    const [crowdZones, openIncidents, liveMatches, pendingTasks, sustainability] = await Promise.all([
      CrowdZone.find({ stadium: stadiumId }),
      Incident.countDocuments({ stadium: stadiumId, status: { $in: ['open', 'investigating'] } }),
      Match.find({ stadium: stadiumId, status: { $in: ['live', 'halftime'] } }),
      VolunteerTask.countDocuments({ stadium: stadiumId, status: { $in: ['pending', 'in_progress'] } }),
      SustainabilityMetric.findOne({ stadium: stadiumId }).sort({ timestamp: -1 }),
    ]);

    const avgDensity = crowdZones.length
      ? Math.round(crowdZones.reduce((s, z) => s + z.density, 0) / crowdZones.length)
      : 0;
    const totalAttendance = liveMatches.reduce((s, m) => s + (m.attendance || 0), 0);
    const alerts = getCongestionAlerts(crowdZones);

    res.json({
      success: true,
      data: {
        attendance: totalAttendance,
        avgCrowdDensity: avgDensity,
        openIncidents,
        pendingTasks,
        congestionAlerts: alerts.length,
        criticalZones: crowdZones.filter((z) => z.status === 'critical').length,
        sustainability: sustainability || null,
        liveMatches,
        crowdZones,
        alerts,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.get('/summary/:stadiumId', authenticate, authorize('staff', 'admin'), async (req, res, next) => {
  try {
    const stadiumId = req.params.stadiumId;
    const [crowdZones, incidents, matches] = await Promise.all([
      CrowdZone.find({ stadium: stadiumId }),
      Incident.find({ stadium: stadiumId }).sort({ createdAt: -1 }).limit(5),
      Match.find({ stadium: stadiumId, status: { $in: ['live', 'halftime'] } }),
    ]);

    const summary = await generateOperationalSummary({ crowdZones, incidents, matches });
    res.json({ success: true, data: { summary, generatedAt: new Date() } });
  } catch (err) {
    next(err);
  }
});

router.get('/incidents', authenticate, authorize('staff', 'security', 'admin'), async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.stadium) filter.stadium = req.query.stadium;
    if (req.query.status) filter.status = req.query.status;
    const incidents = await Incident.find(filter)
      .populate('stadium', 'name')
      .populate('reportedBy', 'name')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: incidents });
  } catch (err) {
    next(err);
  }
});

router.post('/incidents', authenticate, authorize('staff', 'security', 'admin'), async (req, res, next) => {
  try {
    const { aiAnalysis, ...incidentData } = req.body;
    let aiSummary = '';
    let aiRecommendations = [];

    if (aiAnalysis !== false) {
      const analysis = await generateIncidentSummary(incidentData);
      aiSummary = analysis.summary;
      aiRecommendations = analysis.recommendations;
    }

    const incident = await Incident.create({
      ...incidentData,
      reportedBy: req.user._id,
      aiSummary,
      aiRecommendations,
    });
    res.status(201).json({ success: true, data: incident });
  } catch (err) {
    next(err);
  }
});

router.patch('/incidents/:id', authenticate, authorize('staff', 'security', 'admin'), async (req, res, next) => {
  try {
    const updates = { ...req.body };
    if (updates.status === 'resolved') updates.resolvedAt = new Date();
    const incident = await Incident.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!incident) throw new AppError('Incident not found', 404);
    res.json({ success: true, data: incident });
  } catch (err) {
    next(err);
  }
});

export default router;
