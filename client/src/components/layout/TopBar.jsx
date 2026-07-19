import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { Icons, breadcrumbLabels } from './Icons';
import NotificationBell from './NotificationBell';

export default function TopBar({ sidebarOpen, setSidebarOpen }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [userDropdown, setUserDropdown] = useState(false);
  const currentPage = breadcrumbLabels[location.pathname] || 'Page';

  // Close dropdown on click outside
  useEffect(() => {
    const handler = () => setUserDropdown(false);
    if (userDropdown) document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [userDropdown]);

  return (
    <header role="banner" className="sticky top-0 z-40 bg-surface/80 dark:bg-surface/80 bg-white/80 backdrop-blur-glass border-b border-border dark:border-border border-gray-200 px-4 lg:px-6 py-3">
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button className="lg:hidden btn-icon" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle menu">
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
                     <div className="px-3 py-2">
                      <p className="text-sm font-medium text-text-primary">{user.name}</p>
                      <p className="text-xs text-text-muted">{user.email}</p>
                     </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
