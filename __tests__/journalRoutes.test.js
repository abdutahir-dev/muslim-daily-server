import { jest } from '@jest/globals';

// Mock connection since we do not need actual DB queries for 401 tests
jest.unstable_mockModule('../src/db/connection.js', () => ({
  deenbotDb: {
    get: jest.fn(),
    run: jest.fn(),
  },
}));

// Dynamic imports after mocking
const { default: request } = await import('supertest');
const { default: express } = await import('express');
const { default: journalRoutes } = await import('../src/routes/journalRoutes.js');

const app = express();
app.use(express.json());
app.use('/api/journal', journalRoutes);

describe('Journal Routes Authentication', () => {
  it('GET /api/journal/:username/:date should return 401 if unauthenticated', async () => {
    const res = await request(app).get('/api/journal/testuser/2026-10-01');
    expect(res.status).toBe(401);
  });

  it('POST /api/journal/update should return 401 if unauthenticated', async () => {
    const res = await request(app)
      .post('/api/journal/update')
      .send({
        username: 'testuser',
        date: '2026-10-01',
        notes: 'test notes',
        mood: 'happy'
      });
    expect(res.status).toBe(401);
  });
});
