// controllers/authController.js
const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev';

// Signup handler
async function signup(req, res) {
  const { name, email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
  try {
    const hashed = await bcrypt.hash(password, 10);
    const q = `INSERT INTO users (name,email,password) VALUES ($1,$2,$3) RETURNING id,name,email`;
    const r = await pool.query(q, [name || null, email, hashed]);
    const user = r.rows[0];
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ user, token });
  } catch (e) {
    // uniqueness conflict handling
    if (e.code === '23505') {
      return res.status(400).json({ error: 'Email already registered' });
    }
    res.status(500).json({ error: e.message });
  }
}

// Login handler
async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  try {
    const r = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    const user = r.rows[0];
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ user: { id: user.id, name: user.name, email: user.email }, token });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

// Middleware to protect routes and set req.userId
function authMiddleware(req, res, next) {
  const h = req.headers.authorization;
  if (!h) return res.status(401).json({ error: 'Unauthorized' });
  const token = h.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const p = jwt.verify(token, JWT_SECRET);
    req.userId = p.id;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = { signup, login, authMiddleware };
