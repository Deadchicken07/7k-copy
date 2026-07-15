// Formation patterns ported from js/formations.js
// Each pattern defines which slot numbers are in the back vs. front row.
// Back row = safer (fewer hits). Front row = takes the hits.

export const PATTERNS = {
  basic:   { id: "basic",   label: "ธรรมดา",   displayLabel: "รูปแบบหน้า 2 หลัง 3", back: [3, 4, 5], front: [1, 2] },
  balance: { id: "balance", label: "สมดุล",    displayLabel: "รูปแบบหน้า 3 หลัง 2", back: [4, 5],    front: [1, 2, 3] },
  offense: { id: "offense", label: "บุก",       displayLabel: "รูปแบบหน้า 1 หลัง 4", back: [2, 3, 4, 5], front: [1] },
  defense: { id: "defense", label: "รับ",       displayLabel: "รูปแบบหน้า 4 หลัง 1", back: [5],       front: [1, 2, 3, 4] },
};

export const PATTERN_LIST = Object.values(PATTERNS);

// Only this many of the 5 positions may actually hold a character.
export const MAX_FORMATION_HEROES = 3;

export function getPattern(id) {
  return PATTERNS[id] || PATTERNS.basic;
}

export function countFilledSlots(slotMap) {
  if (!slotMap) return 0;
  return Object.values(slotMap).filter(Boolean).length;
}
