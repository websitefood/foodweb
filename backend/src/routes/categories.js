const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categoriesController');
const { isAdmin } = require('../middleware/auth');

router.get('/', categoriesController.getAll);
router.post('/', isAdmin, categoriesController.create);
router.delete('/:id', isAdmin, categoriesController.delete);
module.exports = router;
