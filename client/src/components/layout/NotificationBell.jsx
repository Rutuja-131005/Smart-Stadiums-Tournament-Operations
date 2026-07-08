import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { notificationAPI } from '../../services/api';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const unread = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    notificationAPI.getAll().then(({ data }) => setNotifications(data.data)).catch(() => {});
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('click', handleOutsideClick);
    }
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [open]);

  const markRead = async (id) => {
    try {
      await notificationAPI.markRead(id);
      setNotifications((n) =>
        n.map((item) => (item._id === id ? { ...item, isRead: true } : item))
      );
    } catch (err) {}
  };

  const markAllRead = async () => {
    try {
      await notificationAPI.markAllRead();
      setNotifications((n) => n.map((item) => ({ ...item, isRead: true })));
    } catch (err) {}
  };

  const getCategoryEmoji = (category) => {
    switch (category) {
      case 'match': return '⚽';
      case 'crowd': return '🚨';
      case 'transport': return '🚌';
      case 'general': return '📢';
      default: return '🔔';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="btn-icon relative"
        aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unread > 0 && (
          <span className="absolute top-1.5 right-1.5 bg-danger text-white text-[10px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center border-2 border-surface-card animate-pulse-glow">
            {unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 card-glass border border-border dark:border-border border-gray-200 z-50 overflow-hidden shadow-2xl"
          >
            <div className="p-4 border-b border-border dark:border-border border-gray-100 flex justify-between items-center bg-surface-secondary/40">
              <div>
                <h3 className="font-semibold text-sm text-text-primary">Notifications</h3>
                <p className="text-xs text-text-secondary mt-0.5">{unread} unread alerts</p>
              </div>
              {unread > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs text-accent hover:text-accent-hover font-medium transition-colors"
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-border/40 dark:divide-border/40 divide-gray-100">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-text-secondary text-sm">
                  No notifications yet
                </div>
              ) : (
                notifications.slice(0, 5).map((n) => (
                  <button
                    key={n._id}
                    onClick={() => markRead(n._id)}
                    className={`w-full text-left p-4 hover:bg-surface-elevated/40 dark:hover:bg-surface-elevated/40 hover:bg-gray-50 flex gap-3 transition-colors ${
                      !n.isRead ? 'bg-accent/5 dark:bg-accent/5 bg-emerald-50/50' : ''
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-surface-card dark:bg-surface-card border border-border dark:border-border flex items-center justify-center text-sm shadow-sm flex-shrink-0">
                      {getCategoryEmoji(n.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline gap-1">
                        <p className={`text-sm text-text-primary ${!n.isRead ? 'font-semibold' : 'font-medium'}`}>
                          {n.title}
                        </p>
                        {!n.isRead && (
                          <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-text-secondary mt-0.5 leading-relaxed truncate">
                        {n.message}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>

            <div className="p-3 border-t border-border dark:border-border border-gray-100 bg-surface-secondary/40 text-center">
              <Link
                to="/notifications"
                onClick={() => setOpen(false)}
                className="inline-block text-xs font-semibold text-text-primary hover:text-accent transition-colors"
              >
                View all notifications
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
