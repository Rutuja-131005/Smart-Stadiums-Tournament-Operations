import StatCard from '../common/StatCard';

export default function SustainabilityKPIs({ latest }) {
  if (!latest) return null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Energy Used"
        value={`${(latest.energy.consumptionKwh / 1000).toFixed(1)}K kWh`}
        subtitle={`${latest.energy.renewablePercent}% renewable share`}
        icon="⚡"
        color="gold"
      />
      <StatCard
        title="Water Flow"
        value={`${(latest.water.usageLiters / 1000).toFixed(0)}K Liters`}
        subtitle={`${latest.water.recycledPercent}% recycled usage`}
        icon="💧"
        color="blue"
      />
      <StatCard
        title="Total Waste Load"
        value={`${latest.waste.totalKg} kg`}
        subtitle={`${Math.round((latest.waste.recycledKg / latest.waste.totalKg) * 100)}% recycled`}
        icon="♻️"
        color="green"
      />
      <StatCard
        title="Carbon Footprint"
        value={`${(latest.carbon.footprintKgCo2 / 1000).toFixed(1)}t CO₂`}
        subtitle={`${latest.carbon.offsetKgCo2} kg offset`}
        icon="🌍"
        color="red"
      />
    </div>
  );
}
