'use client';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <span>PokkyRebirth Guild</span>
        <span className="pill-sep" style={{ display: 'inline-block', width: 1, height: 14, background: 'var(--card-border)', margin: '0 10px', verticalAlign: 'middle' }} />
        <span style={{ color: 'var(--muted)', fontSize: 12 }}>
          Guild War Hub &copy; {year}
        </span>
      </div>
    </footer>
  );
}
