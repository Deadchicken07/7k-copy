// Admin gate. This is a static site with no server, so this is a soft lock
// to keep casual visitors from editing data, not real security: anyone who
// reads this file can see the codes. Change ADMIN_CODES before sharing the link.
const ADMIN_CODES = ["LGND_ADMIN", "ICYX_ADMIN", "BRAV0"];
// Guild-member codes: static fallback (always valid).
const GUILD_CODES = ["ICND_GUILD"];

// Salt used to derive the daily rotating guild code.
// Change this value to invalidate all previously shared daily codes.
const GUILD_SALT = "7k_IcOnYx_LgNd";

// Returns a 6-digit code derived from today's date (+ optional day offset) and GUILD_SALT.
function getDailyCode(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const pad = (n) => String(n).padStart(2, "0");
  const input = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}|${GUILD_SALT}`;
  let h = 5381;
  for (let i = 0; i < input.length; i++) h = ((h << 5) + h + input.charCodeAt(i)) >>> 0;
  return String(h % 900000 + 100000);
}

const ADMIN_SESSION_KEY = "7kcombo_admin_ok";
const GUILD_SESSION_KEY = "7kcombo_guild_ok";
const ADMIN_GUILD_KEY   = "7kcombo_admin_guild";

// Maps admin code (lowercase) → guild badge label shown on team cards.
const ADMIN_GUILD_MAP = {
  "lgnd_admin": "LEGENDS",
  "icyx_admin": "ICONYX",
};

const Auth = {
  discordUser: null,

  async initDiscord() {
    try {
      const res = await fetch("/auth/me");
      const data = await res.json();
      if (data.loggedIn) {
        this.discordUser = data;
        if (data.isAdmin) sessionStorage.setItem(ADMIN_SESSION_KEY, "1");
        sessionStorage.setItem(GUILD_SESSION_KEY, "1");
      }
    } catch (_) {}
  },

  isAdmin() {
    if (this.discordUser?.isAdmin) return true;
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === "1";
  },

  // True for both guild-members and admins (admins always have guild access).
  isGuildMember() {
    if (this.discordUser?.isMember) return true;
    return this.isAdmin() || sessionStorage.getItem(GUILD_SESSION_KEY) === "1";
  },

  // Opens the shared login modal configured for the given context.
  // opts: { title, subtitle, label, codes, sessionKey, onSuccess }
  _openLoginModal(opts) {
    const overlay   = document.getElementById("adminLoginModal");
    const titleEl   = document.getElementById("adminLoginTitle");
    const subEl     = document.getElementById("adminLoginSubtitle");
    const labelEl   = document.getElementById("adminLoginLabel");
    const input     = document.getElementById("adminCodeInput");
    const error     = document.getElementById("adminLoginError");
    const eye       = document.getElementById("adminCodeEye");
    const iconShow  = document.getElementById("eyeIconShow");
    const iconHide  = document.getElementById("eyeIconHide");
    const okBtn     = document.getElementById("adminLoginOk");
    const cancelBtn = document.getElementById("adminLoginCancel");
    const closeBtn  = document.getElementById("adminLoginClose");

    // Store original texts so close() restores them for admin login next time.
    const origTitle  = titleEl.textContent;
    const origSub    = subEl.textContent;
    const origLabel  = labelEl.textContent;

    titleEl.textContent = opts.title;
    subEl.textContent   = opts.subtitle;
    labelEl.textContent = opts.label;

    input.value = "";
    input.type  = "password";
    error.textContent = "";
    iconShow.style.display = "";
    iconHide.style.display = "none";
    overlay.classList.add("open");
    setTimeout(() => input.focus(), 60);

    const close = () => {
      overlay.classList.remove("open");
      input.onkeydown   = null;
      okBtn.onclick     = null;
      cancelBtn.onclick = null;
      closeBtn.onclick  = null;
      eye.onclick       = null;
      titleEl.textContent = origTitle;
      subEl.textContent   = origSub;
      labelEl.textContent = origLabel;
    };

    const trySubmit = () => {
      const code = input.value.trim();
      const matched = opts.codes.find((c) => c.toLowerCase() === code.toLowerCase());
      if (matched) {
        sessionStorage.setItem(opts.sessionKey, "1");
        if (opts.sessionKey === ADMIN_SESSION_KEY) {
          const guild = ADMIN_GUILD_MAP[matched.toLowerCase()] || null;
          if (guild) sessionStorage.setItem(ADMIN_GUILD_KEY, guild);
          else sessionStorage.removeItem(ADMIN_GUILD_KEY);
        }
        close();
        opts.onSuccess();
      } else {
        error.textContent = "รหัสไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง";
        input.value = "";
        input.focus();
      }
    };

    okBtn.onclick     = trySubmit;
    cancelBtn.onclick = close;
    closeBtn.onclick  = close;
    input.onkeydown   = (e) => { if (e.key === "Enter") trySubmit(); };
    eye.onclick = () => {
      const hidden = input.type === "password";
      input.type = hidden ? "text" : "password";
      iconShow.style.display = hidden ? "none" : "";
      iconHide.style.display = hidden ? ""     : "none";
    };
  },

  promptLogin(onSuccess) {
    this._openLoginModal({
      title:     "ผู้ดูแลกิลด์",
      subtitle:  "กรอกรหัสผู้ดูแลเพื่อเข้าสู่หน้าแก้ไขรายการ",
      label:     "รหัสผู้ดูแล",
      codes:     ADMIN_CODES,
      sessionKey: ADMIN_SESSION_KEY,
      onSuccess: () => {
        // Admin login also grants guild-member view access.
        sessionStorage.setItem(GUILD_SESSION_KEY, "1");
        onSuccess();
      },
    });
  },

  promptGuildLogin(onSuccess) {
    this._openLoginModal({
      title:     "สมาชิกกิลด์",
      subtitle:  "กรอกรหัสสมาชิกเพื่อเข้าใช้งานเว็บไซต์",
      label:     "รหัสสมาชิก",
      // Static codes + today's rotating daily code all grant guild-member access.
      codes:     [...ADMIN_CODES, ...GUILD_CODES, getDailyCode()],
      sessionKey: GUILD_SESSION_KEY,
      onSuccess,
    });
  },

  getAdminGuild() {
    return sessionStorage.getItem(ADMIN_GUILD_KEY) || null;
  },

  // BRAV0 (no guild) can edit anything; guild admins can only edit their own guild's teams.
  canEditTeam(team) {
    const guild = this.getAdminGuild();
    if (!guild) return true;
    return (team.guild || null) === guild;
  },

  logout() {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    sessionStorage.removeItem(ADMIN_GUILD_KEY);
    // GUILD_SESSION_KEY is intentionally kept so the user can still view
    // defense teams after leaving admin edit mode.
  }
};
