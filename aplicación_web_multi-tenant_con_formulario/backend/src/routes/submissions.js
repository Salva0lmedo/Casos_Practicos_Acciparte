const router = require('express').Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

const VALID_TIPOS = [
  'Urgencia médica',
  'Accidente de tráfico',
  'Intervención quirúrgica',
  'Consulta ambulatoria',
  'Traslado hospitalario',
];

router.use(auth);

router.post('/', async (req, res) => {
  const { nombre, apellidos, lugar, tipo_intervencion } = req.body;
  if (!nombre || !apellidos || !lugar || !tipo_intervencion) {
    return res.status(400).json({ error: 'All fields required' });
  }
  if (!VALID_TIPOS.includes(tipo_intervencion)) {
    return res.status(400).json({ error: 'Invalid tipo_intervencion' });
  }

  const { userId, tenantId } = req.user;
  try {
    const { rows: [submission] } = await db.query(
      `INSERT INTO submissions (tenant_id, user_id, nombre, apellidos, lugar, tipo_intervencion)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [tenantId, userId, nombre, apellidos, lugar, tipo_intervencion]
    );
    res.status(201).json(submission);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', async (req, res) => {
  const { tenantId, userId, role } = req.user;
  try {
    let rows;
    if (role === 'admin') {
      // Admins ven todos los submissions del tenant
      ({ rows } = await db.query(
        'SELECT * FROM submissions WHERE tenant_id = $1 ORDER BY created_at DESC',
        [tenantId]
      ));
    } else {
      // Usuarios normales ven solo sus propios submissions
      ({ rows } = await db.query(
        'SELECT * FROM submissions WHERE tenant_id = $1 AND user_id = $2 ORDER BY created_at DESC',
        [tenantId, userId]
      ));
    }
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
