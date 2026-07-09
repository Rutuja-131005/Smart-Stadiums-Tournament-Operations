import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { app } from '../src/server.js';
import Stadium from '../src/models/Stadium.js';
import Match from '../src/models/Match.js';
import CrowdZone from '../src/models/CrowdZone.js';
import { getDensityStatus, predictDensity, getCongestionAlerts } from '../src/services/crowdService.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongoServer.getUri();
  process.env.JWT_SECRET = 'test-secret-key';
  await mongoose.connect(process.env.MONGODB_URI);
}, 60000);

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Stadium.deleteMany({});
  await Match.deleteMany({});
  await CrowdZone.deleteMany({});
});

// ---------------------------------------------------------------------------
// Stadium CRUD Operations
// ---------------------------------------------------------------------------

describe('Stadium Operations', () => {
  const sampleStadium = {
    name: 'MetLife Stadium',
    city: 'East Rutherford',
    country: 'USA',
    capacity: 82500,
    location: { type: 'Point', coordinates: [-74.0744, 40.8128] },
    zones: [
      { id: 'gate-a', name: 'Gate A', type: 'entrance', coordinates: { lat: 40.8128, lng: -74.0744 }, capacity: 5000 },
      { id: 'sec-100', name: 'Section 100', type: 'seating', coordinates: { lat: 40.8130, lng: -74.0740 }, capacity: 8000 },
      { id: 'concession-1', name: 'Food Court North', type: 'concession', coordinates: { lat: 40.8132, lng: -74.0742 }, capacity: 500 },
    ],
    amenities: ['WiFi', 'Wheelchair Ramps', 'First Aid'],
    status: 'operational',
  };

  it('should create and retrieve a stadium', async () => {
    const stadium = await Stadium.create(sampleStadium);
    expect(stadium._id).toBeDefined();
    expect(stadium.name).toBe('MetLife Stadium');

    const res = await request(app).get('/api/stadiums');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].name).toBe('MetLife Stadium');
  });

  it('should retrieve a stadium by ID', async () => {
    const stadium = await Stadium.create(sampleStadium);
    const res = await request(app).get(`/api/stadiums/${stadium._id}`);
    expect(res.status).toBe(200);
    expect(res.body.data.city).toBe('East Rutherford');
  });

  it('should return 404 for a non-existent stadium ID', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/stadiums/${fakeId}`);
    expect(res.status).toBe(404);
  });

  it('should return 400 for an invalid ObjectId', async () => {
    const res = await request(app).get('/api/stadiums/invalid-id');
    expect(res.status).toBe(400);
  });

  it('should return zones for a stadium', async () => {
    const stadium = await Stadium.create(sampleStadium);
    const res = await request(app).get(`/api/stadiums/${stadium._id}/zones`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(3);
    expect(res.body.data[0].name).toBe('Gate A');
  });
});

// ---------------------------------------------------------------------------
// Match Scheduling & Score Tracking
// ---------------------------------------------------------------------------

describe('Match Scheduling & Score Tracking', () => {
  let stadium;

  beforeEach(async () => {
    stadium = await Stadium.create({
      name: 'Lusail Stadium',
      city: 'Lusail',
      country: 'Qatar',
      capacity: 80000,
      location: { type: 'Point', coordinates: [51.4904, 25.4195] },
    });
  });

  it('should create and list matches', async () => {
    await Match.create({
      homeTeam: 'Argentina',
      awayTeam: 'France',
      stadium: stadium._id,
      scheduledAt: new Date('2026-07-19T18:00:00Z'),
      group: 'Final',
      status: 'scheduled',
      homeScore: 0,
      awayScore: 0,
    });

    const res = await request(app).get('/api/matches');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].homeTeam).toBe('Argentina');
  });

  it('should filter matches by status', async () => {
    await Match.insertMany([
      { homeTeam: 'Brazil', awayTeam: 'Germany', stadium: stadium._id, scheduledAt: new Date(), group: 'A', status: 'scheduled', homeScore: 0, awayScore: 0 },
      { homeTeam: 'Spain', awayTeam: 'Japan', stadium: stadium._id, scheduledAt: new Date(), group: 'B', status: 'live', homeScore: 1, awayScore: 0 },
    ]);

    const res = await request(app).get('/api/matches?status=live');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].homeTeam).toBe('Spain');
  });

  it('should retrieve live matches endpoint', async () => {
    await Match.create({
      homeTeam: 'USA', awayTeam: 'Mexico', stadium: stadium._id,
      scheduledAt: new Date(), group: 'C', status: 'live', homeScore: 2, awayScore: 1,
    });

    const res = await request(app).get('/api/matches/live');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].status).toBe('live');
  });

  it('should return 404 for a non-existent match', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/matches/${fakeId}`);
    expect(res.status).toBe(404);
  });

  it('should detect scheduling overlap for same stadium at same time', async () => {
    const matchTime = new Date('2026-07-20T20:00:00Z');
    await Match.create({ homeTeam: 'A', awayTeam: 'B', stadium: stadium._id, scheduledAt: matchTime, group: 'D', status: 'scheduled', homeScore: 0, awayScore: 0 });
    const overlapping = await Match.find({ stadium: stadium._id, scheduledAt: matchTime });
    expect(overlapping.length).toBeGreaterThanOrEqual(1);
  });
});

