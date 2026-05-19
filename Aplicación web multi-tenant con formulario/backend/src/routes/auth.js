const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many attempts, try again in 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: 'strict',
  maxAge: 24 * 60 * 60 * 1000,
  secure: process.env.NODE_ENV === 'production',
};

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
}

router.post('/register', authLimiter, async (req, res) => {
  const { email, password, tenantSlug } = req.body;
  if (!email || !password || !tenantSlug) {
    return res.status(400).json({ error: 'email, password and tenantSlug required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  const client = await db.connect();
  try {
    await client.query('BEGIN');

    let { rows: [tenant] } = await client.query(
      'SELECT id FROM tenants WHERE slug = $1',
      [tenantSlug]
    );
    if (!tenant) {
      ({ rows: [tenant] } = await client.query(
        'INSERT INTO tenants (name, slug) VALUES ($1, $2) RETURNING id',
        [tenantSlug, tenantSlug]
      ));
    }

    const hash = await bcrypt.hash(password, 10);
    const { rows: [user] } = await client.query(
      'INSERT INTO users (tenant_id, email, password_hash) VALUES ($1, $2, $3) RETURNING id, role',
      [tenant.id, email, hash]
    );

    await client.query('COMMIT');

    res.cookie('token', signToken({ userId: user.id, tenantId: tenant.id, role: user.role }), COOKIE_OPTS);
    res.status(201).json({ tenantSlug });
  } catch (err) {
    await client.query('ROLLBACK');
    if (err.code === '23505') return res.status(409).json({ error: 'Email already exists in this tenant' });
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  } finally {
    client.release();
  }
});

router.post('/login', authLimiter, async (req, res) => {
  const { email, password, tenantSlug } = req.body;
  if (!email || !password || !tenantSlug) {
    return res.status(400).json({ error: 'email, password and tenantSlug required' });
  }

  const { rows: [user] } = await db.query(
    `SELECT u.id, u.password_hash, u.tenant_id, u.role
     FROM users u
     JOIN tenants t ON t.id = u.tenant_id
     WHERE u.email = $1 AND t.slug = $2`,
    [email, tenantSlug]
  );

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  res.cookie('token', signToken({ userId: user.id, tenantId: user.tenant_id, role: user.role }), COOKIE_OPTS);
  res.json({ tenantSlug });
});

router.post('/logout', (req, res) => {
  res.clearCookie('token', COOKIE_OPTS);
  res.json({ ok: true });
});

module.exports = router;
