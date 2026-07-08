import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || '';

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [crowdUpdates, setCrowdUpdates] = useState(null);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const s = io(SOCKET_URL || window.location.origin, { transports: ['websocket', 'polling'] });
    setSocket(s);

    s.on('crowd:update', (data) => setCrowdUpdates(data));
    s.on('alert:crowd', (alert) => {
      setAlerts((prev) => [alert, ...prev].slice(0, 20));
    });

    return () => s.disconnect();
  }, []);

  useEffect(() => {
    if (socket && user) {
      socket.emit('join:role', user.role);
      if (user.assignedStadium) {
        socket.emit('join:stadium', user.assignedStadium._id || user.assignedStadium);
      }
    }
  }, [socket, user]);

  const joinStadium = useCallback(
    (stadiumId) => {
      if (socket) socket.emit('join:stadium', stadiumId);
    },
    [socket]
  );

  return (
    <SocketContext.Provider value={{ socket, crowdUpdates, alerts, joinStadium }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error('useSocket must be used within SocketProvider');
  return ctx;
};