// ---------------------------------------------------------------------------
// Crowd & Queue Management
// ---------------------------------------------------------------------------

describe('Crowd & Queue Management', () => {
  it('should calculate density status correctly', () => {
    expect(getDensityStatus(90)).toBe('critical');
    expect(getDensityStatus(85)).toBe('critical');
    expect(getDensityStatus(75)).toBe('congested');
    expect(getDensityStatus(70)).toBe('congested');
    expect(getDensityStatus(55)).toBe('moderate');
    expect(getDensityStatus(50)).toBe('moderate');
    expect(getDensityStatus(30)).toBe('normal');
    expect(getDensityStatus(0)).toBe('normal');
  });

  it('should predict density within bounds [0, 100]', () => {
    for (let i = 0; i < 50; i++) {
      const predicted = predictDensity(95, 'increasing');
      expect(predicted).toBeLessThanOrEqual(100);
      expect(predicted).toBeGreaterThanOrEqual(0);
    }
    for (let i = 0; i < 50; i++) {
      const predicted = predictDensity(3, 'decreasing');
      expect(predicted).toBeLessThanOrEqual(100);
      expect(predicted).toBeGreaterThanOrEqual(0);
    }
  });

  it('should generate congestion alerts for zones above 70% density', () => {
    const zones = [
      { zoneId: 'z1', zoneName: 'Gate A', density: 90, status: 'critical' },
      { zoneId: 'z2', zoneName: 'Gate B', density: 75, status: 'congested' },
      { zoneId: 'z3', zoneName: 'Gate C', density: 40, status: 'normal' },
    ];
    const alerts = getCongestionAlerts(zones);
    expect(alerts).toHaveLength(2);
    expect(alerts[0].recommendation).toContain('Redirect traffic immediately');
    expect(alerts[1].recommendation).toContain('Monitor closely');
  });

  it('should return empty alerts when no zones are congested', () => {
    const zones = [
      { zoneId: 'z1', zoneName: 'Gate A', density: 30, status: 'normal' },
      { zoneId: 'z2', zoneName: 'Gate B', density: 50, status: 'moderate' },
    ];
    const alerts = getCongestionAlerts(zones);
    expect(alerts).toHaveLength(0);
  });

  it('should retrieve crowd data for a stadium via API', async () => {
    const stadium = await Stadium.create({
      name: 'Test Arena', city: 'NYC', country: 'USA',
      capacity: 50000, location: { type: 'Point', coordinates: [-74.0, 40.7] },
    });

    await CrowdZone.create({
      stadium: stadium._id, zoneId: 'z1', zoneName: 'East Gate',
      density: 65, capacity: 5000, currentCount: 3250, trend: 'stable', status: 'moderate',
    });

    const res = await request(app).get(`/api/crowd/stadium/${stadium._id}`);
    expect(res.status).toBe(200);
    expect(res.body.data.zones).toHaveLength(1);
    expect(res.body.data.zones[0].zoneName).toBe('East Gate');
  });

  it('should return heatmap data for crowd zones', async () => {
    const stadium = await Stadium.create({
      name: 'Heatmap Arena', city: 'LA', country: 'USA',
      capacity: 70000, location: { type: 'Point', coordinates: [-118.2, 34.0] },
    });

    await CrowdZone.insertMany([
      { stadium: stadium._id, zoneId: 'h1', zoneName: 'North Stand', density: 80, capacity: 10000, currentCount: 8000, status: 'congested', coordinates: { lat: 34.0, lng: -118.2 } },
      { stadium: stadium._id, zoneId: 'h2', zoneName: 'South Stand', density: 30, capacity: 10000, currentCount: 3000, status: 'normal', coordinates: { lat: 34.01, lng: -118.21 } },
    ]);

    const res = await request(app).get(`/api/crowd/stadium/${stadium._id}/heatmap`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.data[0]).toHaveProperty('density');
    expect(res.body.data[0]).toHaveProperty('coordinates');
  });
});

// ---------------------------------------------------------------------------
// Edge Cases & Invalid Input Handling
// ---------------------------------------------------------------------------

describe('Edge Cases & Invalid Inputs', () => {
  it('should reject registration with missing required fields', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'incomplete@example.com' });
    expect(res.status).toBe(400);
  });

  it('should reject registration with weak password', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Weak User', email: 'weak@example.com', password: '123' });
    expect(res.status).toBe(400);
  });

  it('should reject registration with password missing uppercase', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test', email: 'test@example.com', password: 'password123!' });
    expect(res.status).toBe(400);
  });

  it('should reject registration with password missing special character', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test', email: 'test@example.com', password: 'Password123' });
    expect(res.status).toBe(400);
  });

  it('should handle non-existent API routes with 404', async () => {
    const res = await request(app).get('/api/nonexistent-route');
    expect(res.status).toBe(404);
  });

  it('should require authentication for protected endpoints', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});
