const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db');
const calculateScore = require('../utils/calculateScore');
const shuffleQuestions = require('../utils/shuffleQuestions');
const { saveMatch, saveAnswers } = require('../controllers/gameController');

// In-memory game state
const waitingQueue = [];       // players waiting for a match
const rooms = new Map();       // roomId -> room state
const playerRooms = new Map(); // socketId -> roomId

/**
 * Initialise Socket.IO event handlers.
 */
function socketHandler(io) {
  io.on('connection', (socket) => {
    console.log(`🔌 Player connected: ${socket.id}`);

    // ── Join Queue ──────────────────────────────────────────
    socket.on('joinQueue', async (data) => {
      const playerName = data?.name || `Player_${socket.id.slice(0, 5)}`;
      console.log(`🔍 ${playerName} (${socket.id}) joined the queue`);

      // Prevent duplicate queue entries
      const alreadyInQueue = waitingQueue.find((p) => p.id === socket.id);
      if (alreadyInQueue) return;

      // If someone is already waiting, pair them
      if (waitingQueue.length > 0) {
        const opponent = waitingQueue.shift();
        const roomId = uuidv4();

        // Fetch questions from DB
        let questions = [];
        try {
          const [rows] = await pool.query('SELECT * FROM questions');
          questions = shuffleQuestions(rows, 10);
        } catch (err) {
          console.error('DB error, using fallback questions:', err.message);
          questions = getFallbackQuestions();
        }

        // Build room state
        const room = {
          id: roomId,
          players: [
            { id: opponent.id, name: opponent.name, score: 0, answers: [] },
            { id: socket.id, name: playerName, score: 0, answers: [] },
          ],
          questions,
          currentQuestion: 0,
          questionStartTime: null,
          answeredCount: 0,
          timer: null,
          finished: false,
        };

        rooms.set(roomId, room);
        playerRooms.set(opponent.id, roomId);
        playerRooms.set(socket.id, roomId);

        // Join socket rooms
        socket.join(roomId);
        const opponentSocket = io.sockets.sockets.get(opponent.id);
        if (opponentSocket) opponentSocket.join(roomId);

        // Notify both players
        io.to(roomId).emit('matchFound', {
          roomId,
          players: room.players.map((p) => ({ id: p.id, name: p.name })),
        });

        // Start countdown: 3, 2, 1, GO!
        let countdown = 3;
        const countdownTimer = setInterval(() => {
          io.to(roomId).emit('countdown', { count: countdown });
          countdown--;

          if (countdown < 0) {
            clearInterval(countdownTimer);
            startQuestion(io, roomId);
          }
        }, 1000);
      } else {
        // No one waiting — add to queue
        waitingQueue.push({ id: socket.id, name: playerName });
        socket.emit('queueJoined', { position: 1 });
      }
    });

    // ── Leave Queue ─────────────────────────────────────────
    socket.on('leaveQueue', () => {
      const idx = waitingQueue.findIndex((p) => p.id === socket.id);
      if (idx !== -1) {
        waitingQueue.splice(idx, 1);
        console.log(`🚪 ${socket.id} left the queue`);
      }
    });

    // ── Submit Answer ───────────────────────────────────────
    socket.on('submitAnswer', (data) => {
      const roomId = playerRooms.get(socket.id);
      if (!roomId) return;

      const room = rooms.get(roomId);
      if (!room || room.finished) return;

      const player = room.players.find((p) => p.id === socket.id);
      if (!player) return;

      const qIndex = room.currentQuestion;
      const question = room.questions[qIndex];
      if (!question) return;

      // Prevent double-answering the same question
      if (player.answers[qIndex] !== undefined) return;

      const timeTaken = data.timeTaken || 10;
      const selectedOption = data.answer; // 'A', 'B', 'C', or 'D'
      const isCorrect = selectedOption === question.correct_answer;
      const points = calculateScore(isCorrect, timeTaken);

      player.score += points;
      player.answers[qIndex] = {
        questionId: question.id,
        selectedOption,
        correct: isCorrect,
        timeTaken,
        points,
      };

      // Send feedback to the answering player
      socket.emit('answerResult', {
        correct: isCorrect,
        correctAnswer: question.correct_answer,
        points,
        totalScore: player.score,
      });

      // Update scores for both players
      io.to(roomId).emit('scoreUpdate', {
        scores: room.players.map((p) => ({
          id: p.id,
          name: p.name,
          score: p.score,
        })),
      });

      // Check if both players have answered
      room.answeredCount++;
      if (room.answeredCount >= 2) {
        room.answeredCount = 0;
        clearTimeout(room.timer);

        // Small delay so players see feedback before next question
        setTimeout(() => {
          advanceQuestion(io, roomId);
        }, 1500);
      }
    });

    // ── Disconnect ──────────────────────────────────────────
    socket.on('disconnect', () => {
      console.log(`❌ Player disconnected: ${socket.id}`);

      // Remove from queue
      const idx = waitingQueue.findIndex((p) => p.id === socket.id);
      if (idx !== -1) waitingQueue.splice(idx, 1);

      // Handle mid-game disconnect
      const roomId = playerRooms.get(socket.id);
      if (roomId) {
        const room = rooms.get(roomId);
        if (room && !room.finished) {
          room.finished = true;
          clearTimeout(room.timer);

          const opponent = room.players.find((p) => p.id !== socket.id);
          if (opponent) {
            io.to(roomId).emit('opponentDisconnected', {
              winner: opponent.name,
              message: 'Your opponent disconnected. You win!',
            });
          }

          cleanupRoom(roomId);
        }
      }
    });
  });
}

