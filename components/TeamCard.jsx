'use client';

import { FormationGrid } from './FormationGrid';

const CATEGORY_LABEL = {
  tank:     'แทงค์',
  magic:    'เวทย์',
  physical: 'กายภาพ',
  other:    'อื่นๆ',
};

export function TeamCard({ team, onClick }) {
  if (!team) return null;

  const { name, category, guild, enemy, counters = [] } = team;
  const catLabel = CATEGORY_LABEL[category] || category || '';
  const counterCount = counters.length;

  return (
    <div className="team-card" role="button" tabIndex={0} onClick={onClick} onKeyDown={(e) => e.key === 'Enter' && onClick?.()}>
      {/* Top bar */}
      <div className="team-card-top">
        <div className="card-top-left">
          <span className="badge-need">
            {catLabel && (
              <span className={`badge-cat badge-cat-${category}`}>{catLabel}</span>
            )}
          </span>
          {guild && (
            <span className={`badge-guild badge-guild-${guild.toLowerCase().replace(/\s+/g, '')}`}>
              {guild}
            </span>
          )}
        </div>
        <span className="counter-count">{counterCount} counter{counterCount !== 1 ? 's' : ''}</span>
      </div>

      {/* Body */}
      <div className="team-card-body">
        <div className="enemy-preview" style={{ flex: 1 }}>
          {name && <div className="enemy-name">{name}</div>}
          {enemy && (
            <FormationGrid
              pattern={enemy.pattern}
              slots={enemy.slots || {}}
            />
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="card-footer">
        <button type="button" className="view-more-btn" tabIndex={-1}>
          ดูเพิ่ม →
        </button>
      </div>
    </div>
  );
}
