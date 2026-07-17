import { motion } from 'framer-motion';

export default function PlayerCard({ name, score, isYou = false }) {
  return (
    <div className={`glass-card px-5 py-4 flex items-center gap-4 min-w-[160px] ${isYou ? 'border-[#6c5ce7]/40' : 'border-white/10'}`}>
      {/* Avatar */}
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
          isYou
            ? 'bg-gradient-to-br from-[#6c5ce7] to-[#a29bfe]'
            : 'bg-gradient-to-br from-[#fd79a8] to-[#e74c3c]'
        }`}
      >
        {name ? name.charAt(0).toUpperCase() : '?'}
      </div>

      {/* Info */}
      <div className="flex flex-col">
        <span className="text-xs text-[#b2bec3]">
          {isYou ? 'You' : 'Opponent'}
        </span>
        <motion.span
          key={score}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-xl font-bold tabular-nums"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {score}
        </motion.span>
      </div>
    </div>
  );
}
