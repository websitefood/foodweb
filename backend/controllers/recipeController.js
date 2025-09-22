// controllers/recipeController.js
const pool = require('../config/db');
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

/**
 * createRecipe - handles creating a recipe from formdata
 * expects req.files (array) and fields: title, short, ingredients, steps, prep, cook, tags
 */
async function createRecipe(req, res) {
  try {
    const { title, short, ingredients, steps, prep, cook, tags, difficulty } = req.body;
    if (!title) return res.status(400).json({ error: 'Title required' });

    // slugify
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const photos = (req.files || []).map(f => `/uploads/${path.basename(f.path)}`);

    const q = `INSERT INTO recipes
      (title, slug, short, description, ingredients, steps, photos, prep, cook, tags, difficulty, author_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`;

    const vals = [
      title,
      slug,
      short || '',
      short || '',
      ingredients || '',
      steps || '',
      photos,
      parseInt(prep || 0),
      parseInt(cook || 0),
      tags || '',
      difficulty || null,
      req.userId || null
    ];

    const r = await pool.query(q, vals);
    res.json(r.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function listRecipes(req, res) {
  try {
    const q = 'SELECT id,title,slug,short,photos,prep,cook,tags,rating,difficulty FROM recipes ORDER BY created_at DESC LIMIT 500';
    const r = await pool.query(q);
    res.json(r.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function getRecipeBySlug(req, res) {
  try {
    const slug = req.params.slug;
    const r = await pool.query('SELECT * FROM recipes WHERE slug=$1', [slug]);
    if (!r.rows[0]) return res.status(404).json({ error: 'Recipe not found' });
    const recipe = r.rows[0];

    // load comments
    const cm = await pool.query(
      `SELECT c.id, c.text, c.created_at, u.id as user_id, u.name as user_name 
       FROM comments c JOIN users u ON u.id=c.user_id WHERE c.recipe_id=$1 ORDER BY c.created_at DESC`,
      [recipe.id]
    );
    recipe.comments = cm.rows;
    res.json(recipe);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function addComment(req, res) {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text required' });
    const slug = req.params.slug;
    const rr = await pool.query('SELECT id FROM recipes WHERE slug=$1', [slug]);
    if (!rr.rows[0]) return res.status(404).json({ error: 'Recipe not found' });
    const recipeId = rr.rows[0].id;
    const r = await pool.query('INSERT INTO comments (recipe_id, user_id, text) VALUES ($1,$2,$3) RETURNING *', [recipeId, req.userId, text]);
    res.json(r.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function listComments(req, res) {
  try {
    const slug = req.params.slug;
    const rr = await pool.query('SELECT id FROM recipes WHERE slug=$1', [slug]);
    if (!rr.rows[0]) return res.status(404).json({ error: 'Recipe not found' });
    const recipeId = rr.rows[0].id;
    const r = await pool.query(
      `SELECT c.id, c.text, c.created_at, u.id as user_id, u.name as user_name 
       FROM comments c JOIN users u ON u.id=c.user_id WHERE c.recipe_id=$1 ORDER BY c.created_at DESC`,
      [recipeId]
    );
    res.json(r.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function likeRecipe(req, res) {
  try {
    const slug = req.params.slug;
    const rr = await pool.query('SELECT id FROM recipes WHERE slug=$1', [slug]);
    if (!rr.rows[0]) return res.status(404).json({ error: 'Recipe not found' });
    const recipeId = rr.rows[0].id;
    await pool.query('INSERT INTO likes (recipe_id, user_id) VALUES ($1,$2) ON CONFLICT DO NOTHING', [recipeId, req.userId]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function unlikeRecipe(req, res) {
  try {
    const slug = req.params.slug;
    const rr = await pool.query('SELECT id FROM recipes WHERE slug=$1', [slug]);
    if (!rr.rows[0]) return res.status(404).json({ error: 'Recipe not found' });
    const recipeId = rr.rows[0].id;
    await pool.query('DELETE FROM likes WHERE recipe_id=$1 AND user_id=$2', [recipeId, req.userId]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function relatedRecipes(req, res) {
  try {
    const slug = req.params.slug;
    const r0 = await pool.query('SELECT tags FROM recipes WHERE slug=$1', [slug]);
    if (!r0.rows[0]) return res.json([]);
    const tags = (r0.rows[0].tags || '').split(',').map(t => t.trim()).filter(Boolean);
    if (tags.length === 0) return res.json([]);

    // simple related by tags
    const q = `SELECT id,title,slug,short,photos FROM recipes WHERE (`;
    const conditions = tags.map((t, i) => `tags ILIKE $${i + 1}`).join(' OR ');
    const vals = tags.map(t => `%${t}%`);
    const final = await pool.query(`SELECT id,title,slug,short,photos FROM recipes WHERE (${conditions}) AND slug != $${tags.length + 1} LIMIT 6`, [...vals, slug]);
    res.json(final.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

// Generate PDF for recipe
async function getRecipePdf(req, res) {
  try {
    const slug = req.params.slug;
    const rr = await pool.query('SELECT * FROM recipes WHERE slug=$1', [slug]);
    if (!rr.rows[0]) return res.status(404).json({ error: 'Recipe not found' });
    const recipe = rr.rows[0];

    // Create PDF in memory stream
    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-disposition', `attachment; filename=${slug}.pdf`);
    res.setHeader('Content-type', 'application/pdf');
    doc.fontSize(20).text(recipe.title, { underline: true });
    doc.moveDown();
    doc.fontSize(12).text(`Prep: ${recipe.prep || 0} min   Cook: ${recipe.cook || 0} min`);
    doc.moveDown();
    doc.fontSize(14).text('Short description', { underline: true });
    doc.fontSize(12).text(recipe.short || '');
    doc.moveDown();
    doc.fontSize(14).text('Ingredients', { underline: true });
    (recipe.ingredients || '').split('\n').forEach(line => {
      if (line.trim()) doc.text('• ' + line);
    });
    doc.moveDown();
    doc.fontSize(14).text('Steps', { underline: true });
    (recipe.steps || '').split('\n').forEach((s, idx) => {
      if (s.trim()) doc.text(`${idx + 1}. ${s}`);
    });

    doc.end();
    doc.pipe(res);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

module.exports = {
  createRecipe,
  listRecipes,
  getRecipeBySlug,
  addComment,
  listComments,
  likeRecipe,
  unlikeRecipe,
  relatedRecipes,
  getRecipePdf
};
