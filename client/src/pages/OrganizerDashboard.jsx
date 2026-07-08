import { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { stadiumAPI, organizerAPI } from '../services/api';
import { useSocket } from '../contexts/SocketContext';
import StatCard from '../components/common/StatCard';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AIChatPanel from '../components/ai/AIChatPanel';

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

  // Chart configuration with premium color palettes matching the theme
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1F2937',
        titleColor: '#F9FAFB',
        bodyColor: '#9CA3AF',
        borderColor: '#374151',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(55, 65, 81, 0.3)',
        },
        ticks: {
          color: '#9CA3AF',
          font: { family: 'Inter', size: 11 },
        },
      },
      y: {
        max: 100,
        grid: {
          color: 'rgba(55, 65, 81, 0.3)',
        },
        ticks: {
          color: '#9CA3AF',
          font: { family: 'Inter', size: 11 },
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#9CA3AF',
          font: { family: 'Inter', size: 11 },
          boxWidth: 12,
        },
      },
    },
  };

  const crowdChart = {
    labels: crowdZones.map((z) => z.zoneName || z.zoneId),
    datasets: [{
      label: 'Density %',
      data: crowdZones.map((z) => z.density),
      backgroundColor: crowdZones.map((z) =>
        z.density >= 85 ? '#EF4444' : z.density >= 70 ? '#F59E0B' : z.density >= 50 ? '#3B82F6' : '#22C55E'
      ),
      borderRadius: 6,
      borderWidth: 0,
      barThickness: 24,
    }],
  };

  const incidentChart = {
    labels: ['Open Alerts', 'Assigned', 'Resolved'],
    datasets: [{
      data: [
        incidents.filter((i) => i.status === 'open').length,
        incidents.filter((i) => i.status === 'investigating').length,
        incidents.filter((i) => i.status === 'resolved').length,
      ],
      backgroundColor: ['#EF4444', '#F59E0B', '#22C55E'],
      borderWidth: 1,
      borderColor: '#1F2937',
    }],
  };

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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Attendance" value={kpis?.attendance?.toLocaleString() || '0'} icon="👥" color="blue" />
        <StatCard title="Avg Crowd Load" value={`${kpis?.avgCrowdDensity || 0}%`} icon="📊" color="gold" />
        <StatCard title="Active Incidents" value={kpis?.openIncidents || 0} icon="🚨" color="red" />
        <StatCard title="Pending Tasks" value={kpis?.pendingTasks || 0} icon="📋" color="green" />
      </div>

      {/* Middle row: Chart metrics */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-base text-text-primary">Real-time Venue Crowd Load</h3>
            <span className="text-xs text-accent bg-accent/10 px-2 py-0.5 rounded-md font-semibold">Active Sensors</span>
          </div>
          <div className="h-64">
            <Bar data={crowdChart} options={chartOptions} />
          </div>
        </div>

        <div className="card space-y-4">
          <h3 className="font-bold text-base text-text-primary">Operational Incident Mix</h3>
          <div className="h-64 flex items-center justify-center">
            <Doughnut data={incidentChart} options={doughnutOptions} />
          </div>
        </div>
      </div>

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
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Active Incident timeline */}
        <div className="lg:col-span-7 card space-y-4">
          <h3 className="font-bold text-base text-text-primary">Log Feed & Active Alerts</h3>
          <div className="space-y-3.5 max-h-[460px] overflow-y-auto pr-1">
            {incidents.filter((i) => i.status !== 'closed').length === 0 ? (
              <div className="py-12 text-center text-text-secondary text-sm">
                No active operational incidents recorded.
              </div>
            ) : (
              incidents.filter((i) => i.status !== 'closed').map((inc) => (
                <div key={inc._id} className="p-4 bg-surface-secondary/40 border border-border/50 rounded-xl space-y-2 hover:border-border transition-colors">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <p className="font-semibold text-sm text-text-primary">{inc.title}</p>
                      <p className="text-xs text-text-muted mt-0.5">Location: {inc.location?.zone || 'N/A'}</p>
                    </div>
                    <StatusBadge status={inc.severity} />
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">{inc.description}</p>
                  {inc.aiRecommendations?.length > 0 && (
                    <div className="pt-2 border-t border-border/30 mt-2">
                      <p className="text-[10px] text-accent font-bold uppercase tracking-wider mb-1">Incident Directives</p>
                      <ul className="text-xs text-text-secondary list-disc list-inside space-y-1">
                        {inc.aiRecommendations.slice(0, 2).map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Live chat panel */}
        <div className="lg:col-span-5">
          <AIChatPanel stadiumId={stadium?._id} className="h-[520px]" />
        </div>
      </div>
    </div>
  );
}
