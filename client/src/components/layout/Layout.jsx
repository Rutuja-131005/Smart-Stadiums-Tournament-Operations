import { useState, useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import NotificationBell from './NotificationBell';
import FloatingAIButton from './FloatingAIButton';

/* ========== SVG ICONS ========== */
const Icons = {
  home: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" /></svg>,
  fan: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  map: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>,
  transport: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h8m-8 4h8m-4 4v4m-4-4h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v8a2 2 0 002 2zm-1 4h10" /></svg>,
  volunteer: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  command: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  security: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  sustainability: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  reports: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  sun: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  moon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>,
  contrast: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><circle cx="12" cy="12" r="9" /><path d="M12 3v18a9 9 0 000-18z" fill="currentColor" opacity="0.3" /></svg>,
  search: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  menu: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>,
  close: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>,
  collapse: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>,
  expand: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>,
  logout: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
  chevron: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>,
};

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: Icons.home, roles: null },
  { path: '/fan', label: 'Fan Hub', icon: Icons.fan, roles: null },
  { path: '/navigation', label: 'Navigation', icon: Icons.map, roles: null },
  { path: '/transport', label: 'Transport', icon: Icons.transport, roles: null },
  { path: '/volunteer', label: 'Volunteer', icon: Icons.volunteer, roles: ['volunteer', 'staff', 'admin'] },
  { path: '/organizer', label: 'Command Center', icon: Icons.command, roles: ['staff', 'admin'] },
  { path: '/security', label: 'Security', icon: Icons.security, roles: ['security', 'admin'] },
  { path: '/sustainability', label: 'Sustainability', icon: Icons.sustainability, roles: null },
  { path: '/reports', label: 'Reports', icon: Icons.reports, roles: ['staff', 'admin'] },
];

const roleColors = {
  admin: 'text-accent',
  staff: 'text-secondary',
  security: 'text-danger',
  volunteer: 'text-warning',
  fan: 'text-fifa-gold',
};

const breadcrumbLabels = {
  '/dashboard': 'Dashboard',
  '/fan': 'Fan Hub',
  '/navigation': 'Navigation',
  '/transport': 'Transport',
  '/volunteer': 'Volunteer Center',
  '/organizer': 'Command Center',
  '/security': 'Security Operations',
  '/sustainability': 'Sustainability',
  '/reports': 'Reports',
  '/notifications': 'Notifications',
};

