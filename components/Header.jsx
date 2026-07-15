'use client';

export function Header({ user, isAdmin, onAdminToggle, onLogout }) {
  return (
    <header className="site-header">
      <div className="brand">
        <div className="brand-title">PokkyRebirth Guild Hub</div>
      </div>

      <div className="header-actions">
        {isAdmin && (
          <button
            type="button"
            className={`icon-btn${onAdminToggle ? ' admin-toggle' : ''}`}
            title="Admin Panel"
            onClick={onAdminToggle}
            aria-label="Toggle admin panel"
          >
            ☰
          </button>
        )}

        {user && (
          <button
            type="button"
            className="icon-btn"
            title="Logout"
            onClick={onLogout}
            aria-label="Logout"
          >
            ⎋
          </button>
        )}
      </div>
    </header>
  );
}
