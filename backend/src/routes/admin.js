const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAdmin } = require('../middleware/auth');

router.get('/recipes', isAdmin, adminController.getRecipes);
router.delete('/recipes/:id', isAdmin, adminController.deleteRecipe);
router.get('/comments', isAdmin, adminController.getComments);
router.delete('/comments/:id', isAdmin, adminController.deleteComment);

module.exports = router;
