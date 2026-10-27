import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { authService } from '../services/authService';
import { leaderboardService } from '../services/leaderboardService';
import '../styles/leaderboard.css';

function LeaderboardPage() {
  const [user, setUser] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    loadLeaderboardData();
  }, [filter]);

  const loadUser = async () => {
    try {
      const userResult = await authService.getCurrentUser();
      if (userResult?.user) setUser(userResult.user);
    } catch (err) {
      console.error('Failed to load user:', err);
    }
  };

  const loadLeaderboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const diffParam = filter === 'all' ? null : filter;
      const result = await leaderboardService.getLeaderboard(25, diffParam);
      setLeaderboard(result?.leaderboard || []);
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
      setError('Unable to load leaderboard scores.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="leaderboard-screen">
      <Navbar username={user?.username} />

      <div className="leaderboard-container">
        <header className="leaderboard-header">
          <h1 className="leaderboard-title">Hall of Warriors</h1>
          <p className="leaderboard-subtitle">Top Math Masters and Boss Slayers</p>

          <div className="leaderboard-tabs">
            <button
              className={`leaderboard-tab-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Tiers
            </button>
            <button
              className={`leaderboard-tab-btn ${filter === 'easy' ? 'active' : ''}`}
              onClick={() => setFilter('easy')}
            >
              Easy
            </button>
            <button
              className={`leaderboard-tab-btn ${filter === 'medium' ? 'active' : ''}`}
              onClick={() => setFilter('medium')}
            >
              Medium
            </button>
            <button
              className={`leaderboard-tab-btn ${filter === 'difficult' ? 'active' : ''}`}
              onClick={() => setFilter('difficult')}
            >
              Difficult
            </button>
          </div>
        </header>

        <div className="leaderboard-card">
          {loading ? (
            <div className="leaderboard-empty">
              <p>Consulting the archives...</p>
            </div>
          ) : error ? (
            <div className="leaderboard-empty">
              <p style={{ color: '#ff6b6b' }}>{error}</p>
              <button
                onClick={loadLeaderboardData}
                style={{
                  marginTop: '1rem',
                  padding: '0.5rem 1.25rem',
                  backgroundColor: 'var(--color-gold)',
                  color: '#0B120A',
                  fontWeight: 700,
                  borderRadius: '6px'
                }}
              >
                Retry
              </button>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="leaderboard-empty">
              <h3 style={{ color: 'var(--color-cream)', marginBottom: '0.5rem' }}>No Warriors Yet</h3>
              <p>Be the first to step into the arena and claim the throne!</p>
              <button
                onClick={() => navigate('/difficulty')}
                style={{
                  marginTop: '1.25rem',
                  padding: '0.65rem 1.5rem',
                  backgroundColor: 'var(--color-gold)',
                  color: '#0B120A',
                  fontWeight: 700,
                  borderRadius: '8px'
                }}
              >
                Start Battle
              </button>
            </div>
          ) : (
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th style={{ width: '80px', textAlign: 'center' }}>Rank</th>
                  <th>Warrior</th>
                  <th>Best Score</th>
                  <th>Bosses Slain</th>
                  <th>Games Played</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, index) => {
                  const isCurrentUser = user && (user.username === entry.username || user.id === entry.user_id);
                  const rank = index + 1;

                  return (
                    <tr
                      key={entry.user_id || index}
                      className={`leaderboard-row ${isCurrentUser ? 'current-user' : ''}`}
                    >
                      <td style={{ textAlign: 'center' }}>
                        <span className={`rank-badge ${rank === 1 ? 'rank-1' : rank === 2 ? 'rank-2' : rank === 3 ? 'rank-3' : ''}`}>
                          {rank}
                        </span>
                      </td>
                      <td>
                        {entry.username} {isCurrentUser && <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>(You)</span>}
                      </td>
                      <td style={{ color: 'var(--color-gold)', fontWeight: 700 }}>
                        {entry.best_score || 0}
                      </td>
                      <td>{entry.bosses_defeated || 0}</td>
                      <td>{entry.total_games || 0}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button
            onClick={() => navigate('/home')}
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--color-cream)',
              border: '1px solid var(--border-sage)',
              fontWeight: 600,
              fontSize: '0.95rem',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default LeaderboardPage;
