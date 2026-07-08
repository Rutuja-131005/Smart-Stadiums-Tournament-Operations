import { useState, useEffect } from 'react';
import { transportAPI } from '../services/api';

/**
 * Hook for transport data fetching
 */
export default function useTransport(stadiumId) {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!stadiumId) return;
    setLoading(true);
    transportAPI.getByStadium(stadiumId)
      .then(({ data }) => setRoutes(data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [stadiumId]);

  return { routes, loading };
}
