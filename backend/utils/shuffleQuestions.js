/**
 * Fisher-Yates shuffle and pick N random items.
 *
 * @param {Array} array
 * @param {number} count — how many items to pick (default: 10)
 * @returns {Array}
 */
function shuffleQuestions(array, count = 10) {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, count);
}

module.exports = shuffleQuestions;
