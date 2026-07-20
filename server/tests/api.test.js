import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { app } from '../src/server.js';
import User from '../src/models/User.js';

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
  await User.deleteMany({});
});

describe('Health Check', () => {
  it('GET /api/health returns 200', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});


describe('Stadium Routes', () => {
  it('GET /api/stadiums returns empty array initially', async () => {
    const res = await request(app).get('/api/stadiums');
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
  });
});
