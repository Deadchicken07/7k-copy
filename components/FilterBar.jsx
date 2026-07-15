'use client';

const CATEGORY_PILLS = [
  { id: '',         label: 'ทั้งหมด' },
  { id: 'tank',     label: 'แทงค์' },
  { id: 'magic',    label: 'เวทย์' },
  { id: 'physical', label: 'กายภาพ' },
  { id: 'other',    label: 'อื่นๆ' },
];

export function FilterBar({ category, guild, onCategoryChange, onGuildChange }) {
  return (
    <div className="filter-row">
      <div className="filter-pills">
        {CATEGORY_PILLS.map((pill, idx) => (
          <button
            key={pill.id || 'all'}
            type="button"
            className={`pill${category === pill.id ? ' active' : ''}`}
            data-cat={pill.id || undefined}
            onClick={() => onCategoryChange?.(pill.id)}
          >
            {pill.label}
          </button>
        ))}

        <span className="pill-sep" />

        <div className="guild-filter-row">
          <span className="pill-group-label">Guild</span>
          <button
            type="button"
            className={`pill pill-guild-pokkyrebirth${guild === 'PokkyRebirth' ? ' active' : ''}`}
            onClick={() => onGuildChange?.(guild === 'PokkyRebirth' ? '' : 'PokkyRebirth')}
          >
            PokkyRebirth
          </button>
        </div>
      </div>
    </div>
  );
}
