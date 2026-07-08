// Renders the public team-list view: search, category filters, cards with
// an enemy-formation preview, and a full detail view for each team.
const ListView = {
  state: { query: "", category: "all", guild: "all", tab: "attack" },

  mount() {
    this.renderTabButtons();
    this.renderFilterPills();
    document.getElementById("searchInput").addEventListener("input", (e) => {
      this.state.query = e.target.value.trim().toLowerCase();
      this.render();
    });
    this.render();
  },

  renderTabButtons() {
    const wrap = document.getElementById("mainTabs");
    wrap.innerHTML = TEAM_TABS.map(
      (tb) =>
        `<button class="main-tab-btn ${tb.id === this.state.tab ? "active" : ""}" data-tab="${tb.id}">${tb.label}</button>`
    ).join("");
    wrap.querySelectorAll(".main-tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.state.tab = btn.dataset.tab;
        this.state.category = "all";
        this.state.guild = "all";
        this.renderTabButtons();
        this.renderFilterPills();
        this.render();
      });
    });
  },

  renderFilterPills() {
    const wrap = document.getElementById("filterPills");
    const catPills = [{ id: "all", label: "ทั้งหมด" }, ...CATEGORIES];
    const guildPills = [
      { id: "ICONYX",  label: "ICONYX"  },
      { id: "LEGENDS", label: "LEGENDS" },
    ];
    wrap.innerHTML =
      catPills.map((c) =>
        `<button class="pill ${c.id === this.state.category ? "active" : ""}" data-cat="${c.id}">${c.label}</button>`
      ).join("") +
      `<span class="pill-sep"></span>` +
      `<span class="pill-group-label">กิลด์</span>` +
      guildPills.map((g) =>
        `<button class="pill pill-guild pill-guild-${g.id.toLowerCase()} ${g.id === this.state.guild ? "active" : ""}" data-guild="${g.id}">${g.label}</button>`
      ).join("");

    wrap.querySelectorAll(".pill[data-cat]").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.state.category = btn.dataset.cat;
        this.renderFilterPills();
        this.render();
      });
    });
    wrap.querySelectorAll(".pill[data-guild]").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.state.guild = this.state.guild === btn.dataset.guild ? "all" : btn.dataset.guild;
        this.renderFilterPills();
        this.render();
      });
    });
  },

  renderEnemyPreview(enemy) {
    enemy = enemy || { pattern: "basic", slots: {} };
    const pattern = getPattern(enemy.pattern);
    return `<div class="enemy-preview">${renderFormationGrid(pattern, enemy.slots, {
      editable: false,
      dotOrder: enemy.dotOrder,
    })}</div>`;
  },

  // ── Detail view ──────────────────────────────────────────────────────────

  showDetail(teamId) {
    const team = Store.getTeam(teamId);
    if (!team) return;
    document.getElementById("listView").style.display = "none";
    const detailEl = document.getElementById("detailView");
    detailEl.style.display = "block";
    this.renderDetail(team);
    history.pushState(null, "", "#team/" + teamId);
    window.scrollTo(0, 0);
  },

  backToList() {
    document.getElementById("detailView").style.display = "none";
    document.getElementById("listView").style.display = "block";
    history.pushState(null, "", window.location.pathname + window.location.search);
  },

  renderDetail(team) {
    const detailEl = document.getElementById("detailView");
    const enemy = team.enemy || { pattern: "basic", slots: {} };
    const enemyPattern = getPattern(enemy.pattern);
    const cat = (typeof CATEGORIES !== "undefined" ? CATEGORIES : []).find(
      (c) => c.id === team.category
    );
    const catLabel = cat ? cat.label : (team.category || "ทั่วไป");

    const counters = team.counters || [];
    const counterHtml = counters.length
      ? `<div class="detail-counters-grid">${counters
          .map((c, i) => this.renderDetailCounterCard(c, i, team.id))
          .join("")}</div>`
      : `<p class="detail-no-counters">ยังไม่มีทีมตอบโต้ที่แนะนำ</p>`;

    detailEl.innerHTML = `
      <div class="detail-top-bar">
        <button class="detail-back-btn" id="detailBackBtn">← กลับ</button>
        <button class="detail-share-btn" id="detailShareBtn">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
          คัดลอกลิงก์
        </button>
      </div>

      <div class="detail-enemy-box">
        <div class="detail-enemy-header">
          <span class="detail-enemy-title">ทีมเป้าหมาย</span>
          <span class="badge-need">${escHtml(catLabel)}</span>
        </div>
        <div class="detail-enemy-name">${escHtml(team.name)} · ${escHtml(enemyPattern.displayLabel)}</div>
        <div class="detail-enemy-body">
          ${this.renderEnemyPreview(enemy)}
        </div>
      </div>

      <div class="detail-counters-heading">ทีมที่ใช้ต่อสู้ได้</div>
      ${counterHtml}
    `;

    document.getElementById("detailBackBtn").addEventListener("click", () => this.backToList());
    document.getElementById("detailShareBtn").addEventListener("click", () => {
      const url = location.origin + location.pathname + "#team/" + team.id;
      navigator.clipboard.writeText(url).then(() => toast("คัดลอกลิงก์แล้ว"));
    });

    detailEl.querySelectorAll("[data-detail-popup]").forEach((btn) => {
      const idx = parseInt(btn.dataset.detailPopup, 10);
      const tid = btn.dataset.popupTeam || team.id;
      btn.addEventListener("click", () => this.showDetailPopup(team.counters[idx], idx, { teamId: tid }));
    });

    this._wireVoteBtns(detailEl, team.id);
  },

  showDetailPopup(c, idx, opts) {
    opts = opts || {};
    const pattern = getPattern(c.pattern);
    const slots = c.slots || {};
    const pets = c.pets || {};
    const gear = c.gear || {};
    const hasAnyPet = Object.values(pets).some(Boolean);

    const allPositions = [...(pattern.back || []), ...(pattern.front || [])];
    const heroIds = allPositions.filter((n) => slots[String(n)]).map((n) => slots[String(n)]);

    const HERO_STATS_arr     = typeof HERO_STATS      !== "undefined" ? HERO_STATS      : [];
    const HERO_STATS_EXT2_arr= typeof HERO_STATS_EXT2 !== "undefined" ? HERO_STATS_EXT2 : [];
    const HERO_STATS_EXT_arr = typeof HERO_STATS_EXT  !== "undefined" ? HERO_STATS_EXT  : [];

    const makeStatRows = (arr, stats) =>
      arr
        .map((s) => {
          const val = stats[s.id];
          const hasVal = val !== undefined && val !== "";
          return `<div class="hero-stat-row">
            <div class="hero-stat-icon">${s.icon}</div>
            <span class="hero-stat-label">${s.label}</span>
            <span class="dp-stat-value${hasVal ? "" : " dp-stat-empty"}">${hasVal ? escHtml(String(val)) : "—"}</span>
          </div>`;
        })
        .join("");

    const makeGearSlots = (gearObj, type) =>
      [1, 2, 3]
        .map((n) => {
          if (type === "ring") {
            const mainId = (gearObj.rings || {})[String(n)];
            const ovId = (gearObj.ringOverlays || {})[String(n)];
            const mainItem = mainId ? getRing(mainId) : null;
            const ovItem = ovId ? getRing(ovId) : null;
            if (!mainItem) return `<div class="gear-slot empty dp-gear-ro"></div>`;
            if (ovItem) return `<div class="ring-slot-pair">` +
              `<div class="gear-slot filled dp-gear-ro" title="${escHtml(mainItem.name)}"><img src="${mainItem.img}" alt="${escHtml(mainItem.name)}" draggable="false"></div>` +
              `<div class="gear-slot ring-overlay-slot filled dp-gear-ro" title="${escHtml(ovItem.name)}"><img src="${ovItem.img}" alt="${escHtml(ovItem.name)}" draggable="false"></div>` +
              `</div>`;
            return `<div class="gear-slot filled dp-gear-ro" title="${escHtml(mainItem.name)}"><img src="${mainItem.img}" alt="${escHtml(mainItem.name)}" draggable="false"></div>`;
          }
          const id = (gearObj.sets || {})[String(n)];
          const item = id ? getEquipmentSet(id) : null;
          return item
            ? `<div class="gear-slot filled dp-gear-ro" title="${escHtml(item.name)}"><img src="${item.img}" alt="${escHtml(item.name)}" draggable="false"></div>`
            : `<div class="gear-slot empty dp-gear-ro"></div>`;
        })
        .join("");

    const heroBlocks = heroIds
      .map((heroId) => {
        const hero = getHero(heroId);
        const g = gear[heroId] || {};
        const stats = g.stats || {};
        const note = g.note?.trim() || "";

        return `<div class="hero-gear-block">
          <div class="hero-gear-row">
            <div class="hero-gear-left">
              <div class="hero-gear-portrait">
                <img src="${hero?.img || ""}" alt="${escHtml(hero?.name || "")}" draggable="false">
                <span>${escHtml(hero?.name || heroId)}</span>
              </div>
              <div class="hero-gear-slots">
                <div class="gear-type-row">
                  <span class="gear-type-label">แหวน</span>
                  <div class="gear-slots-grid">${makeGearSlots(g, "ring")}</div>
                </div>
                <div class="gear-type-row">
                  <span class="gear-type-label">เซ็ต</span>
                  <div class="gear-slots-grid">${makeGearSlots(g, "set")}</div>
                </div>
              </div>
            </div>
            <div class="hero-gear-note">
              <label>รายละเอียด</label>
              <div class="dp-note-text">${fmtNote(note)}</div>
            </div>
          </div>
          <div class="hero-stats-area">
            <div class="hero-stats-table">${makeStatRows(HERO_STATS_arr, stats)}</div>
            <div class="hero-stats-table">${makeStatRows(HERO_STATS_EXT2_arr, stats)}</div>
            <div class="hero-stats-table">${makeStatRows(HERO_STATS_EXT_arr, stats)}</div>
          </div>
        </div>`;
      })
      .join("");

    const popupTitle = c.name?.trim() ? escHtml(c.name.trim()) : `ทีมตอบโต้ที่ ${idx + 1}`;
    const teamId = opts.teamId || null;
    const likes    = c.likes    || 0;
    const dislikes = c.dislikes || 0;
    const localVote = teamId ? Vote.getLocal(teamId, idx) : null;
    const popupVoteBtns = teamId ? `
      <div class="vote-buttons" data-vote-team="${teamId}" data-vote-counter="${idx}">
        <button class="vote-btn vote-like ${localVote === "like" ? "active" : ""}" data-vote-team="${teamId}" data-vote-counter="${idx}" data-vote-type="like" type="button">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/></svg>
          <span class="vote-count">${likes}</span>
        </button>
        <button class="vote-btn vote-dislike ${localVote === "dislike" ? "active" : ""}" data-vote-team="${teamId}" data-vote-counter="${idx}" data-vote-type="dislike" type="button">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/></svg>
          <span class="vote-count">${dislikes}</span>
        </button>
      </div>` : "";

    const popupTeamNote = c.teamNote?.trim()
      ? `<div class="dp-team-note">
          <div class="detail-note-tag">สรุปรายละเอียดทีม</div>
          <div class="detail-team-note-text">${escHtml(c.teamNote.trim())}</div>
        </div>`
      : "";

    const overlay = document.getElementById("counterDetailModal");
    const dpBox = overlay.querySelector(".dp-box");
    dpBox.innerHTML = `
      <div class="dp-header">
        <span class="dp-title">${popupTitle} · ${escHtml(pattern.displayLabel)}</span>
        <button class="dp-close-btn" id="dpCloseBtn" type="button">×</button>
      </div>
      <div class="dp-body">
        <div class="dp-formation-row counter-formation-area">
          ${renderFormationGrid(pattern, slots, { editable: false, dotOrder: c.dotOrder })}
          ${hasAnyPet ? this.renderDetailPetSlots(pets) : ""}
        </div>
        ${popupVoteBtns}
        ${popupTeamNote}
        <div class="hero-gear-section">${heroBlocks}</div>
      </div>
    `;
    overlay.classList.add("open");

    document.getElementById("dpCloseBtn").addEventListener("click", () =>
      overlay.classList.remove("open")
    );
    if (teamId) this._wireVoteBtns(dpBox, teamId);
  },

  // Renders pet slots for detail view: only filled slots, empty sub-slots
  // are omitted and the remaining ones are centered via flex-wrap.
  renderDetailPetSlots(pets) {
    pets = pets || {};
    const mainId = pets["1"];
    const mainPet = mainId ? getPet(mainId) : null;
    const subPets = [2, 3, 4, 5]
      .map((n) => pets[String(n)])
      .filter(Boolean)
      .map((id) => getPet(id))
      .filter(Boolean);

    if (!mainPet && !subPets.length) return "";

    const mainHtml = mainPet
      ? `<div class="pet-slot main filled readonly"><img src="${mainPet.img}" alt="${escHtml(mainPet.name)}" draggable="false"></div>`
      : "";

    const subHtml = subPets.length
      ? `<div class="detail-pet-subs">${subPets
          .map(
            (pet) =>
              `<div class="pet-slot sub filled readonly"><img src="${pet.img}" alt="${escHtml(pet.name)}" draggable="false"></div>`
          )
          .join("")}</div>`
      : "";

    return `<div class="pet-slots-panel">
      <div class="pet-slots-title">สัตว์เลี้ยง</div>
      <div class="pet-slots-wrap">${mainHtml}${subHtml}</div>
    </div>`;
  },

  renderDetailCounterCard(c, idx, teamId) {
    const pattern = getPattern(c.pattern);
    const pets = c.pets || {};
    const hasAnyPet = Object.values(pets).some(Boolean);
    const slots = c.slots || {};
    const gear = c.gear || {};

    const allPositions = [...(pattern.back || []), ...(pattern.front || [])];
    const heroIds = allPositions
      .filter((n) => slots[String(n)])
      .map((n) => slots[String(n)]);

    // ── Note (auto-summary) per hero, always with hero name as header ──
    const heroParts = heroIds
      .map((heroId) => {
        const hero = getHero(heroId);
        const note = gear[heroId]?.note?.trim() || "";
        return note ? { name: hero?.name || heroId, note } : null;
      })
      .filter(Boolean);

    let noteHtml;
    if (!heroParts.length) {
      noteHtml = `<span class="detail-note-empty">ไม่มีข้อมูลรายละเอียด</span>`;
    } else {
      noteHtml = heroParts
        .map(
          (p) => `<div class="detail-note-hero-block">
            <span class="detail-note-hero-name">${escHtml(p.name)}</span>
            <span class="detail-note-text">${fmtNote(p.note)}</span>
          </div>`
        )
        .join("");
    }

    const teamNoteHtml = c.teamNote?.trim()
      ? `<div class="detail-team-note-block">
          <div class="detail-note-tag">สรุปรายละเอียดทีม</div>
          <div class="detail-team-note-text">${escHtml(c.teamNote.trim())}</div>
        </div>`
      : "";

    const moreBtnHtml = heroIds.length
      ? `<button class="detail-more-btn" data-detail-popup="${idx}" data-popup-team="${teamId || ""}" type="button">ดูรายละเอียดเพิ่มเติม</button>`
      : "";

    const likes    = c.likes    || 0;
    const dislikes = c.dislikes || 0;
    const localVote = teamId ? Vote.getLocal(teamId, idx) : null;
    const voteBtns = teamId ? `
      <div class="vote-buttons" data-vote-team="${teamId}" data-vote-counter="${idx}">
        <button class="vote-btn vote-like ${localVote === "like" ? "active" : ""}" data-vote-team="${teamId}" data-vote-counter="${idx}" data-vote-type="like" type="button">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/></svg>
          <span class="vote-count">${likes}</span>
        </button>
        <button class="vote-btn vote-dislike ${localVote === "dislike" ? "active" : ""}" data-vote-team="${teamId}" data-vote-counter="${idx}" data-vote-type="dislike" type="button">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/></svg>
          <span class="vote-count">${dislikes}</span>
        </button>
      </div>` : "";

    const cardName = c.name?.trim() || `ทีมตอบโต้ที่ ${idx + 1}`;
    return `<div class="detail-counter-card">
      <div class="detail-counter-label">${escHtml(cardName)} · ${escHtml(pattern.displayLabel)}</div>
      <div class="counter-formation-area detail-formation-area">
        ${renderFormationGrid(pattern, slots, { editable: false, dotOrder: c.dotOrder })}
        ${hasAnyPet ? this.renderDetailPetSlots(pets) : ""}
      </div>
      <div class="detail-counter-footer">
        ${teamNoteHtml}
        <div class="detail-note-tag">สรุปรายละเอียดแบบย่อ</div>
        <div class="detail-counter-note">${noteHtml}</div>
        <div class="detail-footer-actions">${voteBtns}${moreBtnHtml}</div>
      </div>
    </div>`;
  },

  // ── Vote buttons ──────────────────────────────────────────────────────────
  _wireVoteBtns(container, teamId) {
    container.querySelectorAll(".vote-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        if (btn.dataset.busy) return;
        btn.dataset.busy = "1";
        btn.style.opacity = "0.5";
        const cIdx = Number(btn.dataset.voteCounter);
        const voteType = btn.dataset.voteType;
        try {
          const result = await Vote.cast(teamId, cIdx, voteType);
          // Update all buttons for this counter in this container
          container.querySelectorAll(`[data-vote-team="${teamId}"][data-vote-counter="${cIdx}"].vote-btn`).forEach((b) => {
            b.classList.toggle("active", b.dataset.voteType === result.newVote);
            b.querySelector(".vote-count").textContent =
              b.dataset.voteType === "like" ? result.likes : result.dislikes;
          });
        } catch (err) {
          console.error("[Vote] cast failed:", err);
          toast("โหวตไม่สำเร็จ: " + err.message);
        }
        delete btn.dataset.busy;
        btn.style.opacity = "";
      });
    });
  },

  // ── List view ─────────────────────────────────────────────────────────────

  matchesQuery(team, q) {
    if (!q) return true;
    if (team.name.toLowerCase().includes(q)) return true;
    const ids = Object.values(team.enemy?.slots || {});
    return ids.some((id) => {
      const hero = id ? getHero(id) : null;
      return hero && heroMatchesQuery(hero, q);
    });
  },

  getFilteredTeams() {
    const { query, category, guild, tab } = this.state;
    return Store.getTeams().filter((t) => {
      if (t.hidden) return false;
      const tabOk   = (t.tab || "attack") === tab;
      const catOk   = category === "all" || t.category === category;
      const guildOk = guild === "all" || (t.guild || null) === guild;
      return tabOk && catOk && guildOk && this.matchesQuery(t, query);
    });
  },

  render() {
    const grid  = document.getElementById("teamGrid");
    const empty = document.getElementById("emptyState");

    const teams = this.getFilteredTeams();
    document.getElementById("filterCount").textContent = `ทั้งหมด ${teams.length} รายการ`;
    if (!teams.length) {
      grid.innerHTML = "";
      empty.style.display = "block";
      return;
    }
    empty.style.display = "none";
    grid.innerHTML = teams
      .map((team) => {
        const isDefense = (team.tab || "attack") === "defense";
        const preview   = isDefense ? (team.counters?.[0] || { pattern: "basic", slots: {} }) : team.enemy;
        const badge     = isDefense ? "ทีมป้องกัน" : "ทีมศัตรู";
        const countLabel = isDefense ? "" : `${(team.counters || []).length} ทีมแก้`;
        return `
        <div class="team-card" data-id="${team.id}">
          <div class="team-card-top">
            <div class="card-top-left">
              <span class="badge-need">${badge}</span>
              ${team.guild ? `<span class="badge-guild badge-guild-${team.guild.toLowerCase()}">${team.guild}</span>` : ""}
            </div>
            ${countLabel ? `<span class="counter-count">${countLabel}</span>` : ""}
          </div>
          <div class="enemy-name">${escHtml(team.name)} · ${escHtml(getPattern(preview?.pattern || "basic").displayLabel)}</div>
          <div class="team-card-body cat-bg cat-bg-${team.category || "other"}">
            ${this.renderEnemyPreview(preview)}
          </div>
          <div class="card-footer">
            <button class="view-more-btn" data-view="${team.id}">ดูเพิ่ม ›</button>
          </div>
        </div>`;
      })
      .join("");

    grid.querySelectorAll("[data-view]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const team = Store.getTeam(btn.dataset.view);
        if (!team) return;
        if ((team.tab || "attack") === "defense" && team.counters?.length) {
          this.showDetailPopup(team.counters[0], 0, { title: team.name, teamId: team.id });
        } else {
          this.showDetail(btn.dataset.view);
        }
      });
    });
  }
};

function escHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function fmtNote(note) {
  if (!note) return "";
  return note.split("\n").map(line => {
    const m = line.match(/^(แหวน:|เซ็ต:)([\s\S]*)/);
    if (m) return `<span class="note-keyword">${escHtml(m[1])}</span>${escHtml(m[2])}`;
    return escHtml(line);
  }).join("\n");
}
