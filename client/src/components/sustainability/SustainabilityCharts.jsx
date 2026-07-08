import { Bar, Line } from 'react-chartjs-2';

export default function SustainabilityCharts({ latest, history }) {
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
  );
}
