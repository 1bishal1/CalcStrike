import HealthBar from './HealthBar';
import { BossAvatar } from './Icons';

function BossCard({ bossLevel, bossHealth }) {
  return (
    <div style={{
      backgroundColor: 'var(--bg-card)',
      border: '1px solid rgba(114, 142, 109, 0.35)',
      padding: '1.25rem',
      borderRadius: '12px',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.75rem'
    }}>
      <BossAvatar size={48} />
      <h2 style={{ color: 'var(--color-cream)', fontSize: '1.2rem', margin: 0 }}>
        Boss Level {bossLevel}
      </h2>
      <HealthBar health={bossHealth} label="Boss Health" isBoss={true} />
    </div>
  );
}

export default BossCard;
