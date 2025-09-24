const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const { isAuthenticated } = require('../middleware/auth');

router.post('/signup', usersController.signup);
router.post('/login', usersController.login);
router.post('/logout', isAuthenticated, usersController.logout);
router.get('/profile', isAuthenticated, usersController.profile);
router.get('/favorites', isAuthenticated, usersController.getFavorites);

module.exports = router;
