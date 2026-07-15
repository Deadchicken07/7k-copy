'use client';

// Formation patterns define which slot numbers go in back vs front row
const PATTERN_ROWS = {
  basic:   { back: [3, 4, 5], front: [1, 2] },
  balance: { back: [4, 5],    front: [1, 2, 3] },
  offense: { back: [2, 3, 4, 5], front: [1] },
  defense: { back: [5],          front: [1, 2, 3, 4] },
};

export function FormationGrid({ pattern = 'basic', slots = {} }) {
  const rows = PATTERN_ROWS[pattern] || PATTERN_ROWS.basic;

  const renderSlot = (slotNum) => {
    const hero = slots[String(slotNum)];
    const isEmpty = !hero;
    return (
      <div
        key={slotNum}
        className={`formation-slot${isEmpty ? ' empty' : ' filled'}`}
        title={hero || `Slot ${slotNum}`}
      >
        <span className="slot-num">{slotNum}</span>
        {hero ? (
          <img
            className="slot-hero-img"
            src={`/images/heroes/${encodeURIComponent(hero)}.png`}
            alt={hero}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement.querySelector('.slot-plus').style.display = 'flex';
            }}
          />
        ) : (
          <span className="slot-plus">+</span>
        )}
        {hero && (
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.55)', fontSize: 9, color: '#fff', textAlign: 'center', padding: '2px 2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {hero}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="formation-grid">
      <div className="formation-row">
        {rows.back.map(renderSlot)}
      </div>
      <div className="formation-row">
        {rows.front.map(renderSlot)}
      </div>
    </div>
  );
}
