// Team shape:
// { id, name, tab("attack"|"defense"), category("tank"|"magic"|"physical"|"other"),
//   guild, hidden, enemy: { pattern, slots, dotOrder },
//   counters: [{ id, name, pattern, slots, dotOrder, pets, gear, teamNote, likes, dislikes }] }

export const TEAM_TABS = [
  { id: "attack", label: "ทีมบุก" },
  { id: "defense", label: "ทีมป้องกัน" },
];

export const CATEGORIES = [
  { id: "all", label: "ทั้งหมด" },
  { id: "tank", label: "แทงค์" },
  { id: "magic", label: "เวทมนตร์" },
  { id: "physical", label: "กายภาพ" },
  { id: "other", label: "อื่นๆ" },
];

// fetch teams from static JSON (client-side)
export async function loadTeams() {
  const res = await fetch("/data/teams.json");
  if (!res.ok) return [];
  const data = await res.json();
  return data.teams || [];
}

// get hero names from a team's enemy slots
export function getTeamHeroes(team) {
  if (!team?.enemy?.slots) return [];
  return Object.values(team.enemy.slots).filter(Boolean);
}

// filter helpers
export function filterTeams(teams, { tab, category, guild, query } = {}) {
  return teams.filter((t) => {
    if (t.hidden) return false;
    if (tab && t.tab !== tab) return false;
    if (category && category !== "all" && t.category !== category) return false;
    if (guild && guild !== "all" && t.guild !== guild) return false;
    if (query) {
      const q = query.toLowerCase();
      const heroes = getTeamHeroes(t).join(" ").toLowerCase();
      if (!t.name.toLowerCase().includes(q) && !heroes.includes(q)) return false;
    }
    return true;
  });
}

// draft persistence (localStorage)
export function saveDraft(teams) {
  if (typeof window === "undefined") return;
  localStorage.setItem("7kcombo_draft_v1", JSON.stringify({ teams }));
}

export function loadDraft() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("7kcombo_draft_v1");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearDraft() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("7kcombo_draft_v1");
}

// generate uid
export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
