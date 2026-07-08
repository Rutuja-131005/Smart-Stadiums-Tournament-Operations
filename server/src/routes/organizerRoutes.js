import { Router } from 'express';
import CrowdZone from '../models/CrowdZone.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { generateOperationalSummary } from '../services/geminiService.js';
import { getCongestionAlerts } from '../services/crowdService.js';
import matchService from '../services/matchService.js';
import incidentService from '../services/incidentService.js';
import volunteerService from '../services/volunteerService.js';
import sustainabilityService from '../services/sustainabilityService.js';

const router = Router();

router.get('/kpis/:stadiumId', authenticate, authorize('staff', 'security', 'admin'), async (req, res, next) => {
  try {
    const stadiumId = req.params.stadiumId;
    const [crowdZones, openIncidents, liveMatches, pendingTasks, sustainability] = await Promise.all([
      CrowdZone.find({ stadium: stadiumId }),
      incidentService.countOpenIncidents(stadiumId),
      matchService.getMatches({ stadium: stadiumId, status: { $in: ['live', 'halftime'] } }),
      volunteerService.countPendingTasks(stadiumId),
      sustainabilityService.getLatestMetric(stadiumId).catch(() => null),
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
      incidentService.getRecentIncidents(stadiumId, 5),
      matchService.getMatches({ stadium: stadiumId, status: { $in: ['live', 'halftime'] } }),
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
    const incidents = await incidentService.getIncidents(filter);
    res.json({ success: true, data: incidents });
  } catch (err) {
    next(err);
  }
});

router.post('/incidents', authenticate, authorize('staff', 'security', 'admin'), async (req, res, next) => {
  try {
    const { aiAnalysis, ...incidentData } = req.body;
    const incident = await incidentService.createIncident(incidentData, req.user._id, aiAnalysis);
    res.status(201).json({ success: true, data: incident });
  } catch (err) {
    next(err);
  }
});

router.patch('/incidents/:id', authenticate, authorize('staff', 'security', 'admin'), async (req, res, next) => {
  try {
    const updates = { ...req.body };
    const incident = await incidentService.updateIncident(req.params.id, updates);
    res.json({ success: true, data: incident });
  } catch (err) {
    next(err);
  }
});

export default router;
