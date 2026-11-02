import test from 'node:test';
import assert from 'node:assert/strict';
import { initDatabase, default as db } from '../src/config/database.js';
import authService from '../src/services/auth.service.js';
import gameService from '../src/services/game.service.js';
import leaderboardService from '../src/services/leaderboard.service.js';
import questionService from '../src/services/question.service.js';
import userRepository from '../src/repositories/user.repository.js';
import gameRepository from '../src/repositories/game.repository.js';

test('CalcStrike Core Suite', async (t) => {
  // Ensure DB initialized
  initDatabase();

  const testSuffix = Date.now().toString().slice(-6);
  const testUsername = `warrior_${testSuffix}`;
  const testEmail = `warrior_${testSuffix}@calcstrike.test`;
  const testPassword = 'Password123!';

  let testUserId = null;

  await t.test('1. Database Initialization & Schema', () => {
    const sessionCols = db.pragma('table_info(game_sessions)').map(c => c.name);
    assert.ok(sessionCols.includes('current_answer'), 'game_sessions must have current_answer');
    assert.ok(sessionCols.includes('player_health'), 'game_sessions must have player_health');
    assert.ok(sessionCols.includes('boss_health'), 'game_sessions must have boss_health');
    assert.ok(sessionCols.includes('boss_level'), 'game_sessions must have boss_level');

    const statsCols = db.pragma('table_info(user_stats)').map(c => c.name);
    assert.ok(statsCols.includes('best_score'), 'user_stats must have best_score');
    assert.ok(statsCols.includes('total_games'), 'user_stats must have total_games');
  });

  await t.test('2. User Registration and Duplicates', async () => {
    // Fresh user registration
    const user = await authService.register(testUsername, testEmail, testPassword);
    assert.ok(user.id, 'Registered user should have an ID');
    assert.equal(user.username, testUsername);
    testUserId = user.id;

    // Check password is encrypted, not plain text
    const dbUser = userRepository.findById(user.id);
    assert.notEqual(dbUser.password_hash, testPassword, 'Password must be hashed');
    assert.ok(dbUser.password_hash.startsWith('$2'), 'Should use bcrypt hash format');

    // Duplicate username rejection
    await assert.rejects(
      async () => {
        await authService.register(testUsername, `diff_${testEmail}`, 'NewPass123!');
      },
      /Username already exists/,
      'Duplicate username must be rejected'
    );

    // Duplicate email rejection
    await assert.rejects(
      async () => {
        await authService.register(`diff_${testUsername}`, testEmail, 'NewPass123!');
      },
      /Email already exists/,
      'Duplicate email must be rejected'
    );
  });

  await t.test('3. User Login', async () => {
    // Valid login
    const loggedIn = await authService.login(testUsername, testPassword);
    assert.equal(loggedIn.id, testUserId);
    assert.equal(loggedIn.username, testUsername);

    // Invalid password
    await assert.rejects(
      async () => {
        await authService.login(testUsername, 'WrongPassword!');
      },
      /Invalid credentials/,
      'Invalid password should reject'
    );

    // Non-existent username
    await assert.rejects(
      async () => {
        await authService.login('NonExistentWarrior999', 'AnyPass123!');
      },
      /Invalid credentials/,
      'Nonexistent username should reject'
    );
  });

  await t.test('4. Question Generation & Sanitization', async () => {
    // Procedural math generation
    const easyQ = questionService.generateQuestion('easy');
    assert.ok(easyQ.answer, 'Question must have answer on server');
    assert.equal(easyQ.type, 'math');

    // Client sanitization must NEVER leak the answer
    const sanitized = questionService.sanitizeForClient(easyQ, 'easy');
    assert.equal(sanitized.answer, undefined, 'Sanitized question must NOT contain answer');
    assert.equal(sanitized.solution, undefined, 'Sanitized question must NOT contain solution');
    assert.equal(sanitized.timerSeconds, 40, 'Easy question timer should be 40s');

    const hardQ = questionService.generateQuestion('difficult');
    const sanitizedHard = questionService.sanitizeForClient(hardQ, 'difficult');
    assert.equal(sanitizedHard.timerSeconds, 20, 'Difficult question timer should be 20s');
  });

  await t.test('5. Game Session Start and Initial State', async () => {
    const session = await gameService.startGame(testUserId, 'easy');
    assert.ok(session.sessionId, 'Should return sessionId');
    assert.equal(session.playerHealth, 100, 'Player starts with 100 HP');
    assert.equal(session.bossHealth, 100, 'Boss starts with 100 HP');
    assert.equal(session.bossLevel, 1, 'Initial boss level is 1');
    assert.equal(session.score, 0, 'Initial score is 0');
    assert.equal(session.question.answer, undefined, 'Session start must not leak question answer to client');

    // Verify database stores current_answer
    const dbSession = gameRepository.getSession(session.sessionId);
    assert.ok(dbSession.current_answer, 'Database must record current_answer for the session');
  });

  await t.test('6. Correct Answer Damage and Scoring', async () => {
    const session = await gameService.startGame(testUserId, 'easy');
    const dbSession = gameRepository.getSession(session.sessionId);
    const expected = dbSession.current_answer;

    // Submit correct answer
    const result = await gameService.submitAnswer(testUserId, session.sessionId, expected);
    assert.equal(result.isCorrect, true, 'Should evaluate as correct');
    assert.equal(result.scoreChange, 10, 'Correct answer awards 10 points');
    assert.equal(result.totalScore, 10);
    assert.equal(result.bossHealth, 75, 'Boss takes 25 damage (100 - 25 = 75)');
    assert.equal(result.playerHealth, 100, 'Player health unaffected on correct answer');
    assert.equal(result.correctAnswer, expected, 'Reveals correct answer only after evaluation');
  });

  await t.test('7. Wrong Answer and Timeout Penalties', async () => {
    const session = await gameService.startGame(testUserId, 'easy');

    // Wrong answer
    const wrongResult = await gameService.submitAnswer(testUserId, session.sessionId, '999999');
    assert.equal(wrongResult.isCorrect, false);
    assert.equal(wrongResult.playerHealth, 80, 'Player takes 20 damage on wrong answer (100 - 20 = 80)');
    assert.equal(wrongResult.bossHealth, 100, 'Boss health unchanged on wrong answer');

    // Timeout (empty string submission)
    const timeoutResult = await gameService.submitAnswer(testUserId, session.sessionId, '');
    assert.equal(timeoutResult.isCorrect, false);
    assert.equal(timeoutResult.playerHealth, 60, 'Player takes 20 damage on timeout (80 - 20 = 60)');
  });

  await t.test('8. Boss Defeat, Healing (+30 HP max 100) and New Boss Spawning', async () => {
    const session = await gameService.startGame(testUserId, 'easy');

    // Inflict 40 damage on player with 2 wrong answers (100 - 40 = 60 HP)
    await gameService.submitAnswer(testUserId, session.sessionId, 'wrong_ans_1');
    const wounded = await gameService.submitAnswer(testUserId, session.sessionId, 'wrong_ans_2');
    assert.equal(wounded.playerHealth, 60, 'Player health dropped to 60');

    // 4 correct answers deal 4 * 25 = 100 damage to defeat the boss
    for (let i = 0; i < 3; i++) {
      const dbSess = gameRepository.getSession(session.sessionId);
      await gameService.submitAnswer(testUserId, session.sessionId, dbSess.current_answer);
    }

    // 4th hit defeats the boss: 60 + 30 = 90 HP
    const fourthDbSess = gameRepository.getSession(session.sessionId);
    const finalHit = await gameService.submitAnswer(testUserId, session.sessionId, fourthDbSess.current_answer);

    assert.equal(finalHit.bossDefeated, true, 'Boss must be defeated when HP <= 0');
    assert.equal(finalHit.bossHealth, 100, 'New boss spawns with 100 HP');
    assert.equal(finalHit.bossLevel, 2, 'Boss level increments to 2');
    assert.equal(finalHit.bossesDefeated, 1, 'Bosses defeated counter increments');
    assert.equal(finalHit.playerHealth, 90, 'Player health must increase by 30 when boss is defeated (60 + 30 = 90)');
    assert.equal(finalHit.healthGained, 30, 'Health gained should be 30');

    // Test capping at 100 HP: player is at 90 HP, defeat second boss -> 90 + 30 = 120, but capped at 100!
    for (let i = 0; i < 3; i++) {
      const dbSess = gameRepository.getSession(session.sessionId);
      await gameService.submitAnswer(testUserId, session.sessionId, dbSess.current_answer);
    }
    const boss2DbSess = gameRepository.getSession(session.sessionId);
    const boss2Defeat = await gameService.submitAnswer(testUserId, session.sessionId, boss2DbSess.current_answer);
    assert.equal(boss2Defeat.bossDefeated, true);
    assert.equal(boss2Defeat.playerHealth, 100, 'Player health must NOT exceed 100 after healing (+30 on 90 caps at 100)');
  });

  await t.test('9. Game Over and Submission Lock', async () => {
    const session = await gameService.startGame(testUserId, 'easy');

    // 5 wrong answers will drop player HP from 100 to 0 (5 * 20 = 100 damage)
    let lastResult;
    for (let i = 0; i < 5; i++) {
      lastResult = await gameService.submitAnswer(testUserId, session.sessionId, 'wrong_ans');
    }

    assert.equal(lastResult.playerHealth, 0, 'Player HP reaches 0');
    assert.equal(lastResult.gameOver, true, 'Game must be marked over');

    const dbSess = gameRepository.getSession(session.sessionId);
    assert.equal(dbSess.completed, 1, 'Session should be marked completed in DB');

    // Attempting further answers on ended session must be rejected
    await assert.rejects(
      async () => {
        await gameService.submitAnswer(testUserId, session.sessionId, 'any_answer');
      },
      /Game session has already ended/,
      'Submissions to completed game must be rejected'
    );
  });

  await t.test('10. Stop Playing and Best Score Preservation', async () => {
    const session = await gameService.startGame(testUserId, 'easy');
    const dbSess = gameRepository.getSession(session.sessionId);

    // Get 100 points
    for (let i = 0; i < 4; i++) {
      const s = gameRepository.getSession(session.sessionId);
      await gameService.submitAnswer(testUserId, session.sessionId, s.current_answer);
    }
    // Slay boss: 40 pts + 50 bonus = 90 pts

    await gameService.stopGame(testUserId, session.sessionId);
    const statsAfterFirst = gameService.getStats(testUserId);
    assert.ok(statsAfterFirst.best_score >= 90, 'Best score should be recorded');

    const initialBest = statsAfterFirst.best_score;

    // Start a second session and only score 10 pts
    const session2 = await gameService.startGame(testUserId, 'easy');
    const s2 = gameRepository.getSession(session2.sessionId);
    await gameService.submitAnswer(testUserId, session2.sessionId, s2.current_answer);
    await gameService.stopGame(testUserId, session2.sessionId);

    const statsAfterSecond = gameService.getStats(testUserId);
    assert.equal(
      statsAfterSecond.best_score,
      initialBest,
      'Lower score must NEVER overwrite higher best score'
    );
  });

  await t.test('11. Leaderboard Ranking & Difficulty Filter', async () => {
    // Leaderboard all
    const allBoard = leaderboardService.getLeaderboard(10, 'all');
    assert.ok(Array.isArray(allBoard), 'Leaderboard must return an array');
    assert.ok(allBoard.length > 0, 'Leaderboard should include our warrior');

    // Check descending best_score order
    for (let i = 0; i < allBoard.length - 1; i++) {
      assert.ok(
        allBoard[i].best_score >= allBoard[i + 1].best_score,
        'Leaderboard must be sorted by best score descending'
      );
    }

    // Difficulty filter
    const easyBoard = leaderboardService.getLeaderboard(10, 'easy');
    assert.ok(Array.isArray(easyBoard));
    const warriorEntry = easyBoard.find(e => e.username === testUsername);
    assert.ok(warriorEntry, 'Warrior should appear in Easy leaderboard after playing easy games');

    // Clean up test user so test accounts never pollute real database
    if (testUserId) {
      db.prepare('DELETE FROM game_sessions WHERE user_id = ?').run(testUserId);
      db.prepare('DELETE FROM user_stats WHERE user_id = ?').run(testUserId);
      db.prepare('DELETE FROM boss_defeats WHERE user_id = ?').run(testUserId);
      db.prepare('DELETE FROM users WHERE id = ?').run(testUserId);
    }
  });
});
