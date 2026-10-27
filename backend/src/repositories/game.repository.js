import db from '../config/database.js';

export class GameRepository {
  createSession(userId, difficulty, initialData = {}) {
    const stmt = db.prepare(`
      INSERT INTO game_sessions (
        user_id,
        difficulty,
        score,
        boss_defeated,
        correct_answers,
        incorrect_answers,
        total_answers,
        player_health,
        boss_health,
        boss_level,
        boss_score,
        current_answer,
        current_question,
        completed
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    `);

    const result = stmt.run(
      userId,
      difficulty,
      initialData.score || 0,
      initialData.boss_defeated || 0,
      initialData.correct_answers || 0,
      initialData.incorrect_answers || 0,
      initialData.total_answers || 0,
      initialData.player_health !== undefined ? initialData.player_health : 100,
      initialData.boss_health !== undefined ? initialData.boss_health : 100,
      initialData.boss_level || 1,
      initialData.boss_score || 0,
      initialData.current_answer || null,
      initialData.current_question ? JSON.stringify(initialData.current_question) : null
    );

    return result.lastInsertRowid;
  }

  getSession(sessionId) {
    const stmt = db.prepare('SELECT * FROM game_sessions WHERE id = ?');
    return stmt.get(sessionId);
  }

  updateSession(sessionId, updates) {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(updates)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }

    values.push(sessionId);
    const stmt = db.prepare(`UPDATE game_sessions SET ${fields.join(', ')} WHERE id = ?`);
    return stmt.run(...values);
  }

  recordBossDefeat(userId, difficulty, bossLevel) {
    const stmt = db.prepare(`
      INSERT INTO boss_defeats (user_id, difficulty, boss_level)
      VALUES (?, ?, ?)
    `);
    return stmt.run(userId, difficulty, bossLevel);
  }

  getUserStats(userId) {
    let stmt = db.prepare('SELECT * FROM user_stats WHERE user_id = ?');
    let stats = stmt.get(userId);

    if (!stats) {
      stmt = db.prepare('INSERT INTO user_stats (user_id, best_score, total_games) VALUES (?, 0, 0)');
      stmt.run(userId);
      stmt = db.prepare('SELECT * FROM user_stats WHERE user_id = ?');
      stats = stmt.get(userId);
    }

    // Aggregate true aggregates from game_sessions to ensure accuracy
    const sessionAgg = db.prepare(`
      SELECT 
        COUNT(id) as total_sessions,
        COALESCE(MAX(score), 0) as max_session_score,
        COALESCE(SUM(boss_defeated), 0) as total_bosses_all_sessions,
        COALESCE(SUM(correct_answers), 0) as total_correct_all,
        COALESCE(SUM(total_answers), 0) as total_answers_all
      FROM game_sessions
      WHERE user_id = ?
    `).get(userId);

    const calculatedBestScore = Math.max(stats.best_score || 0, sessionAgg.max_session_score || 0);
    const totalGames = Math.max(stats.total_games || 0, sessionAgg.total_sessions || 0);
    const totalBosses = Math.max(stats.total_bosses_defeated || 0, sessionAgg.total_bosses_all_sessions || 0);

    return {
      ...stats,
      best_score: calculatedBestScore,
      total_bosses_defeated: totalBosses,
      total_games: totalGames,
      total_correct_answers: sessionAgg.total_correct_all,
      total_answers: sessionAgg.total_answers_all
    };
  }

  updateUserStats(userId, updates) {
    // Ensure row exists
    this.getUserStats(userId);

    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(updates)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }

    values.push(userId);
    const stmt = db.prepare(`UPDATE user_stats SET ${fields.join(', ')} WHERE user_id = ?`);
    return stmt.run(...values);
  }

  getUserHistory(userId, limit = 20) {
    const stmt = db.prepare(`
      SELECT 
        id,
        difficulty,
        score,
        boss_defeated,
        correct_answers,
        incorrect_answers,
        total_answers,
        player_health,
        boss_health,
        boss_level,
        completed,
        started_at,
        ended_at
      FROM game_sessions
      WHERE user_id = ?
      ORDER BY started_at DESC
      LIMIT ?
    `);
    return stmt.all(userId, limit);
  }
}

export default new GameRepository();
