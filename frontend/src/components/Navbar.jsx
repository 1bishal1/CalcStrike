import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { SwordLogoIcon, UserIcon } from './Icons';

function Navbar({ username }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      navigate('/login');
    }
  };

  return (
    <nav style={{
      backgroundColor: 'var(--bg-card)',
      borderBottom: '1px solid rgba(114, 142, 109, 0.3)',
      padding: '0.75rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div
        style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer' }}
        onClick={() => navigate('/home')}
      >
        <SwordLogoIcon size={30} color="#E5CD82" />
        <span style={{ color: 'var(--color-gold)', fontSize: '1.4rem', fontWeight: 700, letterSpacing: '0.5px' }}>
          CalcStrike
        </span>
      </div>

      <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-cream)', fontSize: '0.95rem' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: '#15370D',
            border: '1px solid #728E6D',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <UserIcon size={16} color="#E5CD82" />
          </div>
          <span>Welcome, <strong>{username || 'warrior'}</strong>!</span>
        </div>

        <button
          onClick={handleLogout}
          style={{
            padding: '0.4rem 1.1rem',
            backgroundColor: 'transparent',
            color: 'var(--color-cream)',
            border: '1px solid var(--border-sage)',
            borderRadius: '6px',
            fontWeight: 600,
            fontSize: '0.88rem',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
