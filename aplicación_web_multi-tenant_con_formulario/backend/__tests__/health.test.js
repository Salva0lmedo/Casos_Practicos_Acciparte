process.env.JWT_SECRET = 'test_secret_for_tests';
process.env.DATABASE_URL = 'postgresql://fake:fake@localhost:5432/fake';

const request = require('supertest');
const app = require('../src/index');

describe('GET /health', () => {
  it('returns 200 with status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});
