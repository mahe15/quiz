import { motion } from 'framer-motion';

export default function ProgressBar({ current, total }) {
  const progress = ((current + 1) / total) * 100;

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-2 text-sm">
        <span className="text-[#b2bec3]">Progress</span>
        <span className="text-[#a29bfe] font-semibold">
          {current + 1} / {total}
        </span>
      </div>
      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[#6c5ce7] to-[#a29bfe]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ boxShadow: '0 0 10px rgba(108, 92, 231, 0.4)' }}
        />
      </div>
    </div>
  );
}
