const HERO_STATS = [
  { id: "atk",       label: "พลังโจมตี",
    icon: '<svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="13" x2="13" y2="3"/><polyline points="13,3 13,7 9,3"/></svg>' },
  { id: "def",       label: "พลังป้องกัน",
    icon: '<svg viewBox="0 0 16 16" width="15" height="15"><path d="M8 1.5L2 4.5v3.5c0 3.5 2.5 6.2 6 7.2 3.5-1 6-3.7 6-7.2V4.5Z" fill="#3b82f6"/></svg>' },
  { id: "hp",        label: "HP",
    icon: '<svg viewBox="0 0 16 16" width="15" height="15"><path d="M8 13C8 13 2 9 2 5.5a3.3 3.3 0 0 1 6-1.9 3.3 3.3 0 0 1 6 1.9C14 9 8 13 8 13z" fill="#ef4444"/></svg>' },
  { id: "atkSpd",    label: "ความเร็วโจมตี",
    icon: '<svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="#06b6d4" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="10,2 6,8 10,8 6,14"/></svg>' },
  { id: "critRate",  label: "อัตราคริติคอล",
    icon: '<svg viewBox="0 0 16 16" width="15" height="15"><polygon points="8,1 9.5,6 15,6 10.5,9.5 12.2,14.5 8,11.5 3.8,14.5 5.5,9.5 1,6 6.5,6" fill="#eab308"/></svg>' },
  { id: "critDmg",   label: "ความเสียหายคริติคอล",
    icon: '<svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="#f97316" stroke-width="1.8" stroke-linecap="round"><line x1="8" y1="1" x2="8" y2="4"/><line x1="8" y1="12" x2="8" y2="15"/><line x1="1" y1="8" x2="4" y2="8"/><line x1="12" y1="8" x2="15" y2="8"/><line x1="3.1" y1="3.1" x2="5.3" y2="5.3"/><line x1="10.7" y1="10.7" x2="12.9" y2="12.9"/><line x1="12.9" y1="3.1" x2="10.7" y2="5.3"/><line x1="5.3" y1="10.7" x2="3.1" y2="12.9"/><circle cx="8" cy="8" r="2.5" fill="#f97316"/></svg>' },
  { id: "weakPt",    label: "อัตราโจมตีจุดอ่อน",
    icon: '<svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="#f59e0b" stroke-width="1.5"><circle cx="8" cy="8" r="6.5"/><circle cx="8" cy="8" r="4"/><circle cx="8" cy="8" r="1.5" fill="#f59e0b" stroke="none"/></svg>' },
  { id: "blockRate", label: "อัตราบล็อก",
    icon: '<svg viewBox="0 0 16 16" width="15" height="15"><path d="M8 1.5L2 4.5v3.5c0 3.5 2.5 6.2 6 7.2 3.5-1 6-3.7 6-7.2V4.5Z" fill="#8b5cf6"/><line x1="4.5" y1="8" x2="11.5" y2="8" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>' },
  { id: "dmgRed",    label: "ลดความเสียหายที่ได้รับ",
    icon: '<svg viewBox="0 0 16 16" width="15" height="15"><path d="M8 1.5L2 4.5v3.5c0 3.5 2.5 6.2 6 7.2 3.5-1 6-3.7 6-7.2V4.5Z" fill="#94a3b8"/><line x1="5.5" y1="11" x2="10.5" y2="5" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>' },
];

const HERO_STATS_EXT2 = [
  { id: "hitRate",    label: "ผลเข้าเป้า",
    icon: '<svg viewBox="0 0 16 16" width="15" height="15"><path d="M8 1.2l1.1 3.4H13l-2.9 2.1 1.1 3.4L8 8l-3.2 2.1 1.1-3.4L3 4.6h3.9Z" fill="#a78bfa"/></svg>' },
  { id: "effRes",     label: "ต้านทานผล",
    icon: '<svg viewBox="0 0 16 16" width="15" height="15"><path d="M8 1.5L2 4.5v3.5c0 3.5 2.5 6.2 6 7.2 3.5-1 6-3.7 6-7.2V4.5Z" fill="#14b8a6"/><circle cx="8" cy="8" r="2.5" fill="none" stroke="white" stroke-width="1.5"/></svg>' },
];

const HERO_STATS_EXT = [
  { id: "bonusDmg",   label: "เสริมความเสียหาย",
    icon: '<svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="#f97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="12" x2="8" y2="4"/><polyline points="5,7 8,4 11,7"/><line x1="5" y1="13" x2="11" y2="13"/></svg>' },
  { id: "crush",      label: "บดขยี้",
    icon: '<svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 11L8 4l3 7"/><line x1="6" y1="9" x2="10" y2="9"/><line x1="8" y1="12" x2="8" y2="14"/></svg>' },
  { id: "resilience", label: "ยึดหยุ่น",
    icon: '<svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 5c0-1.7 1.3-3 3-3s3 1.3 3 3v2c0 1.7-1.3 3-3 3s-3-1.3-3-3V5z"/><line x1="8" y1="11" x2="8" y2="14"/><line x1="6" y1="14" x2="10" y2="14"/></svg>' },
  { id: "recovery",   label: "ฟื้นคืน",
    icon: '<svg viewBox="0 0 16 16" width="15" height="15"><path d="M8 13C8 13 2 9 2 5.5a3.3 3.3 0 0 1 6-1.9 3.3 3.3 0 0 1 6 1.9C14 9 8 13 8 13z" fill="#ec4899"/><line x1="8" y1="5" x2="8" y2="9" stroke="white" stroke-width="1.5" stroke-linecap="round"/><line x1="6" y1="7" x2="10" y2="7" stroke="white" stroke-width="1.5" stroke-linecap="round"/></svg>' },
];

