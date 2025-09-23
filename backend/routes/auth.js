const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const router = express.Router();

const JWT_SECRET = 'supersecretkey';  // Hardcoded secret

// Signup route
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing fields' });
    }
    // Prevent signup with admin email
    if (email === 'axl200ff@gmail.com') {
      return res.status(400).json({ message: 'Cannot signup with admin email' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hashedPassword]
    );
    const user = newUser.rows[0];
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, isAdmin: false },
      JWT_SECRET
    );
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // Admin login (hardcoded credentials)
    if (email === 'axl200ff@gmail.com' && password === 'ik@sudip') {
      const token = jwt.sign(
        { id: 0, name: 'Admin', email, isAdmin: true },
        JWT_SECRET
      );
      return res.json({ token });
    }
    // Normal user login
    const userRes = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userRes.rows.length === 0) {
      return res.status(400).json({ message: 'User not found' });
    }
    const user = userRes.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Invalid password' });
    }
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, isAdmin: false },
      JWT_SECRET
    );
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
