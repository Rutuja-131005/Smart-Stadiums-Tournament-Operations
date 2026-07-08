import { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { stadiumAPI, organizerAPI } from '../services/api';
import { useSocket } from '../contexts/SocketContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AIChatPanel from '../components/ai/AIChatPanel';
import OrganizerKPIs from '../components/organizer/OrganizerKPIs';
import OrganizerCharts from '../components/organizer/OrganizerCharts';
import OrganizerIncidentLogs from '../components/organizer/OrganizerIncidentLogs';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement);

export default function OrganizerDashboard() {
  const { crowdUpdates } = useSocket();
  const [stadium, setStadium] = useState(null);
  const [kpis, setKpis] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);
  const [crowdZones, setCrowdZones] = useState([]);

  const loadData = async (stadiumId) => {
    try {
      const [k, i, s] = await Promise.all([
        organizerAPI.getKPIs(stadiumId),
        organizerAPI.getIncidents({ stadium: stadiumId }),
        organizerAPI.getSummary(stadiumId),
      ]);
      setKpis(k.data.data);
      setIncidents(i.data.data);
      setSummary(s.data.data.summary);
      setCrowdZones(k.data.data.crowdZones || []);
    } catch (err) {}
  };

  useEffect(() => {
    stadiumAPI.getAll().then(async ({ data }) => {
      const st = data.data[0];
      setStadium(st);
      if (st) await loadData(st._id);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (crowdUpdates?.zones) setCrowdZones(crowdUpdates.zones);
  }, [crowdUpdates]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Upper header action area */}
      <div className="flex justify-between items-center flex-wrap gap-4 border-b border-border/40 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">Organizer Command Center</h1>
          <p className="text-sm text-text-secondary">{stadium?.name} · Global Operations Live Stream</p>
        </div>
        <button
          onClick={() => loadData(stadium?._id)}
          className="btn-secondary text-sm border-border/60 hover:bg-surface-card flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3m0 0l3 3m-3-3v12" />
          </svg>
          Refresh Feed
        </button>
      </div>

      {/* Primary KPI row */}
      <OrganizerKPIs kpis={kpis} />

      {/* Middle row: Chart metrics */}
      <OrganizerCharts crowdZones={crowdZones} incidents={incidents} />

      {/* AI Operational Summary */}
      {summary && (
        <div className="card border-l-4 border-accent/80 bg-surface-card relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl pointer-events-none" />
          <h3 className="font-bold text-base text-text-primary flex items-center gap-2 mb-3">
            <span>🤖</span>
            AI Operational Dispatch Directive
          </h3>
          <p className="text-sm leading-relaxed text-text-secondary whitespace-pre-wrap">{summary}</p>
        </div>
      )}

      {/* Log Feed & AI Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Incident timeline */}
        <div className="lg:col-span-7">
          <OrganizerIncidentLogs incidents={incidents} />
        </div>

        {/* Live chat panel */}
        <div className="lg:col-span-5">
          <AIChatPanel stadiumId={stadium?._id} className="h-[520px]" />
        </div>
      </div>
    </div>
  );
}
