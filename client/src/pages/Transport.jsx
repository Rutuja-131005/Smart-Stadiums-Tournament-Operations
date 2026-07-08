import { useState, useEffect } from 'react';
import { stadiumAPI, transportAPI } from '../services/api';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';

export default function Transport() {
  const [stadium, setStadium] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [plan, setPlan] = useState(null);
  const [origin, setOrigin] = useState('city center');
  const [loading, setLoading] = useState(true);
  const [planning, setPlanning] = useState(false);

  useEffect(() => {
    stadiumAPI.getAll().then(async ({ data }) => {
      const st = data.data[0];
      setStadium(st);
      if (st) {
        const res = await transportAPI.getByStadium(st._id);
        setRoutes(res.data.data);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const getPlan = async () => {
    if (planning) return;
    setPlanning(true);
    setPlan(null);
    try {
      const { data } = await transportAPI.getPlan(stadium._id, { origin, preferences: 'fastest' });
      setPlan(data.data);
    } catch (err) {
      setPlan({ recommended: { name: 'Metro Express' }, aiPlan: 'Could not fetch travel plan details. Try a different origin.' });
    } finally {
      setPlanning(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const loadPercent = (r) => r.capacity ? Math.round((r.currentLoad / r.capacity) * 100) : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b border-border/40 pb-5">
        <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">Transit Command Planner</h1>
        <p className="text-sm text-text-secondary">Real-time tracking of parking lots, shuttles, public metros & AI routing</p>
      </div>

      {/* Plan Journey card */}
      <div className="card space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center font-bold">
            🗺️
          </div>
          <h3 className="font-bold text-base text-text-primary">Optimize Travel Path</h3>
        </div>
        <p className="text-xs text-text-secondary">Input your starting location below to generate a multi-modal AI route that bypasses congested gates.</p>
        <div className="flex gap-3 flex-wrap">
          <input
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && getPlan()}
            className="input-field max-w-sm text-sm"
            placeholder="e.g. City Center or Airport"
            aria-label="Starting location"
          />
          <button onClick={getPlan} className="btn-primary" disabled={planning}>
            {planning ? 'Planning Journey...' : 'Formulate Route'}
          </button>
        </div>

        <AnimatePresence>
          {plan && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-success-bg/15 border border-success/30 rounded-xl mt-4 space-y-2 text-sm leading-relaxed"
            >
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-success uppercase tracking-wider">AI Recommendation Directives</span>
                <span className="text-xs text-text-secondary font-semibold">Option: {plan.recommended?.name}</span>
              </div>
              <p className="whitespace-pre-wrap text-text-secondary text-xs">{plan.aiPlan}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Grid listing route telemetry */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {routes.map((route) => {
          const loadPct = loadPercent(route);
          const barColorClass = loadPct > 80 ? 'bg-danger' : loadPct > 50 ? 'bg-warning' : 'bg-success';
          return (
            <div key={route._id} className="card bg-surface-card border-border/40 hover:border-border transition-all flex flex-col justify-between gap-4">
              <div className="space-y-2.5">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-bold text-sm text-text-primary truncate">{route.name}</h3>
                  <StatusBadge status={route.status} />
                </div>
                <p className="text-[10px] text-accent font-bold uppercase tracking-wider">{route.type}</p>
                <div className="text-xs text-text-secondary space-y-1.5 leading-relaxed">
                  <p>⏱️ Travel Duration: {route.durationMinutes} min</p>
                  <p>📏 Travel Distance: {route.distanceKm} km</p>
                  {route.trafficDelayMinutes > 0 && (
                    <p className="text-warning font-semibold">🚦 Traffic Congestion: +{route.trafficDelayMinutes} min delay</p>
                  )}
                </div>
              </div>

              <div className="space-y-2 pt-3 border-t border-border/30">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-text-muted">Vehicle Capacity</span>
                  <span className="text-text-secondary">{loadPct}% used</span>
                </div>
                <div className="w-full bg-surface-secondary rounded-full h-2 overflow-hidden shadow-inner">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${barColorClass}`}
                    style={{ width: `${loadPct}%` }}
                  />
                </div>
                {route.accessibility?.wheelchairAccessible && (
                  <p className="text-[10px] text-success font-bold flex items-center gap-1 mt-1">
                    ♿ Step-Free Accessible Vehicle
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
