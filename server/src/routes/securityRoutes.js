import { Router } from 'express';
import Incident from '../models/Incident.js';
import CrowdZone from '../models/CrowdZone.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { generateAIResponse } from '../services/geminiService.js';
import { AppError } from '../utils/AppError.js';

const router = Router();

router.get('/alerts/:stadiumId', authenticate, authorize('security', 'admin'), async (req, res, next) => {
  try {
    const [criticalZones, openIncidents] = await Promise.all([
      CrowdZone.find({ stadium: req.params.stadiumId, status: { $in: ['congested', 'critical'] } }),
      Incident.find({
        stadium: req.params.stadiumId,
        status: { $in: ['open', 'investigating'] },
        severity: { $in: ['high', 'critical'] },
      }).sort({ createdAt: -1 }),
    ]);

    const alerts = [
      ...criticalZones.map((z) => ({
        id: `crowd-${z._id}`,
        type: 'crowd',
        severity: z.status === 'critical' ? 'critical' : 'high',
        title: `Crowd Alert: ${z.zoneName}`,
        message: `Density at ${z.density}% - ${z.trend} trend`,
        timestamp: z.updatedAt,
      })),
      ...openIncidents.map((i) => ({
        id: `incident-${i._id}`,
        type: i.type,
        severity: i.severity,
        title: i.title,
        message: i.aiSummary || i.description,
        timestamp: i.createdAt,
      })),
    ];

    res.json({ success: true, data: alerts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) });
  } catch (err) {
    next(err);
  }
});

router.post('/evacuation-plan', authenticate, authorize('security', 'admin'), async (req, res, next) => {
  try {
    const { stadiumId, zone, reason } = req.body;
    const crowdZones = await CrowdZone.find({ stadium: stadiumId });
    const plan = await generateAIResponse(
      `Generate detailed evacuation plan for stadium zone "${zone}". Reason: ${reason}. Current crowd data: ${JSON.stringify(crowdZones)}. Include: exit routes, accessible paths, assembly points, staff deployment, and communication steps.`,
      { type: 'evacuation_plan' }
    );
    res.json({ success: true, data: { plan, generatedAt: new Date() } });
  } catch (err) {
    next(err);
  }
});

router.get('/workflows', authenticate, authorize('security', 'admin'), async (req, res, next) => {
  try {
    const workflows = [
      {
        id: 'medical-emergency',
        name: 'Medical Emergency Response',
        steps: ['Assess situation', 'Dispatch medical team', 'Clear access route', 'Notify command center', 'Document incident'],
        status: 'ready',
      },
      {
        id: 'crowd-surge',
        name: 'Crowd Surge Management',
        steps: ['Identify surge location', 'Deploy crowd control', 'Open alternate exits', 'Update digital signage', 'Monitor density sensors'],
        status: 'ready',
      },
      {
        id: 'evacuation',
        name: 'Full Stadium Evacuation',
        steps: ['Activate alarm protocol', 'Open all exits', 'Deploy evacuation teams', 'Guide accessible routes', 'Account at assembly points'],
        status: 'ready',
      },
      {
        id: 'security-threat',
        name: 'Security Threat Response',
        steps: ['Lock down affected zone', 'Notify law enforcement', 'Evacuate adjacent areas', 'Review CCTV feeds', 'Issue public alert'],
        status: 'ready',
      },
    ];
    res.json({ success: true, data: workflows });
  } catch (err) {
    next(err);
  }
});

export default router;
