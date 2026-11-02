import express from 'express';
import leaderboardController from '../controllers/leaderboard.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', leaderboardController.getLeaderboard);
router.get('/rank', requireAuth, leaderboardController.getUserRank);

export default router;
