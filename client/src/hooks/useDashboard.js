import { useState, useEffect } from 'react';
import { stadiumAPI, matchAPI } from '../services/api';

/**
 * Hook for dashboard data fetching
 */
export default function useDashboard() {
  const [stadiums, setStadiums] = useState([]);
  const [liveMatches, setLiveMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([stadiumAPI.getAll(), matchAPI.getLive()])
      .then(([s, m]) => {
        setStadiums(s.data.data);
        setLiveMatches(m.data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { stadiums, liveMatches, loading };
}
