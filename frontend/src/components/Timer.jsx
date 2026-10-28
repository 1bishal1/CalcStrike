import { ClockIcon } from './Icons';

function Timer({ timeLeft }) {
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.45rem',
      backgroundColor: 'var(--bg-input)',
      border: '1px solid var(--border-subtle)',
      padding: '0.35rem 0.85rem',
      borderRadius: '8px',
      color: 'var(--color-gold)',
      fontWeight: 600,
      fontSize: '0.92rem'
    }}>
      <ClockIcon size={16} color="#E5CD82" />
      <span>Time: {timeLeft}s</span>
    </div>
  );
}

export default Timer;
