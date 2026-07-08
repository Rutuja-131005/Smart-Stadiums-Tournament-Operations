import { useState, useEffect } from 'react';
import { stadiumAPI, crowdAPI, aiAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import StadiumMap from '../components/maps/StadiumMap';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navigation() {
  const { user } = useAuth();
  const [stadium, setStadium] = useState(null);
  const [zones, setZones] = useState([]);
  const [from, setFrom] = useState('Gate A');
  const [to, setTo] = useState('Section 112');
  const [route, setRoute] = useState('');
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const accessibility = user?.accessibility?.wheelchairAccess;

  useEffect(() => {
    stadiumAPI.getAll().then(async ({ data }) => {
      const st = data.data[0];
      setStadium(st);
      if (st) {
        const crowdRes = await crowdAPI.getByStadium(st._id);
        setZones(crowdRes.data.data.zones);
        // Pre-select first two zones if available
        if (st.zones?.length > 1) {
          setFrom(st.zones[0].name);
          setTo(st.zones[4]?.name || st.zones[1].name);
        }
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const findRoute = async () => {
    setSearching(true);
    setRoute('');
    try {
      const { data } = await aiAPI.navigate({
        from, to, stadiumId: stadium._id, accessibility,
      });
      setRoute(data.data.route);
      if (user?.accessibility?.voiceGuidance && window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(data.data.route.slice(0, 200));
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      setRoute('Could not calculate a path. Make sure both points are accessible.');
    } finally {
      setSearching(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b border-border/40 pb-5">
        <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">Stadium Pathfinding console</h1>
        <p className="text-sm text-text-secondary">AI-assisted indoor path calculations & voice guidance at {stadium?.name}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Planner Left column */}
        <div className="card lg:col-span-1 space-y-4">
          <h3 className="font-bold text-base text-text-primary">Route Parameters</h3>
          <div className="space-y-3.5">
            <div>
              <label htmlFor="from" className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-2">Depart From</label>
              <select id="from" value={from} onChange={(e) => setFrom(e.target.value)} className="input-field text-sm">
                {stadium?.zones?.map((z) => (
                  <option key={z.id} value={z.name}>{z.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="to" className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-2">Destination Point</label>
              <select id="to" value={to} onChange={(e) => setTo(e.target.value)} className="input-field text-sm">
                {stadium?.zones?.map((z) => (
                  <option key={z.id} value={z.name}>{z.name}</option>
                ))}
              </select>
            </div>

            {accessibility && (
              <div className="p-3 bg-success-bg/15 border border-success/20 rounded-xl flex items-center gap-2 text-xs text-success font-semibold">
                <span role="img" aria-label="Accessibility Icon">♿</span> Step-Free / Wheelchair Mode Active
              </div>
            )}

            <button
              onClick={findRoute}
              className="btn-primary w-full py-3"
              disabled={searching}
            >
              {searching ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-surface border-t-transparent rounded-full animate-spin" />
                  Calculating optimal path...
                </div>
              ) : (
                'Generate Path Directives'
              )}
            </button>
          </div>

          <AnimatePresence>
            {route && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-surface-secondary border border-border rounded-xl mt-4 space-y-2 text-sm leading-relaxed"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-accent uppercase tracking-wider">AI Directives</span>
                  {user?.accessibility?.voiceGuidance && (
                    <span className="text-[10px] text-text-muted flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" /> Audio active
                    </span>
                  )}
                </div>
                <p className="whitespace-pre-wrap text-text-secondary text-xs">{route}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Map Right Column */}
        <div className="lg:col-span-2 card space-y-4">
          <h3 className="font-bold text-base text-text-primary">Interactive Venue Layout</h3>
          <div className="h-[480px]">
            <StadiumMap stadium={stadium} zones={zones} height="100%" />
          </div>
        </div>
      </div>
    </div>
  );
}
