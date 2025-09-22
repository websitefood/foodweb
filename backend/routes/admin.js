// routes/admin.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../controllers/authController').authMiddleware;

// Basic admin middleware (for demo -- replace with proper role-check)
async function adminOnly(req, res, next) {
  try {
    const r = await pool.query('SELECT is_admin FROM users WHERE id=$1', [req.userId]);
    const user = r.rows[0];
    if (!user || !user.is_admin) return res.status(403).json({ error: 'Forbidden: admin only' });
    next();
  } catch (e) {
    next(e);
  }
}

// Get all recipes (admin)
router.get('/recipes', auth, adminOnly, async (req, res) => {
  try {
    const r = await pool.query('SELECT * FROM recipes ORDER BY created_at DESC');
    res.json(r.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Delete recipe
router.delete('/recipes/:id', auth, adminOnly, async (req, res) => {
  try {
    await pool.query('DELETE FROM recipes WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Moderate comments
router.get('/comments', auth, adminOnly, async (req, res) => {
  try {
    const r = await pool.query('SELECT * FROM comments ORDER BY created_at DESC');
    res.json(r.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
