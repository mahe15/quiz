import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import ResultCard from '../components/ResultCard';
import socket from '../services/socket';

export default function Result() {
  const navigate = useNavigate();
  const location = useLocation();
  const results = location.state?.results;
  const myId = location.state?.myId;

  // Find which player is "me"
  const me = results?.players?.find((p) => p.id === myId);
  const opponent = results?.players?.find((p) => p.id !== myId);
  const isWinner = me && results?.winner === me.name;
  const isDraw = results?.isDraw;

  // Confetti for winner!
  useEffect(() => {
    if (isWinner) {
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
          colors: ['#6c5ce7', '#a29bfe', '#fd79a8', '#00cec9', '#fdcb6e'],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 },
          colors: ['#6c5ce7', '#a29bfe', '#fd79a8', '#00cec9', '#fdcb6e'],
        });

        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    }
  }, [isWinner]);

  const handlePlayAgain = () => {
    navigate('/matchmaking', { replace: true });
  };

  const handleHome = () => {
    socket.disconnect();
    navigate('/', { replace: true });
  };

  if (!results) {
    return (
      <div className="bg-gradient-main">
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-[#b2bec3] mb-4">No game data found.</p>
            <button onClick={handleHome} className="btn-gradient">
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-main">
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12">
        {/* Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          {results.opponentDisconnected ? (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', bounce: 0.5 }}
                className="text-6xl mb-4"
              >
                🚪
              </motion.div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                Opponent Disconnected
              </h1>
              <p className="text-[#00b894] text-lg">{results.message}</p>
            </>
          ) : (
            <>
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
                className="text-6xl md:text-7xl mb-4"
              >
                {isWinner ? '🏆' : isDraw ? '🤝' : '💪'}
              </motion.div>
              <h1
                className="text-3xl md:text-5xl font-extrabold mb-2"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {isWinner ? (
                  <span className="bg-gradient-to-r from-[#fdcb6e] to-[#f39c12] bg-clip-text text-transparent">
                    Victory!
                  </span>
                ) : isDraw ? (
                  <span className="text-[#fdcb6e]">It's a Draw!</span>
                ) : (
                  <span className="text-[#b2bec3]">Better Luck Next Time</span>
                )}
              </h1>
              <p className="text-[#636e72]">
                {isWinner ? 'You dominated that battle!' : isDraw ? 'Equally matched!' : "You'll get them next time!"}
              </p>
            </>
          )}
        </motion.div>

        {/* Result Cards */}
        {!results.opponentDisconnected && me && opponent && (
          <div className="flex flex-col md:flex-row gap-8 mb-12 items-stretch">
            <ResultCard
              player={me}
              isWinner={isWinner}
              isDraw={isDraw}
            />
            <div className="hidden md:flex items-center">
              <span className="text-2xl font-bold text-[#636e72]" style={{ fontFamily: 'var(--font-heading)' }}>
                VS
              </span>
            </div>
            <ResultCard
              player={opponent}
              isWinner={!isWinner && !isDraw}
              isDraw={isDraw}
            />
          </div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex gap-4 flex-wrap justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePlayAgain}
            className="btn-gradient px-8"
          >
            ⚡ Play Again
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleHome}
            className="btn-secondary px-8"
          >
            🏠 Home
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
