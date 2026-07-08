import { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { stadiumAPI, sustainabilityAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SustainabilityKPIs from '../components/sustainability/SustainabilityKPIs';
import SustainabilityCharts from '../components/sustainability/SustainabilityCharts';
import SustainabilityAISuggestions from '../components/sustainability/SustainabilityAISuggestions';

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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b border-border/40 pb-5">
        <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">Sustainability Dashboard</h1>
        <p className="text-sm text-text-secondary">Environmental metrics & resource optimization for {stadium?.name}</p>
      </div>

      {latest ? (
        <>
          <SustainabilityKPIs latest={latest} />
          <SustainabilityCharts latest={latest} history={history} />
          <SustainabilityAISuggestions suggestions={suggestions} onLoadSuggestions={loadSuggestions} />
        </>
      ) : (
        <div className="py-16 text-center text-text-muted bg-surface-secondary border border-border/40 rounded-3xl">
          <span className="text-3xl block mb-2">📡</span>
          No live environmental telemetry received yet.
        </div>
      )}
    </div>
  );
}
