import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { authService } from '../services/authService';
import { gameService } from '../services/gameService';
import { HomeIcon, PlayIcon, TrophyIcon, UserIcon } from '../components/Icons';

function HomePage() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    best_score: 0,
    total_score: 0,
    total_bosses_defeated: 0,
    total_games: 0
  });
  const [activeTab, setActiveTab] = useState('home');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userResult = await authService.getCurrentUser();
      if (userResult?.user) {
        setUser(userResult.user);
        const statsResult = await gameService.getStats();
        if (statsResult?.stats) {
          setStats(statsResult.stats);
        }
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  return (
    <div className="app-screen">
      <Navbar username={user?.username} />

      <div style={{
        maxWidth: '1050px',
        width: '100%',
        margin: '2rem auto',
        padding: '0 1.25rem',
        display: 'grid',
        gridTemplateColumns: '220px 1fr',
        gap: '1.5rem',
        alignItems: 'start'
      }}>
        {/* Left Navigation Sidebar */}
        <aside style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '14px',
          border: '1px solid rgba(114, 142, 109, 0.3)',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          <button
            onClick={() => { setActiveTab('home'); setShowProfileModal(false); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              backgroundColor: activeTab === 'home' && !showProfileModal ? 'rgba(114, 142, 109, 0.25)' : 'transparent',
              color: activeTab === 'home' && !showProfileModal ? 'var(--color-cream)' : 'var(--color-sage)',
              fontWeight: 600,
              fontSize: '0.95rem',
              textAlign: 'left',
              width: '100%'
            }}
          >
            <HomeIcon size={20} color={activeTab === 'home' && !showProfileModal ? '#FFF2B4' : '#728E6D'} />
            <span>Home</span>
          </button>

          <button
            onClick={() => navigate('/difficulty')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              backgroundColor: 'transparent',
              color: 'var(--color-sage)',
              fontWeight: 600,
              fontSize: '0.95rem',
              textAlign: 'left',
              width: '100%'
            }}
          >
            <PlayIcon size={20} color="#728E6D" />
            <span>Play Game</span>
          </button>

          <button
            onClick={() => navigate('/leaderboard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              backgroundColor: 'transparent',
              color: 'var(--color-sage)',
              fontWeight: 600,
              fontSize: '0.95rem',
              textAlign: 'left',
              width: '100%'
            }}
          >
            <TrophyIcon size={20} color="#728E6D" />
            <span>Leaderboard</span>
          </button>

          <button
            onClick={() => setShowProfileModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              backgroundColor: showProfileModal ? 'rgba(114, 142, 109, 0.25)' : 'transparent',
              color: showProfileModal ? 'var(--color-cream)' : 'var(--color-sage)',
              fontWeight: 600,
              fontSize: '0.95rem',
              textAlign: 'left',
              width: '100%'
            }}
          >
            <UserIcon size={20} color={showProfileModal ? '#FFF2B4' : '#728E6D'} />
            <span>Profile</span>
          </button>
        </aside>

        {/* Main Content Area */}
        <main>
          {showProfileModal ? (
            <div style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid rgba(114, 142, 109, 0.3)',
              borderRadius: '16px',
              padding: '2rem 2.25rem',
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.5)'
            }}>
              <h2 style={{ color: 'var(--color-cream)', fontSize: '1.6rem', marginBottom: '0.5rem' }}>
                Warrior Profile
              </h2>
              <p style={{ color: 'var(--color-sage)', marginBottom: '1.75rem', fontSize: '0.95rem' }}>
                Your account statistics and warrior pedigree.
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '1rem',
                marginBottom: '1.75rem'
              }}>
                <div style={{ backgroundColor: 'var(--bg-input)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ color: 'var(--color-sage)', fontSize: '0.85rem' }}>Username</div>
                  <div style={{ color: 'var(--color-cream)', fontSize: '1.1rem', fontWeight: 600 }}>{user?.username}</div>
                </div>
                <div style={{ backgroundColor: 'var(--bg-input)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ color: 'var(--color-sage)', fontSize: '0.85rem' }}>Email</div>
                  <div style={{ color: 'var(--color-cream)', fontSize: '1.1rem', fontWeight: 600 }}>{user?.email}</div>
                </div>
                <div style={{ backgroundColor: 'var(--bg-input)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ color: 'var(--color-sage)', fontSize: '0.85rem' }}>Best Score</div>
                  <div style={{ color: 'var(--color-gold)', fontSize: '1.2rem', fontWeight: 700 }}>{stats.best_score || 0}</div>
                </div>
                <div style={{ backgroundColor: 'var(--bg-input)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ color: 'var(--color-sage)', fontSize: '0.85rem' }}>Total Bosses Slain</div>
                  <div style={{ color: 'var(--color-cream)', fontSize: '1.2rem', fontWeight: 700 }}>{stats.total_bosses_defeated || 0}</div>
                </div>
              </div>

              <button
                onClick={() => setShowProfileModal(false)}
                style={{
                  padding: '0.65rem 1.5rem',
                  backgroundColor: 'var(--color-gold)',
                  color: '#0B120A',
                  fontWeight: 700,
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Back to Dashboard
              </button>
            </div>
          ) : (
            <div style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid rgba(114, 142, 109, 0.3)',
              borderRadius: '16px',
              padding: '2.25rem 2.5rem',
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.5)'
            }}>
              <h2 style={{
                color: 'var(--color-cream)',
                fontSize: '1.85rem',
                fontWeight: 700,
                marginBottom: '0.35rem'
              }}>
                Welcome back, {user?.username || 'warrior'}!
              </h2>
              <p style={{
                color: 'var(--color-sage)',
                fontSize: '0.96rem',
                marginBottom: '2rem'
              }}>
                Sharpen your mind. Defeat the bosses. Claim the throne.
              </p>

              {/* 3 Stat Cards in a row */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1.25rem',
                marginBottom: '2rem'
              }}>
                <div style={{
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '1.25rem 1rem',
                  textAlign: 'left'
                }}>
                  <div style={{ color: 'var(--color-sage)', fontSize: '0.88rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                    Best Score
                  </div>
                  <div style={{ color: 'var(--color-gold)', fontSize: '2.5rem', fontWeight: 700, lineHeight: 1 }}>
                    {stats.best_score || 0}
                  </div>
                </div>

                <div style={{
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '1.25rem 1rem',
                  textAlign: 'left'
                }}>
                  <div style={{ color: 'var(--color-sage)', fontSize: '0.88rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                    Bosses Defeated
                  </div>
                  <div style={{ color: 'var(--color-cream)', fontSize: '2.5rem', fontWeight: 700, lineHeight: 1 }}>
                    {stats.total_bosses_defeated || 0}
                  </div>
                </div>

                <div style={{
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '1.25rem 1rem',
                  textAlign: 'left'
                }}>
                  <div style={{ color: 'var(--color-sage)', fontSize: '0.88rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                    Total Games
                  </div>
                  <div style={{ color: 'var(--color-cream)', fontSize: '2.5rem', fontWeight: 700, lineHeight: 1 }}>
                    {stats.total_games || 0}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <button
                  onClick={() => navigate('/difficulty')}
                  style={{
                    width: '100%',
                    padding: '0.9rem',
                    backgroundColor: 'var(--color-gold)',
                    color: '#0B120A',
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    borderRadius: '10px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(229, 205, 130, 0.25)'
                  }}
                >
                  Start Game
                </button>

                <button
                  onClick={() => navigate('/leaderboard')}
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    backgroundColor: 'var(--bg-input)',
                    color: 'var(--color-cream)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderRadius: '10px',
                    cursor: 'pointer'
                  }}
                >
                  View Leaderboard
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default HomePage;
