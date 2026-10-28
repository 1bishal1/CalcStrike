import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useEffect, useState } from 'react';
import { authService } from '../services/authService';
import { LeafIcon, MountainIcon, CrownIcon } from '../components/Icons';

function DifficultyPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const result = await authService.getCurrentUser();
    if (result?.user) setUser(result.user);
  };

  const selectDifficulty = (difficulty) => {
    navigate('/game', { state: { difficulty } });
  };

  return (
    <div className="app-screen">
      <Navbar username={user?.username} />

      <div style={{
        maxWidth: '1050px',
        width: '100%',
        margin: '2rem auto',
        padding: '0 1.25rem'
      }}>
        {/* Header with Back button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
          <button
            onClick={() => navigate('/home')}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid rgba(114, 142, 109, 0.4)',
              color: 'var(--color-cream)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              cursor: 'pointer'
            }}
            aria-label="Back to home"
          >
            ←
          </button>
          <div>
            <h1 style={{ color: 'var(--color-cream)', fontSize: '2rem', fontWeight: 700, margin: 0 }}>
              Choose Difficulty
            </h1>
            <p style={{ color: 'var(--color-sage)', fontSize: '0.95rem', margin: 0 }}>
              Select your challenge level
            </p>
          </div>
        </div>

        {/* 3 Difficulty Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.75rem'
        }}>
          {/* Easy Card */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid rgba(114, 142, 109, 0.35)',
            borderRadius: '16px',
            padding: '2.25rem 1.75rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4)'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(46, 213, 115, 0.15)',
              border: '1px solid rgba(46, 213, 115, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <LeafIcon size={32} color="#2ed573" />
            </div>

            <h3 style={{ color: 'var(--color-cream)', fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.35rem' }}>
              Easy
            </h3>

            <div style={{
              backgroundColor: 'rgba(46, 213, 115, 0.25)',
              color: '#2ed573',
              fontSize: '0.72rem',
              fontWeight: 800,
              letterSpacing: '1px',
              padding: '0.2rem 0.75rem',
              borderRadius: '12px',
              marginBottom: '1.5rem'
            }}>
              EASY
            </div>

            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: '0 0 2rem 0',
              textAlign: 'left',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.45rem',
              color: 'var(--color-cream)',
              fontSize: '0.92rem'
            }}>
              <li>• Addition</li>
              <li>• Subtraction</li>
              <li>• Multiplication</li>
              <li>• Simple division</li>
              <li>• Number patterns</li>
            </ul>

            <button
              onClick={() => selectDifficulty('easy')}
              style={{
                width: '100%',
                padding: '0.8rem',
                backgroundColor: 'var(--color-gold)',
                color: '#0B120A',
                fontWeight: 700,
                fontSize: '0.96rem',
                borderRadius: '8px',
                marginTop: 'auto',
                cursor: 'pointer'
              }}
            >
              Start Battle
            </button>
          </div>

          {/* Medium Card */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid rgba(114, 142, 109, 0.35)',
            borderRadius: '16px',
            padding: '2.25rem 1.75rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4)'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(229, 205, 130, 0.15)',
              border: '1px solid rgba(229, 205, 130, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <MountainIcon size={32} color="#E5CD82" />
            </div>

            <h3 style={{ color: 'var(--color-cream)', fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.35rem' }}>
              Medium
            </h3>

            <div style={{
              backgroundColor: 'rgba(229, 205, 130, 0.25)',
              color: '#E5CD82',
              fontSize: '0.72rem',
              fontWeight: 800,
              letterSpacing: '1px',
              padding: '0.2rem 0.75rem',
              borderRadius: '12px',
              marginBottom: '1.5rem'
            }}>
              MEDIUM
            </div>

            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: '0 0 2rem 0',
              textAlign: 'left',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.45rem',
              color: 'var(--color-cream)',
              fontSize: '0.92rem'
            }}>
              <li>• Fractions</li>
              <li>• Percentages</li>
              <li>• Negative numbers</li>
              <li>• Order of operations</li>
              <li>• Basic algebra</li>
            </ul>

            <button
              onClick={() => selectDifficulty('medium')}
              style={{
                width: '100%',
                padding: '0.8rem',
                backgroundColor: 'var(--color-gold)',
                color: '#0B120A',
                fontWeight: 700,
                fontSize: '0.96rem',
                borderRadius: '8px',
                marginTop: 'auto',
                cursor: 'pointer'
              }}
            >
              Start Battle
            </button>
          </div>

          {/* Difficult Card */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid rgba(114, 142, 109, 0.35)',
            borderRadius: '16px',
            padding: '2.25rem 1.75rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4)'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 71, 87, 0.15)',
              border: '1px solid rgba(255, 71, 87, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <CrownIcon size={32} color="#ff4757" />
            </div>

            <h3 style={{ color: 'var(--color-cream)', fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.35rem' }}>
              Difficult
            </h3>

            <div style={{
              backgroundColor: 'rgba(255, 71, 87, 0.25)',
              color: '#ff6b6b',
              fontSize: '0.72rem',
              fontWeight: 800,
              letterSpacing: '1px',
              padding: '0.2rem 0.75rem',
              borderRadius: '12px',
              marginBottom: '1.5rem'
            }}>
              DIFFICULT
            </div>

            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: '0 0 2rem 0',
              textAlign: 'left',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.45rem',
              color: 'var(--color-cream)',
              fontSize: '0.92rem'
            }}>
              <li>• Quadratic equations</li>
              <li>• Exponents</li>
              <li>• Roots</li>
              <li>• Complex fractions</li>
              <li>• Multi-step algebra</li>
            </ul>

            <button
              onClick={() => selectDifficulty('difficult')}
              style={{
                width: '100%',
                padding: '0.8rem',
                backgroundColor: 'var(--color-gold)',
                color: '#0B120A',
                fontWeight: 700,
                fontSize: '0.96rem',
                borderRadius: '8px',
                marginTop: 'auto',
                cursor: 'pointer'
              }}
            >
              Start Battle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DifficultyPage;
