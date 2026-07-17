import { motion } from 'framer-motion';

export default function QuestionCard({ question, index, total }) {
  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="glass-card-strong p-8 md:p-10 w-full max-w-3xl mx-auto"
    >
      {/* Question number */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-sm font-semibold px-3 py-1 rounded-lg bg-[#6c5ce7]/20 text-[#a29bfe]">
          Question {index + 1}/{total}
        </span>
      </div>

      {/* Question text */}
      <h2
        className="text-xl md:text-2xl font-bold leading-relaxed"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {question}
      </h2>
    </motion.div>
  );
}
