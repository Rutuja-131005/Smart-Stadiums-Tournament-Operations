import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { generateAIResponse } from '../services/geminiService.js';
import volunteerService from '../services/volunteerService.js';
import { AppError } from '../utils/AppError.js';

const router = Router();

router.get('/tasks', authenticate, authorize('volunteer', 'staff', 'admin'), async (req, res, next) => {
  try {
    const filter = req.user.role === 'volunteer'
      ? { assignedTo: req.user._id }
      : {};
    if (req.query.stadium) filter.stadium = req.query.stadium;
    if (req.query.status) filter.status = req.query.status;

    const tasks = await volunteerService.getTasks(filter);
    res.json({ success: true, data: tasks });
  } catch (err) {
    next(err);
  }
});

router.patch('/tasks/:id', authenticate, authorize('volunteer', 'staff', 'admin'), async (req, res, next) => {
  try {
    const { status } = req.body;
    const task = await volunteerService.updateTaskStatus(req.params.id, status);
    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
});

router.post('/knowledge', authenticate, authorize('volunteer', 'staff', 'admin'), async (req, res, next) => {
  try {
    const { question } = req.body;
    if (!question) throw new AppError('Question is required', 400);
    const response = await generateAIResponse(
      `As a volunteer knowledge assistant for FIFA World Cup 2026: ${question}`,
      { type: 'volunteer_knowledge', role: 'volunteer' }
    );
    res.json({ success: true, data: { answer: response } });
  } catch (err) {
    next(err);
  }
});

router.get('/announcements', authenticate, authorize('volunteer', 'staff', 'admin'), async (req, res, next) => {
  try {
    const announcements = [
      { id: 1, title: 'Shift Change Reminder', message: 'All volunteers report to Zone B briefing room at 16:00.', priority: 'high', timestamp: new Date() },
      { id: 2, title: 'Guest Services Update', message: 'Increased foot traffic expected at Gate A. Deploy 2 additional wayfinding volunteers.', priority: 'medium', timestamp: new Date() },
      { id: 3, title: 'Safety Briefing', message: 'Review evacuation procedures before second half kickoff.', priority: 'high', timestamp: new Date() },
    ];
    res.json({ success: true, data: announcements });
  } catch (err) {
    next(err);
  }
});

export default router;
