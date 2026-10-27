import db from '../config/database.js';

export class LeaderboardRepository {
  /**
   * Retrieves genuine registered users from the database with their scores.
   * Orders by best_score DESC, bosses_defeated DESC, total_games DESC, u.id ASC.
   * Supports filtering by difficulty ('easy', 'medium', 'difficult').
   */
  getTopScores(limit = 25, difficulty = null) {
    if (difficulty && difficulty.toLowerCase() !== 'all') {
      const stmt = db.prepare(`
        SELECT 
          u.id as user_id,
          u.username,
          COALESCE(MAX(gs.score), 0) as best_score,
          COALESCE(MAX(gs.boss_defeated), 0) as bosses_defeated,
          COALESCE(COUNT(gs.id), 0) as total_games
        FROM users u
        LEFT JOIN game_sessions gs ON gs.user_id = u.id AND LOWER(gs.difficulty) = LOWER(?)
        GROUP BY u.id, u.username
        ORDER BY best_score DESC, bosses_defeated DESC, total_games DESC, u.id ASC
        LIMIT ?
      `);
      return stmt.all(difficulty.toLowerCase(), limit);
    }

    const stmt = db.prepare(`
      SELECT 
        u.id as user_id,
        u.username,
        COALESCE(MAX(gs.score), us.best_score, 0) as best_score,
        COALESCE(MAX(gs.boss_defeated), us.total_bosses_defeated, 0) as bosses_defeated,
        COALESCE(COUNT(DISTINCT gs.id), us.total_games, 0) as total_games
      FROM users u
      LEFT JOIN game_sessions gs ON gs.user_id = u.id
      LEFT JOIN user_stats us ON us.user_id = u.id
      GROUP BY u.id, u.username
      ORDER BY best_score DESC, bosses_defeated DESC, total_games DESC, u.id ASC
      LIMIT ?
    `);

    return stmt.all(limit);
  }

  /**
   * Get rank of a specific user
   */
  getUserRank(userId, difficulty = null) {
    const list = this.getTopScores(1000, difficulty);
    const index = list.findIndex(entry => entry.user_id === userId);
    return index !== -1 ? index + 1 : list.length + 1;
  }
}

export default new LeaderboardRepository();
