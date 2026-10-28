function HealthBar({ health, maxHealth = 100, label, isBoss = false }) {
  const percentage = Math.max(0, Math.min(100, (health / maxHealth) * 100));

  return (
    <div style={{ width: '100%' }}>
      {label && (
        <div style={{ color: 'var(--color-cream)', marginBottom: '0.35rem', fontSize: '0.85rem', fontWeight: 600 }}>
          {label}
        </div>
      )}
      <div style={{
        width: '100%',
        height: '16px',
        backgroundColor: 'var(--bg-input)',
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid var(--border-subtle)'
      }}>
        <div
          style={{
            height: '100%',
            width: `${percentage}%`,
            backgroundColor: isBoss ? 'var(--hp-boss)' : 'var(--hp-player)',
            transition: 'width 0.35s ease'
          }}
        />
      </div>
      <div style={{ color: 'var(--color-sage)', fontSize: '0.75rem', marginTop: '0.2rem' }}>
        HP {Math.round(health)}/{maxHealth}
      </div>
    </div>
  );
}

export default HealthBar;
