const pool = require('../config/db');

/**
 * Save a completed match to the database.
 */
async function saveMatch(roomId, player1, player2, p1Score, p2Score, winner) {
  try {
    const [result] = await pool.query(
      'INSERT INTO matches (room_id, player1, player2, player1_score, player2_score, winner) VALUES (?, ?, ?, ?, ?, ?)',
      [roomId, player1, player2, p1Score, p2Score, winner]
    );
    return result.insertId;
  } catch (error) {
    console.error('Error saving match:', error.message);
    return null;
  }
}

/**
 * Save all answers for a match.
 */
async function saveAnswers(matchId, answers) {
  try {
    if (!matchId || answers.length === 0) return;

    const values = answers.map((a) => [
      matchId,
      a.player,
      a.questionId,
      a.selectedOption,
      a.correct,
      a.timeTaken,
    ]);

    await pool.query(
      'INSERT INTO answers (match_id, player, question_id, selected_option, correct, time_taken) VALUES ?',
      [values]
    );
  } catch (error) {
    console.error('Error saving answers:', error.message);
  }
}

module.exports = { saveMatch, saveAnswers };
