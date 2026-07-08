import { useState, useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';

/**
 * Hook for real-time crowd analytics via Socket.IO
 */
export default function useRealtimeAnalytics(stadiumId) {
  const { socket, crowdUpdates, alerts, joinStadium } = useSocket();
  const [latestUpdate, setLatestUpdate] = useState(null);

  useEffect(() => {
    if (stadiumId) {
      joinStadium(stadiumId);
    }
  }, [stadiumId, joinStadium]);

  useEffect(() => {
    if (crowdUpdates && crowdUpdates.stadiumId === stadiumId) {
      setLatestUpdate(crowdUpdates);
    }
  }, [crowdUpdates, stadiumId]);

  return { socket, latestUpdate, alerts };
}
