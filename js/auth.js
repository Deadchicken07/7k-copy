// ── Cookie-based role ──────────────────────────────────────────────────────
// Cookie name sent by your auth server. Value must be exactly "admin" or "user".
const ROLE_COOKIE = "7k_role";
// MOCK: set "admin" or "user" to simulate a role without a real cookie.
// Remove (or set to null) when the real cookie is live.
const MOCK_ROLE   = "admin";

function _readRoleCookie() {
  const match = document.cookie.split("; ").find((r) => r.startsWith(ROLE_COOKIE + "="));
  return match ? decodeURIComponent(match.split("=")[1]) : MOCK_ROLE;
}
// ──────────────────────────────────────────────────────────────────────────

const ADMIN_SESSION_KEY = "7kcombo_admin_ok";
const GUILD_SESSION_KEY = "7kcombo_guild_ok";
const ADMIN_GUILD_KEY   = "7kcombo_admin_guild";

const Auth = {
  discordUser: null,

  // Reads the role cookie (or MOCK_ROLE) and seeds sessionStorage so the
  // rest of the app can use isAdmin() / isGuildMember() normally.
  // Call this once during app init, before any isAdmin() check.
  initCookieRole() {
    const role = _readRoleCookie();
    if (role === "admin") {
      sessionStorage.setItem(ADMIN_SESSION_KEY, "1");
      sessionStorage.setItem(GUILD_SESSION_KEY, "1");
    } else if (role === "user") {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
      sessionStorage.setItem(GUILD_SESSION_KEY, "1");
    }
  },

  // Returns the effective role: "admin" | "user" | null
  getRole() {
    if (this.isAdmin()) return "admin";
    if (this.isGuildMember()) return "user";
    return null;
  },

  async initDiscord() {
    try {
      const res  = await fetch("/auth/me");
      const data = await res.json();
      if (data.loggedIn) {
        this.discordUser = data;
        if (data.isAdmin) sessionStorage.setItem(ADMIN_SESSION_KEY, "1");
        if (data.guild)   sessionStorage.setItem(ADMIN_GUILD_KEY, data.guild);
        sessionStorage.setItem(GUILD_SESSION_KEY, "1");
      }
    } catch (_) {}
  },

  isAdmin() {
    if (this.discordUser?.isAdmin) return true;
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === "1";
  },

  // True for both guild-members and admins.
  isGuildMember() {
    if (this.discordUser?.isMember) return true;
    return this.isAdmin() || sessionStorage.getItem(GUILD_SESSION_KEY) === "1";
  },

  getAdminGuild() {
    return sessionStorage.getItem(ADMIN_GUILD_KEY) || null;
  },

  // No guild restriction → can edit anything; guild set → only own guild's teams.
  canEditTeam(team) {
    const guild = this.getAdminGuild();
    if (!guild) return true;
    return (team.guild || null) === guild;
  },

  logout() {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    sessionStorage.removeItem(ADMIN_GUILD_KEY);
    // GUILD_SESSION_KEY is kept so the user can still view teams after leaving admin mode.
  },
};
