// The 4 guild-war formation patterns. Each has 5 numbered positions split
// between a back row (safer, fewer hits taken) and a front row (takes the
// hits). Both rows use equal-size slots and are horizontally centered on
// each other, matching the official pattern artwork.
const PATTERNS = {
  basic:   { id: "basic",   label: "รูปแบบพื้นฐาน", displayLabel: "รูปแบบหน้า 2 หลัง 3", back: [3, 4, 5],    front: [1, 2]    },
  balance: { id: "balance", label: "รูปแบบสมดุล",    displayLabel: "รูปแบบหน้า 3 หลัง 2", back: [4, 5],       front: [1, 2, 3] },
  offense: { id: "offense", label: "รูปแบบโจมตี",    displayLabel: "รูปแบบหน้า 1 หลัง 4", back: [2, 3, 4, 5], front: [1]       },
  defense: { id: "defense", label: "รูปแบบป้องกัน",  displayLabel: "รูปแบบหน้า 4 หลัง 1", back: [5],          front: [1, 2, 3, 4] }
};

const PATTERN_LIST = Object.values(PATTERNS);

// Only this many of the 5 positions may actually hold a character.
const MAX_FORMATION_HEROES = 3;

function getPattern(id) {
  return PATTERNS[id] || PATTERNS.basic;
}

function countFilledSlots(slotMap) {
  return Object.values(slotMap || {}).filter(Boolean).length;
}

// Renders the small back/front shield diagram used on pattern-picker buttons.
function renderPatternIcon(pattern) {
  const row = (nums, cls) =>
    `<div class="pattern-row ${cls}">` +
    nums.map((n) => `<span class="pattern-pip">${n}</span>`).join("") +
    `</div>`;
  return `<div class="pattern-icon">${row(pattern.back, "pattern-back")}${row(
    pattern.front,
    "pattern-front"
  )}</div>`;
}

// Renders the back row above the front row, both centered on each other.
// slotMap: { "1": heroId, ... }
// opts.editable -> adds drag/drop + click-to-place affordances + remove buttons.
// opts.hideEmpty -> skip unfilled positions (for compact read-only displays).
// opts.pickedSlot -> slot number "picked up" for a pending move/swap, highlighted.
function renderFormationGrid(pattern, slotMap, opts) {
  opts = opts || {};
  slotMap = slotMap || {};
  const filledCount = countFilledSlots(slotMap);
  const dotOrder = opts.dotOrder || [];

  const renderSlot = (n, rowCls) => {
    const heroId = slotMap[String(n)];
    const hero = heroId ? getHero(heroId) : null;
    if (!hero && opts.hideEmpty) return "";
    const filled = hero ? "filled" : "empty";
    const picked = opts.pickedSlot === String(n) ? "picked" : "";
    const waiting = opts.waitingSlot === String(n) ? "waiting" : "";
    const img = hero
      ? `<img src="${hero.img}" alt="${hero.name}" draggable="false">`
      : `<span class="slot-plus">+</span>`;
    const removeBtn =
      opts.editable && hero
        ? `<button class="slot-remove" data-slot="${n}" title="ลบ" type="button">×</button>`
        : "";
    const slotEl = `<div class="formation-slot ${filled} ${rowCls} ${picked} ${waiting}" data-slot="${n}">
        <span class="slot-row-dot ${rowCls}" title="${rowCls === "back" ? "แถวหลัง" : "แถวหน้า"}"></span>
        <span class="slot-num">${n}</span>
        ${img}
        ${removeBtn}
      </div>`;

    // Dots: interactive in editable mode; read-only display when dotOrder provided
    let dotsHtml = "";
    if (hero) {
      if (opts.editable) {
        const isFull = dotOrder.length >= 3;
        dotsHtml = `<div class="slot-dots">` +
          ["A", "U", "L"].map((lbl) => {
            const qi = dotOrder.findIndex((d) => d.slot === String(n) && d.dot === lbl);
            if (qi >= 0) return `<button class="slot-dot dot-selected dot-order-${qi + 1}" data-dot-slot="${n}" data-dot="${lbl}" type="button">${qi + 1}</button>`;
            if (isFull) return `<button class="slot-dot dot-greyed" data-dot-slot="${n}" data-dot="${lbl}" type="button">${lbl}</button>`;
            return `<button class="slot-dot dot-inactive" data-dot-slot="${n}" data-dot="${lbl}" type="button">${lbl}</button>`;
          }).join("") + `</div>`;
      } else if (dotOrder.length > 0) {
        // Read-only: show dots column only when at least one dot is selected for this slot
        const selectedHere = dotOrder.filter((d) => d.slot === String(n));
        if (selectedHere.length) {
          dotsHtml = `<div class="slot-dots">` +
            ["A", "U", "L"].map((lbl) => {
              const qi = dotOrder.findIndex((d) => d.slot === String(n) && d.dot === lbl);
              if (qi >= 0) return `<span class="slot-dot dot-selected dot-order-${qi + 1}">${qi + 1}</span>`;
              return `<span class="slot-dot dot-greyed">${lbl}</span>`;
            }).join("") + `</div>`;
        }
      }
    }

    return `<div class="formation-slot-wrap">${slotEl}${dotsHtml}</div>`;
  };

  const backHtml = pattern.back.map((n) => renderSlot(n, "back")).join("");
  const frontHtml = pattern.front.map((n) => renderSlot(n, "front")).join("");
  const counter = opts.editable
    ? `<div class="formation-fill-count">ใส่แล้ว ${filledCount}/${MAX_FORMATION_HEROES} ตัว</div>`
    : "";
  const fkAttr = opts.formationKey ? ` data-formation-key="${opts.formationKey}"` : "";

  return `<div class="formation-grid ${opts.editable ? "editable" : ""}" data-pattern="${pattern.id}"${fkAttr}>
      <div class="formation-row back-row">${backHtml}</div>
      <div class="formation-row front-row">${frontHtml}</div>
      ${counter}
    </div>`;
}
