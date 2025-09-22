const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

// Multer local storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${uuidv4()}-${file.originalname}`)
});
const upload = multer({ storage });

// Auth middleware
function auth(req, res, next) {
  const h = req.headers.authorization;
  if (!h) return res.status(401).json({ error: 'Unauthorized' });
  const token = h.split(' ')[1];
  try {
    const p = jwt.verify(token, process.env.JWT_SECRET || 'dev');
    req.userId = p.id;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Create recipe
router.post('/', auth, upload.array('photos', 8), async (req, res) => {
  const { title, short, ingredients, steps, prep, cook, tags } = req.body;
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const photos = (req.files || []).map(f => `/uploads/${path.basename(f.path)}`);
  try {
    const result = await pool.query(
      `INSERT INTO recipes 
      (title, slug, short, description, ingredients, steps, photos, prep, cook, tags, author_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [title, slug, short, short, ingredients, steps, photos, prep, cook, tags, req.userId]
    );
    res.json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// List recipes
router.get('/', async (req, res) => {
  const result = await pool.query(
    'SELECT id,title,slug,short,photos,prep,cook,tags,rating FROM recipes ORDER BY created_at DESC LIMIT 200'
  );
  res.json(result.rows);
});

// Get recipe by slug
router.get('/:slug', async (req, res) => {
  const result = await pool.query('SELECT * FROM recipes WHERE slug=$1', [req.params.slug]);
  if (!result.rows[0]) return res.status(404).json({ error: 'Not found' });
  res.json(result.rows[0]);
});

// Add comment
router.post('/:slug/comments', auth, async (req, res) => {
  const { text } = req.body;
  const recipeRes = await pool.query('SELECT id FROM recipes WHERE slug=$1', [req.params.slug]);
  if (!recipeRes.rows[0]) return res.status(404).json({ error: 'Recipe not found' });
  const recipeId = recipeRes.rows[0].id;
  await pool.query('INSERT INTO comments (recipe_id, user_id, text) VALUES ($1,$2,$3)', [recipeId, req.userId, text]);
  res.json({ ok: true });
});

// Like recipe
router.post('/:slug/like', auth, async (req, res) => {
  const recipeRes = await pool.query('SELECT id FROM recipes WHERE slug=$1', [req.params.slug]);
  if (!recipeRes.rows[0]) return res.status(404).json({ error: 'Recipe not found' });
  const recipeId = recipeRes.rows[0].id;
  await pool.query('INSERT INTO likes (recipe_id, user_id) VALUES ($1,$2) ON CONFLICT DO NOTHING', [recipeId, req.userId]);
  res.json({ ok: true });
});

module.exports = router;
