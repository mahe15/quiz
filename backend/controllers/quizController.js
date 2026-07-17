const pool = require('../config/db');
const shuffleQuestions = require('../utils/shuffleQuestions');

/**
 * GET /api/questions
 * Fetch 10 random questions from the database.
 */
async function getQuestions(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM questions');
    const questions = shuffleQuestions(rows, 10);

    // Strip correct_answer before sending to client
    const sanitized = questions.map(({ correct_answer, ...rest }) => rest);
    res.json({ success: true, questions: sanitized });
  } catch (error) {
    console.error('Error fetching questions:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch questions' });
  }
}

/**
 * GET /api/match/:id
 * Fetch match results by match ID.
 */
async function getMatch(req, res) {
  try {
    const { id } = req.params;

    const [matches] = await pool.query('SELECT * FROM matches WHERE id = ?', [id]);
    if (matches.length === 0) {
      return res.status(404).json({ success: false, message: 'Match not found' });
    }

    const [answers] = await pool.query(
      'SELECT a.*, q.question FROM answers a JOIN questions q ON a.question_id = q.id WHERE a.match_id = ?',
      [id]
    );

    res.json({ success: true, match: matches[0], answers });
  } catch (error) {
    console.error('Error fetching match:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch match' });
  }
}

module.exports = { getQuestions, getMatch };