const AdminEditor = {
  team: null,
  tab: "attack",
  selectedHero: null,
  selectedPet: null,
  selectedRing: null,
  selectedSet: null,
  heroFilter: "",
  heroTierFilter: null,
  petFilter: "",
  ringFilter: "",
  setFilter: "",
  paletteTab: "hero",
  paletteCollapsed: false,
  // moveSource: the slot being "picked up" for a click-to-swap move
  // { type:"hero", slots, slotNum, formationKey } | { type:"pet", target, slotNum } | { type:"gear", gearType, cIdx, heroId, slotNum }
  moveSource: null,
  dragSource: null,
  // activeSlot: the slot waiting to receive an item (slot-first flow)
  // { type:"hero", formationKey, slotNum } | { type:"pet", target, slotNum } | { type:"ring"|"set", cIdx, heroId, slotNum }
  activeSlot: null,
  // lastFormationKey: tracks which formation was last interacted with, for auto-place on hero chip tap
  lastFormationKey: "enemy",
  enemySectionOpen: true,
  openCounterCards: new Set(),

  mount() {
    document.getElementById("exitAdminBtn").addEventListener("click", () => App.exitAdminWithConfirm());
    document.getElementById("addTeamBtn").addEventListener("click", () => this.startNew());
    document.getElementById("exportBtn").addEventListener("click", () => Store.exportJson());
    document.getElementById("publishBtn").addEventListener("click", () => {
      Modal.confirm("ยืนยันจะบันทึกข้อมูลทั้งหมดขึ้นเว็บไซต์หลักใช่ไหม?", () => Publisher.publish());
    });
    document.getElementById("importBtn").addEventListener("click", () =>
      document.getElementById("importFile").click()
    );
    document.getElementById("importFile").addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        await Store.importJsonFile(file);
        toast("นำเข้าข้อมูลสำเร็จ");
        this.closeEditor();
      } catch (err) {
        window.alert("นำเข้าไม่สำเร็จ: " + err.message);
      }
      e.target.value = "";
    });
    this.renderTeamList();
  },

  renderTeamList() {
    const wrap = document.getElementById("adminTeamList");
    const teams = Store.getTeams().filter((t) => (t.tab || "attack") === this.tab);
    const activeId = this.team ? this.team.id : null;

    const tabHtml = `<div class="main-tabs" style="margin-bottom:10px;">${
      TEAM_TABS.map((tb) =>
        `<button class="main-tab-btn ${tb.id === this.tab ? "active" : ""}" data-admin-tab="${tb.id}">${tb.label}</button>`
      ).join("")
    }</div>`;

    const eyeOn  = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
    const eyeOff = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
    const rowHtml = (t, idx) => {
      const canEdit = Auth.canEditTeam(t);
      const noEditAttr  = canEdit ? "" : `disabled title="ไม่มีสิทธิ์แก้ไขทีมของกิลด์อื่น"`;
      return `
      <div class="admin-team-row ${t.id === activeId ? "active" : ""} ${t.hidden ? "row-hidden" : ""} ${!canEdit ? "row-locked" : ""}" data-team-id="${t.id}" draggable="true">
        <span class="drag-handle" title="ลากเพื่อย้าย">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="5" r="1.8"/><circle cx="15" cy="5" r="1.8"/><circle cx="9" cy="12" r="1.8"/><circle cx="15" cy="12" r="1.8"/><circle cx="9" cy="19" r="1.8"/><circle cx="15" cy="19" r="1.8"/></svg>
        </span>
        <div class="reorder-btns">
          <button class="btn btn-icon btn-reorder" data-move-up="${t.id}" title="เลื่อนขึ้น" ${idx === 0 ? "disabled" : ""}>
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
          </button>
          <button class="btn btn-icon btn-reorder" data-move-down="${t.id}" title="เลื่อนลง" ${idx === teams.length - 1 ? "disabled" : ""}>
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
        </div>
        <span class="name">${t.name || "(ไม่มีชื่อ)"}</span>
        <span class="badge-cat badge-cat-${t.category || "other"}">${getCategory(t.category).label}</span>
        ${t.guild ? `<span class="badge-guild badge-guild-${t.guild.toLowerCase()}">${t.guild}</span>` : ""}
        <span class="counter-count">${(t.counters || []).length} ทีมแก้</span>
        <div class="btn-group">
          <button class="btn btn-icon btn-eye ${t.hidden ? "btn-eye-off" : ""}" data-toggle-hidden="${t.id}" title="${t.hidden ? "แสดงในหน้าหลัก" : "ซ่อนจากหน้าหลัก"}" ${noEditAttr}>${t.hidden ? eyeOff : eyeOn}</button>
          <button class="btn btn-icon" data-edit="${t.id}" title="แก้ไข" ${noEditAttr}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="btn btn-icon btn-icon-danger" data-del="${t.id}" title="ลบ" ${noEditAttr}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
          </button>
        </div>
      </div>`;
    };

    wrap.innerHTML = tabHtml + (
      teams.length
        ? teams.map(rowHtml).join("")
        : `<div class="hint">ยังไม่มีทีมศัตรูในหมวดนี้ กด "+ เพิ่มทีมศัตรูใหม่" เพื่อเริ่มสร้างรายการแรก</div>`
    );

    wrap.querySelectorAll("[data-admin-tab]").forEach((btn) =>
      btn.addEventListener("click", () => {
        if (this.tab === btn.dataset.adminTab) return;
        const doSwitch = () => { this.tab = btn.dataset.adminTab; this.closeEditor(); };
        if (this.team) {
          Modal.confirm("คุณมีการแก้ไขที่ยังไม่บันทึก ต้องการเปลี่ยนแท็บใช่หรือไม่?", doSwitch);
        } else {
          doSwitch();
        }
      })
    );
    // Drag-to-reorder
    let dragId = null;
    const clearDragOver = () => wrap.querySelectorAll(".admin-team-row").forEach((r) => {
      r.classList.remove("drag-over-top", "drag-over-bottom");
    });
    wrap.querySelectorAll(".admin-team-row[data-team-id]").forEach((row) => {
      row.addEventListener("dragstart", (e) => {
        dragId = row.dataset.teamId;
        e.dataTransfer.effectAllowed = "move";
        setTimeout(() => row.classList.add("dragging"), 0);
      });
      row.addEventListener("dragend", () => {
        dragId = null;
        row.classList.remove("dragging");
        clearDragOver();
      });
      row.addEventListener("dragover", (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        if (row.dataset.teamId === dragId) return;
        clearDragOver();
        const mid = row.getBoundingClientRect().top + row.offsetHeight / 2;
        row.classList.add(e.clientY < mid ? "drag-over-top" : "drag-over-bottom");
      });
      row.addEventListener("dragleave", clearDragOver);
      row.addEventListener("drop", (e) => {
        e.preventDefault();
        clearDragOver();
        if (dragId && row.dataset.teamId !== dragId) {
          const mid = row.getBoundingClientRect().top + row.offsetHeight / 2;
          Store.reorderTeam(dragId, row.dataset.teamId, e.clientY < mid);
          this.renderTeamList();
        }
      });
    });

    wrap.querySelectorAll("[data-toggle-hidden]").forEach((b) =>
      b.addEventListener("click", () => { Store.toggleTeamHidden(b.dataset.toggleHidden); this.renderTeamList(); })
    );
    wrap.querySelectorAll("[data-move-up]").forEach((b) =>
      b.addEventListener("click", () => { Store.moveTeam(b.dataset.moveUp, "up"); this.renderTeamList(); })
    );
    wrap.querySelectorAll("[data-move-down]").forEach((b) =>
      b.addEventListener("click", () => { Store.moveTeam(b.dataset.moveDown, "down"); this.renderTeamList(); })
    );
    wrap.querySelectorAll("[data-edit]").forEach((b) =>
      b.addEventListener("click", () => this.openEditor(Store.getTeam(b.dataset.edit)))
    );
    wrap.querySelectorAll("[data-del]").forEach((b) =>
      b.addEventListener("click", () => this.confirmDelete(b.dataset.del))
    );

    const isDefense = this.tab === "defense";
    const addTeamLabel = document.querySelector("#addTeamBtn span");
    if (addTeamLabel) {
      addTeamLabel.textContent = isDefense ? "3. เพิ่มทีมป้องกันบ้าน" : "3. เพิ่มทีม";
    }
    const hintEl = document.getElementById("adminHint");
    if (hintEl) hintEl.textContent = isDefense
      ? "บันทึกข้อมูลทีมป้องกันบ้านอัตโนมัติในเบราว์เซอร์ กด \"ส่งออก (Export) JSON\" เพื่อบันทึกเป็นไฟล์ data/teams.json สำหรับอัปโหลดขึ้นเว็บ"
      : "ข้อมูลที่แก้ไขจะถูกบันทึกอัตโนมัติเป็นฉบับร่างในเบราว์เซอร์นี้ กด \"ส่งออก (Export) JSON\" เพื่อบันทึกเป็นไฟล์ data/teams.json จริงสำหรับอัปโหลดขึ้นเว็บ";
  },

  confirmDelete(id) {
    const team = Store.getTeam(id);
    Modal.confirm(`ลบทีม "${team ? team.name : ""}" ใช่หรือไม่?`, () => {
      Store.deleteTeam(id);
      if (this.team && this.team.id === id) this.closeEditor();
      this.renderTeamList();
      toast("ลบทีมแล้ว");
    });
  },

  startNew() {
    const isDefense = this.tab === "defense";
    this.openEditor({
      id: uid(), name: "", tab: this.tab, category: "physical",
      guild: Auth.getAdminGuild(),
      enemy: { pattern: "basic", slots: {} },
      counters: isDefense ? [{ id: uid(), pattern: "basic", slots: {} }] : [],
    });
    if (isDefense) {
      this.enemySectionOpen = false;
      this.renderPanel();
    }
  },

  openEditor(team) {
    this.team = JSON.parse(JSON.stringify(team));
    this.selectedHero = null; this.selectedPet = null;
    this.selectedRing = null; this.selectedSet = null;
    this.heroFilter = ""; this.petFilter = "";
    this.ringFilter = ""; this.setFilter = "";
    this.paletteTab = "hero";
    this.moveSource = null; this.dragSource = null; this.activeSlot = null;
    this.lastFormationKey = "enemy";
    this.enemySectionOpen = true;
    this.openCounterCards = new Set(team.counters.map((_, i) => i));
    this.renderTeamList();
    this.renderPanel();
  },

  closeEditor() {
    this.team = null;
    this.moveSource = null; this.dragSource = null; this.activeSlot = null;
    document.getElementById("editorPanel").innerHTML = "";
    const dock = document.getElementById("paletteDock");
    if (dock) { dock.style.display = "none"; dock.innerHTML = ""; }
    document.getElementById("adminView").style.paddingBottom = "";
    this.renderTeamList();
  },

  save() {
    if (!this.team.name.trim()) { window.alert("กรุณาใส่ชื่อทีม"); return; }
    Store.upsertTeam(this.team);
    toast("บันทึก (ฉบับร่าง) แล้ว");
    this.closeEditor();
  },

  // ---- helpers ----
  getSlotsForFormationKey(fKey) {
    if (fKey === "enemy") return this.team.enemy.slots;
    return this.team.counters[Number(fKey.replace("counter-", ""))].slots;
  },

  nextEmptySlotFor(fKey) {
    const slots = this.getSlotsForFormationKey(fKey);
    if (countFilledSlots(slots) >= MAX_FORMATION_HEROES) return null;
    const formation = fKey === "enemy" ? this.team.enemy : this.team.counters[Number(fKey.replace("counter-", ""))];
    const pattern = getPattern(formation.pattern);
    const slotNum = [...pattern.back, ...pattern.front].map(String).find((n) => !slots[n]);
    return slotNum ? { slots, slotNum } : null;
  },

  renderPatternChoices(selectedId, attr, valueForId) {
    return PATTERN_LIST.map((p) =>
      `<div class="pattern-choice ${p.id === selectedId ? "selected" : ""}" ${attr}="${valueForId(p.id)}">
        ${renderPatternIcon(p)}<div class="pattern-label">${p.label}</div>
      </div>`
    ).join("");
  },

  // ---- enemy section (collapsible, no pet slots) ----
  renderEnemyEditor() {
    const enemy = this.team.enemy;
    const pattern = getPattern(enemy.pattern);
    const choices = this.renderPatternChoices(enemy.pattern, "data-set-enemy-pattern", (id) => id);
    const pickedSlot = this.moveSource?.type === "hero" && this.moveSource.slots === enemy.slots ? this.moveSource.slotNum : null;
    const waitingSlot = this.activeSlot?.type === "hero" && this.activeSlot.formationKey === "enemy" ? this.activeSlot.slotNum : null;
    const chevron = this.enemySectionOpen ? "▾" : "▸";
    return `
      <div class="section-header" data-toggle-section="enemy">
        <span class="editor-section-title" style="margin:0;">ทีมศัตรู (พรีวิวบนการ์ด)</span>
        <span class="section-chevron">${chevron}</span>
      </div>
      <div class="section-body"${this.enemySectionOpen ? "" : ' style="display:none"'}>
        <p class="hint">เลือกรูปแบบการตี แล้วใส่ตัวละครสำคัญสูงสุด ${MAX_FORMATION_HEROES} ตัว ลากหรือกดตัวละครในช่องเพื่อย้าย/สลับตำแหน่ง หรือกดช่องว่างเพื่อเลือกตัวละครจากคลัง</p>
        <div class="pattern-choices">${choices}</div>
        <div data-formation="enemy">${renderFormationGrid(pattern, enemy.slots, { editable: true, pickedSlot, waitingSlot, dotOrder: enemy.dotOrder, formationKey: "enemy" })}</div>
      </div>`;
  },

  // ---- pet slots (counter teams) ----
  renderPetSlotsPanel(pets, ownerTarget) {
    const isW = (n) => this.activeSlot?.type === "pet" && this.activeSlot.target === ownerTarget && this.activeSlot.slotNum === String(n);
    const isP = (n) => this.moveSource?.type === "pet" && this.moveSource.target === ownerTarget && this.moveSource.slotNum === String(n);
    const subSlots = [2, 3, 4, 5].map((n) => this.renderPetSlot(pets, n, false, isW(n), isP(n))).join("");
    return `<div class="pet-slots-panel">
      <div class="pet-slots-title">สัตว์เลี้ยง</div>
      <div class="pet-slots-wrap" data-pet-target="${ownerTarget}">
        ${this.renderPetSlot(pets, 1, true, isW(1), isP(1))}
        <div class="pet-slots-sub">${subSlots}</div>
      </div>
    </div>`;
  },

  renderPetSlot(pets, n, isMain, isWaiting = false, isPicked = false) {
    const petId = pets[String(n)];
    const pet = petId ? getPet(petId) : null;
    const sizeCls = isMain ? "main" : "sub";
    const filled = pet ? "filled" : "empty";
    const stateCls = isPicked ? "picked" : isWaiting ? "waiting" : "";
    const img = pet ? `<img src="${pet.img}" alt="${pet.name}" draggable="false">` : `<span class="slot-plus">+</span>`;
    const removeBtn = pet ? `<button class="pet-slot-remove" data-pet-slot="${n}" title="ลบ" type="button">×</button>` : "";
    return `<div class="pet-slot ${sizeCls} ${filled} ${stateCls}" data-pet-slot="${n}"${petId ? ` data-pet-id="${petId}"` : ""}>${img}${removeBtn}</div>`;
  },

  // ---- gear section ----
  renderCounterGear(c, cIdx) {
    const pattern = getPattern(c.pattern);
    const allSlots = [...pattern.back, ...pattern.front].sort((a, b) => a - b);
    const filled = allSlots.filter((n) => c.slots[String(n)]);
    if (!filled.length) return "";
    const gear = c.gear || {};
    const rows = filled.map((slotNum) => {
      const heroId = c.slots[String(slotNum)];
      const hero = getHero(heroId);
      if (!hero) return "";
      const hg = gear[heroId] || {};
      const rings = hg.rings || {};
      const overlays = hg.ringOverlays || {};
      const sets = hg.sets || {};
      const stats = hg.stats || {};
      const note = hg.note || "";
      const gSlot = (type, col, n) => {
        const isW = this.activeSlot?.type === type && this.activeSlot.cIdx === cIdx && this.activeSlot.heroId === heroId && this.activeSlot.slotNum === String(n);
        const isP = this.moveSource?.type === "gear" && this.moveSource.gearType === type && this.moveSource.cIdx === cIdx && this.moveSource.heroId === heroId && this.moveSource.slotNum === String(n);
        return this.renderGearSlot(col, n, type, isW, isP);
      };
      const makeStatRows = (arr) => arr.map((s) => `
        <div class="hero-stat-row">
          <div class="hero-stat-icon">${s.icon}</div>
          <span class="hero-stat-label">${s.label}</span>
          <input class="hero-stat-input" type="text" inputmode="text"
            data-gear-counter="${cIdx}" data-gear-hero="${heroId}" data-stat-id="${s.id}"
            value="${stats[s.id] || ""}" placeholder="—">
        </div>`).join("");
      return `<div class="hero-gear-block">
        <div class="hero-gear-row">
          <div class="hero-gear-left">
            <div class="hero-gear-portrait">
              <img src="${hero.img}" alt="${hero.name}">
              <span>${hero.name}</span>
            </div>
            <div class="hero-gear-slots">
              <div class="gear-type-row">
                <span class="gear-type-label">แหวน</span>
                <div class="gear-slots-grid" data-gear-type="ring" data-gear-counter="${cIdx}" data-gear-hero="${heroId}">
                  ${[1,2,3].map((n) => this.renderRingSlotPair(rings, overlays, n, cIdx, heroId)).join("")}
                </div>
              </div>
              <div class="gear-type-row">
                <span class="gear-type-label">เซ็ตไอเทม</span>
                <div class="gear-slots-grid" data-gear-type="set" data-gear-counter="${cIdx}" data-gear-hero="${heroId}">
                  ${[1,2,3].map((n) => gSlot("set", sets, n)).join("")}
                </div>
              </div>
            </div>
          </div>
          <div class="hero-gear-note">
            <label>สรุปรายละเอียด</label>
            <textarea data-gear-counter="${cIdx}" data-gear-hero="${heroId}" placeholder="เช่น บล็อค >> ป้องกัน >> เลือด...">${note}</textarea>
          </div>
        </div>
        <div class="hero-stats-area">
          <div class="hero-stats-table">${makeStatRows(HERO_STATS)}</div>
          <div class="hero-stats-col">
            <div class="hero-stats-table">${makeStatRows(HERO_STATS_EXT2)}</div>
            <div class="hero-stats-table">${makeStatRows(HERO_STATS_EXT)}</div>
          </div>
        </div>
      </div>`;
    }).filter(Boolean).join("");
    if (!rows) return "";
    return `<div class="hero-gear-section">
      ${rows}
      <div class="gear-confirm-row">
        <button class="btn btn-primary" data-gen-note="${cIdx}" type="button">ยืนยันและสรุปรายละเอียดอัตโนมัติ</button>
      </div>
    </div>`;
  },

  renderRingSlotPair(rings, overlays, n, cIdx, heroId) {
    const mainId = rings[String(n)];
    const ovId = (overlays || {})[String(n)];
    const mainItem = mainId ? getRing(mainId) : null;
    const ovItem = ovId ? getRing(ovId) : null;

    if (!mainItem) {
      const isW = this.activeSlot?.type === "ring" && this.activeSlot.cIdx === cIdx && this.activeSlot.heroId === heroId && this.activeSlot.slotNum === String(n);
      return `<div class="gear-slot empty ${isW ? "waiting" : ""}" data-gear-slot="${n}"><span class="slot-plus">+</span></div>`;
    }

    const isWMain = this.activeSlot?.type === "ring" && this.activeSlot.cIdx === cIdx && this.activeSlot.heroId === heroId && this.activeSlot.slotNum === String(n);
    const isPMain = this.moveSource?.type === "gear" && this.moveSource.gearType === "ring" && this.moveSource.cIdx === cIdx && this.moveSource.heroId === heroId && this.moveSource.slotNum === String(n);
    const isWOv = this.activeSlot?.type === "ring" && this.activeSlot.cIdx === cIdx && this.activeSlot.heroId === heroId && this.activeSlot.slotNum === `${n}v`;

    const mainCls = isPMain ? "picked" : isWMain ? "waiting" : "";
    const ovCls = isWOv ? "waiting" : "";
    const ovContent = ovItem
      ? `<img src="${ovItem.img}" alt="${ovItem.name}" draggable="false"><button class="gear-slot-remove" data-gear-slot="${n}v" title="ลบแหวนซ้อน" type="button">×</button>`
      : `<span class="ring-overlay-plus">+</span>`;

    return `<div class="ring-slot-pair">
      <div class="gear-slot filled ${mainCls}" data-gear-slot="${n}" data-gear-item="${mainId}">
        <img src="${mainItem.img}" alt="${mainItem.name}" draggable="false">
        <button class="gear-slot-remove" data-gear-slot="${n}" title="ลบแหวนหลัก" type="button">×</button>
      </div>
      <div class="gear-slot ring-overlay-slot ${ovItem ? "filled" : "empty"} ${ovCls}" data-gear-slot="${n}v"${ovId ? ` data-gear-item="${ovId}"` : ""}>
        ${ovContent}
      </div>
    </div>`;
  },

  renderGearSlot(items, n, type, isWaiting = false, isPicked = false) {
    const itemId = items[String(n)];
    const item = itemId ? (type === "ring" ? getRing(itemId) : getEquipmentSet(itemId)) : null;
    const filled = item ? "filled" : "empty";
    const stateCls = isPicked ? "picked" : isWaiting ? "waiting" : "";
    const img = item ? `<img src="${item.img}" alt="${item.name}" draggable="false">` : `<span class="slot-plus">+</span>`;
    const removeBtn = item ? `<button class="gear-slot-remove" data-gear-slot="${n}" title="ลบ" type="button">×</button>` : "";
    return `<div class="gear-slot ${filled} ${stateCls}" data-gear-slot="${n}"${itemId ? ` data-gear-item="${itemId}"` : ""}>${img}${removeBtn}</div>`;
  },

  // ---- counters editor ----
  renderCounters() {
    const isDefense = this.team.tab === "defense";
    const counters = this.team.counters || [];
    const cardLabel = isDefense ? "บ้านป้องกันที่" : "ทีมตอบโต้ที่";
    const items = counters.map((c, idx) => {
      const isOpen = this.openCounterCards.has(idx);
      const pattern = getPattern(c.pattern);
      const choices = this.renderPatternChoices(c.pattern, "data-set-pattern", (id) => `${idx}:${id}`);
      const pickedSlot = this.moveSource?.type === "hero" && this.moveSource.slots === c.slots ? this.moveSource.slotNum : null;
      const waitingSlot = this.activeSlot?.type === "hero" && this.activeSlot.formationKey === `counter-${idx}` ? this.activeSlot.slotNum : null;
      const pets = c.pets || {};
      const chevron = isOpen ? "▾" : "▸";
      return `<div class="counter-editor-card" data-counter-idx="${idx}">
        <div class="counter-editor-head">
          <div class="counter-head-toggle" data-toggle-counter="${idx}">
            <span class="section-chevron">${chevron}</span>
            <input class="counter-name-input" data-counter-name="${idx}" type="text"
              value="${(c.name || "").replace(/"/g, "&quot;")}"
              placeholder="${cardLabel} ${idx + 1}">
          </div>
          <div class="counter-head-actions">
            <button class="btn btn-icon btn-reorder" data-counter-up="${idx}" type="button" title="เลื่อนขึ้น" ${idx === 0 ? "disabled" : ""}>
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
            </button>
            <button class="btn btn-icon btn-reorder" data-counter-down="${idx}" type="button" title="เลื่อนลง" ${idx === counters.length - 1 ? "disabled" : ""}>
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            <button class="btn btn-icon" data-copy-counter="${idx}" type="button" title="คัดลอกไปยังทีมศัตรูอื่น">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            </button>
            <button class="btn btn-icon btn-icon-danger" data-remove-counter="${idx}" type="button" title="ลบทีมนี้">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
            </button>
          </div>
        </div>
        <div class="counter-card-body"${isOpen ? "" : ' style="display:none"'}>
          <div class="pattern-choices">${choices}</div>
          <div class="counter-formation-area">
            ${renderFormationGrid(pattern, c.slots, { editable: true, pickedSlot, waitingSlot, dotOrder: c.dotOrder, formationKey: `counter-${idx}` })}
            ${this.renderPetSlotsPanel(pets, `counter-${idx}`)}
          </div>
          ${this.renderCounterGear(c, idx)}
          <div class="counter-team-note-section">
            <label class="counter-team-note-label">สรุปรายละเอียดทีม</label>
            <textarea class="counter-team-note-input" data-counter-note="${idx}" placeholder="เช่น ลำดับการใช้สกิล / ข้อควรระวัง / หมายเหตุพิเศษ...">${c.teamNote || ""}</textarea>
          </div>
        </div>
      </div>`;
    }).join("");

    let disabledAttr = "", titleAttr = "";
    if (!isDefense) {
      const enemyFilled = countFilledSlots(this.team.enemy.slots) >= MAX_FORMATION_HEROES;
      disabledAttr = enemyFilled ? "" : "disabled";
      titleAttr = enemyFilled ? "" : `title="ใส่ตัวละครทีมศัตรูให้ครบ ${MAX_FORMATION_HEROES} ตัวก่อน"`;
    }
    const sectionTitle = isDefense ? "ทีมป้องกันบ้านที่แนะนำ" : "ทีมตอบโต้ที่แนะนำ";
    return `
      <div class="editor-section-title">${sectionTitle}</div>
      <div class="counters-editor">${items}</div>
      ${isDefense ? "" : `<button class="btn" id="addCounterBtn" type="button" style="margin-top:10px;" ${disabledAttr} ${titleAttr}>+ เพิ่มทีมตอบโต้</button>`}`;
  },

  // ---- palette ----
  renderPalette() {
    const hasCounters = (this.team.counters || []).length > 0;
    if (!hasCounters && this.paletteTab !== "hero") this.paletteTab = "hero";
    const dis = hasCounters ? "" : " disabled";
    const t = this.paletteTab;
    const tabBar = `<div class="palette-tabs">
      <button class="palette-tab ${t === "hero" ? "active" : ""}" data-tab="hero">ตัวละคร</button>
      <button class="palette-tab ${t === "pet" ? "active" : ""}" data-tab="pet"${dis}>สัตว์เลี้ยง</button>
      <button class="palette-tab ${t === "ring" ? "active" : ""}" data-tab="ring"${dis}>แหวน</button>
      <button class="palette-tab ${t === "set" ? "active" : ""}" data-tab="set"${dis}>เซ็ตไอเทม</button>
    </div>`;
    if (t === "pet") {
      const pets = PETS.filter((p) => !this.petFilter || p.name.toLowerCase().includes(this.petFilter.toLowerCase()));
      return `<div class="editor-section-title">คลัง</div>${tabBar}
        <div class="hero-search-row"><input type="text" class="hero-search" id="petSearch" placeholder="ค้นหาสัตว์เลี้ยง..." value="${this.petFilter}"></div>
        <div class="hero-grid" id="petGridContainer">${this.petGridHtml(pets)}</div>`;
    }
    if (t === "ring") {
      const rings = RINGS.filter((r) => ringMatchesQuery(r, this.ringFilter));
      return `<div class="editor-section-title">คลัง</div>${tabBar}
        <div class="hero-search-row"><input type="text" class="hero-search" id="ringSearch" placeholder="ค้นหาแหวน..." value="${this.ringFilter}"></div>
        <div class="hero-grid" id="ringGridContainer">${this.ringGridHtml(rings)}</div>`;
    }
    if (t === "set") {
      const sets = EQUIPMENT_SETS.filter((s) => !this.setFilter || s.name.toLowerCase().includes(this.setFilter.toLowerCase()));
      return `<div class="editor-section-title">คลัง</div>${tabBar}
        <div class="hero-search-row"><input type="text" class="hero-search" id="setSearch" placeholder="ค้นหาเซ็ตไอเทม..." value="${this.setFilter}"></div>
        <div class="hero-grid" id="setGridContainer">${this.setGridHtml(sets)}</div>`;
    }
    const TIER_PILLS = [
      { key: null,       label: "ทั้งหมด", cls: "" },
      { key: "awake",    label: "Awake",    cls: "tp-1" },
      { key: "legend++", label: "Legend++", cls: "tp-2" },
      { key: "legend+",  label: "Legend+",  cls: "tp-3" },
      { key: "legend",   label: "Legend",   cls: "tp-5" },
      { key: "rare",     label: "Rare",     cls: "tp-6" },
    ];
    const pillBar = `<div class="tier-filter-pills">${
      TIER_PILLS.map((p) =>
        `<button class="tier-pill ${p.cls} ${this.heroTierFilter === p.key ? "active" : ""}" data-tier-filter="${p.key ?? "all"}">${p.label}</button>`
      ).join("")
    }</div>`;
    const heroes = HEROES.filter((h) => this._heroVisible(h));
    return `<div class="editor-section-title">คลัง</div>
      <p class="hint">ลากตัวละครไปวางในช่อง หรือกดช่องว่างเพื่อเลือกจากคลัง</p>
      ${tabBar}
      <div class="hero-search-row">
        <input type="text" class="hero-search" id="heroSearch" placeholder="ค้นหาตัวละคร..." value="${this.heroFilter}">
        ${pillBar}
      </div>
      <div class="hero-grid" id="heroGridContainer">${this.heroGridHtml(heroes)}</div>`;
  },

  _heroVisible(h) {
    if (!heroMatchesQuery(h, this.heroFilter)) return false;
    const f = this.heroTierFilter;
    if (!f) return true;
    if (f === "legend+") return h.tier === 3 || h.tier === 4;
    return h.tier === { awake: 1, "legend++": 2, legend: 5, rare: 6 }[f];
  },

  // ---- grid HTML ----
  heroGridHtml(heroes) {
    const groups = HERO_TIERS
      .map((t) => ({ tier: t.tier, label: t.label, heroes: heroes.filter((h) => h.tier === t.tier) }))
      .filter((g) => g.heroes.length > 0);
    return groups.map((g) =>
      `<div class="palette-tier-header palette-tier-${g.tier}">${g.label}</div>` +
      g.heroes.map((h) =>
        `<div class="hero-chip ${this.selectedHero === h.id ? "selected" : ""}" draggable="true" data-hero="${h.id}">
          <img src="${h.img}" alt="${h.name}"><span>${h.name}</span></div>`
      ).join("")
    ).join("");
  },
  petGridHtml(pets) {
    return pets.map((p) =>
      `<div class="hero-chip ${this.selectedPet === p.id ? "selected" : ""}" draggable="true" data-pet="${p.id}">
        <img src="${p.img}" alt="${p.name}"><span>${p.name}</span></div>`
    ).join("");
  },
  ringGridHtml(rings) {
    return rings.map((r) =>
      `<div class="hero-chip ${this.selectedRing === r.id ? "selected" : ""}" draggable="true" data-ring="${r.id}">
        <img src="${r.img}" alt="${r.name}"><span>${r.name}</span></div>`
    ).join("");
  },
  setGridHtml(sets) {
    return sets.map((s) =>
      `<div class="hero-chip ${this.selectedSet === s.id ? "selected" : ""}" draggable="true" data-set="${s.id}">
        <img src="${s.img}" alt="${s.name}"><span>${s.name}</span></div>`
    ).join("");
  },

  // ---- main render ----
  renderPanel() {
    const panel = document.getElementById("editorPanel");
    const t = this.team;
    const isDefense = t.tab === "defense";
    // Auto-expand palette whenever a slot is waiting for an item
    if (this.activeSlot !== null) this.paletteCollapsed = false;
    panel.innerHTML = `
      <div class="editor-panel">
        <div class="editor-section-title">ข้อมูลทีม</div>
        <div class="field-row">
          <div class="field">
            <label>${isDefense ? "ชื่อทีมป้องกัน" : "ชื่อทีมศัตรู"}</label>
            <input type="text" id="teamNameInput" value="${t.name.replace(/"/g, "&quot;")}" placeholder="${isDefense ? "บ้านป้องกัน..." : "อีวาน / คาริน / ซิลเวสตา"}">
          </div>
          <div class="field">
            <label>ประเภททีม</label>
            <select id="teamCategorySelect">
              ${CATEGORIES.map((c) => `<option value="${c.id}" ${c.id === t.category ? "selected" : ""}>${c.label}</option>`).join("")}
            </select>
          </div>
        </div>
        ${isDefense ? "" : this.renderEnemyEditor()}
        ${this.renderCounters()}
        <div class="btn-group" style="margin-top:18px; justify-content:flex-end;">
          <button class="btn" id="cancelEditBtn" type="button">ยกเลิก</button>
          <button class="btn btn-primary" id="saveTeamBtn" type="button">บันทึก</button>
        </div>
      </div>`;
    const dock = document.getElementById("paletteDock");
    dock.innerHTML = `
      <div class="palette-dock-header" id="paletteDockHeader">
        <span class="palette-dock-title">คลัง</span>
        <button class="palette-dock-toggle" id="paletteDockToggle">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
          <span>${this.paletteCollapsed ? "แสดงคลัง" : "ซ่อนคลัง"}</span>
        </button>
      </div>
      <div class="palette-dock-body">
        ${this.renderPalette()}
      </div>`;
    dock.style.display = "block";
    dock.classList.toggle("collapsed", this.paletteCollapsed);
    document.getElementById("adminView").style.paddingBottom =
      this.paletteCollapsed ? "56px" : "370px";
    this.bindPanelEvents();
  },

  // ---- events ----
  bindPanelEvents() {
    const panel = document.getElementById("editorPanel");

    document.getElementById("teamNameInput").addEventListener("input", (e) => { this.team.name = e.target.value; });
    document.getElementById("teamCategorySelect").addEventListener("change", (e) => { this.team.category = e.target.value; });
    document.getElementById("saveTeamBtn").addEventListener("click", () => this.save());
    document.getElementById("cancelEditBtn").addEventListener("click", () => this.closeEditor());

    // Section collapse toggles
    const enemyToggle = panel.querySelector("[data-toggle-section='enemy']");
    if (enemyToggle) enemyToggle.addEventListener("click", () => { this.enemySectionOpen = !this.enemySectionOpen; this.renderPanel(); });

    panel.querySelectorAll("[data-toggle-counter]").forEach((el) =>
      el.addEventListener("click", () => {
        const idx = Number(el.dataset.toggleCounter);
        if (this.openCounterCards.has(idx)) this.openCounterCards.delete(idx);
        else this.openCounterCards.add(idx);
        this.renderPanel();
      })
    );

    // Palette tab switching (palette is in #paletteDock, not in panel)
    document.querySelectorAll(".palette-tab").forEach((btn) =>
      btn.addEventListener("click", () => {
        this.paletteTab = btn.dataset.tab;
        this.selectedHero = null; this.selectedPet = null;
        this.selectedRing = null; this.selectedSet = null;
        this.activeSlot = null; this.moveSource = null;
        this.renderPanel();
      })
    );

    // Tier filter pills
    document.querySelectorAll(".tier-pill").forEach((btn) =>
      btn.addEventListener("click", () => {
        const v = btn.dataset.tierFilter;
        this.heroTierFilter = v === "all" ? null : v;
        document.querySelectorAll(".tier-pill").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        document.getElementById("heroGridContainer").innerHTML = this.heroGridHtml(HEROES.filter((h) => this._heroVisible(h)));
        this.bindHeroChips();
      })
    );

    // Search inputs
    const heroSearch = document.getElementById("heroSearch");
    if (heroSearch) heroSearch.addEventListener("input", (e) => {
      this.heroFilter = e.target.value;
      document.getElementById("heroGridContainer").innerHTML = this.heroGridHtml(HEROES.filter((h) => this._heroVisible(h)));
      this.bindHeroChips();
    });

    const petSearch = document.getElementById("petSearch");
    if (petSearch) petSearch.addEventListener("input", (e) => {
      this.petFilter = e.target.value;
      const pets = PETS.filter((p) => !this.petFilter || p.name.toLowerCase().includes(this.petFilter.toLowerCase()));
      document.getElementById("petGridContainer").innerHTML = this.petGridHtml(pets);
      this.bindPetChips();
    });

    const ringSearch = document.getElementById("ringSearch");
    if (ringSearch) ringSearch.addEventListener("input", (e) => {
      this.ringFilter = e.target.value;
      const rings = RINGS.filter((r) => ringMatchesQuery(r, this.ringFilter));
      document.getElementById("ringGridContainer").innerHTML = this.ringGridHtml(rings);
      this.bindRingChips();
    });

    const setSearch = document.getElementById("setSearch");
    if (setSearch) setSearch.addEventListener("input", (e) => {
      this.setFilter = e.target.value;
      const sets = EQUIPMENT_SETS.filter((s) => !this.setFilter || s.name.toLowerCase().includes(this.setFilter.toLowerCase()));
      document.getElementById("setGridContainer").innerHTML = this.setGridHtml(sets);
      this.bindSetChips();
    });

    // Add/remove counters
    const addCounterBtn = document.getElementById("addCounterBtn");
    if (addCounterBtn) addCounterBtn.addEventListener("click", () => {
      this.team.counters.push({ id: uid(), pattern: "basic", slots: {} });
      const newIdx = this.team.counters.length - 1;
      this.enemySectionOpen = false;
      this.openCounterCards = new Set([newIdx]);
      this.activeSlot = null; this.moveSource = null;
      this.renderPanel();
    });

    // Counter team note
    panel.querySelectorAll("[data-counter-note]").forEach((ta) =>
      ta.addEventListener("input", () => {
        this.team.counters[Number(ta.dataset.counterNote)].teamNote = ta.value;
      })
    );

    // Counter name inputs
    panel.querySelectorAll(".counter-name-input").forEach((inp) => {
      inp.addEventListener("click", (e) => e.stopPropagation());
      inp.addEventListener("input", () => {
        this.team.counters[Number(inp.dataset.counterName)].name = inp.value;
      });
    });

    // Counter reorder
    panel.querySelectorAll("[data-counter-up]").forEach((b) =>
      b.addEventListener("click", () => {
        const idx = Number(b.dataset.counterUp);
        if (idx === 0) return;
        [this.team.counters[idx - 1], this.team.counters[idx]] = [this.team.counters[idx], this.team.counters[idx - 1]];
        const adj = new Set();
        this.openCounterCards.forEach((i) => {
          if (i === idx) adj.add(idx - 1);
          else if (i === idx - 1) adj.add(idx);
          else adj.add(i);
        });
        this.openCounterCards = adj;
        this.renderPanel();
      })
    );
    panel.querySelectorAll("[data-counter-down]").forEach((b) =>
      b.addEventListener("click", () => {
        const idx = Number(b.dataset.counterDown);
        if (idx >= this.team.counters.length - 1) return;
        [this.team.counters[idx], this.team.counters[idx + 1]] = [this.team.counters[idx + 1], this.team.counters[idx]];
        const adj = new Set();
        this.openCounterCards.forEach((i) => {
          if (i === idx) adj.add(idx + 1);
          else if (i === idx + 1) adj.add(idx);
          else adj.add(i);
        });
        this.openCounterCards = adj;
        this.renderPanel();
      })
    );

    panel.querySelectorAll("[data-copy-counter]").forEach((b) =>
      b.addEventListener("click", () => {
        const idx = Number(b.dataset.copyCounter);
        Modal.copyCounter(this.team.counters[idx], this.team.id, this.team.tab || "attack");
      })
    );

    panel.querySelectorAll("[data-remove-counter]").forEach((b) =>
      b.addEventListener("click", () => {
        const removedIdx = Number(b.dataset.removeCounter);
        const isDefense = this.team.tab === "defense";
        Modal.confirm(`ลบ${isDefense ? "บ้านป้องกันที่" : "ทีมตอบโต้ที่"} ${removedIdx + 1} ออกใช่หรือไม่?`, () => {
          this.team.counters.splice(removedIdx, 1);
          const adjusted = new Set();
          this.openCounterCards.forEach((i) => {
            if (i < removedIdx) adjusted.add(i);
            else if (i > removedIdx) adjusted.add(i - 1);
          });
          this.openCounterCards = adjusted;
          this.activeSlot = null; this.moveSource = null;
          this.renderPanel();
        });
      })
    );

    // Pattern choices
    panel.querySelectorAll("[data-set-enemy-pattern]").forEach((b) =>
      b.addEventListener("click", () => {
        if (this.team.enemy.pattern === b.dataset.setEnemyPattern) return;
        this.team.enemy.pattern = b.dataset.setEnemyPattern;
        this.renderPanel();
      })
    );
    panel.querySelectorAll("[data-set-pattern]").forEach((b) =>
      b.addEventListener("click", () => {
        const [idx, patternId] = b.dataset.setPattern.split(":");
        const counter = this.team.counters[Number(idx)];
        if (counter.pattern === patternId) return;
        counter.pattern = patternId;
        this.renderPanel();
      })
    );

    // Remove buttons
    panel.querySelectorAll(".slot-remove").forEach((btn) =>
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const counterCard = btn.closest(".counter-editor-card");
        const fKey = counterCard ? `counter-${counterCard.dataset.counterIdx}` : "enemy";
        const slots = counterCard ? this.team.counters[Number(counterCard.dataset.counterIdx)].slots : this.team.enemy.slots;
        const heroId = slots[btn.dataset.slot];
        const heroName = heroId ? (getHero(heroId)?.name || "") : "";
        Modal.confirm(`ลบ${heroName ? ` "${heroName}" ` : "ตัวละคร"}ออกจากช่องนี้?`, () => {
          delete slots[btn.dataset.slot];
          this.setDotOrder(fKey, this.getDotOrder(fKey).filter((d) => d.slot !== btn.dataset.slot));
          this.renderPanel();
        });
      })
    );

    // Dot buttons (A / U / L priority markers)
    panel.querySelectorAll(".slot-dot").forEach((dotBtn) =>
      dotBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const grid = dotBtn.closest("[data-formation-key]");
        if (grid) this.handleDotClick(dotBtn.dataset.dotSlot, dotBtn.dataset.dot, grid.dataset.formationKey);
      })
    );
    panel.querySelectorAll(".pet-slot-remove").forEach((btn) =>
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const target = btn.closest("[data-pet-target]").dataset.petTarget;
        Modal.confirm("ลบสัตว์เลี้ยงออกจากช่องนี้?", () => {
          this.removePetFromSlot(target, btn.dataset.petSlot);
        });
      })
    );
    panel.querySelectorAll(".gear-slot-remove").forEach((btn) =>
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const grid = btn.closest("[data-gear-type]");
        const { gearType, gearCounter, gearHero } = grid.dataset;
        const label = gearType === "ring" ? "แหวน" : "เซ็ตไอเทม";
        Modal.confirm(`ลบ${label}ออกจากช่องนี้?`, () => {
          this.removeGear(gearType, Number(gearCounter), gearHero, btn.dataset.gearSlot);
        });
      })
    );

    // Gear note textarea (no re-render)
    panel.querySelectorAll("textarea[data-gear-hero]").forEach((ta) =>
      ta.addEventListener("input", () => {
        this.getGearObj(Number(ta.dataset.gearCounter), ta.dataset.gearHero).note = ta.value;
      })
    );
    panel.querySelectorAll("[data-gen-note]").forEach((btn) =>
      btn.addEventListener("click", () => this.generateNotes(Number(btn.dataset.genNote)))
    );
    panel.querySelectorAll("input[data-stat-id]").forEach((inp) =>
      inp.addEventListener("input", () => {
        const g = this.getGearObj(Number(inp.dataset.gearCounter), inp.dataset.gearHero);
        if (!g.stats) g.stats = {};
        g.stats[inp.dataset.statId] = inp.value;
      })
    );

    // Wire formation slots
    const enemyWrap = panel.querySelector('[data-formation="enemy"]');
    if (enemyWrap) enemyWrap.querySelectorAll(".formation-slot[data-slot]").forEach((slot) =>
      this.wireSlot(slot, this.team.enemy.slots, slot.dataset.slot, "enemy")
    );
    panel.querySelectorAll(".counter-editor-card").forEach((card) => {
      const cIdx = Number(card.dataset.counterIdx);
      card.querySelectorAll(".formation-slot[data-slot]").forEach((slot) =>
        this.wireSlot(slot, this.team.counters[cIdx].slots, slot.dataset.slot, `counter-${cIdx}`)
      );
    });

    // Wire pet slots
    panel.querySelectorAll("[data-pet-target] .pet-slot[data-pet-slot]").forEach((slot) => {
      const target = slot.closest("[data-pet-target]").dataset.petTarget;
      this.wirePetSlot(slot, slot.dataset.petSlot, target, slot.dataset.petId || null);
    });

    // Wire gear slots
    panel.querySelectorAll("[data-gear-type]").forEach((grid) => {
      const { gearType, gearCounter, gearHero } = grid.dataset;
      grid.querySelectorAll(".gear-slot[data-gear-slot]:not(.ring-overlay-slot)").forEach((slot) =>
        this.wireGearSlot(slot, gearType, Number(gearCounter), gearHero, slot.dataset.gearSlot, slot.dataset.gearItem || null)
      );
      if (gearType === "ring") {
        grid.querySelectorAll(".ring-overlay-slot[data-gear-slot]").forEach((slot) =>
          this.wireOverlaySlot(slot, Number(gearCounter), gearHero, slot.dataset.gearSlot, slot.dataset.gearItem || null)
        );
      }
    });

    // Palette dock toggle
    const dockToggle = document.getElementById("paletteDockToggle");
    if (dockToggle) dockToggle.addEventListener("click", () => {
      this.paletteCollapsed = !this.paletteCollapsed;
      const dock = document.getElementById("paletteDock");
      dock.classList.toggle("collapsed", this.paletteCollapsed);
      document.getElementById("adminView").style.paddingBottom =
        this.paletteCollapsed ? "56px" : "370px";
      const label = dockToggle.querySelector("span");
      if (label) label.textContent = this.paletteCollapsed ? "แสดงคลัง" : "ซ่อนคลัง";
    });

    // Bind palette chips
    if (this.paletteTab === "pet") this.bindPetChips();
    else if (this.paletteTab === "ring") this.bindRingChips();
    else if (this.paletteTab === "set") this.bindSetChips();
    else this.bindHeroChips();
  },

  // ---- gear data ----
  getGearObj(cIdx, heroId) {
    const c = this.team.counters[cIdx];
    if (!c.gear) c.gear = {};
    if (!c.gear[heroId]) c.gear[heroId] = { rings: {}, ringOverlays: {}, sets: {}, stats: {}, note: "" };
    return c.gear[heroId];
  },
  assignGear(gearType, cIdx, heroId, gearSlotNum, itemId) {
    const gear = this.getGearObj(cIdx, heroId);
    const s = String(gearSlotNum);
    if (gearType === "ring" && s.endsWith("v")) {
      if (!gear.ringOverlays) gear.ringOverlays = {};
      gear.ringOverlays[s.slice(0, -1)] = itemId;
    } else {
      (gearType === "ring" ? gear.rings : gear.sets)[s] = itemId;
    }
    this.selectedRing = null; this.selectedSet = null; this.activeSlot = null;
    this.renderPanel();
  },
  removeGear(gearType, cIdx, heroId, gearSlotNum) {
    const gear = this.getGearObj(cIdx, heroId);
    const s = String(gearSlotNum);
    if (gearType === "ring" && s.endsWith("v")) {
      if (gear.ringOverlays) delete gear.ringOverlays[s.slice(0, -1)];
    } else {
      delete (gearType === "ring" ? gear.rings : gear.sets)[s];
    }
    this.renderPanel();
  },
  generateNotes(cIdx) {
    const SHORT = {
      atk: "โจมตี", def: "ป้องกัน", hp: "HP",
      atkSpd: "ความเร็ว", critRate: "คริ", critDmg: "ดาเมจคริ",
      weakPt: "จุดอ่อน", blockRate: "บล็อก", dmgRed: "ลดดาเมจ",
      bonusDmg: "เสริมดาเมจ", crush: "บดขยี้", resilience: "ยึดหยุ่น", recovery: "ฟื้นคืน"
    };
    const RING_ALIAS = {
      "แหวนแห่งการคืนชีพระดับสูง": "แหวนชุบ6*",
      "แหวนแห่งการคืนชีพ": "แหวนชุบ5*",
      "แหวนแห่งการคืนชีพเก่า": "แหวนชุบ4*",
      "แหวนอมตะระดับสูง": "แหวนอมตะ 6*",
      "แหวนอมตะ": "แหวนอมตะ 5*",
      "แหวนอมตะเก่า": "แหวนอมตะ 4*",
      "แหวนแห่งอำนาจระดับสูง": "แหวนอำนาจ 6*",
      "แหวนแห่งอำนาจ": "แหวนอำนาจ 5*",
      "แหวนแห่งอำนาจเก่า": "แหวนอำนาจ4*",
    };
    const ra = (name) => RING_ALIAS[name] || name;
    const c = this.team.counters[cIdx];
    const pattern = getPattern(c.pattern);
    const filled = [...pattern.back, ...pattern.front].filter((n) => c.slots[String(n)]);
    filled.forEach((slotNum) => {
      const heroId = c.slots[String(slotNum)];
      const g = this.getGearObj(cIdx, heroId);
      const rings = g.rings || {};
      const ringOverlays = g.ringOverlays || {};
      const sets = g.sets || {};
      const stats = g.stats || {};
      const ringNames = [1, 2, 3].map((n) => {
        const mainId = rings[String(n)];
        if (!mainId) return null;
        const mainName = ra(getRing(mainId)?.name || mainId);
        const ovId = ringOverlays[String(n)];
        if (ovId) return `${mainName} ซ้อน ${ra(getRing(ovId)?.name || ovId)}`;
        return mainName;
      }).filter(Boolean);
      const setNames = [1, 2, 3].map((n) => sets[String(n)]).filter(Boolean)
        .map((id) => getEquipmentSet(id)?.name || id);
      const statParts = [...HERO_STATS, ...HERO_STATS_EXT2, ...HERO_STATS_EXT]
        .filter((s) => stats[s.id] !== undefined && stats[s.id] !== "")
        .map((s) => `${SHORT[s.id] || s.label} ${stats[s.id]}`);
      const lines = [];
      if (ringNames.length) lines.push(`แหวน: ${ringNames.join(", ")}`);
      if (setNames.length) lines.push(`เซ็ต: ${setNames.join(", ")}`);
      if (statParts.length) lines.push(statParts.join(" | "));
      g.note = lines.join("\n");
    });
    this.renderPanel();
  },

  swapGearSlots(gearType, cIdx, heroId, fromSlot, toSlot) {
    this.dragSource = null; this.moveSource = null;
    if (fromSlot === toSlot) { this.renderPanel(); return; }
    const col = gearType === "ring" ? this.getGearObj(cIdx, heroId).rings : this.getGearObj(cIdx, heroId).sets;
    const a = col[String(fromSlot)], b = col[String(toSlot)];
    if (b) col[String(fromSlot)] = b; else delete col[String(fromSlot)];
    col[String(toSlot)] = a;
    this.renderPanel();
  },

  // ---- pet data ----
  getPetsObj(target) {
    if (target === "enemy") { if (!this.team.enemy.pets) this.team.enemy.pets = {}; return this.team.enemy.pets; }
    const idx = Number(target.replace("counter-", ""));
    if (!this.team.counters[idx].pets) this.team.counters[idx].pets = {};
    return this.team.counters[idx].pets;
  },
  assignPet(target, slotNum, petId) {
    const pets = this.getPetsObj(target);
    const isDup = Object.entries(pets).some(([k, v]) => v === petId && k !== String(slotNum));
    if (isDup) { toast("สัตว์เลี้ยงนี้ถูกใช้ในทีมนี้แล้ว"); return; }
    pets[String(slotNum)] = petId;
    this.selectedPet = null; this.activeSlot = null;
    this.renderPanel();
  },
  removePetFromSlot(target, slotNum) {
    delete this.getPetsObj(target)[String(slotNum)];
    this.renderPanel();
  },
  swapPetSlots(target, fromSlot, toSlot) {
    this.dragSource = null; this.moveSource = null;
    if (fromSlot === toSlot) { this.renderPanel(); return; }
    const pets = this.getPetsObj(target);
    const a = pets[String(fromSlot)], b = pets[String(toSlot)];
    if (b) pets[String(fromSlot)] = b; else delete pets[String(fromSlot)];
    pets[String(toSlot)] = a;
    this.renderPanel();
  },

  // ---- hero formation ----
  assignToSlots(slots, slotNum, heroId) {
    const isDup = Object.entries(slots).some(([k, v]) => v === heroId && k !== slotNum);
    if (isDup) { toast("ตัวละครนี้ถูกใช้ในทีมนี้แล้ว"); return; }
    if (!slots[slotNum] && countFilledSlots(slots) >= MAX_FORMATION_HEROES) {
      toast(`ใส่ได้สูงสุด ${MAX_FORMATION_HEROES} ตัวละครต่อทีม`); return;
    }
    slots[slotNum] = heroId;
    this.selectedHero = null; this.activeSlot = null;
    if (slots === this.team.enemy.slots) { this.lastFormationKey = "enemy"; this.autoNameEnemyTeam(); }
    else { const i = this.team.counters.findIndex((c) => c.slots === slots); if (i >= 0) this.lastFormationKey = `counter-${i}`; }
    this.renderPanel();
  },
  moveWithinFormation(slots, fromSlot, toSlot) {
    this.moveSource = null; this.dragSource = null; this.activeSlot = null;
    if (fromSlot === toSlot) { this.renderPanel(); return; }
    const a = slots[fromSlot], b = slots[toSlot];
    if (b) { slots[fromSlot] = b; slots[toSlot] = a; }
    else { delete slots[fromSlot]; slots[toSlot] = a; }

    // Migrate dot references: two-pass to avoid collision on swaps
    let fKey = null;
    if (slots === this.team.enemy.slots) fKey = "enemy";
    else { const i = this.team.counters.findIndex((c) => c.slots === slots); if (i >= 0) fKey = `counter-${i}`; }
    if (fKey) {
      const from = String(fromSlot), to = String(toSlot);
      const updated = this.getDotOrder(fKey)
        .map((d) => ({ ...d, slot: d.slot === from ? "\x00" : d.slot }))
        .map((d) => ({ ...d, slot: d.slot === to && b ? from : (d.slot === "\x00" ? to : d.slot) }));
      this.setDotOrder(fKey, updated);
    }

    if (slots === this.team.enemy.slots) this.autoNameEnemyTeam();
    this.renderPanel();
  },
  autoNameEnemyTeam() {
    const slots = this.team.enemy.slots;
    if (countFilledSlots(slots) !== MAX_FORMATION_HEROES) return;
    const pattern = getPattern(this.team.enemy.pattern);
    const names = [...pattern.back, ...pattern.front]
      .map((n) => slots[String(n)]).filter(Boolean)
      .map((id) => getHero(id)?.name || id);
    this.team.name = names.join(" / ");
  },

  // ---- dot order (A/U/L priority markers) ----
  getDotOrder(formationKey) {
    if (formationKey === "enemy") return this.team.enemy.dotOrder || [];
    const idx = Number(formationKey.replace("counter-", ""));
    return (this.team.counters[idx] || {}).dotOrder || [];
  },
  setDotOrder(formationKey, dotOrder) {
    if (formationKey === "enemy") { this.team.enemy.dotOrder = dotOrder; return; }
    const idx = Number(formationKey.replace("counter-", ""));
    if (this.team.counters[idx]) this.team.counters[idx].dotOrder = dotOrder;
  },
  handleDotClick(slotNum, dotLabel, formationKey) {
    const order = [...this.getDotOrder(formationKey)];
    const ei = order.findIndex((d) => d.slot === String(slotNum) && d.dot === dotLabel);
    if (ei >= 0) {
      order.splice(ei, 1);
    } else {
      if (order.length >= 3) order.shift();
      order.push({ slot: String(slotNum), dot: dotLabel });
    }
    this.setDotOrder(formationKey, order);
    Store.saveDraft();
    this.renderPanel();
  },

  // ---- chip binding ----
  bindHeroChips() {
    document.querySelectorAll(".hero-chip[data-hero]").forEach((chip) => {
      const heroId = chip.dataset.hero;
      chip.addEventListener("dragstart", (e) => e.dataTransfer.setData("text/plain", heroId));
      chip.addEventListener("click", () => {
        // Slot-first: active hero slot waiting → place directly
        if (this.activeSlot?.type === "hero") {
          const slots = this.getSlotsForFormationKey(this.activeSlot.formationKey);
          this.assignToSlots(slots, this.activeSlot.slotNum, heroId);
          return;
        }
        // Auto-place: find next empty slot in last-used formation
        const target = this.nextEmptySlotFor(this.lastFormationKey);
        if (target) {
          this.assignToSlots(target.slots, target.slotNum, heroId);
          return;
        }
        // Formation full — fall back to chip selection so user can pick a specific slot
        this.selectedHero = this.selectedHero === heroId ? null : heroId;
        document.querySelectorAll(".hero-chip[data-hero]").forEach((c) =>
          c.classList.toggle("selected", c.dataset.hero === this.selectedHero)
        );
      });
    });
  },
  bindPetChips() {
    document.querySelectorAll(".hero-chip[data-pet]").forEach((chip) => {
      const petId = chip.dataset.pet;
      chip.addEventListener("dragstart", (e) => e.dataTransfer.setData("text/pet", petId));
      chip.addEventListener("click", () => {
        if (this.activeSlot?.type === "pet") {
          this.assignPet(this.activeSlot.target, this.activeSlot.slotNum, petId);
          return;
        }
        this.selectedPet = this.selectedPet === petId ? null : petId;
        document.querySelectorAll(".hero-chip[data-pet]").forEach((c) =>
          c.classList.toggle("selected", c.dataset.pet === this.selectedPet)
        );
      });
    });
  },
  bindRingChips() {
    document.querySelectorAll(".hero-chip[data-ring]").forEach((chip) => {
      const ringId = chip.dataset.ring;
      chip.addEventListener("dragstart", (e) => e.dataTransfer.setData("text/ring", ringId));
      chip.addEventListener("click", () => {
        if (this.activeSlot?.type === "ring") {
          this.assignGear("ring", this.activeSlot.cIdx, this.activeSlot.heroId, this.activeSlot.slotNum, ringId);
          return;
        }
        this.selectedRing = this.selectedRing === ringId ? null : ringId;
        document.querySelectorAll(".hero-chip[data-ring]").forEach((c) =>
          c.classList.toggle("selected", c.dataset.ring === this.selectedRing)
        );
      });
    });
  },
  bindSetChips() {
    document.querySelectorAll(".hero-chip[data-set]").forEach((chip) => {
      const setId = chip.dataset.set;
      chip.addEventListener("dragstart", (e) => e.dataTransfer.setData("text/equipment-set", setId));
      chip.addEventListener("click", () => {
        if (this.activeSlot?.type === "set") {
          this.assignGear("set", this.activeSlot.cIdx, this.activeSlot.heroId, this.activeSlot.slotNum, setId);
          return;
        }
        this.selectedSet = this.selectedSet === setId ? null : setId;
        document.querySelectorAll(".hero-chip[data-set]").forEach((c) =>
          c.classList.toggle("selected", c.dataset.set === this.selectedSet)
        );
      });
    });
  },

  // ---- slot wiring ----
  wireSlot(slot, slots, slotNum, formationKey) {
    if (slots[slotNum]) {
      slot.setAttribute("draggable", "true");
      slot.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", slots[slotNum]);
        this.dragSource = { type: "hero", slots, slotNum };
      });
      slot.addEventListener("dragend", () => { this.dragSource = null; });
    }
    slot.addEventListener("dragover", (e) => { e.preventDefault(); slot.classList.add("dragover"); });
    slot.addEventListener("dragleave", () => slot.classList.remove("dragover"));
    slot.addEventListener("drop", (e) => {
      e.preventDefault(); slot.classList.remove("dragover");
      if (this.dragSource?.type === "hero" && this.dragSource.slots === slots) {
        this.moveWithinFormation(slots, this.dragSource.slotNum, slotNum); return;
      }
      const heroId = e.dataTransfer.getData("text/plain");
      if (heroId) this.assignToSlots(slots, slotNum, heroId);
    });
    slot.addEventListener("click", (e) => {
      if (e.target.closest(".slot-remove")) return;
      // Handle move (click-to-swap)
      if (this.moveSource?.type === "hero" && this.moveSource.slots === slots) {
        if (this.moveSource.slotNum === slotNum) { this.moveSource = null; this.renderPanel(); }
        else this.moveWithinFormation(slots, this.moveSource.slotNum, slotNum);
        return;
      }
      // Item-first: selected hero → place
      if (this.selectedHero) { this.assignToSlots(slots, slotNum, this.selectedHero); return; }
      // Filled slot → pick up for move
      if (slots[slotNum]) {
        this.moveSource = { type: "hero", slots, slotNum };
        this.activeSlot = null;
        this.renderPanel(); return;
      }
      // Empty slot → slot-first: switch palette + set active
      this.activeSlot = { type: "hero", formationKey, slotNum };
      this.lastFormationKey = formationKey;
      this.moveSource = null;
      if (this.paletteTab !== "hero") { this.paletteTab = "hero"; }
      this.renderPanel();
    });
  },

  wirePetSlot(slot, slotNum, target, petId) {
    if (petId) {
      slot.setAttribute("draggable", "true");
      slot.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/pet", petId);
        this.dragSource = { type: "pet", target, slotNum };
      });
      slot.addEventListener("dragend", () => { this.dragSource = null; });
    }
    slot.addEventListener("dragover", (e) => { e.preventDefault(); slot.classList.add("dragover"); });
    slot.addEventListener("dragleave", () => slot.classList.remove("dragover"));
    slot.addEventListener("drop", (e) => {
      e.preventDefault(); slot.classList.remove("dragover");
      if (this.dragSource?.type === "pet" && this.dragSource.target === target) {
        this.swapPetSlots(target, this.dragSource.slotNum, slotNum); return;
      }
      const droppedId = e.dataTransfer.getData("text/pet");
      if (droppedId) this.assignPet(target, slotNum, droppedId);
    });
    slot.addEventListener("click", (e) => {
      if (e.target.closest(".pet-slot-remove")) return;
      // Click-to-swap
      if (this.moveSource?.type === "pet" && this.moveSource.target === target) {
        if (this.moveSource.slotNum === slotNum) { this.moveSource = null; this.renderPanel(); }
        else this.swapPetSlots(target, this.moveSource.slotNum, slotNum);
        return;
      }
      // Item-first: selectedPet → place
      if (this.selectedPet) { this.assignPet(target, slotNum, this.selectedPet); return; }
      // Filled → pick up for move
      if (petId) {
        this.moveSource = { type: "pet", target, slotNum };
        this.activeSlot = null;
        this.renderPanel(); return;
      }
      // Empty → slot-first: switch palette
      this.activeSlot = { type: "pet", target, slotNum };
      this.moveSource = null;
      if (this.paletteTab !== "pet") { this.paletteTab = "pet"; }
      this.renderPanel();
    });
  },

  wireOverlaySlot(slot, cIdx, heroId, slotNum, itemId) {
    slot.addEventListener("dragover", (e) => { e.preventDefault(); slot.classList.add("dragover"); });
    slot.addEventListener("dragleave", () => slot.classList.remove("dragover"));
    slot.addEventListener("drop", (e) => {
      e.preventDefault(); slot.classList.remove("dragover");
      const id = e.dataTransfer.getData("text/ring");
      if (id) this.assignGear("ring", cIdx, heroId, slotNum, id);
    });
    slot.addEventListener("click", (e) => {
      if (e.target.closest(".gear-slot-remove")) return;
      if (this.moveSource?.type === "gear") { this.moveSource = null; }
      if (this.selectedRing) { this.assignGear("ring", cIdx, heroId, slotNum, this.selectedRing); return; }
      this.activeSlot = { type: "ring", cIdx, heroId, slotNum };
      this.moveSource = null;
      if (this.paletteTab !== "ring") { this.paletteTab = "ring"; }
      this.renderPanel();
    });
  },

  wireGearSlot(slot, gearType, cIdx, heroId, gearSlotNum, itemId) {
    const mime = gearType === "ring" ? "text/ring" : "text/equipment-set";
    if (itemId) {
      slot.setAttribute("draggable", "true");
      slot.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData(mime, itemId);
        this.dragSource = { type: "gear", gearType, cIdx, heroId, slotNum: gearSlotNum };
      });
      slot.addEventListener("dragend", () => { this.dragSource = null; });
    }
    slot.addEventListener("dragover", (e) => { e.preventDefault(); slot.classList.add("dragover"); });
    slot.addEventListener("dragleave", () => slot.classList.remove("dragover"));
    slot.addEventListener("drop", (e) => {
      e.preventDefault(); slot.classList.remove("dragover");
      if (this.dragSource?.type === "gear" && this.dragSource.gearType === gearType && this.dragSource.cIdx === cIdx && this.dragSource.heroId === heroId) {
        this.swapGearSlots(gearType, cIdx, heroId, this.dragSource.slotNum, gearSlotNum); return;
      }
      const droppedId = e.dataTransfer.getData(mime);
      if (droppedId) this.assignGear(gearType, cIdx, heroId, gearSlotNum, droppedId);
    });
    slot.addEventListener("click", (e) => {
      if (e.target.closest(".gear-slot-remove")) return;
      // Click-to-swap
      if (this.moveSource?.type === "gear" && this.moveSource.gearType === gearType && this.moveSource.cIdx === cIdx && this.moveSource.heroId === heroId) {
        if (this.moveSource.slotNum === gearSlotNum) { this.moveSource = null; this.renderPanel(); }
        else this.swapGearSlots(gearType, cIdx, heroId, this.moveSource.slotNum, gearSlotNum);
        return;
      }
      // Item-first: selected item → place
      const sel = gearType === "ring" ? this.selectedRing : this.selectedSet;
      if (sel) { this.assignGear(gearType, cIdx, heroId, gearSlotNum, sel); return; }
      // Filled → pick up for move
      if (itemId) {
        this.moveSource = { type: "gear", gearType, cIdx, heroId, slotNum: gearSlotNum };
        this.activeSlot = null;
        this.renderPanel(); return;
      }
      // Empty → slot-first: switch palette
      this.activeSlot = { type: gearType, cIdx, heroId, slotNum: gearSlotNum };
      this.moveSource = null;
      if (this.paletteTab !== gearType) { this.paletteTab = gearType; }
      this.renderPanel();
    });
  }
};