export default function Layout() {
  const { user, logout, hasRole } = useAuth();
  const { darkMode, toggleDarkMode, toggleHighContrast } = useTheme();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  const filteredNav = navItems.filter((item) => !item.roles || hasRole(...item.roles));
  const currentPage = breadcrumbLabels[location.pathname] || 'Page';

  // Close dropdown on click outside
  useEffect(() => {
    const handler = () => setUserDropdown(false);
    if (userDropdown) document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [userDropdown]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* ========== SIDEBAR ========== */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col
          text-white
          border-r border-white/10
          transform transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
          ${collapsed ? 'w-[72px]' : 'w-64'}`}
        style={{ backgroundColor: '#1F2937' }}
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div className={`flex items-center gap-3 border-b border-white/10 ${collapsed ? 'px-4 py-5 justify-center' : 'px-5 py-5'}`}>
          <Link to="/dashboard" className="flex items-center gap-3 group" onClick={() => setSidebarOpen(false)}>
            <img 
              src="/logo.jpg" 
              alt="Smart Stadium Logo" 
              className="w-9 h-9 rounded-xl object-cover flex-shrink-0 group-hover:shadow-glow transition-shadow" 
            />
            {!collapsed && (
              <div className="overflow-hidden">
                <h1 className="font-bold text-sm leading-tight text-white truncate">Smart Stadiums</h1>
                <p className="text-[10px] text-fifa-gold font-semibold tracking-wider uppercase">FIFA World Cup 2026</p>
              </div>
            )}
          </Link>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {filteredNav.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                  ${isActive
                    ? 'bg-fifa-gold text-fifa-navy font-semibold'
                    : 'text-white/90 hover:bg-white/10 hover:text-white'
                  }
                  ${collapsed ? 'justify-center' : ''}`}
                aria-current={isActive ? 'page' : undefined}
                title={collapsed ? item.label : undefined}
              >
                <span className={`flex-shrink-0 transition-colors ${isActive ? 'text-fifa-navy' : 'text-white/80'}`}>
                  {item.icon}
                </span>
                {!collapsed && <span className="truncate">{item.label}</span>}
                {isActive && !collapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-fifa-navy" />}
              </Link>
            );
          })}
        </nav>

        {/* Collapse Button (Desktop only) */}
        <div className="hidden lg:block px-3 py-2 border-t border-white/10">
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="w-full justify-center flex items-center gap-2 p-2 hover:bg-white/10 rounded-xl text-white/70 hover:text-white transition-colors"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? Icons.expand : Icons.collapse}
          </button>
        </div>

        {/* User Info */}
        {user && (
          <div className={`border-t border-white/10 ${collapsed ? 'p-3 flex justify-center' : 'p-4'}`}>
            {collapsed ? (
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white font-semibold text-sm" title={user.name}>
                {user.name?.charAt(0)}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                  {user.name?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{user.name}</p>
                  <p className="text-xs font-semibold capitalize text-fifa-gold">
                    {user.role}
                  </p>
                </div>
                <button
                  onClick={logout}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                  aria-label="Sign out"
                  title="Sign out"
                >
                  {Icons.logout}
                </button>
              </div>
            )}
          </div>
        )}
      </aside>

      {/* ========== MAIN AREA ========== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-40 bg-surface/80 dark:bg-surface/80 bg-white/80 backdrop-blur-glass border-b border-border dark:border-border border-gray-200 px-4 lg:px-6 py-3">
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              className="lg:hidden btn-icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle menu"
            >
              {sidebarOpen ? Icons.close : Icons.menu}
            </button>

            {/* Breadcrumb */}
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <span className="text-text-muted">Home</span>
              {currentPage !== 'Dashboard' && (
                <>
                  <span className="text-text-muted">{Icons.chevron}</span>
                  <span className="text-text-primary dark:text-text-primary text-gray-900 font-medium">{currentPage}</span>
                </>
              )}
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Actions */}
            <div className="flex items-center gap-1">
              {/* Search */}
              <button className="btn-icon hidden sm:flex" aria-label="Search" title="Search">
                {Icons.search}
              </button>

              {/* High contrast toggle */}
              <button
                onClick={toggleHighContrast}
                className="btn-icon hidden sm:flex"
                aria-label="Toggle high contrast"
                title="High contrast"
              >
                {Icons.contrast}
              </button>

              {/* Theme toggle */}
              <button
                onClick={toggleDarkMode}
                className="btn-icon"
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                title={darkMode ? 'Light mode' : 'Dark mode'}
              >
                {darkMode ? Icons.sun : Icons.moon}
              </button>

              {/* Notifications */}
              {user && <NotificationBell />}

              {/* User dropdown / Sign In */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={(e) => { e.stopPropagation(); setUserDropdown((d) => !d); }}
                    className="btn-icon lg:hidden"
                    aria-label="User menu"
                  >
                    <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-accent font-semibold text-xs">
                      {user.name?.charAt(0)}
                    </div>
                  </button>
                  <AnimatePresence>
                    {userDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -5, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -5, scale: 0.95 }}
                        className="absolute right-0 top-full mt-2 w-56 card-glass p-2 border border-border dark:border-border border-gray-200 z-50 lg:hidden"
                      >
                        <div className="px-3 py-2 mb-1">
                          <p className="text-sm font-medium text-text-primary">{user.name}</p>
                          <p className="text-xs text-text-muted">{user.email}</p>
                        </div>
                        <hr className="border-border dark:border-border border-gray-200 my-1" />
                        <button
                          onClick={logout}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-danger hover:bg-danger-bg rounded-lg transition-colors"
                        >
                          {Icons.logout} Sign out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link to="/login" className="btn-primary text-sm py-2">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main id="main-content" className="flex-1 p-4 lg:p-6 overflow-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Floating AI Assistant overlay */}
      {user && user.role !== 'fan' && <FloatingAIButton />}
    </div>
  );
}
