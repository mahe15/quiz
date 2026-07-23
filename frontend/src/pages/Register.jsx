import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (formData.username.trim().length < 3) {
      setError('Username must be at least 3 characters.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      await register(formData.username, formData.email, formData.password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-main min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-6 pt-28 pb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card-strong w-full max-w-md p-8 md:p-10 shadow-2xl relative overflow-hidden"
        >
          {/* Decorative glow */}
          <div className="absolute -top-12 -left-12 w-36 h-36 bg-[#fd79a8] rounded-full opacity-20 blur-3xl pointer-events-none" />

          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00cec9] to-[#6c5ce7] flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              ⚔️
            </div>
            <h2 className="text-3xl font-extrabold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
              Join QuizBattle
            </h2>
            <p className="text-[#b2bec3] text-sm mt-1">Create your profile to start playing</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#e74c3c]/15 border border-[#e74c3c]/30 text-[#ff7675] px-4 py-3 rounded-xl text-sm mb-6 text-center"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#b2bec3] uppercase tracking-wider mb-1.5">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a player name"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#6c5ce7] focus:ring-1 focus:ring-[#6c5ce7] transition-all text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#b2bec3] uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#6c5ce7] focus:ring-1 focus:ring-[#6c5ce7] transition-all text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#b2bec3] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#6c5ce7] focus:ring-1 focus:ring-[#6c5ce7] transition-all text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#b2bec3] uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#6c5ce7] focus:ring-1 focus:ring-[#6c5ce7] transition-all text-sm"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-gradient py-3.5 rounded-xl text-base font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 mt-3"
            >
              {submitting ? 'Creating Account...' : 'Register & Play ⚡'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-[#b2bec3]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#a29bfe] hover:text-white font-semibold transition-colors">
              Sign In
            </Link>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
