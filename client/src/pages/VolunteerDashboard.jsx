import { useState, useEffect } from 'react';
import { volunteerAPI } from '../services/api';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';

export default function VolunteerDashboard() {
  const [tasks, setTasks] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [asking, setAsking] = useState(false);

  useEffect(() => {
    Promise.all([volunteerAPI.getTasks(), volunteerAPI.getAnnouncements()])
      .then(([t, a]) => {
        setTasks(t.data.data);
        setAnnouncements(a.data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const updateTask = async (id, status) => {
    try {
      const { data } = await volunteerAPI.updateTask(id, { status });
      setTasks((ts) => ts.map((t) => (t._id === id ? data.data : t)));
    } catch (err) {}
  };

  const askAI = async () => {
    if (!question || asking) return;
    setAsking(true);
    setAnswer('');
    try {
      const { data } = await volunteerAPI.askKnowledge(question);
      setAnswer(data.data.answer);
    } catch (err) {
      setAnswer('Error fetching lookup response from knowledge base. Please try again.');
    } finally {
      setAsking(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header info */}
      <div className="flex justify-between items-center flex-wrap gap-4 border-b border-border/40 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">Volunteer Operations Hub</h1>
          <p className="text-sm text-text-secondary">Assigned event support tasks, emergency notices, and handbook lookup</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Task lists */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-text-primary">Assigned Duty Tasks</h2>
            <span className="badge-blue text-[10px]">{tasks.length} Assigned</span>
          </div>

          <div className="space-y-4">
            {tasks.length === 0 ? (
              <div className="card text-center text-text-secondary py-12">
                No active tasks assigned to your shift yet.
              </div>
            ) : (
              tasks.map((task) => (
                <div key={task._id} className="card bg-surface-card hover:border-border-light transition-all flex flex-col justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-bold text-base text-text-primary">{task.title}</h3>
                      <StatusBadge status={task.priority} />
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">{task.description}</p>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-border/30">
                    <div className="flex items-center gap-3">
                      <StatusBadge status={task.status} label={task.status.replace('_', ' ')} />
                      {task.dueAt && (
                        <span className="text-[10px] text-text-muted">
                          Due: {new Date(task.dueAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {task.status === 'pending' && (
                        <button
                          onClick={() => updateTask(task._id, 'in_progress')}
                          className="btn-primary text-xs py-1.5 px-3.5 shadow-sm"
                        >
                          Start Shift
                        </button>
                      )}
                      {task.status === 'in_progress' && (
                        <button
                          onClick={() => updateTask(task._id, 'completed')}
                          className="btn-primary text-xs py-1.5 px-3.5 bg-success hover:bg-green-600 focus:ring-success shadow-sm"
                        >
                          Mark Completed
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right side: Notice feed & AI Lookup */}
        <div className="lg:col-span-4 space-y-6">
          {/* Announcements */}
          <div className="card space-y-4">
            <h3 className="font-bold text-base text-text-primary">Shift Broadcasts</h3>
            <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
              {announcements.length === 0 ? (
                <p className="text-xs text-text-muted text-center py-4">No broadcasts for this venue.</p>
              ) : (
                announcements.map((a) => (
                  <div key={a.id} className="p-3 bg-surface-secondary/40 border border-border/50 rounded-xl space-y-1">
                    <div className="flex justify-between items-center">
                      <p className="font-bold text-xs text-text-primary truncate">{a.title}</p>
                      <StatusBadge status={a.priority || 'medium'} />
                    </div>
                    <p className="text-[11px] text-text-secondary leading-relaxed">{a.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Handbook Lookup */}
          <div className="card space-y-4">
            <h3 className="font-bold text-base text-text-primary">AI Handbook Directives</h3>
            <p className="text-xs text-text-secondary">Look up volunteer guidelines, medical stations, or crowd handling protocols.</p>
            <div className="space-y-2.5">
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && askAI()}
                className="input-field text-xs py-2"
                placeholder="Ask about gate rules, lost items..."
                aria-label="Volunteer handbook search input"
              />
              <button
                onClick={askAI}
                className="btn-primary w-full text-xs py-2 shadow"
                disabled={asking}
              >
                {asking ? 'Searching manual...' : 'Search Handbooks'}
              </button>

              <AnimatePresence>
                {answer && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 bg-surface-secondary border border-border/60 rounded-xl text-xs text-text-secondary leading-relaxed max-h-[220px] overflow-y-auto"
                  >
                    <p className="text-[10px] text-accent font-bold uppercase tracking-wider mb-1">Handbook Match</p>
                    <p>{answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
