import StatusBadge from '../common/StatusBadge';

export default function OrganizerIncidentLogs({ incidents }) {
  const activeIncidents = incidents.filter((i) => i.status !== 'closed');

  return (
    <div className="card space-y-4">
      <h3 className="font-bold text-base text-text-primary">Log Feed & Active Alerts</h3>
      <div className="space-y-3.5 max-h-[460px] overflow-y-auto pr-1">
        {activeIncidents.length === 0 ? (
          <div className="py-12 text-center text-text-secondary text-sm">
            No active operational incidents recorded.
          </div>
        ) : (
          activeIncidents.map((inc) => (
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
  );
}
