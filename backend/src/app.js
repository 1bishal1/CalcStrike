import express from 'express';
import cors from 'cors';
import session from 'express-session';
import { sessionConfig } from './config/session.js';
import { initDatabase } from './config/database.js';
import authRoutes from './routes/auth.routes.js';
import gameRoutes from './routes/game.routes.js';
import leaderboardRoutes from './routes/leaderboard.routes.js';
import { errorHandler } from './middleware/error.middleware.js';

const app = express();

// Initialize database
initDatabase();

// Middleware
const allowedOrigins = [process.env.CLIENT_URL, 'http://localhost:5173', 'http://localhost:5174'].filter(Boolean);
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session(sessionConfig));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handler
app.use(errorHandler);

export default app;
