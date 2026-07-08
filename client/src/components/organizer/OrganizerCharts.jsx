import { Bar, Doughnut } from 'react-chartjs-2';

export default function OrganizerCharts({ crowdZones, incidents }) {
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
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(55, 65, 81, 0.3)' },
        ticks: { color: '#9CA3AF', font: { family: 'Inter', size: 11 } },
      },
      y: {
        max: 100,
        grid: { color: 'rgba(55, 65, 81, 0.3)' },
        ticks: { color: '#9CA3AF', font: { family: 'Inter', size: 11 } },
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
  );
}
