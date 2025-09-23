const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'supersecretkey';

// Signup
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name,email,password,isadmin) VALUES ($1,$2,$3,false) RETURNING id,name,email,isadmin',
      [name, email, hashed]
    );
    const user = result.rows[0];
    const token = jwt.sign({ id: user.id }, JWT_SECRET);
    res.json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Admin hardcoded
    if (email === 'axl200ff@gmail.com' && password === 'ik@sudip') {
      const token = jwt.sign({ id: 0, isadmin: true }, JWT_SECRET);
      return res.json({ user: { id: 0, name: 'Admin', email, isadmin: true }, token });
    }

    // Normal user
    const result = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    const user = result.rows[0];
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id }, JWT_SECRET);
    res.json({ user: { id: user.id, name: user.name, email: user.email, isadmin: user.isadmin }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
