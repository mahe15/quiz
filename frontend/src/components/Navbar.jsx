import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getOnlineCount } from '../services/api';

export default function Navbar() {
  const [online, setOnline] = useState(0);

  useEffect(() => {
    const fetchOnline = async () => {
      try {
        const { data } = await getOnlineCount();
        setOnline(data.online || 0);
      } catch {
        setOnline(0);
      }
    };

    fetchOnline();
    const interval = setInterval(fetchOnline, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3 no-underline">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6c5ce7] to-[#fd79a8] flex items-center justify-center text-lg font-bold">
            ⚡
          </div>
          <span className="text-xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
            Quiz<span className="text-[#a29bfe]">Battle</span>
          </span>
        </a>

        {/* Online Badge */}
        <div className="glass-card px-4 py-2 flex items-center gap-2 text-sm">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00b894] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00b894]"></span>
          </span>
          <span className="text-[#b2bec3]">
            <span className="text-white font-semibold">{online}</span> online
          </span>
        </div>
      </div>
    </motion.nav>
  );
}
