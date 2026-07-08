// Data layer: loads data/teams.json, keeps an in-memory working copy that
// gets auto-saved as a draft to localStorage, and offers Export/Import to
// move that draft back into the committed teams.json file (this is a static
// site with no backend, so the JSON file is the real source of truth).
const TEAMS_JSON_PATH = "data/teams.json";
const DRAFT_KEY = "7kcombo_draft_v1";

const TEAM_TABS = [
  { id: "attack",  label: "ทีมบุก" },
  { id: "defense", label: "ทีมป้องกัน" },
];

const CATEGORIES = [
  { id: "tank", label: "ถึก", color: "#94a3b8" },
  { id: "magic", label: "เวทย์", color: "#60a5fa" },
  { id: "physical", label: "กายภาพ", color: "#f87171" },
  { id: "other", label: "อื่นๆ", color: "#a78bfa" }
];

function getCategory(id) {
  return CATEGORIES.find((c) => c.id === id) || CATEGORIES[3];
}

const DEFAULT_DATA = { teams: [] };

const Store = {
  data: null,
  _remoteSnapshot: null,
  _pollTimer: null,
  _baseTeamIds: null, // IDs ตอนโหลดหน้า ใช้แยกว่า "ลบตั้งใจ" vs "คนอื่นเพิ่มใหม่"

  async load() {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft && Auth.isAdmin()) {
      try {
        this.data = JSON.parse(draft);
        this._baseTeamIds = new Set((this.data.teams || []).map((t) => t.id));
        // Fetch remote in background: set polling baseline AND merge fresh vote counts
        fetch(TEAMS_JSON_PATH, { cache: "no-store" })
          .then((r) => (r.ok ? r.text() : null))
          .then((t) => {
            if (!t) return;
            this._remoteSnapshot = t;
            try {
              const remote = JSON.parse(t);
              (this.data.teams || []).forEach((team) => {
                const rt = (remote.teams || []).find((x) => x.id === team.id);
                if (!rt) return;
                (team.counters || []).forEach((counter, idx) => {
                  const rc = (rt.counters || [])[idx];
                  if (!rc) return;
                  counter.likes    = rc.likes    || 0;
                  counter.dislikes = rc.dislikes || 0;
                });
              });
              // Patch any visible vote counts already rendered in the DOM
              document.querySelectorAll(".vote-btn").forEach((btn) => {
                const teamId  = btn.dataset.voteTeam;
                const cIdx    = Number(btn.dataset.voteCounter);
                const vType   = btn.dataset.voteType;
                const team    = (this.data.teams || []).find((t) => t.id === teamId);
                const counter = team?.counters?.[cIdx];
                if (!counter) return;
                const el = btn.querySelector(".vote-count");
                if (el) el.textContent = vType === "like" ? (counter.likes || 0) : (counter.dislikes || 0);
              });
            } catch (_) {}
          })
          .catch(() => {});
        return this.data;
      } catch (e) {
        console.warn("Draft parse failed, falling back to teams.json", e);
      }
    }
    try {
      const res = await fetch(TEAMS_JSON_PATH, { cache: "no-store" });
      if (!res.ok) throw new Error("fetch failed " + res.status);
      const text = await res.text();
      this._remoteSnapshot = text;
      this.data = JSON.parse(text);
      this._baseTeamIds = new Set((this.data.teams || []).map((t) => t.id));
    } catch (e) {
      console.warn(
        "Could not load data/teams.json (this is normal if opened via file://). Starting empty.",
        e
      );
      this.data = JSON.parse(JSON.stringify(DEFAULT_DATA));
    }
    return this.data;
  },

  pollForUpdates(onChanged, intervalMs = 60000) {
    if (this._pollTimer) return;
    this._pollTimer = setInterval(async () => {
      try {
        const res = await fetch(TEAMS_JSON_PATH, { cache: "no-store" });
        if (!res.ok) return;
        const text = await res.text();
        if (this._remoteSnapshot && text !== this._remoteSnapshot) {
          this._remoteSnapshot = text;
          onChanged();
        }
      } catch (e) { /* network error, try again next cycle */ }
    }, intervalMs);
  },

  stopPolling() {
    clearInterval(this._pollTimer);
    this._pollTimer = null;
  },

  saveDraft() {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(this.data));
  },

  hasDraft() {
    return !!localStorage.getItem(DRAFT_KEY);
  },

  clearDraft() {
    localStorage.removeItem(DRAFT_KEY);
  },

  getTeams() {
    return this.data.teams;
  },

  getTeam(id) {
    return this.data.teams.find((t) => t.id === id) || null;
  },

  upsertTeam(team) {
    const idx = this.data.teams.findIndex((t) => t.id === team.id);
    if (idx >= 0) this.data.teams[idx] = team;
    else this.data.teams.push(team);
    this.saveDraft();
  },

  deleteTeam(id) {
    this.data.teams = this.data.teams.filter((t) => t.id !== id);
    this.saveDraft();
  },

  reorderTeam(dragId, targetId, insertBefore) {
    const teams = this.data.teams;
    const dragIdx = teams.findIndex((t) => t.id === dragId);
    if (dragIdx < 0) return;
    const [dragged] = teams.splice(dragIdx, 1);
    const newTargetIdx = teams.findIndex((t) => t.id === targetId);
    teams.splice(insertBefore ? newTargetIdx : newTargetIdx + 1, 0, dragged);
    this.saveDraft();
  },

  toggleTeamHidden(id) {
    const team = this.data.teams.find((t) => t.id === id);
    if (!team) return;
    team.hidden = !team.hidden;
    this.saveDraft();
  },

  moveTeam(id, direction) {
    const teams = this.data.teams;
    const team = teams.find((t) => t.id === id);
    if (!team) return;
    const tab = team.tab || "attack";
    const tabTeams = teams.filter((t) => (t.tab || "attack") === tab);
    const tabIdx = tabTeams.findIndex((t) => t.id === id);
    const newTabIdx = tabIdx + (direction === "up" ? -1 : 1);
    if (newTabIdx < 0 || newTabIdx >= tabTeams.length) return;
    const neighbor = tabTeams[newTabIdx];
    const idxA = teams.findIndex((t) => t.id === id);
    const idxB = teams.findIndex((t) => t.id === neighbor.id);
    [teams[idxA], teams[idxB]] = [teams[idxB], teams[idxA]];
    this.saveDraft();
  },

  exportJson() {
    const blob = new Blob([JSON.stringify(this.data, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "teams.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  },

  async importJsonFile(file) {
    const text = await file.text();
    const parsed = JSON.parse(text);
    if (!parsed || !Array.isArray(parsed.teams)) {
      throw new Error("ไฟล์ไม่ถูกต้อง: ต้องมี teams เป็น array");
    }
    this.data = parsed;
    this.saveDraft();
  }
};

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
