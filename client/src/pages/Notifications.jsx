import { useState, useEffect } from 'react';
import { notificationAPI } from '../services/api';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, match, crowd, transport

  useEffect(() => {
    notificationAPI.getAll()
      .then(({ data }) => setNotifications(data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const markRead = async (id) => {
    try {
      await notificationAPI.markRead(id);
      setNotifications((n) => n.map((item) => (item._id === id ? { ...item, isRead: true } : item)));
    } catch (err) {}
  };

  const markAllRead = async () => {
    try {
      await notificationAPI.markAllRead();
      setNotifications((n) => n.map((item) => ({ ...item, isRead: true })));
    } catch (err) {}
  };

  if (loading) return <LoadingSpinner />;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.isRead;
    return n.category === filter;
  });

  const getEmoji = (category) => {
    switch (category) {
      case 'match': return '⚽';
      case 'crowd': return '🚨';
      case 'transport': return '🚌';
      case 'general': return '📢';
      default: return '🔔';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center flex-wrap gap-4 border-b border-border/40 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">Notification Center</h1>
          <p className="text-sm text-text-secondary">Real-time alerts, match briefs, and dispatcher directives</p>
        </div>
        <button
          onClick={markAllRead}
          className="btn-secondary text-sm border-border/60 hover:bg-surface-card"
        >
          Mark all as read
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-border/30">
        {[
          { id: 'all', label: 'All Messages' },
          { id: 'unread', label: `Unread (${notifications.filter(n => !n.isRead).length})` },
          { id: 'match', label: '⚽ Matches' },
          { id: 'crowd', label: '🚨 Crowd Info' },
          { id: 'transport', label: '🚌 Transit' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 text-xs font-semibold rounded-xl border whitespace-nowrap transition-all duration-200 ${
              filter === tab.id
                ? 'bg-accent/15 border-accent text-accent shadow-sm'
                : 'bg-surface-secondary/40 border-border text-text-secondary hover:text-text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3.5">
        <AnimatePresence mode="popLayout">
          {filteredNotifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="card text-center py-16 text-text-secondary text-sm"
            >
              No notifications matching this filter category.
            </motion.div>
          ) : (
            filteredNotifications.map((n) => (
              <motion.div
                key={n._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`card-hover text-left flex gap-4 items-start ${
                  !n.isRead ? 'border-l-4 border-accent bg-accent/5 dark:bg-accent/5' : ''
                }`}
                role="button"
                tabIndex={0}
                onClick={() => !n.isRead && markRead(n._id)}
                onKeyDown={(e) => e.key === 'Enter' && !n.isRead && markRead(n._id)}
              >
                <div className="w-10 h-10 rounded-xl bg-surface-secondary border border-border/60 flex items-center justify-center text-lg flex-shrink-0 shadow-inner">
                  {getEmoji(n.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <p className={`text-sm text-text-primary ${!n.isRead ? 'font-bold' : 'font-medium'}`}>{n.title}</p>
                    <StatusBadge status={n.type} label={n.type} />
                  </div>
                  <p className="text-xs text-text-secondary mt-1 leading-relaxed">{n.message}</p>
                  <p className="text-[10px] text-text-muted mt-2">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
