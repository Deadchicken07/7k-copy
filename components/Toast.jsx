'use client';

export function Toast({ message, visible }) {
  if (!visible || !message) return null;
  return (
    <div
      className="toast"
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'var(--card-bg)',
        border: '1.5px solid var(--card-border)',
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow-md)',
        padding: '10px 22px',
        fontSize: 14,
        fontWeight: 600,
        color: 'var(--text)',
        zIndex: 9999,
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
      }}
    >
      {message}
    </div>
  );
}
