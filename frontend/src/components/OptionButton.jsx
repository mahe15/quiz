import { motion } from 'framer-motion';

const labels = ['A', 'B', 'C', 'D'];

export default function OptionButton({ option, index, onClick, disabled, status }) {
  // status: null | 'correct' | 'wrong' | 'reveal'
  const label = labels[index];

  let className = 'option-btn';
  if (status === 'correct') className += ' correct';
  if (status === 'wrong') className += ' wrong';

  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={className}
      onClick={() => onClick?.(label)}
      disabled={disabled}
    >
      <span className="option-label">{label}</span>
      <span className="flex-1">{option}</span>
      {status === 'correct' && <span className="text-[#00b894] text-xl">✓</span>}
      {status === 'wrong' && <span className="text-[#e74c3c] text-xl">✗</span>}
    </motion.button>
  );
}
