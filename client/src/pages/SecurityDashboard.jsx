import { useState, useEffect } from 'react';
import { stadiumAPI, securityAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SecurityLogs from '../components/security/SecurityLogs';
import EvacuationPlanner from '../components/security/EvacuationPlanner';
import WorkflowChecklist from '../components/security/WorkflowChecklist';

export default function SecurityDashboard() {
  const [stadium, setStadium] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [workflows, setWorkflows] = useState([]);
  const [evacZone, setEvacZone] = useState('North Concourse');
  const [evacReason, setEvacReason] = useState('');
  const [evacPlan, setEvacPlan] = useState('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    Promise.all([stadiumAPI.getAll(), securityAPI.getWorkflows()])
      .then(async ([s, w]) => {
        const st = s.data.data[0];
        setStadium(st);
        setWorkflows(w.data.data);
        if (st) {
          const a = await securityAPI.getAlerts(st._id);
          setAlerts(a.data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const generateEvacuation = async () => {
    if (generating) return;
    setGenerating(true);
    setEvacPlan('');
    try {
      const { data } = await securityAPI.getEvacuationPlan({
        stadiumId: stadium._id,
        zone: evacZone,
        reason: evacReason || 'Emergency evacuation required',
      });
      setEvacPlan(data.data.plan);
    } catch (err) {
      setEvacPlan('Error generating plan. Please select a valid zone and write details.');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4 border-b border-border/40 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">Security Command Control</h1>
          <p className="text-sm text-text-secondary">Incident monitoring, evacuation routing & dispatcher telemetry</p>
        </div>
        {/* Threat Level indicator bar */}
        <div className="flex items-center gap-3 bg-surface-secondary border border-border p-3 rounded-2xl shadow-inner">
          <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Status Threat Level:</span>
          <div className="flex gap-1">
            <span className="w-6 h-2 rounded bg-success" />
            <span className="w-6 h-2 rounded bg-warning" />
            <span className="w-6 h-2 rounded bg-border" />
          </div>
          <span className="text-xs font-extrabold text-warning uppercase">Yellow / Moderate</span>
        </div>
      </div>

      {/* Alert Feed */}
      <SecurityLogs alerts={alerts} />

      {/* Grid: Evacuation planner & Procedures */}
      <div className="grid lg:grid-cols-2 gap-6">
        <EvacuationPlanner
          evacZone={evacZone}
          setEvacZone={setEvacZone}
          evacReason={evacReason}
          setEvacReason={setEvacReason}
          evacPlan={evacPlan}
          setEvacPlan={setEvacPlan}
          generating={generating}
          onGenerate={generateEvacuation}
        />
        <WorkflowChecklist workflows={workflows} />
      </div>
    </div>
  );
}
