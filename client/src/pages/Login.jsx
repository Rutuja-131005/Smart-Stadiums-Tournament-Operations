import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const demoAccounts = [];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Handle preset quick logins from query params (e.g. /login?role=fan)
  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam) {
      const preset = demoAccounts.find((acc) => acc.role === roleParam);
      if (preset) {
        setEmail(preset.email);
        setPassword(preset.pass);
      }
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      const routes = {
        admin: '/dashboard',
        staff: '/organizer',
        security: '/security',
        volunteer: '/volunteer',
        fan: '/fan',
      };
      navigate(routes[user.role] || '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (demo) => {
    setEmail(demo.email);
    setPassword(demo.pass);
    setError('');
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
            FIFA Operations <br />
            <span className="gradient-text">Unified Command</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-text-secondary leading-relaxed"
          >
            Access the advanced monitoring systems, emergency workflows, real-time crowd metrics, and generative AI navigation controls for the FIFA World Cup 2026 venues.
          </motion.p>
          <div className="pt-4 grid grid-cols-2 gap-4">
            <div className="card border-border/40 bg-surface-card/40 p-4">
              <p className="text-2xl font-bold text-accent">Active</p>
              <p className="text-xs text-text-secondary mt-1">Live Database State</p>
            </div>
            <div className="card border-border/40 bg-surface-card/40 p-4">
              <p className="text-2xl font-bold text-secondary">Offline</p>
              <p className="text-xs text-text-secondary mt-1">Fallback Mode Available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right form side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent pointer-events-none" />

        <div className="w-full max-w-md space-y-8 relative">
          <div className="text-center lg:text-left space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">Sign In</h1>
            <p className="text-sm text-text-secondary">Enter your credentials or choose a pre-seeded account</p>
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

          <form onSubmit={handleSubmit} className="space-y-5" aria-label="Login form">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                required
                autoComplete="email"
                placeholder="operator@fifa2026.com"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary">Password</label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs text-text-secondary hover:text-text-primary transition-colors focus:outline-none"
                >
                  {showPassword ? 'Hide' : 'Show'} Password
                </button>
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                required
                autoComplete="current-password"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-border bg-surface-secondary text-accent focus:ring-accent focus:ring-offset-surface w-4 h-4 cursor-pointer"
                />
                <span className="text-text-secondary">Remember me</span>
              </label>
              <a href="#" className="text-accent hover:text-accent-hover font-medium" onClick={(e) => e.preventDefault()}>
                Forgot password?
              </a>
            </div>

            <button type="submit" className="btn-primary w-full py-3 mt-2" disabled={loading}>
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-surface border-t-transparent rounded-full animate-spin" />
                  Authenticating...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Quick login demo selector */}
          {demoAccounts.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-border/40">
              <p className="text-xs font-bold uppercase tracking-wider text-text-secondary">Quick Login Presets</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {demoAccounts.map((demo) => (
                  <button
                    key={demo.role}
                    onClick={() => handleDemoLogin(demo)}
                    className={`px-3 py-2 text-xs font-semibold rounded-xl border bg-surface-secondary/40 text-center transition-all ${demo.color}`}
                  >
                    {demo.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="text-center text-sm text-text-secondary">
            Don't have an operational account?{' '}
            <Link to="/register" className="text-accent hover:text-accent-hover font-medium">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
