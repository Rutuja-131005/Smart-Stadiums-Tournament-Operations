const statusConfig = {
  live: { dot: 'bg-danger animate-pulse', text: 'text-danger', bg: 'badge-danger', label: 'LIVE' },
  critical: { dot: 'bg-danger animate-pulse', text: 'text-danger', bg: 'badge-danger', label: 'Critical' },
  high: { dot: 'bg-danger', text: 'text-danger', bg: 'badge-danger', label: 'High' },
  medium: { dot: 'bg-warning', text: 'text-warning', bg: 'badge-warning', label: 'Medium' },
  low: { dot: 'bg-success', text: 'text-success', bg: 'badge-success', label: 'Low' },
  normal: { dot: 'bg-success', text: 'text-success', bg: 'badge-success', label: 'Normal' },
  moderate: { dot: 'bg-warning', text: 'text-warning', bg: 'badge-warning', label: 'Moderate' },
  congested: { dot: 'bg-danger', text: 'text-danger', bg: 'badge-danger', label: 'Congested' },
  open: { dot: 'bg-secondary', text: 'text-secondary', bg: 'badge-blue', label: 'Open' },
  investigating: { dot: 'bg-warning animate-pulse', text: 'text-warning', bg: 'badge-warning', label: 'Investigating' },
  resolved: { dot: 'bg-success', text: 'text-success', bg: 'badge-success', label: 'Resolved' },
  closed: { dot: 'bg-text-muted', text: 'text-text-muted', bg: 'badge-muted', label: 'Closed' },
  pending: { dot: 'bg-warning', text: 'text-warning', bg: 'badge-warning', label: 'Pending' },
  in_progress: { dot: 'bg-secondary animate-pulse', text: 'text-secondary', bg: 'badge-blue', label: 'In Progress' },
  completed: { dot: 'bg-success', text: 'text-success', bg: 'badge-success', label: 'Completed' },
  available: { dot: 'bg-success', text: 'text-success', bg: 'badge-success', label: 'Available' },
  busy: { dot: 'bg-warning', text: 'text-warning', bg: 'badge-warning', label: 'Busy' },
  scheduled: { dot: 'bg-secondary', text: 'text-secondary', bg: 'badge-blue', label: 'Scheduled' },
  operational: { dot: 'bg-success', text: 'text-success', bg: 'badge-success', label: 'Operational' },
};

export default function StatusBadge({ status, label, showDot = true, className = '' }) {
  const config = statusConfig[status] || statusConfig.normal;
  const displayLabel = label || config.label;

  return (
    <span className={`${config.bg} ${className}`}>
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot} flex-shrink-0`} />
      )}
      {displayLabel}
    </span>
  );
}
