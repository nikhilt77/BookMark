const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

// Register route
router.post('/register', authController.register);

// Login route
router.post('/login', authController.login);

// Profile route
router.get('/profile', require('../middleware/authMiddleware'), authController.profile);

module.exports = router;
