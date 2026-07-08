import { useState } from 'react';

/**
 * Hook for stadium map zone selection and sector data
 */
export default function useMapNavigation(zones = []) {
  const [selectedZone, setSelectedZone] = useState(null);

  const getZoneData = (keywords) => {
    const keyArray = Array.isArray(keywords) ? keywords : [keywords];
    const matched = zones.find((z) => {
      const name = (z.zoneName || z.name || z.zoneId || '').toLowerCase();
      return keyArray.some((k) => name.includes(k.toLowerCase()));
    });
    return matched || { zoneName: keywords[0], density: 10, status: 'normal', wheelchairAccessible: true };
  };

  const clearSelection = () => setSelectedZone(null);

  return { selectedZone, setSelectedZone, clearSelection, getZoneData };
}
