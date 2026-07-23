import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useSocket from '../hooks/useSocket';
import socket from '../services/socket';
import Loading from '../components/Loading';

import { useAuth } from '../context/AuthContext';

export default function Matchmaking() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { emit, on, disconnect } = useSocket();
  const [status, setStatus] = useState('searching'); // searching | found | countdown
  const [opponent, setOpponent] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [players, setPlayers] = useState([]);

  // Refs to capture latest values for socket callbacks
  const roomIdRef = useRef(null);
  const playersRef = useRef([]);

  useEffect(() => {
    roomIdRef.current = roomId;
    playersRef.current = players;
  }, [roomId, players]);

  useEffect(() => {
    const name = user?.username || 'Player';

    // Join the matchmaking queue with name and token
    emit('joinQueue', { name, token });

    // Listen for match found
    const cleanupMatch = on('matchFound', (data) => {
      setStatus('found');
      setRoomId(data.roomId);
      setPlayers(data.players);

      const myId = socket.id;
      const opp = data.players.find((p) => p.id !== myId);
      setOpponent(opp);
    });

    // Listen for countdown
    const cleanupCountdown = on('countdown', (data) => {
      setStatus('countdown');
      setCountdown(data.count);
    });

    // Listen for first question (game start)
    const cleanupStart = on('nextQuestion', () => {
      navigate('/game', {
        state: { roomId: roomIdRef.current, players: playersRef.current },
        replace: true,
      });
    });

    return () => {
      cleanupMatch();
      cleanupCountdown();
      cleanupStart();
    };
  }, [emit, on, navigate, user?.username, token]);

  const handleCancel = useCallback(() => {
    emit('leaveQueue');
    disconnect();
    navigate('/', { replace: true });
  }, [emit, disconnect, navigate]);

  return (
    <div className="bg-gradient-main">
      <div className="relative z-10 min-h-screen">
        <AnimatePresence mode="wait">
          {status === 'searching' && (
            <motion.div
              key="searching"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Loading onCancel={handleCancel} />
            </motion.div>
          )}

          {status === 'found' && (
            <motion.div
              key="found"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-screen px-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', bounce: 0.5 }}
                className="text-6xl mb-6"
              >
                ⚔️
              </motion.div>
              <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                Opponent Found!
              </h2>
              <p className="text-[#b2bec3] text-lg mb-2">
                You're battling <span className="text-[#fd79a8] font-semibold">{opponent?.name}</span>
              </p>
              <p className="text-[#636e72]">Get ready...</p>
            </motion.div>
          )}

          {status === 'countdown' && (
            <motion.div
              key="countdown"
              className="flex flex-col items-center justify-center min-h-screen px-6"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={countdown}
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
                  {countdown === 0 ? 'GO!' : countdown}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
