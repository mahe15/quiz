const express = require('express');
const router = express.Router();
const { register, login, getMe, getProfile } = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', authenticateToken, getMe);
router.get('/profile', authenticateToken, getProfile);

module.exports = router;
