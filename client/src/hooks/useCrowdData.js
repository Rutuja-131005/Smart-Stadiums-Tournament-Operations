import { useState, useEffect, useCallback } from 'react';
import { crowdAPI } from '../services/api';

/**
 * Hook for crowd zone data fetching
 */
export default function useCrowdData(stadiumId) {
  const [zones, setZones] = useState([]);
  const [heatmap, setHeatmap] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchZones = useCallback(async () => {
    if (!stadiumId) return;
    setLoading(true);
    try {
      const { data } = await crowdAPI.getByStadium(stadiumId);
      setZones(data.data || []);
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }, [stadiumId]);

  const fetchHeatmap = useCallback(async () => {
    if (!stadiumId) return;
    try {
      const { data } = await crowdAPI.getHeatmap(stadiumId);
      setHeatmap(data.data);
    } catch {
      // Silently fail
    }
  }, [stadiumId]);

  useEffect(() => {
    fetchZones();
  }, [fetchZones]);

  return { zones, heatmap, loading, fetchZones, fetchHeatmap };
}
