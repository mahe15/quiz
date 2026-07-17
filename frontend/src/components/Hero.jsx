import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative flex flex-col items-center justify-center text-center px-6 pt-32 pb-20 min-h-[90vh]">
      {/* Decorative orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#6c5ce7] rounded-full opacity-10 blur-[120px]" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#fd79a8] rounded-full opacity-8 blur-[150px]" />

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-card px-5 py-2 mb-8 text-sm font-medium text-[#a29bfe]"
      >
        🎮 Real-time 1v1 Quiz Battles
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-tight mb-6"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        Challenge Your{' '}
        <span className="bg-gradient-to-r from-[#6c5ce7] via-[#a29bfe] to-[#fd79a8] bg-clip-text text-transparent">
          Knowledge
        </span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="text-lg md:text-xl text-[#b2bec3] max-w-2xl mb-12 leading-relaxed"
      >
        Go head-to-head with other players in fast-paced quiz battles.
        Answer quickly, score big, and prove you're the smartest!
      </motion.p>

      {/* CTA Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate('/matchmaking')}
        className="btn-gradient text-lg px-12 py-5 rounded-2xl"
      >
        ⚡ Play Now
      </motion.button>

      {/* Floating elements */}
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 right-[15%] text-4xl opacity-20 hidden lg:block"
      >
        🧠
      </motion.div>
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-1/3 left-[10%] text-3xl opacity-20 hidden lg:block"
      >
        🏆
      </motion.div>
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute top-1/3 left-[20%] text-3xl opacity-15 hidden lg:block"
      >
        💡
      </motion.div>
    </section>
  );
}
