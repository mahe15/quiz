import { motion } from 'framer-motion';

const features = [
  {
    icon: '⚔️',
    title: '1v1 Battle',
    description: 'Challenge real players in head-to-head quiz matches.',
    gradient: 'from-[#6c5ce7] to-[#4834d4]',
  },
  {
    icon: '⚡',
    title: 'Real-time',
    description: 'Instant matchmaking and live score updates via WebSocket.',
    gradient: 'from-[#00cec9] to-[#00b894]',
  },
  {
    icon: '🔥',
    title: 'Fast-paced',
    description: '10 seconds per question. Speed matters — faster answers earn bonus points!',
    gradient: 'from-[#fd79a8] to-[#e74c3c]',
  },
];

export default function GameCard() {
  return (
    <section className="px-6 py-20">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-center mb-16"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Why Play Quiz<span className="text-[#a29bfe]">Battle</span>?
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="glass-card-strong p-8 text-center group cursor-default"
            >
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-2xl mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                {feature.icon}
              </div>
              <h3
                className="text-xl font-bold mb-3"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {feature.title}
              </h3>
              <p className="text-[#b2bec3] leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
