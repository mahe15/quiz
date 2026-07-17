import { motion } from 'framer-motion';

export default function ResultCard({ player, isWinner, isDraw }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`glass-card-strong p-8 w-full max-w-sm ${
        isWinner ? 'border-[#00b894]/30' : isDraw ? 'border-[#fdcb6e]/30' : 'border-white/10'
      }`}
    >
      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-3xl mb-2">
          {isWinner ? '🏆' : isDraw ? '🤝' : '😔'}
        </div>
        <h3
          className="text-xl font-bold mb-1"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {player.name}
        </h3>
        <span
          className={`text-sm font-semibold px-3 py-1 rounded-lg ${
            isWinner
              ? 'bg-[#00b894]/20 text-[#00b894]'
              : isDraw
              ? 'bg-[#fdcb6e]/20 text-[#fdcb6e]'
              : 'bg-[#e74c3c]/20 text-[#e74c3c]'
          }`}
        >
          {isWinner ? 'WINNER' : isDraw ? 'DRAW' : 'DEFEATED'}
        </span>
      </div>

      {/* Score */}
      <div className="text-center mb-6">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="text-5xl font-extrabold bg-gradient-to-r from-[#6c5ce7] to-[#a29bfe] bg-clip-text text-transparent"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {player.score}
        </motion.span>
        <p className="text-[#636e72] text-sm mt-1">points</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <StatItem label="Correct" value={player.correct} color="#00b894" />
        <StatItem label="Wrong" value={player.wrong} color="#e74c3c" />
        <StatItem label="Accuracy" value={`${player.accuracy}%`} color="#a29bfe" />
        <StatItem label="Avg Time" value={`${player.avgTime}s`} color="#fdcb6e" />
      </div>
    </motion.div>
  );
}

function StatItem({ label, value, color }) {
  return (
    <div className="glass-card p-3 text-center rounded-xl">
      <p className="text-[#636e72] text-xs mb-1">{label}</p>
      <p className="text-lg font-bold" style={{ color, fontFamily: 'var(--font-heading)' }}>
        {value}
      </p>
    </div>
  );
}
