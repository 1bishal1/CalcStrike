import gameRepository from '../repositories/game.repository.js';
import questionService from './question.service.js';

export class GameService {
  /**
   * Start a new game session.
   * Fetches an initial question, stores its expected answer in the database,
   * and returns the sanitized question to the client without exposing the answer.
   */
  async startGame(userId, difficulty = 'easy') {
    const diff = (difficulty || 'easy').toLowerCase();
    const initialQuestion = await questionService.getQuestion(diff);

    const sessionId = gameRepository.createSession(userId, diff, {
      player_health: 100,
      boss_health: 100,
      boss_level: 1,
      boss_score: 0,
      score: 0,
      correct_answers: 0,
      incorrect_answers: 0,
      total_answers: 0,
      boss_defeated: 0,
      current_answer: initialQuestion.answer,
      current_question: initialQuestion
    });

    const sanitized = questionService.sanitizeForClient(initialQuestion, diff);

    return {
      sessionId,
      difficulty: diff,
      question: sanitized,
      playerHealth: 100,
      bossHealth: 100,
      bossLevel: 1,
      score: 0,
      bossesDefeated: 0,
      timerSeconds: sanitized.timerSeconds
    };
  }

  /**
   * Submit an answer to the current question for the session.
   * Compares against the expected answer stored in the database.
   */
  async submitAnswer(userId, sessionId, answer) {
    const session = gameRepository.getSession(sessionId);

    if (!session) {
      throw new Error('Game session not found');
    }

    if (session.user_id !== userId) {
      throw new Error('Unauthorized');
    }

    if (session.completed === 1 || session.player_health <= 0) {
      throw new Error('Game session has already ended');
    }

    const diff = (session.difficulty || 'easy').toLowerCase();

    // The expected answer is stored in the session record
    const expectedAnswer = (session.current_answer || '').toString().trim();

    // Check correctness (non-empty submitted answer that matches expected)
    const submittedStr = (answer !== undefined && answer !== null) ? answer.toString().trim() : '';
    const isCorrect = submittedStr !== '' && submittedStr.toLowerCase() === expectedAnswer.toLowerCase();

    let playerHealth = Math.max(0, session.player_health ?? 100);
    let bossHealth = Math.max(0, session.boss_health ?? 100);
    let bossLevel = session.boss_level || 1;
    let bossesDefeatedCount = session.boss_defeated || 0;
    let bossScore = session.boss_score || 0;
    let scoreChange = 0;
    let bossDefeated = false;

    // Difficulty score rewards
    const scorePerCorrect = diff === 'difficult' ? 20 : diff === 'medium' ? 15 : 10;
    const playerDamageTaken = diff === 'difficult' ? 30 : diff === 'medium' ? 25 : 20;
    const bossDamageDealt = 25;

    if (isCorrect) {
      scoreChange = scorePerCorrect;
      bossHealth = Math.max(0, bossHealth - bossDamageDealt);
    } else {
      scoreChange = 0;
      playerHealth = Math.max(0, playerHealth - playerDamageTaken);
      bossScore += 1; // Boss gains 1 point on wrong answer/timeout
    }

    // Check boss defeat
    let healthGained = 0;
    if (bossHealth <= 0 && isCorrect) {
      bossDefeated = true;
      scoreChange += 50; // Bonus for slaying the boss
      bossesDefeatedCount += 1;
      gameRepository.recordBossDefeat(userId, session.difficulty, bossLevel);

      // Player health increases by 30 if less than 100, not exceeding 100
      if (playerHealth < 100) {
        const oldHealth = playerHealth;
        playerHealth = Math.min(100, playerHealth + 30);
        healthGained = playerHealth - oldHealth;
      }

      // New boss spawns with 100 HP
      bossHealth = 100;
      bossLevel += 1;
    }

    const newScore = (session.score || 0) + scoreChange;
    const newCorrect = (session.correct_answers || 0) + (isCorrect ? 1 : 0);
    const newIncorrect = (session.incorrect_answers || 0) + (isCorrect ? 0 : 1);
    const newTotal = (session.total_answers || 0) + 1;
    const isGameOver = playerHealth <= 0;

    // Fetch next question if game is still active
    let nextQuestionData = null;
    let sanitizedNext = null;
    if (!isGameOver) {
      try {
        nextQuestionData = await questionService.getQuestion(diff);
        sanitizedNext = questionService.sanitizeForClient(nextQuestionData, diff);
      } catch (err) {
        console.warn('Fallback to procedural question on nextQuestion error:', err.message);
        nextQuestionData = questionService.generateQuestion(diff);
        sanitizedNext = questionService.sanitizeForClient(nextQuestionData, diff);
      }
    }

    // Update database session
    gameRepository.updateSession(sessionId, {
      score: newScore,
      correct_answers: newCorrect,
      incorrect_answers: newIncorrect,
      total_answers: newTotal,
      boss_defeated: bossesDefeatedCount,
      boss_score: bossScore,
      player_health: playerHealth,
      boss_health: bossHealth,
      boss_level: bossLevel,
      current_answer: nextQuestionData ? nextQuestionData.answer : null,
      current_question: nextQuestionData ? JSON.stringify(nextQuestionData) : null,
      completed: isGameOver ? 1 : 0,
      ended_at: isGameOver ? new Date().toISOString() : null
    });

    // Update overall user stats and ensure best_score only increases
    const currentStats = gameRepository.getUserStats(userId);
    const newBestScore = Math.max(currentStats.best_score || 0, newScore);

    gameRepository.updateUserStats(userId, {
      best_score: newBestScore,
      total_score: (currentStats.total_score || 0) + scoreChange,
      total_bosses_defeated: (currentStats.total_bosses_defeated || 0) + (bossDefeated ? 1 : 0),
      total_correct_answers: (currentStats.total_correct_answers || 0) + (isCorrect ? 1 : 0),
      total_answers: (currentStats.total_answers || 0) + 1,
      total_games: isGameOver ? (currentStats.total_games || 0) + 1 : currentStats.total_games
    });

    return {
      isCorrect,
      correctAnswer: expectedAnswer, // reveal only after answer was evaluated
      playerHealth,
      bossHealth,
      bossLevel,
      bossDefeated,
      bossesDefeated: bossesDefeatedCount,
      scoreChange,
      healthGained,
      totalScore: newScore,
      gameOver: isGameOver,
      nextQuestion: sanitizedNext
    };
  }

  /**
   * Stop playing and end the run cleanly
   */
  async stopGame(userId, sessionId) {
    const session = gameRepository.getSession(sessionId);
    if (!session || session.user_id !== userId) {
      throw new Error('Unauthorized');
    }

    if (session.completed === 0) {
      gameRepository.updateSession(sessionId, {
        completed: 1,
        ended_at: new Date().toISOString()
      });

      const stats = gameRepository.getUserStats(userId);
      const newBestScore = Math.max(stats.best_score || 0, session.score || 0);

      gameRepository.updateUserStats(userId, {
        best_score: newBestScore,
        total_games: (stats.total_games || 0) + 1
      });
    }

    return {
      success: true,
      score: session.score,
      bossesDefeated: session.boss_defeated,
      difficulty: session.difficulty
    };
  }

  /**
   * Retrieve player statistics
   */
  getStats(userId) {
    return gameRepository.getUserStats(userId);
  }

  /**
   * Retrieve player session history
   */
  getHistory(userId, limit = 20) {
    return gameRepository.getUserHistory(userId, limit);
  }
}

export default new GameService();