// ── Helper: Start a question ──────────────────────────────────
function startQuestion(io, roomId) {
  const room = rooms.get(roomId);
  if (!room || room.finished) return;

  const qIndex = room.currentQuestion;
  const question = room.questions[qIndex];

  room.questionStartTime = Date.now();
  room.answeredCount = 0;

  // Send question (without correct answer)
  io.to(roomId).emit('nextQuestion', {
    index: qIndex,
    total: room.questions.length,
    question: {
      id: question.id,
      question: question.question,
      option_a: question.option_a,
      option_b: question.option_b,
      option_c: question.option_c,
      option_d: question.option_d,
    },
  });

  // 10-second timer — auto-advance if both haven't answered
  room.timer = setTimeout(() => {
    // Mark unanswered players as skipped
    room.players.forEach((player) => {
      if (player.answers[qIndex] === undefined) {
        player.answers[qIndex] = {
          questionId: question.id,
          selectedOption: null,
          correct: false,
          timeTaken: 10,
          points: 0,
        };

        // Notify the player who didn't answer
        const playerSocket = io.sockets.sockets.get(player.id);
        if (playerSocket) {
          playerSocket.emit('answerResult', {
            correct: false,
            correctAnswer: question.correct_answer,
            points: 0,
            totalScore: player.score,
            timedOut: true,
          });
        }
      }
    });

    io.to(roomId).emit('scoreUpdate', {
      scores: room.players.map((p) => ({
        id: p.id,
        name: p.name,
        score: p.score,
      })),
    });

    setTimeout(() => {
      advanceQuestion(io, roomId);
    }, 1500);
  }, 10000);
}

// ── Helper: Advance to next question or end game ──────────────
function advanceQuestion(io, roomId) {
  const room = rooms.get(roomId);
  if (!room || room.finished) return;

  room.currentQuestion++;

  if (room.currentQuestion >= room.questions.length) {
    endGame(io, roomId);
  } else {
    startQuestion(io, roomId);
  }
}

