import { useState, useEffect } from 'react';
import { stadiumAPI, securityAPI } from '../services/api';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';

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
      <div className="card border-l-4 border-danger bg-surface-card relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-danger/5 rounded-full blur-3xl pointer-events-none" />
        <h3 className="font-bold text-base text-text-primary flex items-center gap-2.5 mb-4">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-danger"></span>
          </span>
          Live Security Logs
          <span className="badge bg-danger/20 text-danger text-[10px] ml-1.5">{alerts.length} Warnings</span>
        </h3>

        {alerts.length === 0 ? (
          <div className="py-8 text-center text-success bg-success/5 border border-success/20 rounded-xl font-medium text-sm">
            ✓ Operational clear — zero threat vector detected.
          </div>
        ) : (
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {alerts.map((alert) => (
              <div key={alert.id} className="p-4 bg-danger/5 border border-danger/20 rounded-xl space-y-1.5 hover:border-danger/30 transition-colors">
                <div className="flex justify-between items-start gap-2">
                  <p className="font-bold text-sm text-text-primary">{alert.title}</p>
                  <StatusBadge status={alert.severity} />
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">{alert.message}</p>
                <div className="flex justify-between text-[10px] text-text-muted mt-1.5">
                  <span>Sensor: Gate B turnstile telemetry</span>
                  <span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Grid: Evacuation planner & Procedures */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Evacuation Planner */}
        <div className="card space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-danger/10 text-danger flex items-center justify-center font-bold">
              ⚡
            </div>
            <h3 className="font-bold text-base text-text-primary">AI Emergency Evacuation Routing</h3>
          </div>
          <p className="text-xs text-text-secondary">Generate step-free, crowd-balanced redirection instructions using generative routing matrices.</p>

          <div className="space-y-3.5">
            <div>
              <label htmlFor="affectedZone" className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-2">Affected Stadium Zone</label>
              <input
                id="affectedZone"
                value={evacZone}
                onChange={(e) => setEvacZone(e.target.value)}
                className="input-field"
                placeholder="Affected zone (e.g. Gate A)"
              />
            </div>
            <div>
              <label htmlFor="reason" className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-2">Trigger Incident Reason</label>
              <textarea
                id="reason"
                value={evacReason}
                onChange={(e) => setEvacReason(e.target.value)}
                className="input-field h-24"
                placeholder="Reason for routing updates..."
              />
            </div>
            <button
              onClick={generateEvacuation}
              className="btn-primary w-full bg-danger hover:bg-red-600 focus:ring-danger text-white py-3"
              disabled={generating}
            >
              {generating ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating evacuation layout...
                </div>
              ) : (
                'Formulate Evacuation Protocol'
              )}
            </button>
          </div>

          <AnimatePresence>
            {evacPlan && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-4 bg-warning-bg border border-warning/30 rounded-xl mt-4 space-y-2 text-sm leading-relaxed"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-warning uppercase tracking-wider">AI Operations Dispatch</span>
                  <span className="text-xs text-text-muted">Generated instantly</span>
                </div>
                <p className="whitespace-pre-wrap text-text-primary text-xs">{evacPlan}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Procedures / Workflows */}
        <div className="card space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center font-bold">
              📋
            </div>
            <h3 className="font-bold text-base text-text-primary">Standard Threat Response Workflows</h3>
          </div>
          <p className="text-xs text-text-secondary">Standard operating protocols designed by organizers for venue dispatch.</p>

          <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
            {workflows.map((wf) => (
              <div key={wf.id} className="p-4 border border-border/50 rounded-xl bg-surface-secondary/20 hover:border-border transition-all">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-bold text-sm text-text-primary">{wf.name}</h4>
                  <StatusBadge status="normal" label={wf.status} />
                </div>
                <ol className="list-decimal list-inside text-xs text-text-secondary space-y-2 pl-1 leading-relaxed">
                  {wf.steps.map((step, i) => (
                    <li key={i} className="pl-1">
                      <span className="text-text-primary">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
