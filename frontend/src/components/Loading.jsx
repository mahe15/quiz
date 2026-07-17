import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Loading({ onCancel }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6">
      {/* Searching animation */}
      <div className="relative mb-10">
        {/* Outer ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="w-32 h-32 rounded-full border-4 border-transparent"
          style={{
            borderTopColor: '#6c5ce7',
            borderRightColor: '#a29bfe',
          }}
        />
        {/* Inner ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-4 rounded-full border-4 border-transparent"
          style={{
            borderTopColor: '#fd79a8',
            borderLeftColor: '#fab1c4',
          }}
        />
        {/* Center icon */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 flex items-center justify-center text-3xl"
        >
          🔍
        </motion.div>
      </div>

      {/* Text */}
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-2xl font-bold mb-3"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        Finding an opponent
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          ...
        </motion.span>
      </motion.h2>

      <p className="text-[#b2bec3] mb-2">Waiting for another player to join</p>

      {/* Elapsed time */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="glass-card px-6 py-3 mb-10 tabular-nums text-lg font-semibold text-[#a29bfe]"
      >
        ⏱ {formatTime(elapsed)}
      </motion.div>

      {/* Cancel button */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onCancel}
        className="btn-secondary"
      >
        Cancel
      </motion.button>
    </div>
  );
}
