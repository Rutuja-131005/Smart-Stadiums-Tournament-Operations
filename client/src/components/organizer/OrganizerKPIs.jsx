import StatCard from '../common/StatCard';

export default function OrganizerKPIs({ kpis }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Total Attendance" value={kpis?.attendance?.toLocaleString() || '0'} icon="👥" color="blue" />
      <StatCard title="Avg Crowd Load" value={`${kpis?.avgCrowdDensity || 0}%`} icon="📊" color="gold" />
      <StatCard title="Active Incidents" value={kpis?.openIncidents || 0} icon="🚨" color="red" />
      <StatCard title="Pending Tasks" value={kpis?.pendingTasks || 0} icon="📋" color="green" />
    </div>
  );
}
