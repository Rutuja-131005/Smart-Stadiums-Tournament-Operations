import mongoose from 'mongoose';
import User from '../models/User.js';
import Stadium from '../models/Stadium.js';
import Match from '../models/Match.js';
import CrowdZone from '../models/CrowdZone.js';
import Incident from '../models/Incident.js';
import VolunteerTask from '../models/VolunteerTask.js';
import Notification from '../models/Notification.js';
import SustainabilityMetric from '../models/SustainabilityMetric.js';
import TransportRoute from '../models/TransportRoute.js';
import Report from '../models/Report.js';
import logger from '../utils/logger.js';
import { getDemoAccounts } from './authDefaults.js';

const seedDatabase = async () => {
  // Check if data already exists
  const userCount = await User.countDocuments();
  if (userCount > 0) {
    logger.info('Database already seeded, skipping...');
    return;
  }

  logger.info('Auto-seeding in-memory database...');

  const stadiums = await Stadium.insertMany([
    {
      name: 'MetLife Stadium',
      city: 'East Rutherford',
      country: 'USA',
      capacity: 82500,
      location: { type: 'Point', coordinates: [-74.0745, 40.8135] },
      zones: [
        { id: 'gate-a', name: 'Gate A - Main Entrance', type: 'entrance', coordinates: { lat: 40.8138, lng: -74.0740 }, floor: 0, wheelchairAccessible: true, capacity: 5000 },
        { id: 'gate-c', name: 'Gate C - West Entrance', type: 'entrance', coordinates: { lat: 40.8132, lng: -74.0760 }, floor: 0, wheelchairAccessible: true, capacity: 4000 },
        { id: 'north-concourse', name: 'North Concourse', type: 'concourse', coordinates: { lat: 40.8140, lng: -74.0745 }, floor: 1, wheelchairAccessible: true, capacity: 8000 },
        { id: 'south-concourse', name: 'South Concourse', type: 'concourse', coordinates: { lat: 40.8130, lng: -74.0745 }, floor: 1, wheelchairAccessible: true, capacity: 7500 },
        { id: 'section-112', name: 'Section 112', type: 'seating', coordinates: { lat: 40.8136, lng: -74.0748 }, floor: 2, wheelchairAccessible: true, capacity: 1200 },
        { id: 'concession-n1', name: 'North Concession Plaza', type: 'concession', coordinates: { lat: 40.8139, lng: -74.0743 }, floor: 1, wheelchairAccessible: true, capacity: 2000 },
        { id: 'medical-1', name: 'Medical Station 1', type: 'medical', coordinates: { lat: 40.8134, lng: -74.0742 }, floor: 0, wheelchairAccessible: true, capacity: 50 },
        { id: 'parking-b', name: 'Parking Lot B', type: 'parking', coordinates: { lat: 40.8120, lng: -74.0730 }, floor: 0, wheelchairAccessible: true, capacity: 3000 },
      ],
      amenities: ['WiFi', 'Accessible Seating', 'Family Zone', 'Premium Lounges', 'EV Charging'],
      status: 'operational',
    },
    {
      name: 'Estadio Azteca',
      city: 'Mexico City',
      country: 'Mexico',
      capacity: 87500,
      location: { type: 'Point', coordinates: [-99.1505, 19.3029] },
      zones: [
        { id: 'gate-1', name: 'Gate 1 - South', type: 'entrance', coordinates: { lat: 19.3025, lng: -99.1500 }, floor: 0, wheelchairAccessible: true, capacity: 6000 },
        { id: 'gate-5', name: 'Gate 5 - North', type: 'entrance', coordinates: { lat: 19.3033, lng: -99.1510 }, floor: 0, wheelchairAccessible: true, capacity: 5000 },
        { id: 'concourse-a', name: 'Concourse A', type: 'concourse', coordinates: { lat: 19.3029, lng: -99.1505 }, floor: 1, wheelchairAccessible: true, capacity: 10000 },
      ],
      amenities: ['WiFi', 'Museum', 'Accessible Routes', 'Fan Zone'],
      status: 'operational',
    },
    {
      name: 'BC Place',
      city: 'Vancouver',
      country: 'Canada',
      capacity: 54500,
      location: { type: 'Point', coordinates: [-123.1122, 49.2768] },
      zones: [
        { id: 'gate-east', name: 'East Gate', type: 'entrance', coordinates: { lat: 49.2765, lng: -123.1115 }, floor: 0, wheelchairAccessible: true, capacity: 4000 },
        { id: 'concourse-main', name: 'Main Concourse', type: 'concourse', coordinates: { lat: 49.2768, lng: -123.1122 }, floor: 1, wheelchairAccessible: true, capacity: 7000 },
      ],
      amenities: ['Retractable Roof', 'SkyTrain Access', 'Accessible Seating'],
      status: 'operational',
    },
  ]);

  const [metlife, azteca, bcplace] = stadiums;

  const demoAccounts = getDemoAccounts();
  const users = await Promise.all(
    demoAccounts.map((account, idx) =>
      User.create({
        name: account.name,
        email: account.email,
        password: account.password,
        role: account.role,
        preferredLanguage: account.preferredLanguage || 'en',
        ...(idx < 4 && { assignedStadium: metlife._id }),
      })
    )
  );

  const organizerId = users[1]?._id || new mongoose.Types.ObjectId();
  const securityId = users[2]?._id || new mongoose.Types.ObjectId();
  const volunteerId = users[3]?._id || new mongoose.Types.ObjectId();
  const fanId = users[4]?._id || new mongoose.Types.ObjectId();

  const matches = await Match.insertMany([
    {
      stadium: metlife._id,
      homeTeam: 'USA',
      awayTeam: 'England',
      stage: 'group',
      group: 'D',
      scheduledAt: new Date('2026-06-15T19:00:00Z'),
      status: 'live',
      homeScore: 2,
      awayScore: 1,
      attendance: 78500,
      weather: { condition: 'Clear', temperature: 24, humidity: 55 },
    },
    {
      stadium: azteca._id,
      homeTeam: 'Mexico',
      awayTeam: 'Brazil',
      stage: 'group',
      group: 'A',
      scheduledAt: new Date('2026-06-18T21:00:00Z'),
      status: 'scheduled',
      weather: { condition: 'Partly Cloudy', temperature: 28, humidity: 60 },
    },
    {
      stadium: bcplace._id,
      homeTeam: 'Canada',
      awayTeam: 'France',
      stage: 'quarter',
      scheduledAt: new Date('2026-07-05T17:00:00Z'),
      status: 'scheduled',
    },
  ]);

  const [liveMatch] = matches;

  const zoneNames = [
    { zoneId: 'gate-a', zoneName: 'Gate A', capacity: 5000, coordinates: { lat: 40.8138, lng: -74.0740 }, floor: 0 },
    { zoneId: 'gate-c', zoneName: 'Gate C', capacity: 4000, coordinates: { lat: 40.8132, lng: -74.0760 }, floor: 0 },
    { zoneId: 'north-concourse', zoneName: 'North Concourse', capacity: 8000, coordinates: { lat: 40.8140, lng: -74.0745 }, floor: 1 },
    { zoneId: 'south-concourse', zoneName: 'South Concourse', capacity: 7500, coordinates: { lat: 40.8130, lng: -74.0745 }, floor: 1 },
    { zoneId: 'section-112', zoneName: 'Section 112', capacity: 1200, coordinates: { lat: 40.8136, lng: -74.0748 }, floor: 2 },
    { zoneId: 'concession-n1', zoneName: 'North Concession', capacity: 2000, coordinates: { lat: 40.8139, lng: -74.0743 }, floor: 1 },
  ];

  await CrowdZone.insertMany(
    zoneNames.map((z) => {
      const currentCount = Math.floor(z.capacity * (0.3 + Math.random() * 0.5));
      const density = Math.round((currentCount / z.capacity) * 100);
      return {
        stadium: metlife._id,
        ...z,
        currentCount,
        density,
        trend: ['increasing', 'stable', 'decreasing'][Math.floor(Math.random() * 3)],
        predictedDensity15min: Math.floor(40 + Math.random() * 40),
        status: density >= 85 ? 'critical' : density >= 70 ? 'congested' : density >= 50 ? 'moderate' : 'normal',
      };
    })
  );

  await Incident.insertMany([
    {
      stadium: metlife._id,
      match: liveMatch._id,
      title: 'Minor medical incident - Section 112',
      description: 'Fan requiring medical assistance for heat-related symptoms',
      type: 'medical',
      severity: 'medium',
      status: 'investigating',
      location: { zone: 'Section 112', coordinates: { lat: 40.8136, lng: -74.0748 }, floor: 2 },
      reportedBy: volunteerId,
      aiSummary: 'Medical team dispatched to Section 112. Heat-related incident during live match.',
      aiRecommendations: ['Ensure hydration stations are visible', 'Monitor crowd density in Section 112', 'Prepare backup medical team'],
    },
    {
      stadium: metlife._id,
      title: 'Elevator maintenance - Gate A',
      description: 'Elevator 2 at Gate A temporarily out of service',
      type: 'technical',
      severity: 'low',
      status: 'open',
      location: { zone: 'Gate A', floor: 0 },
      reportedBy: organizerId,
    },
  ]);

  await VolunteerTask.insertMany([
    {
      stadium: metlife._id,
      match: liveMatch._id,
      title: 'Wayfinding Support - Gate A',
      description: 'Assist fans with directions to Section 112 and accessible routes',
      assignedTo: volunteerId,
      priority: 'high',
      status: 'in_progress',
      location: { zone: 'Gate A', coordinates: { lat: 40.8138, lng: -74.0740 } },
      dueAt: new Date(Date.now() + 3600000),
      category: 'wayfinding',
    },
    {
      stadium: metlife._id,
      title: 'Concession Restock Alert',
      description: 'North Concession Plaza running low on inventory - coordinate with vendors',
      priority: 'medium',
      status: 'pending',
      location: { zone: 'North Concession' },
      category: 'operations',
    },
    {
      stadium: metlife._id,
      title: 'Guest Services - Lost Item',
      description: 'Process lost item report from Gate C area',
      assignedTo: volunteerId,
      priority: 'low',
      status: 'pending',
      category: 'guest_services',
    },
  ]);

  await Notification.insertMany([
    { role: 'all', stadium: metlife._id, title: 'Match Live', message: 'USA vs England is now LIVE at MetLife Stadium!', type: 'info', category: 'match' },
    { role: 'security', stadium: metlife._id, title: 'Crowd Alert', message: 'North Concourse approaching 75% capacity', type: 'warning', category: 'crowd' },
    { role: 'volunteer', stadium: metlife._id, title: 'Shift Update', message: 'Briefing at Zone B at 16:00', type: 'info', category: 'general' },
    { user: fanId, title: 'Transport Tip', message: 'Metro shuttle has low wait times from Downtown', type: 'recommendation', category: 'transport' },
  ]);

  await SustainabilityMetric.insertMany([
    {
      stadium: metlife._id,
      match: liveMatch._id,
      energy: { consumptionKwh: 45200, renewablePercent: 35, peakDemandMw: 12.5 },
      water: { usageLiters: 85000, recycledPercent: 42 },
      waste: { totalKg: 3200, recycledKg: 1850, compostKg: 680, landfillKg: 670 },
      carbon: { footprintKgCo2: 12500, offsetKgCo2: 4200, transportEmissionsKg: 8900 },
      aiSuggestions: [
        'Increase renewable energy share by activating solar panels on west stand',
        'Deploy additional recycling bins at concession areas',
        'Optimize HVAC in unoccupied zones to reduce peak demand',
      ],
    },
  ]);

  await TransportRoute.insertMany([
    {
      stadium: metlife._id,
      name: 'NJ Transit Shuttle',
      type: 'shuttle',
      origin: { name: 'Secaucus Junction', coordinates: { lat: 40.7614, lng: -74.0776 } },
      destination: { name: 'MetLife Stadium', coordinates: { lat: 40.8135, lng: -74.0745 } },
      durationMinutes: 15,
      distanceKm: 8.2,
      capacity: 500,
      currentLoad: 180,
      status: 'available',
      accessibility: { wheelchairAccessible: true, elevatorAvailable: true },
      schedule: [{ departureTime: 'Every 10 min', frequency: '10min' }],
    },
    {
      stadium: metlife._id,
      name: 'Parking Lot B',
      type: 'parking',
      origin: { name: 'Parking Lot B', coordinates: { lat: 40.8120, lng: -74.0730 } },
      destination: { name: 'Gate C', coordinates: { lat: 40.8132, lng: -74.0760 } },
      durationMinutes: 8,
      distanceKm: 0.5,
      capacity: 3000,
      currentLoad: 2100,
      status: 'busy',
      accessibility: { wheelchairAccessible: true },
    },
    {
      stadium: metlife._id,
      name: 'Metro Line 2 Express',
      type: 'metro',
      origin: { name: '34th St Penn Station', coordinates: { lat: 40.7506, lng: -73.9935 } },
      destination: { name: 'MetLife Stadium', coordinates: { lat: 40.8135, lng: -74.0745 } },
      durationMinutes: 35,
      distanceKm: 15.4,
      capacity: 800,
      currentLoad: 320,
      status: 'available',
      accessibility: { wheelchairAccessible: true, elevatorAvailable: true },
      trafficDelayMinutes: 5,
    },
  ]);

  await Report.create({
    stadium: metlife._id,
    match: liveMatch._id,
    type: 'match_day',
    title: 'USA vs England - Match Day Report',
    content: 'Preliminary match-day report. Full AI-generated report available on demand.',
    generatedBy: 'ai',
    author: organizerId,
    metrics: { attendance: 78500, avgDensity: 58, incidents: 2 },
  });

  logger.info('Database seeded successfully!');
  logger.info('Demo accounts:');
  demoAccounts.forEach((a) => {
    logger.info(`  ${a.email} / ${a.password}`);
  });
};

export default seedDatabase;
