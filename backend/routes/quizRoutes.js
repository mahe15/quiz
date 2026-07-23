const express = require('express');
const router = express.Router();
const { getQuestions, getMatch } = require('../controllers/quizController');

const authenticateToken = require('../middleware/authMiddleware');

router.get('/questions', authenticateToken, getQuestions);
router.get('/match/:id', authenticateToken, getMatch);

// GET /api/online — handled via socket count in server.js
// (injected at mount time)

module.exports = router;
