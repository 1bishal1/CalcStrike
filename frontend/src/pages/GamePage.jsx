import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { authService } from '../services/authService';
import { gameService } from '../services/gameService';
import { WarriorAvatar, BossAvatar, ClockIcon } from '../components/Icons';
import '../styles/game.css';

function GamePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const difficulty = (location.state?.difficulty || 'easy').toLowerCase();

  const [user, setUser] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null); // { isCorrect, text }
  const [error, setError] = useState('');
  const [showStopModal, setShowStopModal] = useState(false);

  // Timer configuration
  const defaultSeconds = difficulty === 'difficult' ? 20 : difficulty === 'medium' ? 30 : 40;
  const [timerMax, setTimerMax] = useState(defaultSeconds);
  const [timeLeft, setTimeLeft] = useState(defaultSeconds);

  const submittingRef = useRef(false);

  useEffect(() => {
    loadUserAndStartGame();
  }, []);

  const loadUserAndStartGame = async () => {
    try {
      setLoading(true);
      setError('');
      const userResult = await authService.getCurrentUser();
      if (userResult?.user) setUser(userResult.user);

      const result = await gameService.startGame(difficulty);

      setGameState({
        sessionId: result.sessionId,
        playerHealth: result.playerHealth,
        bossHealth: result.bossHealth,
        bossLevel: result.bossLevel,
        score: result.score || 0,
        bossesDefeated: result.bossesDefeated || 0
      });

      const maxSec = result.timerSeconds || defaultSeconds;
      setTimerMax(maxSec);
      setTimeLeft(maxSec);
      setCurrentQuestion(result.question);
      setLoading(false);
    } catch (err) {
      console.error('Failed to start game:', err);
      setError(err.message || 'Failed to start game session. Please check your connection.');
      setLoading(false);
    }
  };

  // Timer countdown hook
  useEffect(() => {
    if (loading || submitting || feedback || error || showStopModal || !gameState) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [loading, submitting, feedback, error, showStopModal, currentQuestion, gameState]);

  // Handle timeout as a wrong answer
  const handleTimeout = async () => {
    if (submittingRef.current || !gameState) return;
    submittingRef.current = true;
    setSubmitting(true);

    try {
      const result = await gameService.submitAnswer(gameState.sessionId, '');

      setFeedback({
        isCorrect: false,
        text: `Time's up! Penalty: -20 HP. Correct answer was: ${result.correctAnswer}`
      });

      setGameState(prev => ({
        ...prev,
        playerHealth: result.playerHealth,
        bossHealth: result.bossHealth,
        bossLevel: result.bossLevel,
        score: result.totalScore,
        bossesDefeated: result.bossesDefeated
      }));

      setTimeout(() => {
        if (result.gameOver) {
          navigate('/results', {
            state: {
              score: result.totalScore,
              bossesDefeated: result.bossesDefeated,
              difficulty,
              gameOver: true
            }
          });
        } else if (result.nextQuestion) {
          setFeedback(null);
          setAnswer('');
          setCurrentQuestion(result.nextQuestion);
          const nextMax = result.nextQuestion.timerSeconds || timerMax;
          setTimerMax(nextMax);
          setTimeLeft(nextMax);
          submittingRef.current = false;
          setSubmitting(false);
        }
      }, 2000);
    } catch (err) {
      console.error('Timeout submission error:', err);
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  // Handle user manual answer submission
  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (submittingRef.current || submitting || feedback || !gameState) return;

    submittingRef.current = true;
    setSubmitting(true);

    try {
      const result = await gameService.submitAnswer(gameState.sessionId, answer.trim());

      let feedbackMsg = '';
      if (result.isCorrect) {
        if (result.bossDefeated) {
          const healText = result.healthGained > 0
            ? ` Healed +${result.healthGained} HP!`
            : ' (HP already at 100 max!)';
          feedbackMsg = `Boss Defeated! +50 Bonus Points!${healText} A new challenger approaches!`;
        } else {
          feedbackMsg = `Correct! Boss took 25 damage! (+${result.scoreChange} pts)`;
        }
      } else {
        feedbackMsg = `Incorrect! Player took 20 damage. Correct answer was: ${result.correctAnswer}`;
      }

      setFeedback({
        isCorrect: result.isCorrect,
        text: feedbackMsg
      });

      setGameState(prev => ({
        ...prev,
        playerHealth: result.playerHealth,
        bossHealth: result.bossHealth,
        bossLevel: result.bossLevel,
        score: result.totalScore,
        bossesDefeated: result.bossesDefeated
      }));

      setTimeout(() => {
        if (result.gameOver) {
          navigate('/results', {
            state: {
              score: result.totalScore,
              bossesDefeated: result.bossesDefeated,
              difficulty,
              gameOver: true
            }
          });
        } else if (result.nextQuestion) {
          setFeedback(null);
          setAnswer('');
          setCurrentQuestion(result.nextQuestion);
          const nextMax = result.nextQuestion.timerSeconds || timerMax;
          setTimerMax(nextMax);
          setTimeLeft(nextMax);
          submittingRef.current = false;
          setSubmitting(false);
        }
      }, 2000);
    } catch (err) {
      console.error('Submit answer error:', err);
      setError(err.message || 'Failed to submit answer.');
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  // Stop playing run
  const handleConfirmStop = async () => {
    setShowStopModal(false);
    if (!gameState) {
      navigate('/results', { state: { score: 0, bossesDefeated: 0, difficulty } });
      return;
    }

    try {
      const result = await gameService.stopGame(gameState.sessionId);
      navigate('/results', {
        state: {
          score: result.score || gameState.score || 0,
          bossesDefeated: result.bossesDefeated || gameState.bossesDefeated || 0,
          difficulty,
          stopped: true
        }
      });
    } catch (err) {
      navigate('/results', {
        state: {
          score: gameState.score || 0,
          bossesDefeated: gameState.bossesDefeated || 0,
          difficulty,
          stopped: true
        }
      });
    }
  };

  // Timer circle calculation
  const circleRadius = 26;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeOffset = circumference - (timeLeft / timerMax) * circumference;

  if (loading) {
    return (
      <div className="battle-screen">
        <Navbar username={user?.username} />
        <div style={{ textAlign: 'center', color: 'var(--color-cream)', padding: '5rem 1rem' }}>
          <h2 style={{ color: 'var(--color-gold)', marginBottom: '1rem' }}>Entering the Battle Arena...</h2>
          <p style={{ color: 'var(--color-sage)' }}>Summoning the boss and preparing equations.</p>
        </div>
      </div>
    );
  }

  if (error && !currentQuestion) {
    return (
      <div className="battle-screen">
        <Navbar username={user?.username} />
        <div style={{ maxWidth: '480px', margin: '4rem auto', textAlign: 'center' }}>
          <div style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid rgba(255, 71, 87, 0.4)',
            borderRadius: '14px',
            padding: '2rem'
          }}>
            <h2 style={{ color: '#ff6b6b', marginBottom: '1rem' }}>Connection Notice</h2>
            <p style={{ color: 'var(--color-cream)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>{error}</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={loadUserAndStartGame}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: 'var(--color-gold)',
                  color: '#0B120A',
                  fontWeight: 700,
                  borderRadius: '8px'
                }}
              >
                Retry
              </button>
              <button
                onClick={() => navigate('/home')}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: 'var(--bg-input)',
                  color: 'var(--color-cream)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px'
                }}
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const playerHealthPct = Math.max(0, Math.min(100, gameState?.playerHealth ?? 100));
  const bossHealthPct = Math.max(0, Math.min(100, gameState?.bossHealth ?? 100));

  return (
    <div className="battle-screen">
      <div className="battle-container">
        {/* Top bar with level and Stop button */}
        <div className="battle-topbar">
          <div style={{ color: 'var(--color-sage)', fontSize: '0.9rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span>CalcStrike</span>
            <span>•</span>
            <span style={{ color: 'var(--color-gold)', fontWeight: 600, textTransform: 'capitalize' }}>
              {difficulty} Mode
            </span>
            <span>•</span>
            <span style={{ color: 'var(--color-cream)' }}>
              Boss Level {gameState?.bossLevel || 1}
            </span>
          </div>

          <button
            className="battle-stop-btn"
            onClick={() => setShowStopModal(true)}
          >
            Stop Playing
          </button>
        </div>

        {/* Top HUD Bar (Matches Image 2) */}
        <header className="battle-hud">
          {/* Player Entity */}
          <div className="hud-entity player">
            <WarriorAvatar size={48} />
            <div className="hud-entity-info">
              <span className="hud-entity-name">You</span>
              <div className="hud-hp-bar-outer">
                <div
                  className="hud-hp-bar-inner player"
                  style={{ width: `${playerHealthPct}%` }}
                />
              </div>
              <span className="hud-hp-text">HP {gameState?.playerHealth ?? 100}/100</span>
            </div>
          </div>

          {/* Center Metrics & Timer Ring */}
          <div className="hud-center">
            <div className="hud-stat-box">
              <span className="hud-stat-label">Score</span>
              <span className="hud-stat-val" style={{ color: 'var(--color-gold)' }}>
                {gameState?.score || 0}
              </span>
            </div>

            <div className="hud-stat-divider" />

            <div className="hud-stat-box">
              <span className="hud-stat-label">Bosses Defeated</span>
              <span className="hud-stat-val">
                {gameState?.bossesDefeated || 0}
              </span>
            </div>

            {/* Circular Timer Ring */}
            <div className="hud-timer-circle">
              <svg width="64" height="64">
                <circle
                  cx="32"
                  cy="32"
                  r={circleRadius}
                  stroke="#294228"
                  strokeWidth="4"
                  fill="transparent"
                />
                <circle
                  cx="32"
                  cy="32"
                  r={circleRadius}
                  stroke={timeLeft <= 10 ? '#ff4757' : '#E5CD82'}
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeOffset}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.8s linear, stroke 0.3s ease' }}
                />
              </svg>
              <div className="hud-timer-value">
                <span className="hud-timer-number" style={{ color: timeLeft <= 10 ? '#ff4757' : '#E5CD82' }}>
                  {timeLeft}
                </span>
                <span className="hud-timer-unit">s</span>
              </div>
            </div>
          </div>

          {/* Boss Entity */}
          <div className="hud-entity boss">
            <div className="hud-entity-info" style={{ textAlign: 'right' }}>
              <span className="hud-entity-name">Boss</span>
              <div className="hud-hp-bar-outer">
                <div
                  className="hud-hp-bar-inner boss"
                  style={{ width: `${bossHealthPct}%` }}
                />
              </div>
              <span className="hud-hp-text">HP {gameState?.bossHealth ?? 100}/100</span>
            </div>
            <BossAvatar size={48} />
          </div>
        </header>

        {/* Main 2-Card Battle Grid (Matches Image 2) */}
        <main className="battle-main-grid">
          {/* Left Card: Question Canvas */}
          <div className="battle-card">
            <div className="battle-question-box">
              {currentQuestion?.questionImage ? (
                <img
                  src={currentQuestion.questionImage}
                  alt="Banana Math Equation"
                  className="battle-question-img"
                />
              ) : (
                <div className="battle-question-equation">
                  {currentQuestion?.questionText || 'Loading challenge...'}
                </div>
              )}
            </div>
          </div>

          {/* Right Card: Answer Input & Submit */}
          <div className="battle-card">
            <form onSubmit={handleSubmitAnswer} className="battle-answer-form">
              <input
                type="text"
                className="battle-answer-input"
                placeholder="Enter your answer..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={submitting || !!feedback}
                autoFocus
              />

              <button
                type="submit"
                className="battle-submit-btn"
                disabled={submitting || !!feedback || !answer.trim()}
              >
                {submitting ? 'Evaluating...' : 'Submit Answer'}
              </button>
            </form>
          </div>
        </main>

        {/* Feedback Banner */}
        {feedback && (
          <div className={`battle-feedback-banner ${feedback.isCorrect ? 'correct' : 'wrong'}`}>
            {feedback.text}
          </div>
        )}

        {/* Bottom Status Bar */}
        <footer className="battle-bottom-bar">
          <div className="battle-time-indicator">
            <ClockIcon size={18} color="#E5CD82" />
            <span>Time left: {timeLeft} seconds</span>
          </div>
        </footer>
      </div>

      {/* Stop Playing Confirmation Dialog */}
      {showStopModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 style={{ color: 'var(--color-cream)', fontSize: '1.4rem', marginBottom: '0.75rem' }}>
              Stop Playing?
            </h3>
            <p style={{ color: 'var(--color-sage)', fontSize: '0.95rem', lineHeight: 1.5 }}>
              Are you sure you want to stop? Your current progress and score will be safely recorded.
            </p>
            <div className="modal-actions">
              <button
                className="modal-btn cancel"
                onClick={() => setShowStopModal(false)}
              >
                Cancel
              </button>
              <button
                className="modal-btn confirm"
                onClick={handleConfirmStop}
              >
                Yes, Stop
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GamePage;
