import StatusBadge from '../common/StatusBadge';

export default function SecurityLogs({ alerts }) {
  return (
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
  );
}
