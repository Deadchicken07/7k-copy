// Bootstraps the app: theme toggle, update banner, admin gate, and switching
// between the public list view and the admin editor view.
const App = {
  async init() {
    this.initTheme();
    this.initBanner();
    Auth.initCookieRole();
    await Auth.initDiscord();
    await Store.load();

    // แสดง error ถ้า Discord ปฏิเสธสิทธิ์
    const urlParams = new URLSearchParams(location.search);
    const authResult = urlParams.get("auth");

    if (urlParams.get("logged_out") === "1") {
      sessionStorage.clear();
      history.replaceState(null, "", location.pathname);
    }

    if (!Auth.isGuildMember()) {
      this.showGate(authResult);
    } else {
      this.bootApp();
      this.showWatermark();
      if (Auth.isAdmin()) {
        this.toggleAdminSidebar(true);
        this.setActiveNav("exitAdminBtn");
      }
    }
  },

  showGate(authResult) {
    document.getElementById("gateView").style.display = "flex";
    document.getElementById("listView").style.display = "none";

    if (authResult === "denied") {
      const errEl = document.getElementById("gateAuthError");
      errEl.textContent = "ไม่มีสิทธิ์เข้าถึง — ต้องเป็นสมาชิกกิลด์ใน Discord";
      errEl.style.display = "block";
    } else if (authResult === "failed") {
      const errEl = document.getElementById("gateAuthError");
      errEl.textContent = "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง";
      errEl.style.display = "block";
    }

    document.getElementById("gateLoginBtn").addEventListener("click", () => {
      window.location.href = "/auth/discord";
    });
  },

  showWatermark() {
    const user = Auth.discordUser;
    if (!user) return;
    const name = user.displayName;
    // Corner watermark
    const wm = document.getElementById("discordWatermark");
    wm.textContent = name;
    wm.style.display = "block";
    // CSS variable for card watermarks
    document.documentElement.style.setProperty("--discord-wm", `"${name}"`);
    // Show logout button
    document.getElementById("discordLogoutBtn").style.display = "";
  },

  bootApp() {
    document.getElementById("gateView").style.display = "none";
    document.getElementById("listView").style.display = "block";
    ListView.mount();
    AdminEditor.mount();
    if (typeof ImageFolderChecker !== "undefined") ImageFolderChecker.mount();
    this.startPolling();
    document.getElementById("editToggle").addEventListener("click", () => this.onEditToggle());
    document.getElementById("toolsToggle")?.addEventListener("click", () => this.showTools());
    const adminSidebarToggle = document.getElementById("adminSidebarToggle");
    if (adminSidebarToggle) {
      adminSidebarToggle.addEventListener("click", () => this.toggleAdminSidebar());
    }
    document.getElementById("sidebarTeamsBtn")?.addEventListener("click", () => {
      this.showAdmin();
    });
    // capture=true → fires before editor.js so adminView is visible when startNew() runs
    document.getElementById("addTeamBtn")?.addEventListener("click", () => {
      this.showAdmin();
      this.setActiveNav("addTeamBtn");
    }, true);
    document.getElementById("closeLineModal").addEventListener("click", () =>
      document.getElementById("lineModal").classList.remove("open")
    );
    document.getElementById("copyLineBtn").addEventListener("click", () => {
      navigator.clipboard.writeText(document.getElementById("lineText").textContent)
        .then(() => toast("คัดลอกข้อความแล้ว"));
    });
    this.applyAdminUi();
    this.handleDeepLink();
    window.addEventListener("popstate", () => this.handleDeepLink());
  },

  handleDeepLink() {
    const match = window.location.hash.match(/^#team\/(.+)$/);
    if (match) {
      ListView.showDetail(match[1]);
    } else if (document.getElementById("detailView").style.display !== "none") {
      document.getElementById("detailView").style.display = "none";
      document.getElementById("listView").style.display = "block";
    }
  },

  initTheme() {
    const saved = localStorage.getItem("7kcombo_theme");
    if (saved !== "light") document.documentElement.classList.add("dark");
  },

  initBanner() {
    const banner = document.getElementById("updateBanner");
    const closeBtn = document.getElementById("closeBanner");
    if (!banner || !closeBtn) return;
    if (localStorage.getItem("7kcombo_banner_closed") === "1") {
      banner.style.display = "none";
    }
    closeBtn.addEventListener("click", () => {
      banner.style.display = "none";
      localStorage.setItem("7kcombo_banner_closed", "1");
    });
  },

  onEditToggle() {
    const inAdmin = document.getElementById("adminView").style.display !== "none";
    if (inAdmin) {
      // Currently in admin view → exit (logout clears admin session)
      this.exitAdminWithConfirm();
      return;
    }
    if (Auth.isAdmin()) {
      // Admin session still active (e.g. came back from tools) → re-enter directly
      this.showAdmin();
      return;
    }
    toast("โหมดแก้ไขสำหรับผู้ดูแลเท่านั้น");
  },

  // Leaving admin mode (via the editToggle icon or the "กลับหน้าหลัก"
  // button) always logs out, so getting back in requires the ADMIN_CODE
  // again. If a team add/edit is open and unsaved, confirm first so a stray
  // click can't silently throw away in-progress work.
  exitAdminWithConfirm() {
    const leave = () => this.showList();
    if (AdminEditor.team) {
      Modal.confirm("คุณมีการแก้ไขที่ยังไม่บันทึก ต้องการออกจากหน้าแก้ไขใช่หรือไม่?", leave);
      return;
    }
    leave();
  },

  showAdmin() {
    document.getElementById("listView").style.display = "none";
    document.getElementById("detailView").style.display = "none";
    document.getElementById("toolsView").style.display = "none";
    document.getElementById("adminView").style.display = "block";
    AdminEditor.tab = ListView.state.tab;
    AdminEditor.renderTeamList();
    this.renderSidebarOverview();
    if (typeof ImageFolderChecker !== "undefined") ImageFolderChecker.mount();
    this.setActiveNav("sidebarTeamsBtn");
    this.applyAdminUi();
  },

  showList() {
    ListView.state.tab = AdminEditor.tab;
    AdminEditor.closeEditor();
    document.getElementById("adminView").style.display = "none";
    document.getElementById("detailView").style.display = "none";
    document.getElementById("toolsView").style.display = "none";
    document.getElementById("listView").style.display = "block";
    ListView.renderTabButtons();
    ListView.renderFilterPills();
    ListView.render();
    this.setActiveNav("exitAdminBtn");
    this.applyAdminUi();
  },

  showTools() {
    this.toggleAdminSidebar(false);
    document.getElementById("listView").style.display = "none";
    document.getElementById("adminView").style.display = "none";
    document.getElementById("detailView").style.display = "none";
    document.getElementById("toolsView").style.display = "block";
    AdminTools.render();
    this.applyAdminUi();
  },

  switchSidebarTab(tabId) {
    document.querySelectorAll(".sidebar-tab-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.sidebarTab === tabId);
    });
    document.querySelectorAll(".sidebar-tab-panel").forEach((panel) => {
      panel.style.display = "none";
    });
    const target = document.getElementById(
      tabId === "actions" ? "sidebarTabActions" : "sidebarTabTools"
    );
    if (target) target.style.display = "";
    if (tabId === "tools") this.renderSidebarTools();
  },

  renderSidebarTools() {
    const container = document.getElementById("sidebarToolsContent");
    if (!container) return;
    const today = new Date();
    const todayLabel = today.toLocaleDateString("th-TH", {
      weekday: "short", day: "numeric", month: "short", year: "numeric",
    });
    const code = typeof getDailyCode === "function" ? getDailyCode(0) : "—";
    const staticCodes = typeof GUILD_CODES !== "undefined" ? GUILD_CODES.join(" · ") : "";
    container.innerHTML = `
      <div class="sidebar-tools-title">🗓️ รหัสสมาชิกประจำวัน</div>
      <div class="sidebar-tools-code-box">
        <div class="sidebar-tools-date">${todayLabel}</div>
        <div class="sidebar-tools-code" id="sidebarTodayCode">${code}</div>
        <div class="admin-sidebar-actions">
          <button class="btn btn-primary" id="sidebarCopyCodeBtn">📋 คัดลอกรหัส</button>
          <button class="btn" id="sidebarLineBtn">💬 สร้างข้อความ LINE</button>
        </div>
      </div>
      ${staticCodes ? `<div class="sidebar-tools-static"><b>รหัสสำรอง:</b><br/><code>${staticCodes}</code></div>` : ""}
    `;
    document.getElementById("sidebarCopyCodeBtn").addEventListener("click", () => {
      navigator.clipboard.writeText(code).then(() => toast("คัดลอกรหัสแล้ว"));
    });
    document.getElementById("sidebarLineBtn").addEventListener("click", () => {
      const msg =
        `🛡️ PokkyRebirth Guild War Hub\n` +
        `📅 ${todayLabel}\n` +
        `🔑 รหัสสมาชิก: ${code}\n\n` +
        `นำรหัสนี้ไปกรอกที่หน้าเว็บเพื่อเข้าดูทีมที่แนะนำ\n` +
        `⚠️ รหัสนี้ใช้ได้เฉพาะวันนี้เท่านั้น`;
      document.getElementById("lineText").textContent = msg;
      document.getElementById("lineModal").classList.add("open");
    });
  },

  setActiveNav(id) {
    document.querySelectorAll(".admin-nav-item").forEach((el) => {
      el.classList.toggle("active", el.id === id);
    });
  },

  focusAdminTeams() {
    this.setActiveNav("sidebarTeamsBtn");
    const list = document.getElementById("adminTeamList");
    if (!list) return;
    list.scrollIntoView({ behavior: "smooth", block: "start" });
  },
  renderSidebarOverview() {
    const container = document.getElementById("sidebarOverviewContent");
    if (!container) return;

    const teams = typeof Store?.getTeams === "function" ? Store.getTeams() : [];
    const currentTab = AdminEditor?.tab || "attack";
    const tabLabel = (typeof TEAM_TABS !== "undefined"
      ? TEAM_TABS.find((tab) => tab.id === currentTab)?.label
      : "") || currentTab;
    const visibleTeams = teams.filter((team) => !team.hidden).length;
    const hiddenTeams = teams.length - visibleTeams;
    const counterCount = teams.reduce((sum, team) => sum + ((team.counters || []).length), 0);

    container.innerHTML = `
      <div class="sidebar-overview-grid">
        <div class="sidebar-stat">
          <span>ทีมทั้งหมด</span>
          <b>${teams.length}</b>
        </div>
        <div class="sidebar-stat">
          <span>แสดงอยู่</span>
          <b>${visibleTeams}</b>
        </div>
        <div class="sidebar-stat">
          <span>ซ่อนไว้</span>
          <b>${hiddenTeams}</b>
        </div>
        <div class="sidebar-stat">
          <span>ทีมแก้</span>
          <b>${counterCount}</b>
        </div>
      </div>
      <div class="admin-sidebar-meta">หมวดที่กำลังแก้: ${tabLabel}</div>
    `;

    const summary = document.getElementById("sidebarTeamSummary");
    if (summary) {
      summary.textContent = `${teams.length} ทีมทั้งหมด · ${visibleTeams} ทีมที่แสดง`;
    }
  },

  toggleAdminSidebar(forceOpen) {
    const sidebar = document.getElementById("adminSidebar");
    const toggle = document.getElementById("adminSidebarToggle");
    if (!sidebar || !toggle) return;

    const willOpen = typeof forceOpen === "boolean"
      ? forceOpen
      : !document.body.classList.contains("admin-sidebar-open");

    document.body.classList.toggle("admin-sidebar-open", willOpen);
    sidebar.setAttribute("aria-hidden", String(!willOpen));
    toggle.setAttribute("aria-expanded", String(willOpen));
  },

  applyAdminUi() {
    const isAdmin = Auth.isAdmin();
    const sidebar = document.getElementById("adminSidebar");
    if (sidebar) sidebar.style.display = isAdmin ? "" : "none";
    document.getElementById("adminSidebarToggle").style.display = isAdmin ? "" : "none";
    document.getElementById("editToggle").style.display = "none";
  },

  startPolling() {
    Store.pollForUpdates(() => {
      // Skip if admin is editing — they already have the latest data
      if (Auth.isAdmin()) return;
      this.showUpdateNotif();
    });
  },

  showUpdateNotif() {
    Store.stopPolling();
    const banner = document.getElementById("updateNotifBanner");
    if (!banner || banner.style.display !== "none") return;
    banner.style.display = "flex";
  },
};

