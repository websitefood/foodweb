const express = require('express');
const router = express.Router();
const pool = require('../db');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'supersecretkey';

const upload = multer({ dest: 'uploads/' });  // Save uploads in /uploads/:contentReference[oaicite:7]{index=7}

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.sendStatus(401);
  const token = authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// GET all recipes
router.get('/', async (req, res) => {
  try {
    const recipesRes = await pool.query('SELECT id, title, ingredients, instructions, image_path FROM recipes ORDER BY id DESC');
    res.json(recipesRes.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET recipe by ID with comments, like count, save count
router.get('/:id', async (req, res) => {
  const recipeId = req.params.id;
  try {
    // Get recipe
    const recipeRes = await pool.query(
      'SELECT id, title, ingredients, instructions, image_path FROM recipes WHERE id = $1',
      [recipeId]
    );
    if (recipeRes.rows.length === 0) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    const recipe = recipeRes.rows[0];
    // Get comments and usernames
    const commentsRes = await pool.query(
      'SELECT comments.id, comments.comment, users.name AS username FROM comments JOIN users ON comments.user_id = users.id WHERE comments.recipe_id = $1',
      [recipeId]
    );
    const comments = commentsRes.rows;
    // Count likes
    const likesRes = await pool.query('SELECT COUNT(*) FROM likes WHERE recipe_id = $1', [recipeId]);
    const likeCount = parseInt(likesRes.rows[0].count);
    // Count saves
    const savesRes = await pool.query('SELECT COUNT(*) FROM saves WHERE recipe_id = $1', [recipeId]);
    const saveCount = parseInt(savesRes.rows[0].count);

    res.json({ recipe, comments, likes: likeCount, saves: saveCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create a new recipe (with image upload)
router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { title, ingredients, instructions } = req.body;
    const imagePath = req.file ? req.file.path : null;
    const userId = req.user.id;
    const newRecipe = await pool.query(
      'INSERT INTO recipes (user_id, title, ingredients, instructions, image_path) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [userId, title, ingredients, instructions, imagePath]
    );
    res.json({ id: newRecipe.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST like a recipe
router.post('/:id/like', authenticateToken, async (req, res) => {
  const recipeId = req.params.id;
  const userId = req.user.id;
  try {
    await pool.query('INSERT INTO likes (user_id, recipe_id) VALUES ($1, $2)', [userId, recipeId]);
    res.json({ message: 'Liked' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST save/bookmark a recipe
router.post('/:id/save', authenticateToken, async (req, res) => {
  const recipeId = req.params.id;
  const userId = req.user.id;
  try {
    await pool.query('INSERT INTO saves (user_id, recipe_id) VALUES ($1, $2)', [userId, recipeId]);
    res.json({ message: 'Saved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST add a comment to a recipe
router.post('/:id/comments', authenticateToken, async (req, res) => {
  const recipeId = req.params.id;
  const userId = req.user.id;
  const { comment } = req.body;
  try {
    const newCommentRes = await pool.query(
      'INSERT INTO comments (user_id, recipe_id, comment) VALUES ($1, $2, $3) RETURNING id',
      [userId, recipeId, comment]
    );
    const newCommentId = newCommentRes.rows[0].id;
    // Get the username of the commenter
    const userRes = await pool.query('SELECT name FROM users WHERE id = $1', [userId]);
    const username = userRes.rows[0].name;
    res.json({ id: newCommentId, comment, username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE a recipe (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.sendStatus(403);
  }
  const recipeId = req.params.id;
  try {
    await pool.query('DELETE FROM recipes WHERE id = $1', [recipeId]);
    res.json({ message: 'Recipe deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE a comment (admin only)
router.delete('/:recipeId/comments/:commentId', authenticateToken, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.sendStatus(403);
  }
  const commentId = req.params.commentId;
  try {
    await pool.query('DELETE FROM comments WHERE id = $1', [commentId]);
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
