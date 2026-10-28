import leaderboardService from '../services/leaderboard.service.js';

export class LeaderboardController {
  async getLeaderboard(req, res, next) {
    try {
      const limit = parseInt(req.query.limit, 10) || 10;
      const difficulty = req.query.difficulty || null;
      const leaderboard = leaderboardService.getLeaderboard(limit, difficulty);
      res.json({ leaderboard });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getUserRank(req, res, next) {
    try {
      const userId = req.session.userId;
      const difficulty = req.query.difficulty || null;
      const rank = leaderboardService.getUserRank(userId, difficulty);
      res.json({ rank });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new LeaderboardController();
