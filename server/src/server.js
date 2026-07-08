import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import logger from './utils/logger.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import initializeSocket from './sockets/index.js';

import authRoutes from './routes/authRoutes.js';
import stadiumRoutes from './routes/stadiumRoutes.js';
import matchRoutes from './routes/matchRoutes.js';
import crowdRoutes from './routes/crowdRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import transportRoutes from './routes/transportRoutes.js';
import volunteerRoutes from './routes/volunteerRoutes.js';
import organizerRoutes from './routes/organizerRoutes.js';
import securityRoutes from './routes/securityRoutes.js';
import sustainabilityRoutes from './routes/sustainabilityRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import seedDatabase from './config/seedData.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const server = createServer(app);

// --- CORS Configuration ---
const allowedOrigins = [
  process.env.CORS_ORIGIN || 'http://localhost:5173',
  process.env.CLIENT_URL,
  // Cloud Run URLs
  /\.run\.app$/,
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (server-to-server, curl, health checks)
    if (!origin) return callback(null, true);
    const isAllowed = allowedOrigins.some((allowed) =>
      allowed instanceof RegExp ? allowed.test(origin) : allowed === origin
    );
    if (isAllowed) return callback(null, true);
    callback(null, true); // Permissive in dev; restrict in production as needed
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
};

const io = new Server(server, {
  cors: corsOptions,
});

app.set('io', io);
initializeSocket(io);

const startDB = async () => {
  if (process.env.NODE_ENV !== 'test') {
    await connectDB();
    // Auto-seed when using in-memory DB
    if (process.env.__MEMORY_DB__ === 'true') {
      await seedDatabase();
    }
  }
};
startDB();

// --- Security Middleware ---
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        fontSrc: ["'self'"],
        connectSrc: [
          "'self'",
          'https://generativelanguage.googleapis.com',
          'wss:',
          'ws:',
        ],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use('/api/', limiter);

// --- Dev request logging for auth debugging ---
if (process.env.NODE_ENV !== 'production') {
  app.use('/api/auth', (req, _res, next) => {
    logger.info(`[Auth] ${req.method} ${req.originalUrl}`, {
      body: req.body?.email ? { email: req.body.email, hasPassword: !!req.body.password } : {},
    });
    next();
  });
}

// --- Health Check Endpoints ---
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Smart Stadiums API is running', timestamp: new Date() });
});

app.get('/health/liveness', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'smart-stadiums-api' });
});

app.get('/health/readiness', async (req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;
  if (dbConnected) {
    res.status(200).json({ status: 'READY', db: 'connected' });
  } else {
    res.status(503).json({ status: 'NOT_READY', db: 'disconnected' });
  }
});

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/stadiums', stadiumRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/crowd', crowdRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/transport', transportRoutes);
app.use('/api/volunteer', volunteerRoutes);
app.use('/api/organizer', organizerRoutes);
app.use('/api/security', securityRoutes);
app.use('/api/sustainability', sustainabilityRoutes);
app.use('/api/notifications', notificationRoutes);

// --- Static Frontend ---
const frontendDist = path.join(__dirname, '../../client/dist');
app.use(express.static(frontendDist));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(frontendDist, 'index.html'), (err) => {
    if (err) next();
  });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  const activeServer = server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });

  const gracefulShutdown = (signal) => {
    logger.info(`Received ${signal}. Starting graceful shutdown...`);
    activeServer.close(async () => {
      logger.info('HTTP server closed.');
      try {
        await mongoose.connection.close();
        logger.info('Database connection closed.');
        process.exit(0);
      } catch (err) {
        logger.error('Error during database connection close:', err);
        process.exit(1);
      }
    });
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}

export { app, server, io };
