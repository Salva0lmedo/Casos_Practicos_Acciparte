process.env.JWT_SECRET = 'test_secret_for_tests';

const jwt = require('jsonwebtoken');
const auth = require('../src/middleware/auth');

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('auth middleware', () => {
  it('rejects request with no token', () => {
    const req = { cookies: {}, headers: {} };
    const res = mockRes();
    auth(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'No token' });
  });

  it('rejects tampered / invalid token', () => {
    const req = { cookies: { token: 'bad.token.here' }, headers: {} };
    const res = mockRes();
    auth(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token' });
  });

  it('accepts valid token and attaches user payload to req', () => {
    const payload = { userId: 1, tenantId: 2, role: 'user' };
    const token = jwt.sign(payload, 'test_secret_for_tests');
    const req = { cookies: { token }, headers: {} };
    const next = jest.fn();
    auth(req, {}, next);
    expect(next).toHaveBeenCalled();
    expect(req.user).toMatchObject(payload);
  });

  it('rejects token signed with wrong secret', () => {
    const token = jwt.sign({ userId: 1 }, 'wrong_secret');
    const req = { cookies: { token }, headers: {} };
    const res = mockRes();
    auth(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(401);
  });
});
