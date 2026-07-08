import { useState, useEffect } from 'react';
import { stadiumAPI, matchAPI, crowdAPI, aiAPI } from '../services/api';
import { useSocket } from '../contexts/SocketContext';
import { useAuth } from '../contexts/AuthContext';
import AIChatPanel from '../components/ai/AIChatPanel';
import StadiumMap from '../components/maps/StadiumMap';
import StatCard from '../components/common/StatCard';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';

const LANGUAGES = [
  { code: 'en', name: 'English' }, { code: 'es', name: 'Español' }, { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' }, { code: 'pt', name: 'Português' }, { code: 'ar', name: 'العربية' },
  { code: 'zh', name: '中文' }, { code: 'ja', name: '日本語' },
];

export default function FanDashboard() {
  const { user, updateAccessibility } = useAuth();
  const { crowdUpdates, joinStadium } = useSocket();
  const [stadium, setStadium] = useState(null);
  const [match, setMatch] = useState(null);
  const [crowd, setCrowd] = useState({ zones: [], alerts: [] });
  const [loading, setLoading] = useState(true);
  const [translateText, setTranslateText] = useState('');
  const [translation, setTranslation] = useState('');
  const [targetLang, setTargetLang] = useState('es');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    Promise.all([stadiumAPI.getAll(), matchAPI.getLive()])
      .then(async ([s, m]) => {
        const st = s.data.data[0];
        setStadium(st);
        setMatch(m.data.data[0] || null);
        if (st) {
          joinStadium(st._id);
          const crowdRes = await crowdAPI.getByStadium(st._id);
          setCrowd(crowdRes.data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [joinStadium]);

  useEffect(() => {
    if (crowdUpdates?.zones) {
      setCrowd((c) => ({ ...c, zones: crowdUpdates.zones }));
    }
  }, [crowdUpdates]);

  const handleTranslate = async () => {
    if (!translateText) return;
    try {
      const { data } = await aiAPI.translate({ text: translateText, targetLanguage: targetLang });
      setTranslation(data.data.translation);
    } catch (err) {}
  };

  const toggleAccessibility = async (key) => {
    const current = user?.accessibility?.[key] || false;
    await updateAccessibility({ [key]: !current });
  };

  if (loading) return <LoadingSpinner />;

  // Filter zones on the map based on spectator toggles
  const filteredZones = crowd.zones.filter((z) => {
    if (filterType === 'all') return true;
    if (filterType === 'food') return z.zoneId?.includes('concession') || z.zoneName?.toLowerCase().includes('concession');
    if (filterType === 'parking') return z.zoneId?.includes('parking') || z.zoneName?.toLowerCase().includes('parking');
    if (filterType === 'medical') return z.zoneId?.includes('medical') || z.zoneName?.toLowerCase().includes('medical');
    if (filterType === 'entrance') return z.zoneId?.includes('gate') || z.zoneName?.toLowerCase().includes('gate');
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">Fan Experience Hub</h1>
          <p className="text-sm text-text-secondary">AI-driven navigation, digital ticketing, and match companion</p>
        </div>
      </div>

      {/* Grid Layout: Left Column = Digital Ticket & Stats, Right Column = Visual Ticket info */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Ticket Container */}
        {match && (
          <div className="lg:col-span-8 card-glass border-fifa-gold/30 bg-fifa-gold/5 relative overflow-hidden flex flex-col md:flex-row justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-fifa-gold/10 rounded-full blur-3xl pointer-events-none" />
            <div className="p-6 flex-1 space-y-6">
              <div className="flex justify-between items-center">
                <StatusBadge status="live" label="Live Access Match Ticket" />
                <span className="text-xs text-fifa-gold font-semibold uppercase tracking-widest">FIFA World Cup 2026</span>
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-text-primary">{match.homeTeam} vs {match.awayTeam}</h2>
                <p className="text-sm text-text-secondary">{stadium?.name} · {stadium?.city}</p>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-2">
                <div>
                  <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Gate</p>
                  <p className="text-sm font-extrabold text-text-primary">Gate A</p>
                </div>
                <div>
                  <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Section</p>
                  <p className="text-sm font-extrabold text-text-primary">112</p>
                </div>
                <div>
                  <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Seat</p>
                  <p className="text-sm font-extrabold text-text-primary">Row F, Seat 12</p>
                </div>
              </div>
            </div>

            {/* Stub divider */}
            <div className="hidden md:flex flex-col items-center justify-between border-l border-dashed border-border/60 px-8 py-6 bg-surface-secondary/40 w-52 text-center">
              <div className="space-y-1">
                <p className="text-xs font-bold text-text-secondary">QR Pass Code</p>
                <p className="text-[10px] text-text-muted">Scan at Turnstile</p>
              </div>
              {/* Mock QR barcode visuals */}
              <div className="w-24 h-24 bg-white p-2 rounded-lg shadow flex items-center justify-center">
                <svg className="w-20 h-20 text-surface" viewBox="0 0 100 100" fill="currentColor">
                  <path d="M5 5h30v30H5zm10 10h10v10H15zm50-10h30v30H65zm10 10h10v10H75zm-70 50h30v30H5zm10 10h10v10H15zm50 0h10v10H65zm10 10h20v20H75zm10-10v-10h10v10z" />
                </svg>
              </div>
              <p className="text-[10px] font-mono text-text-secondary">#FWC26-928A</p>
            </div>
          </div>
        )}

        <div className="lg:col-span-4 grid grid-cols-2 gap-4">
          <StatCard title="Crowd Density" value={`${Math.round(crowd.zones.reduce((s, z) => s + z.density, 0) / (crowd.zones.length || 1))}%`} icon="👥" color="blue" />
          <StatCard title="Active Alerts" value={crowd.alerts?.length || 0} icon="⚠️" color="red" />
          <StatCard title="Stadium" value={stadium?.name?.split(' ')[0] || 'N/A'} icon="🏟️" color="gold" />
          <StatCard title="Language" value={user?.preferredLanguage?.toUpperCase() || 'EN'} icon="🌐" color="green" />
        </div>
      </div>

      {/* Main Interactive Row */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left: Stadium Map with Filters */}
        <div className="lg:col-span-12 card flex flex-col space-y-4">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <h3 className="font-bold text-base text-text-primary">Interactive Seating & Venue Map</h3>
            <div className="flex gap-1.5 flex-wrap">
              {[
                { type: 'all', label: 'All' },
                { type: 'entrance', label: 'Gates' },
                { type: 'food', label: 'Food' },
                { type: 'parking', label: 'Parking' },
                { type: 'medical', label: 'Medical' },
              ].map((btn) => (
                <button
                  key={btn.type}
                  onClick={() => setFilterType(btn.type)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all ${
                    filterType === btn.type
                      ? 'bg-accent/15 border-accent text-accent'
                      : 'bg-surface-secondary border-border text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          <StadiumMap stadium={stadium} zones={filteredZones} height="400px" />
        </div>
      </div>

      {/* Accessibility configurations */}
      <div className="card space-y-4">
        <h3 className="font-bold text-base text-text-primary">Accessibility Guidance Setup</h3>
        <p className="text-xs text-text-secondary">Toggle specialized routing configurations to optimize your journey across the stadium.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {[
            { key: 'wheelchairAccess', label: 'Step-Free Routes', icon: '♿' },
            { key: 'voiceGuidance', label: 'Audio Navigation', icon: '🔊' },
            { key: 'screenReader', label: 'High Contrast Font', icon: '📖' },
            { key: 'highContrast', label: 'Enterprise Contrast', icon: '◐' },
          ].map(({ key, label, icon }) => (
            <label
              key={key}
              className={`flex items-center gap-3 p-3.5 rounded-xl border border-border/50 bg-surface-secondary/40 hover:border-accent/40 cursor-pointer select-none transition-all ${
                user?.accessibility?.[key] ? 'border-accent/40 bg-accent/5' : ''
              }`}
            >
              <input
                type="checkbox"
                checked={user?.accessibility?.[key] || false}
                onChange={() => toggleAccessibility(key)}
                className="w-5 h-5 rounded border-border text-accent focus:ring-accent focus:ring-offset-surface cursor-pointer"
              />
              <span className="text-sm font-semibold text-text-primary">
                <span className="mr-1.5" role="img" aria-hidden="true">{icon}</span>
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
