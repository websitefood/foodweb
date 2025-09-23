const express = require('express');
const router = express.Router();
const pool = require('../db');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'supersecretkey';

const upload = multer({ dest: 'uploads/' });

// JWT Auth middleware
async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'No token' });
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Invalid token' });

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Token invalid' });

    try {
      if (decoded.id === 0) {
        req.user = { id: 0, name: 'Admin', email: 'axl200ff@gmail.com', isadmin: true };
      } else {
        const result = await pool.query('SELECT id,name,email,isadmin FROM users WHERE id=$1', [decoded.id]);
        req.user = result.rows[0];
      }
      next();
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Server error' });
    }
  });
}

// GET all recipes
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT id,title,ingredients,instructions,image_path FROM recipes ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET recipe detail
router.get('/:id', async (req, res) => {
  const recipeId = req.params.id;
  try {
    const recipeRes = await pool.query('SELECT * FROM recipes WHERE id=$1', [recipeId]);
    if (!recipeRes.rows.length) return res.status(404).json({ message: 'Recipe not found' });
    const recipe = recipeRes.rows[0];

    const commentsRes = await pool.query(
      'SELECT comments.id,comments.comment,users.name AS username FROM comments JOIN users ON comments.user_id=users.id WHERE comments.recipe_id=$1',
      [recipeId]
    );

    const likesRes = await pool.query('SELECT COUNT(*) FROM likes WHERE recipe_id=$1', [recipeId]);
    const savesRes = await pool.query('SELECT COUNT(*) FROM saves WHERE recipe_id=$1', [recipeId]);

    res.json({
      recipe,
      comments: commentsRes.rows,
      likes: parseInt(likesRes.rows[0].count),
      saves: parseInt(savesRes.rows[0].count),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST new recipe
router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { title, ingredients, instructions } = req.body;
    const userId = req.user.id;
    const imagePath = req.file ? req.file.path : null;

    const newRecipe = await pool.query(
      'INSERT INTO recipes (user_id,title,ingredients,instructions,image_path) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [userId, title, ingredients, instructions, imagePath]
    );
    res.json({ message: 'Recipe uploaded', recipe: newRecipe.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
