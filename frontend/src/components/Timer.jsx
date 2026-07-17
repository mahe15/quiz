import { motion } from 'framer-motion';

export default function Timer({ timeLeft, duration = 10 }) {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const progress = timeLeft / duration;
  const offset = circumference * (1 - progress);

  // Color transitions: green → yellow → red
  let color = '#00b894';
  if (timeLeft <= 3) color = '#e74c3c';
  else if (timeLeft <= 5) color = '#fdcb6e';

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="110" height="110" viewBox="0 0 110 110">
        {/* Background ring */}
        <circle
          cx="55"
          cy="55"
          r={radius}
          fill="none"
          className="timer-ring-bg"
          strokeWidth="6"
        />
        {/* Progress ring */}
        <motion.circle
          cx="55"
          cy="55"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="timer-ring-progress"
          style={{ filter: `drop-shadow(0 0 6px ${color}40)` }}
        />
      </svg>

      {/* Timer text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          key={Math.ceil(timeLeft)}
          initial={{ scale: 1.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="text-2xl font-bold tabular-nums"
          style={{ color, fontFamily: 'var(--font-heading)' }}
        >
          {Math.ceil(timeLeft)}
        </motion.span>
        <span className="text-[10px] text-[#636e72] uppercase tracking-wider">sec</span>
      </div>
    </div>
  );
}
