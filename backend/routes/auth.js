const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Signup
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });

  try {
    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (name,email,password) VALUES ($1,$2,$3) RETURNING id,name,email`,
      [name, email, hashed]
    );
    const user = result.rows[0];
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'dev', { expiresIn: '7d' });
    res.json({ user, token });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const result = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
  const user = result.rows[0];
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'dev', { expiresIn: '7d' });
  res.json({ user: { id: user.id, name: user.name, email: user.email }, token });
});

module.exports = router;
