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
    this.startPolling();
    document.getElementById("editToggle").addEventListener("click", () => this.onEditToggle());
    document.getElementById("toolsToggle").addEventListener("click", () => this.showTools());
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
    // Dark is the default; only an explicit saved "light" choice turns it off.
    const saved = localStorage.getItem("7kcombo_theme");
    if (saved !== "light") document.documentElement.classList.add("dark");
    const btn = document.getElementById("themeToggle");
    btn.textContent = document.documentElement.classList.contains("dark") ? "☀️" : "🌙";
    btn.addEventListener("click", () => {
      document.documentElement.classList.toggle("dark");
      const isDark = document.documentElement.classList.contains("dark");
      localStorage.setItem("7kcombo_theme", isDark ? "dark" : "light");
      btn.textContent = isDark ? "☀️" : "🌙";
    });
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
    const leave = () => {
      Auth.logout();
      this.showList();
    };
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
    this.applyAdminUi();
  },

  showTools() {
    document.getElementById("listView").style.display = "none";
    document.getElementById("adminView").style.display = "none";
    document.getElementById("detailView").style.display = "none";
    document.getElementById("toolsView").style.display = "block";
    AdminTools.render();
    this.applyAdminUi();
  },

  applyAdminUi() {
    const inAdmin = document.getElementById("adminView").style.display !== "none";
    document.getElementById("editToggle").classList.toggle("active", inAdmin);
    document.getElementById("toolsToggle").style.display = Auth.isAdmin() ? "" : "none";
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
