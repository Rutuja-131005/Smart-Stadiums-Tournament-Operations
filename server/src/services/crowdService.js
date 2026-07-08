import CrowdZone from '../models/CrowdZone.js';

export const getDensityStatus = (density) => {
  if (density >= 85) return 'critical';
  if (density >= 70) return 'congested';
  if (density >= 50) return 'moderate';
  return 'normal';
};

export const predictDensity = (current, trend) => {
  const delta = trend === 'increasing' ? 8 : trend === 'decreasing' ? -5 : 0;
  return Math.min(100, Math.max(0, current + delta + Math.floor(Math.random() * 5)));
};

export const simulateCrowdUpdate = async (stadiumId) => {
  const zones = await CrowdZone.find({ stadium: stadiumId });
  const updates = [];

  for (const zone of zones) {
    const change = Math.floor(Math.random() * 11) - 5;
    zone.currentCount = Math.max(0, Math.min(zone.capacity, zone.currentCount + change));
    zone.density = Math.round((zone.currentCount / zone.capacity) * 100);
    zone.status = getDensityStatus(zone.density);
    zone.predictedDensity15min = predictDensity(zone.density, zone.trend);
    zone.trend = zone.density > 70 ? 'increasing' : zone.density < 40 ? 'decreasing' : 'stable';
    await zone.save();
    updates.push(zone);
  }

  return updates;
};

export const getCongestionAlerts = (zones) =>
  zones
    .filter((z) => z.density >= 70)
    .map((z) => ({
      zoneId: z.zoneId,
      zoneName: z.zoneName,
      density: z.density,
      status: z.status,
      recommendation: z.density >= 85
        ? 'Redirect traffic immediately via alternate routes'
        : 'Monitor closely and prepare alternate routing',
    }));

export default { simulateCrowdUpdate, getCongestionAlerts, getDensityStatus };
