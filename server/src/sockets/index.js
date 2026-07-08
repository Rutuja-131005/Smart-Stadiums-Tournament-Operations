import { simulateCrowdUpdate } from '../services/crowdService.js';
import logger from '../utils/logger.js';

export const initializeSocket = (io) => {
  io.on('connection', (socket) => {
    logger.info(`Client connected: ${socket.id}`);

    socket.on('join:stadium', (stadiumId) => {
      socket.join(`stadium:${stadiumId}`);
      logger.info(`Socket ${socket.id} joined stadium:${stadiumId}`);
    });

    socket.on('leave:stadium', (stadiumId) => {
      socket.leave(`stadium:${stadiumId}`);
    });

    socket.on('join:role', (role) => {
      socket.join(`role:${role}`);
    });

    socket.on('disconnect', () => {
      logger.info(`Client disconnected: ${socket.id}`);
    });
  });

  const broadcastCrowdUpdates = async () => {
    try {
      const Stadium = (await import('../models/Stadium.js')).default;
      const stadiums = await Stadium.find({ status: 'operational' }).select('_id name');

      for (const stadium of stadiums) {
        const updates = await simulateCrowdUpdate(stadium._id);
        io.to(`stadium:${stadium._id}`).emit('crowd:update', {
          stadiumId: stadium._id,
          zones: updates,
          timestamp: new Date(),
        });

        const critical = updates.filter((z) => z.density >= 85);
        if (critical.length > 0) {
          io.to(`role:security`).emit('alert:crowd', {
            stadiumId: stadium._id,
            stadiumName: stadium.name,
            zones: critical,
          });
          io.to(`role:staff`).emit('alert:crowd', {
            stadiumId: stadium._id,
            stadiumName: stadium.name,
            zones: critical,
          });
        }
      }
    } catch (error) {
      logger.error('Crowd broadcast error:', error.message);
    }
  };

  if (process.env.NODE_ENV !== 'test') {
    setInterval(broadcastCrowdUpdates, 15000);
  }

  return io;
};

export default initializeSocket;
