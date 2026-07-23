import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProfile } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loading from '../components/Loading';

export default function Profile() {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await getProfile();
        if (data.success) {
          setProfileData(data);
        } else {
          setError(data.message || 'Failed to load profile');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching profile statistics.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="bg-gradient-main min-h-screen flex items-center justify-center">
        <Loading text="Loading profile statistics..." />
      </div>
    );
  }

  const { user, stats, history } = profileData || {};

  return (
    <div className="bg-gradient-main min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-5xl w-full mx-auto px-6 pt-28 pb-16 relative z-10">
        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card-strong p-8 md:p-10 mb-8 relative overflow-hidden"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5 text-center md:text-left">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#6c5ce7] via-[#a29bfe] to-[#fd79a8] flex items-center justify-center text-3xl font-extrabold text-white shadow-xl">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                  {user?.username}
                </h1>
                <p className="text-[#b2bec3] text-sm mt-0.5">{user?.email}</p>
                <p className="text-xs text-[#636e72] mt-1">
                  Member since {user?.created_at ? new Date(user.created_at).toLocaleDateString() : '2026'}
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate('/matchmaking')}
              className="btn-gradient px-8 py-3.5 rounded-xl font-bold text-base shadow-lg hover:scale-105 transition-transform"
            >
              ⚡ Start Battle
            </button>
          </div>
        </motion.div>

        {error && (
          <div className="bg-[#e74c3c]/15 border border-[#e74c3c]/30 text-[#ff7675] p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-5 text-center"
          >
            <p className="text-xs font-semibold text-[#b2bec3] uppercase tracking-wider mb-1">Matches Played</p>
            <p className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
              {stats?.totalMatches || 0}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-5 text-center"
          >
            <p className="text-xs font-semibold text-[#b2bec3] uppercase tracking-wider mb-1">Total Wins</p>
            <p className="text-3xl font-bold text-[#00b894]" style={{ fontFamily: 'var(--font-heading)' }}>
              {stats?.wins || 0}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-5 text-center"
          >
            <p className="text-xs font-semibold text-[#b2bec3] uppercase tracking-wider mb-1">Win Rate</p>
            <p className="text-3xl font-bold text-[#fdcb6e]" style={{ fontFamily: 'var(--font-heading)' }}>
              {stats?.winRate || '0%'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-5 text-center"
          >
            <p className="text-xs font-semibold text-[#b2bec3] uppercase tracking-wider mb-1">Total Score</p>
            <p className="text-3xl font-bold text-[#a29bfe]" style={{ fontFamily: 'var(--font-heading)' }}>
              {stats?.totalScore || 0}
            </p>
          </motion.div>
        </div>

        {/* Match History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6 md:p-8"
        >
          <h2 className="text-xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
            ⚔️ Match History
          </h2>

          {!history || history.length === 0 ? (
            <div className="text-center py-10 text-[#b2bec3]">
              <p className="text-lg font-medium mb-2">No matches played yet!</p>
              <p className="text-sm text-[#636e72] mb-6">Hit the queue to challenge players and get on the board.</p>
              <Link to="/matchmaking" className="btn-gradient px-6 py-2.5 rounded-xl text-sm font-bold">
                Play First Match
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-xs font-semibold text-[#b2bec3] uppercase tracking-wider">
                    <th className="pb-3 px-3">Result</th>
                    <th className="pb-3 px-3">Opponent</th>
                    <th className="pb-3 px-3 text-center">Score</th>
                    <th className="pb-3 px-3 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {history.map((m) => (
                    <tr key={m.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-3 font-bold">
                        {m.result === 'WIN' && (
                          <span className="inline-flex items-center gap-1 text-[#00b894]">
                            🏆 WIN
                          </span>
                        )}
                        {m.result === 'LOSS' && (
                          <span className="inline-flex items-center gap-1 text-[#ff7675]">
                            ❌ LOSS
                          </span>
                        )}
                        {m.result === 'TIE' && (
                          <span className="inline-flex items-center gap-1 text-[#fdcb6e]">
                            🤝 DRAW
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-white font-medium">{m.opponent}</td>
                      <td className="py-3.5 px-3 text-center font-bold">
                        <span className="text-[#a29bfe]">{m.myScore}</span>
                        <span className="text-[#636e72] mx-1 font-normal">-</span>
                        <span className="text-[#b2bec3]">{m.opponentScore}</span>
                      </td>
                      <td className="py-3.5 px-3 text-right text-xs text-[#636e72]">
                        {new Date(m.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
