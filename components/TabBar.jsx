'use client';

const TABS = [
  { id: 'attack',  label: 'ทีมบุก' },
  { id: 'defense', label: 'ทีมป้องกัน' },
];

export function TabBar({ tab, onTabChange }) {
  return (
    <div className="main-tabs">
      {TABS.map((t) => (
        <button
          key={t.id}
          type="button"
          className={`main-tab-btn${tab === t.id ? ' active' : ''}`}
          onClick={() => onTabChange?.(t.id)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