function toast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove("show"), 2200);
}

const Modal = {
  confirm(text, onOk) {
    const overlay = document.getElementById("confirmModal");
    document.getElementById("confirmText").textContent = text;
    overlay.classList.add("open");
    const ok = document.getElementById("confirmOk");
    const cancel = document.getElementById("confirmCancel");
    const close = () => overlay.classList.remove("open");
    ok.onclick = () => { close(); onOk(); };
    cancel.onclick = close;
  },

  copyCounter(counter, currentTeamId, tab) {
    const teams = Store.getTeams().filter(
      (t) => t.id !== currentTeamId && (t.tab || "attack") === tab
    );
    if (!teams.length) {
      toast("ไม่มีทีมศัตรูอื่นในหมวดนี้");
      return;
    }
    const overlay = document.getElementById("copyCounterModal");
    const list = document.getElementById("copyCounterTeamList");
    list.innerHTML = teams.map((t) => `
      <label class="copy-counter-team-item">
        <input type="checkbox" value="${t.id}">
        <span class="copy-team-name">${t.name || "(ไม่มีชื่อ)"}</span>
        <span class="copy-team-count">${(t.counters || []).length} ทีมแก้</span>
      </label>
    `).join("");
    overlay.classList.add("open");
    const close = () => overlay.classList.remove("open");
    document.getElementById("closeCopyCounterModal").onclick = close;
    document.getElementById("copyCounterCancel").onclick = close;
    document.getElementById("copyCounterConfirm").onclick = () => {
      const checked = [...list.querySelectorAll("input:checked")].map((i) => i.value);
      if (!checked.length) { toast("เลือกทีมอย่างน้อย 1 ทีม"); return; }
      checked.forEach((teamId) => {
        const team = Store.getTeam(teamId);
        if (!team) return;
        const clone = JSON.parse(JSON.stringify(counter));
        clone.id = uid();
        clone.likes = 0;
        clone.dislikes = 0;
        if (!team.counters) team.counters = [];
        team.counters.push(clone);
      });
      Store.saveDraft();
      AdminEditor.renderTeamList();
      close();
      const names = checked.map((id) => Store.getTeam(id)?.name).filter(Boolean);
      const label = names.length === 1 ? `"${names[0]}"` : `${names.length} ทีม`;
      toast(`คัดลอกทีมตอบโต้ไปยัง ${label} แล้ว`);
    };
  }
};
