import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useEffect, useState } from 'react';
import { authService } from '../services/authService';
import { SwordLogoIcon, TrophyIcon } from '../components/Icons';

function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    score = 0,
    bossesDefeated = 0,
    difficulty = 'easy',
    gameOver = false,
    stopped = false
  } = location.state || {};

  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const result = await authService.getCurrentUser();
    if (result?.user) setUser(result.user);
  };

  const isGameOver = gameOver;

  return (
    <div className="app-screen">
      <Navbar username={user?.username} />

      <div style={{
        maxWidth: '560px',
        width: '100%',
        margin: '3rem auto',
        padding: '0 1.25rem',
        textAlign: 'center'
      }}>
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid rgba(114, 142, 109, 0.35)',
          borderRadius: '16px',
          padding: '2.5rem 2rem',
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            {isGameOver ? (
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 71, 87, 0.15)',
                border: '1px solid rgba(255, 71, 87, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '2rem' }}>⚔️</span>
              </div>
            ) : (
              <SwordLogoIcon size={56} color="#E5CD82" />
            )}
          </div>

          <h1 style={{
            color: isGameOver ? '#ff6b6b' : 'var(--color-gold)',
            fontSize: '2.2rem',
            fontWeight: 700,
            marginBottom: '0.4rem'
          }}>
            {isGameOver ? 'Game Over' : stopped ? 'Run Concluded' : 'Victory!'}
          </h1>

          <p style={{
            color: 'var(--color-sage)',
            fontSize: '0.96rem',
            marginBottom: '2rem'
          }}>
            {isGameOver
              ? 'Your HP reached zero in battle. Sharpen your mind and fight again!'
              : 'Well fought! Your session results have been recorded in the archives.'}
          </p>

          {/* Stats Box */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '1.25rem 1rem'
            }}>
              <div style={{ color: 'var(--color-sage)', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                Final Score
              </div>
              <div style={{ color: 'var(--color-gold)', fontSize: '2.4rem', fontWeight: 700, lineHeight: 1 }}>
                {score}
              </div>
            </div>

            <div style={{
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '1.25rem 1rem'
            }}>
              <div style={{ color: 'var(--color-sage)', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                Bosses Defeated
              </div>
              <div style={{ color: 'var(--color-cream)', fontSize: '2.4rem', fontWeight: 700, lineHeight: 1 }}>
                {bossesDefeated}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <button
              onClick={() => navigate('/difficulty')}
              style={{
                width: '100%',
                padding: '0.85rem',
                backgroundColor: 'var(--color-gold)',
                color: '#0B120A',
                fontWeight: 700,
                fontSize: '1rem',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Play Again
            </button>

            <button
              onClick={() => navigate('/leaderboard')}
              style={{
                width: '100%',
                padding: '0.8rem',
                backgroundColor: 'var(--bg-input)',
                color: 'var(--color-cream)',
                border: '1px solid var(--border-subtle)',
                fontWeight: 600,
                fontSize: '0.95rem',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              View Leaderboard
            </button>

            <button
              onClick={() => navigate('/home')}
              style={{
                width: '100%',
                padding: '0.8rem',
                backgroundColor: 'transparent',
                color: 'var(--color-sage)',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.92rem',
                cursor: 'pointer'
              }}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultsPage;
