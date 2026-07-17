/**
 * Calculate score for an answer.
 * Correct answer: 100 base points + (remaining seconds × 5) speed bonus
 * Wrong / Skipped: 0
 *
 * @param {boolean} isCorrect
 * @param {number} timeTaken  — seconds the player took to answer (0–10)
 * @returns {number}
 */
function calculateScore(isCorrect, timeTaken) {
  if (!isCorrect) return 0;

  const MAX_TIME = 10;
  const BASE_POINTS = 100;
  const SPEED_MULTIPLIER = 5;

  const remaining = Math.max(0, MAX_TIME - timeTaken);
  const speedBonus = Math.round(remaining * SPEED_MULTIPLIER);

  return BASE_POINTS + speedBonus;
}

module.exports = calculateScore;
