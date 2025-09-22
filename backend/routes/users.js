// routes/users.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../controllers/authController').authMiddleware;

// Get current user's profile
router.get('/me', auth, userController.getMe);

// Get user's saved recipes
router.get('/me/saved', auth, userController.getSavedRecipes);

// Save / unsave a recipe
router.post('/me/save/:recipeId', auth, userController.saveRecipe);
router.post('/me/unsave/:recipeId', auth, userController.unsaveRecipe);

module.exports = router;
