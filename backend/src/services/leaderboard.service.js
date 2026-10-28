import leaderboardRepository from '../repositories/leaderboard.repository.js';

export class LeaderboardService {
  getLeaderboard(limit = 10, difficulty = null) {
    return leaderboardRepository.getTopScores(limit, difficulty);
  }

  getUserRank(userId, difficulty = null) {
    return leaderboardRepository.getUserRank(userId, difficulty);
  }
}

export default new LeaderboardService();
