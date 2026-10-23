import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SwordLogoIcon } from '../components/Icons';

function IntroPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at 50% 35%, #15370D 0%, #0B120A 85%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '2rem 1.5rem',
      cursor: 'pointer'
    }}
    onClick={() => navigate('/login')}
    >
      <div style={{ marginBottom: '1.5rem', animation: 'fadeInScale 1s ease-out' }}>
        <SwordLogoIcon size={84} color="#E5CD82" />
      </div>

      <h1 style={{
        color: 'var(--color-gold)',
        fontSize: '3.6rem',
        fontWeight: 800,
        letterSpacing: '1px',
        marginBottom: '0.85rem',
        animation: 'slideDown 0.9s ease-out'
      }}>
        CalcStrike
      </h1>

      <p style={{
        color: 'var(--color-cream)',
        fontSize: '1.25rem',
        fontStyle: 'italic',
        maxWidth: '560px',
        lineHeight: 1.6,
        marginBottom: '2.5rem',
        animation: 'slideUp 0.9s ease-out'
      }}>
        “Solve the equation. Defeat the boss. Claim the throne.”
      </p>

      <button
        onClick={() => navigate('/login')}
        style={{
          padding: '0.85rem 2.5rem',
          backgroundColor: 'var(--color-gold)',
          color: '#0B120A',
          fontWeight: 700,
          fontSize: '1.05rem',
          borderRadius: '30px',
          boxShadow: '0 4px 18px rgba(229, 205, 130, 0.35)',
          cursor: 'pointer',
          animation: 'fadeIn 1.4s ease'
        }}
      >
        Enter Arena
      </button>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideDown {
          from { transform: translateY(-24px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(24px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default IntroPage;