// ── Helper: End game ──────────────────────────────────────────
async function endGame(io, roomId) {
  const room = rooms.get(roomId);
  if (!room || room.finished) return;

  room.finished = true;
  clearTimeout(room.timer);

  const [p1, p2] = room.players;

  let winner = null;
  if (p1.score > p2.score) winner = p1.name;
  else if (p2.score > p1.score) winner = p2.name;
  // else: tie — winner stays null

  // Build player stats
  const buildStats = (player) => {
    const totalQuestions = room.questions.length;
    const correctCount = player.answers.filter((a) => a && a.correct).length;
    const wrongCount = totalQuestions - correctCount;
    const totalTime = player.answers.reduce((sum, a) => sum + (a ? a.timeTaken : 10), 0);
    const avgTime = (totalTime / totalQuestions).toFixed(1);
    const accuracy = Math.round((correctCount / totalQuestions) * 100);

    return {
      id: player.id,
      name: player.name,
      score: player.score,
      correct: correctCount,
      wrong: wrongCount,
      accuracy,
      avgTime: parseFloat(avgTime),
    };
  };

  const results = {
    winner,
    isDraw: winner === null,
    players: [buildStats(p1), buildStats(p2)],
  };

  io.to(roomId).emit('gameOver', results);

  // Persist to database
  const matchId = await saveMatch(roomId, p1.name, p2.name, p1.score, p2.score, winner);

  if (matchId) {
    const allAnswers = [];
    room.players.forEach((player) => {
      player.answers.forEach((a) => {
        if (a) {
          allAnswers.push({
            player: player.name,
            questionId: a.questionId,
            selectedOption: a.selectedOption,
            correct: a.correct,
            timeTaken: a.timeTaken,
          });
        }
      });
    });
    await saveAnswers(matchId, allAnswers);
  }

  // Cleanup after a delay
  setTimeout(() => cleanupRoom(roomId), 5000);
}

// ── Helper: Cleanup room ──────────────────────────────────────
function cleanupRoom(roomId) {
  const room = rooms.get(roomId);
  if (room) {
    room.players.forEach((p) => playerRooms.delete(p.id));
    rooms.delete(roomId);
  }
}

// ── Fallback questions (if DB is not available) ───────────────
function getFallbackQuestions() {
  return [
    { id: 1, question: 'What is the chemical symbol for gold?', option_a: 'Go', option_b: 'Au', option_c: 'Ag', option_d: 'Gd', correct_answer: 'B' },
    { id: 2, question: 'Which planet is known as the Red Planet?', option_a: 'Venus', option_b: 'Jupiter', option_c: 'Mars', option_d: 'Saturn', correct_answer: 'C' },
    { id: 3, question: 'What is the largest ocean on Earth?', option_a: 'Atlantic', option_b: 'Indian', option_c: 'Arctic', option_d: 'Pacific', correct_answer: 'D' },
    { id: 4, question: 'Who painted the Mona Lisa?', option_a: 'Michelangelo', option_b: 'Raphael', option_c: 'Donatello', option_d: 'Leonardo da Vinci', correct_answer: 'D' },
    { id: 5, question: 'How many bones are in the adult human body?', option_a: '186', option_b: '206', option_c: '226', option_d: '256', correct_answer: 'B' },
    { id: 6, question: 'What does CPU stand for?', option_a: 'Central Process Unit', option_b: 'Central Processing Unit', option_c: 'Computer Personal Unit', option_d: 'Central Program Utility', correct_answer: 'B' },
    { id: 7, question: 'In which year did World War II end?', option_a: '1943', option_b: '1944', option_c: '1945', option_d: '1946', correct_answer: 'C' },
    { id: 8, question: 'Which country has won the most FIFA World Cups?', option_a: 'Germany', option_b: 'Argentina', option_c: 'Italy', option_d: 'Brazil', correct_answer: 'D' },
    { id: 9, question: 'How many Harry Potter books are there?', option_a: '5', option_b: '6', option_c: '7', option_d: '8', correct_answer: 'C' },
    { id: 10, question: 'What is the smallest country in the world?', option_a: 'Monaco', option_b: 'Vatican City', option_c: 'San Marino', option_d: 'Liechtenstein', correct_answer: 'B' },
  ];
}

module.exports = { socketHandler, waitingQueue };
