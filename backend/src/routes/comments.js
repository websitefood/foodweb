const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/commentsController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

router.get('/', commentsController.getByRecipe);
router.post('/', isAuthenticated, commentsController.create);
router.delete('/:id', isAdmin, commentsController.delete); // Only admin can delete
module.exports = router;
