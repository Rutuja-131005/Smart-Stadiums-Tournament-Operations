import { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { stadiumAPI, sustainabilityAPI } from '../services/api';
import StatCard from '../components/common/StatCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

export default function SustainabilityDashboard() {
  const [stadium, setStadium] = useState(null);
  const [latest, setLatest] = useState(null);
  const [history, setHistory] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    stadiumAPI.getAll().then(async ({ data }) => {
      const st = data.data[0];
      setStadium(st);
      if (st) {
        try {
          const [lat, hist] = await Promise.all([
            sustainabilityAPI.getLatest(st._id),
            sustainabilityAPI.getByStadium(st._id),
          ]);
          setLatest(lat.data.data);
          setHistory(hist.data.data);
          setSuggestions(lat.data.data.aiSuggestions || []);
        } catch {
          /* no data yet */
        }
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const loadSuggestions = async () => {
    try {
      const { data } = await sustainabilityAPI.getSuggestions(stadium._id);
      setSuggestions(data.data.suggestions);
    } catch (err) {}
  };

  if (loading) return <LoadingSpinner />;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1F2937',
        titleColor: '#F9FAFB',
        bodyColor: '#9CA3AF',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(55, 65, 81, 0.2)' },
        ticks: { color: '#9CA3AF', font: { family: 'Inter', size: 10 } },
      },
      y: {
        grid: { color: 'rgba(55, 65, 81, 0.2)' },
        ticks: { color: '#9CA3AF', font: { family: 'Inter', size: 10 } },
      },
    },
  };

  const wasteChart = latest ? {
    labels: ['Recycled', 'Compost', 'Landfill'],
    datasets: [{
      label: 'Waste (kg)',
      data: [latest.waste.recycledKg, latest.waste.compostKg, latest.waste.landfillKg],
      backgroundColor: ['#22C55E', '#3B82F6', '#EF4444'],
      borderRadius: 6,
      barThickness: 28,
    }],
  } : null;

  const energyLine = history.length ? {
    labels: history.map((h, i) => `T-${history.length - i}`),
    datasets: [{
      label: 'Energy (kWh)',
      data: history.map((h) => h.energy?.consumptionKwh),
      borderColor: '#00E5A8',
      backgroundColor: 'rgba(0, 229, 168, 0.1)',
      borderWidth: 2,
      fill: true,
      tension: 0.3,
      pointRadius: 3,
    }],
  } : null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b border-border/40 pb-5">
        <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">Sustainability Dashboard</h1>
        <p className="text-sm text-text-secondary">Environmental metrics & resource optimization for {stadium?.name}</p>
      </div>

      {latest ? (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Energy Used" value={`${(latest.energy.consumptionKwh / 1000).toFixed(1)}K kWh`} subtitle={`${latest.energy.renewablePercent}% renewable share`} icon="⚡" color="gold" />
            <StatCard title="Water Flow" value={`${(latest.water.usageLiters / 1000).toFixed(0)}K Liters`} subtitle={`${latest.water.recycledPercent}% recycled usage`} icon="💧" color="blue" />
            <StatCard title="Total Waste Load" value={`${latest.waste.totalKg} kg`} subtitle={`${Math.round((latest.waste.recycledKg / latest.waste.totalKg) * 100)}% recycled`} icon="♻️" color="green" />
            <StatCard title="Carbon Footprint" value={`${(latest.carbon.footprintKgCo2 / 1000).toFixed(1)}t CO₂`} subtitle={`${latest.carbon.offsetKgCo2} kg offset`} icon="🌍" color="red" />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {wasteChart && (
              <div className="card space-y-4">
                <h3 className="font-bold text-base text-text-primary">Waste Breakdown</h3>
                <div className="h-64">
                  <Bar data={wasteChart} options={chartOptions} />
                </div>
              </div>
            )}
            {energyLine && (
              <div className="card space-y-4">
                <h3 className="font-bold text-base text-text-primary">Energy Consumption Trend</h3>
                <div className="h-64">
                  <Line data={energyLine} options={chartOptions} />
                </div>
              </div>
            )}
          </div>

          <div className="card space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-success/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex justify-between items-center flex-wrap gap-2">
              <h3 className="font-bold text-base text-text-primary flex items-center gap-2">
                <span>🌱</span>
                AI Optimization Suggestions
              </h3>
              <button
                onClick={loadSuggestions}
                className="btn-secondary text-xs border-border/60 hover:bg-surface-card"
              >
                Refresh AI Suggestions
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {suggestions.map((s, i) => (
                <div key={i} className="p-4 border border-success/20 bg-success-bg/10 rounded-xl text-xs text-text-secondary leading-relaxed">
                  <p className="font-semibold text-success mb-1">Directive #{i + 1}</p>
                  {s}
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="card text-center py-16">
          <p className="text-text-secondary">No sustainability telemetry available. Run the database seed script to populate sample metrics.</p>
        </div>
      )}
    </div>
  );
}
