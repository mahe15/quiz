import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import GameCard from '../components/GameCard';
import Footer from '../components/Footer';

const howToPlaySteps = [
  { step: '01', title: 'Click Play Now', desc: 'Hit the button and enter the matchmaking queue.' },
  { step: '02', title: 'Get Matched', desc: "We'll pair you with another player in seconds." },
  { step: '03', title: 'Answer Fast', desc: '10 questions, 10 seconds each. Speed earns bonus points!' },
  { step: '04', title: 'Win the Battle', desc: 'Highest score wins. Can you top the leaderboard?' },
];

export default function Home() {
  return (
    <div className="bg-gradient-main">
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <GameCard />

        {/* How to Play */}
        <section className="px-6 py-20">
          <div className="max-w-5xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold text-center mb-16"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              How to <span className="text-[#00cec9]">Play</span>
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {howToPlaySteps.map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass-card p-6 text-center relative overflow-hidden group"
                >
                  {/* Step number */}
                  <span className="absolute top-3 right-4 text-5xl font-extrabold text-white/[0.03]" style={{ fontFamily: 'var(--font-heading)' }}>
                    {item.step}
                  </span>

                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00cec9] to-[#00b894] flex items-center justify-center text-sm font-bold mx-auto mb-4 group-hover:scale-110 transition-transform">
                    {item.step}
                  </div>
                  <h4 className="font-bold text-lg mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                    {item.title}
                  </h4>
                  <p className="text-[#b2bec3] text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Score Guide */}
        <section className="px-6 py-16 pb-24">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glass-card-strong p-8 md:p-10"
            >
              <h3 className="text-2xl font-bold mb-6 text-center" style={{ fontFamily: 'var(--font-heading)' }}>
                💯 Scoring System
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-white/5">
                  <span className="text-[#b2bec3]">Correct Answer</span>
                  <span className="font-bold text-[#00b894]">100 pts</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-white/5">
                  <span className="text-[#b2bec3]">Speed Bonus</span>
                  <span className="font-bold text-[#a29bfe]">Remaining sec × 5</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-white/5">
                  <span className="text-[#b2bec3]">Example: Answer in 4s</span>
                  <span className="font-bold text-[#fdcb6e]">100 + 30 = 130 pts</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-[#b2bec3]">Wrong / Skipped</span>
                  <span className="font-bold text-[#e74c3c]">0 pts</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
