import api from './api';

export const leaderboardService = {
  async getLeaderboard(limit = 10, difficulty = null) {
    let url = `/leaderboard?limit=${limit}`;
    if (difficulty) url += `&difficulty=${difficulty}`;
    return api.get(url);
  },

  async getUserRank() {
    return api.get('/leaderboard/rank');
  }
};
