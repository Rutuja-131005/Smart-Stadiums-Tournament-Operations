import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'fan' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(form);
      const routes = {
        volunteer: '/volunteer',
        fan: '/fan',
      };
      navigate(routes[form.role] || '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-surface">
      {/* Left visual side */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-surface-secondary items-center justify-center p-12 overflow-hidden border-r border-border/40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-secondary/15 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-[20%] left-[20%] w-[350px] h-[350px] bg-accent/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative max-w-lg space-y-6 text-center lg:text-left">
          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            src="/logo.jpg"
            alt="Smart Stadium Logo"
            className="w-14 h-14 rounded-2xl object-cover shadow-lg"
          />
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl lg:text-5xl font-black tracking-tight"
          >
            Create Your <br />
            <span className="gradient-text">Operations Profile</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-text-secondary leading-relaxed"
          >
            Register as a Volunteer helper or Fan guest to explore live match guidance, transit planning, and automated translation support.
          </motion.p>
          <div className="pt-4 grid grid-cols-2 gap-4">
            <div className="card border-border/40 bg-surface-card/40 p-4">
              <p className="text-sm font-bold text-text-primary">Collaborative</p>
              <p className="text-xs text-text-secondary mt-1">Volunteer Shift Allocation</p>
            </div>
            <div className="card border-border/40 bg-surface-card/40 p-4">
              <p className="text-sm font-bold text-text-primary">Interactive</p>
              <p className="text-xs text-text-secondary mt-1">Indoor Seating Guide</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right form side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent pointer-events-none" />

        <div className="w-full max-w-md space-y-8 relative">
          <div className="text-center lg:text-left space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">Register Account</h1>
            <p className="text-sm text-text-secondary">Fill in the form to set up your World Cup profile</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-danger-bg border border-danger/30 rounded-xl flex gap-3 text-sm text-danger"
              role="alert"
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" aria-label="Register form">
            <div>
              <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">Full Name</label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-field"
                required
                placeholder="John Doe"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">Email Address</label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-field"
                required
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">Password</label>
              <input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input-field"
                required
                minLength={6}
                placeholder="Minimum 6 characters"
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">Operational Role</label>
              <select
                id="role"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="input-field"
              >
                <option value="fan">⚽ Fan / Spectator</option>
                <option value="volunteer">🙋 Volunteer Helper</option>
              </select>
            </div>

            <button type="submit" className="btn-primary w-full py-3 mt-4" disabled={loading}>
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-surface border-t-transparent rounded-full animate-spin" />
                  Creating Account...
                </div>
              ) : (
                'Create Profile'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="text-accent hover:text-accent-hover font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
