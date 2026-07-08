const PET_FILENAMES = [
  "ครี", "คารัม", "จีฟ", "ดอจ", "มิค", "ยอนจี", "ยู", "รีเชล",
  "ลู", "อีรีน", "เจโอ", "เดลโล่", "เมลแปร์โรว์", "เอริ", "โยรัง", "ไพค์"
];

const PETS = PET_FILENAMES.map((name) => ({
  id: name,
  name,
  img: `pet/${name}.png`
}));

function getPet(id) {
  return PETS.find((p) => p.id === id) || null;
}

// Read-only pet panel used on the homepage (no click/drag handlers, no remove buttons).
// Same visual structure as the editor: 1 large slot + 2×2 small slots.
function renderPetSlotsView(pets) {
  pets = pets || {};
  const renderSlot = (n, isMain) => {
    const petId = pets[String(n)];
    const pet = petId ? getPet(petId) : null;
    const sizeCls = isMain ? "main" : "sub";
    const img = pet ? `<img src="${pet.img}" alt="${pet.name}" draggable="false">` : "";
    return `<div class="pet-slot ${sizeCls} ${pet ? "filled" : "empty"} readonly">${img}</div>`;
  };
  const subSlots = [2, 3, 4, 5].map((n) => renderSlot(n, false)).join("");
  return `<div class="pet-slots-panel">
    <div class="pet-slots-title">สัตว์เลี้ยง</div>
    <div class="pet-slots-wrap">
      ${renderSlot(1, true)}
      <div class="pet-slots-sub">${subSlots}</div>
    </div>
  </div>`;
}
