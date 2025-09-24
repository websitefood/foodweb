const express = require('express');
const router = express.Router();
const recipesController = require('../controllers/recipesController');
const { isAuthenticated } = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ dest: 'src/uploads/' });

router.get('/', recipesController.getAll);
router.get('/:id', recipesController.getOne);
router.post('/', upload.single('image'), isAuthenticated, recipesController.create);
router.put('/:id', isAuthenticated, recipesController.update);
router.delete('/:id', isAuthenticated, recipesController.delete);

// Likes
router.post('/:id/like', isAuthenticated, recipesController.like);
router.get('/:id/likes', isAuthenticated, recipesController.getLikes);

module.exports = router;