document.addEventListener("DOMContentLoaded", () => {
  App.init();

  const fab        = document.getElementById("contactFab");
  const modal      = document.getElementById("contactModal");
  const closeBtn   = document.getElementById("closeContactModal");
  const cancelBtn  = document.getElementById("contactCancel");
  const sendBtn    = document.getElementById("contactSend");

  if (fab && modal && closeBtn && cancelBtn && sendBtn) {
    const openContact  = () => { modal.classList.add("open"); setTimeout(() => document.getElementById("contactName").focus(), 60); };
    const closeContact = () => modal.classList.remove("open");

    const nameInput = document.getElementById("contactName");
    const msgInput  = document.getElementById("contactMessage");
    const checkReady = () => {
      sendBtn.disabled = !nameInput.value.trim() || !msgInput.value.trim();
    };
    nameInput.addEventListener("input", checkReady);
    msgInput.addEventListener("input", checkReady);

    fab.addEventListener("click", openContact);
    closeBtn.addEventListener("click", closeContact);
    cancelBtn.addEventListener("click", closeContact);
    modal.addEventListener("click", (e) => { if (e.target === modal) closeContact(); });

    sendBtn.addEventListener("click", () => {
      const name    = document.getElementById("contactName").value.trim();
      const subject = document.getElementById("contactSubject").value.trim();
      const message = document.getElementById("contactMessage").value.trim();
      if (!message) { toast("กรุณาพิมพ์ข้อความก่อนส่ง"); return; }
      toast("Contact email is disabled.");
      closeContact();
    });
  }
});
