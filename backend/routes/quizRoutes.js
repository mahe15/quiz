const express = require('express');
const router = express.Router();
const { getQuestions, getMatch } = require('../controllers/quizController');

router.get('/questions', getQuestions);
router.get('/match/:id', getMatch);

// GET /api/online — handled via socket count in server.js
// (injected at mount time)

module.exports = router;
