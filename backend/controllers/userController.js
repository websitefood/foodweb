// controllers/userController.js
const pool = require('../config/db');

// get current user profile
async function getMe(req, res) {
  try {
    const r = await pool.query('SELECT id, name, email, created_at FROM users WHERE id=$1', [req.userId]);
    if (!r.rows[0]) return res.status(404).json({ error: 'User not found' });
    res.json(r.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

// get saved recipes for user
async function getSavedRecipes(req, res) {
  try {
    // assumes a saved_recipes table; if not present we can use likes or a separate table
    const r = await pool.query(
      `SELECT rp.id, rp.title, rp.slug, rp.short, rp.photos
       FROM saved_recipes s JOIN recipes rp ON rp.id=s.recipe_id WHERE s.user_id=$1 ORDER BY s.created_at DESC`,
      [req.userId]
    );
    res.json(r.rows);
  } catch (e) {
    // if saved_recipes table doesn't exist, return likes as fallback
    if (e.code === '42P01') {
      try {
        const r2 = await pool.query(
          `SELECT r.id, r.title, r.slug, r.short, r.photos
           FROM likes l JOIN recipes r ON r.id=l.recipe_id WHERE l.user_id=$1 ORDER BY l.recipe_id DESC`,
          [req.userId]
        );
        return res.json(r2.rows);
      } catch (e2) {
        return res.status(500).json({ error: e2.message });
      }
    }
    res.status(500).json({ error: e.message });
  }
}

// save a recipe (creates saved_recipes if not exists)
async function saveRecipe(req, res) {
  try {
    const recipeId = parseInt(req.params.recipeId);
    // create saved_recipes table if not exists (basic safety)
    await pool.query(`CREATE TABLE IF NOT EXISTS saved_recipes (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(user_id, recipe_id)
    )`);
    await pool.query('INSERT INTO saved_recipes (user_id, recipe_id) VALUES ($1,$2) ON CONFLICT DO NOTHING', [req.userId, recipeId]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function unsaveRecipe(req, res) {
  try {
    const recipeId = parseInt(req.params.recipeId);
    await pool.query('DELETE FROM saved_recipes WHERE user_id=$1 AND recipe_id=$2', [req.userId, recipeId]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

module.exports = { getMe, getSavedRecipes, saveRecipe, unsaveRecipe };
