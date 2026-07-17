import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import socket from '../services/socket';
import useTimer from '../hooks/useTimer';
import ScoreBoard from '../components/ScoreBoard';
import QuestionCard from '../components/QuestionCard';
import OptionButton from '../components/OptionButton';
import Timer from '../components/Timer';
import ProgressBar from '../components/ProgressBar';

export default function Game() {
  const navigate = useNavigate();
  const location = useLocation();

  const [question, setQuestion] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [players, setPlayers] = useState(location.state?.players || []);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [timerActive, setTimerActive] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdownValue, setCountdownValue] = useState(3);

  const myId = socket.id;
  const startTimeRef = useRef(Date.now());

  // Timer with auto-expire
  const onTimerExpire = useCallback(() => {
    if (!answered) {
      // Time's up — server will handle it
      setAnswered(true);
    }
  }, [answered]);

  const { timeLeft } = useTimer(10, onTimerExpire, timerActive);

  // ── Socket Listeners ──────────────────────────────
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    const handleCountdown = (data) => {
      setShowCountdown(true);
      setCountdownValue(data.count);
    };

    const handleNextQuestion = (data) => {
      setShowCountdown(false);
      setQuestion(data.question);
      setQuestionIndex(data.index);
      setTotalQuestions(data.total);
      setAnswered(false);
      setSelectedAnswer(null);
      setCorrectAnswer(null);
      setTimerActive(true);
      startTimeRef.current = Date.now();
    };

    const handleAnswerResult = (data) => {
      setCorrectAnswer(data.correctAnswer);
      setTimerActive(false);
    };

    const handleScoreUpdate = (data) => {
      setPlayers(data.scores);
    };

    const handleGameOver = (data) => {
      setTimeout(() => {
        navigate('/result', { state: { results: data, myId }, replace: true });
      }, 500);
    };

    const handleDisconnect = (data) => {
      navigate('/result', {
        state: {
          results: {
            winner: data.winner,
            isDraw: false,
            players: players.map((p) => ({
              ...p,
              correct: 0,
              wrong: 0,
              accuracy: 0,
              avgTime: 0,
            })),
            opponentDisconnected: true,
            message: data.message,
          },
          myId,
        },
        replace: true,
      });
    };

    socket.on('countdown', handleCountdown);
    socket.on('nextQuestion', handleNextQuestion);
    socket.on('answerResult', handleAnswerResult);
    socket.on('scoreUpdate', handleScoreUpdate);
    socket.on('gameOver', handleGameOver);
    socket.on('opponentDisconnected', handleDisconnect);

    return () => {
      socket.off('countdown', handleCountdown);
      socket.off('nextQuestion', handleNextQuestion);
      socket.off('answerResult', handleAnswerResult);
      socket.off('scoreUpdate', handleScoreUpdate);
      socket.off('gameOver', handleGameOver);
      socket.off('opponentDisconnected', handleDisconnect);
    };
  }, [navigate, myId, players]);

  // ── Handle Answer ─────────────────────────────────
  const handleAnswer = useCallback(
    (answer) => {
      if (answered) return;

      const timeTaken = (Date.now() - startTimeRef.current) / 1000;
      setAnswered(true);
      setSelectedAnswer(answer);
      setTimerActive(false);

      socket.emit('submitAnswer', {
        answer,
        timeTaken: Math.min(timeTaken, 10),
      });
    },
    [answered]
  );

  // ── Get option status ─────────────────────────────
  const getOptionStatus = (label) => {
    if (!correctAnswer) return null;
    if (label === correctAnswer) return 'correct';
    if (label === selectedAnswer && label !== correctAnswer) return 'wrong';
    return null;
  };

  // ── Countdown Overlay ─────────────────────────────
  if (showCountdown) {
    return (
      <div className="bg-gradient-main">
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <AnimatePresence mode="wait">
            <motion.div
              key={countdownValue}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.5, type: 'spring' }}
              className="text-8xl md:text-9xl font-extrabold"
              style={{
                fontFamily: 'var(--font-heading)',
                background: 'linear-gradient(135deg, #6c5ce7, #fd79a8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 30px rgba(108, 92, 231, 0.5))',
              }}
            >
              {countdownValue === 0 ? 'GO!' : countdownValue}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // ── Loading State ─────────────────────────────────
  if (!question) {
    return (
      <div className="bg-gradient-main">
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-4 border-[#6c5ce7] border-t-transparent rounded-full"
          />
        </div>
      </div>
    );
  }

  // ── Game UI ────────────────────────────────────────
  return (
    <div className="bg-gradient-main">
      <div className="relative z-10 min-h-screen flex flex-col px-4 py-6 md:px-8">
        {/* Top: ScoreBoard */}
        <div className="mb-8">
          <ScoreBoard
            players={players}
            myId={myId}
            questionIndex={questionIndex}
            totalQuestions={totalQuestions}
          />
        </div>

        {/* Center: Question + Options */}
        <div className="flex-1 flex flex-col items-center justify-center gap-8">
          <QuestionCard
            question={question.question}
            index={questionIndex}
            total={totalQuestions}
          />

          <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-4">
            <OptionButton
              option={question.option_a}
              index={0}
              onClick={handleAnswer}
              disabled={answered}
              status={getOptionStatus('A')}
            />
            <OptionButton
              option={question.option_b}
              index={1}
              onClick={handleAnswer}
              disabled={answered}
              status={getOptionStatus('B')}
            />
            <OptionButton
              option={question.option_c}
              index={2}
              onClick={handleAnswer}
              disabled={answered}
              status={getOptionStatus('C')}
            />
            <OptionButton
              option={question.option_d}
              index={3}
              onClick={handleAnswer}
              disabled={answered}
              status={getOptionStatus('D')}
            />
          </div>
        </div>

        {/* Bottom: Timer + Progress */}
        <div className="mt-8 flex flex-col items-center gap-6">
          <Timer timeLeft={timeLeft} duration={10} />
          <ProgressBar current={questionIndex} total={totalQuestions} />
        </div>
      </div>
    </div>
  );
}
