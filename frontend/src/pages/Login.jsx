import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.emailOrUsername || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }

    setSubmitting(true);
    try {
      await login(formData.emailOrUsername, formData.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
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
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#6c5ce7] rounded-full opacity-20 blur-3xl pointer-events-none" />

          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6c5ce7] to-[#fd79a8] flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              ⚡
            </div>
            <h2 className="text-3xl font-extrabold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
              Welcome Back
            </h2>
            <p className="text-[#b2bec3] text-sm mt-1">Sign in to battle players & track stats</p>
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

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#b2bec3] uppercase tracking-wider mb-2">
                Username or Email
              </label>
              <input
                type="text"
                name="emailOrUsername"
                value={formData.emailOrUsername}
                onChange={handleChange}
                placeholder="e.g. quizmaster or alex@example.com"
                className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#6c5ce7] focus:ring-1 focus:ring-[#6c5ce7] transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#b2bec3] uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-[#6c5ce7] focus:ring-1 focus:ring-[#6c5ce7] transition-all"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-gradient py-4 rounded-xl text-lg font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 mt-2"
            >
              {submitting ? 'Signing in...' : 'Sign In 🚀'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-[#b2bec3]">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#a29bfe] hover:text-white font-semibold transition-colors">
              Create one now
            </Link>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
