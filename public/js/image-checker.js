const ImageFolderChecker = {
  mounted: false,
  selectedFolder: null,
  selectedFiles: [],

  mount() {
    this.ensureUi();
    this.bindEvents();
    this.renderFolders();
    if (!this.mounted) {
      this.mounted = true;
      this.renderEmpty();
    }
  },

  ensureUi() {
    const nav = document.querySelector(".admin-sidebar-nav");
    const adminView = document.getElementById("adminView");
    if (!nav || !adminView) return;

    if (!document.getElementById("imageManagerNavBtn")) {
      const overviewItem = nav.querySelector(".admin-nav-static");
      const html = `
        <button class="admin-nav-item" id="imageManagerNavBtn" type="button">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
          <span>เพิ่มไฟล์ตัวละคร</span>
        </button>
      `;
      if (overviewItem) overviewItem.insertAdjacentHTML("beforebegin", html);
      else nav.insertAdjacentHTML("beforeend", html);
    }

    const adminMain = adminView.querySelector(".admin-main") || adminView;
    if (!document.getElementById("imageManagerPanel")) {
      adminMain.insertAdjacentHTML("afterbegin", `
        <section class="image-manager-panel" id="imageManagerPanel" style="display:none;">
          <div class="image-manager-shell">
            <div class="image-manager-head">
              <div>
                <div class="image-manager-kicker">Hero image manager</div>
                <h2 class="image-manager-title">เพิ่มไฟล์รูปตัวละคร</h2>
                <p class="hint">เลือก folder ปลายทางก่อน เช่น Awake, Legend, Legend+ แล้วค่อยเพิ่มไฟล์รูปภาพ</p>
              </div>
              <button class="btn" id="imageManagerBackBtn" type="button">กลับรายการทีม</button>
            </div>

            <div class="image-folder-grid" id="imageFolderGrid"></div>

            <div class="image-upload-box" id="imageUploadBox">
              <div class="image-upload-icon">+</div>
              <div class="image-upload-title" id="imageUploadTitle">เลือก folder ก่อน</div>
              <div class="image-upload-sub" id="imageUploadSub">หลังเลือก folder แล้วกดเพิ่มไฟล์หรือลากรูปมาวางตรงนี้</div>
              <button class="btn btn-primary" id="heroImagePickBtn" type="button" disabled>เพิ่มไฟล์รูปภาพ</button>
              <input id="heroImageFileInput" type="file" accept="image/*" multiple style="display:none;" />
            </div>

            <div class="image-manager-result" id="imageManagerResult"></div>
          </div>
        </section>
      `);
    }
  },

  bindEvents() {
    const navBtn = document.getElementById("imageManagerNavBtn");
    const backBtn = document.getElementById("imageManagerBackBtn");
    const pickBtn = document.getElementById("heroImagePickBtn");
    const fileInput = document.getElementById("heroImageFileInput");
    const uploadBox = document.getElementById("imageUploadBox");

    if (navBtn && !navBtn.dataset.bound) {
      navBtn.dataset.bound = "1";
      navBtn.addEventListener("click", () => this.showManager());
    }

    if (backBtn && !backBtn.dataset.bound) {
      backBtn.dataset.bound = "1";
      backBtn.addEventListener("click", () => this.hideManager());
    }

    if (pickBtn && fileInput && !pickBtn.dataset.bound) {
      pickBtn.dataset.bound = "1";
      pickBtn.addEventListener("click", () => fileInput.click());
      fileInput.addEventListener("change", () => {
        this.addFiles(Array.from(fileInput.files || []));
        fileInput.value = "";
      });
    }

    if (uploadBox && !uploadBox.dataset.bound) {
      uploadBox.dataset.bound = "1";
      ["dragenter", "dragover"].forEach((eventName) => {
        uploadBox.addEventListener(eventName, (event) => {
          event.preventDefault();
          if (!this.selectedFolder) return;
          uploadBox.classList.add("drag-over");
        });
      });
      ["dragleave", "drop"].forEach((eventName) => {
        uploadBox.addEventListener(eventName, (event) => {
          event.preventDefault();
          if (eventName === "dragleave" && uploadBox.contains(event.relatedTarget)) return;
          uploadBox.classList.remove("drag-over");
        });
      });
      uploadBox.addEventListener("drop", async (event) => {
        if (!this.selectedFolder) return;
        const files = await this.filesFromDataTransfer(event.dataTransfer);
        this.addFiles(files);
      });
    }

    ["sidebarTeamsBtn", "addTeamBtn", "exitAdminBtn"].forEach((id) => {
      const btn = document.getElementById(id);
      if (btn && !btn.dataset.imageManagerBound) {
        btn.dataset.imageManagerBound = "1";
        btn.addEventListener("click", () => this.hideManager(false));
      }
    });
  },

  showManager() {
    this.openAdminView();
    this.ensureUi();
    this.bindEvents();
    this.renderFolders();
    this.setMainVisibility(false);
    const panel = document.getElementById("imageManagerPanel");
    if (panel) panel.style.display = "block";
    this.setActiveNav("imageManagerNavBtn");
    panel?.scrollIntoView({ behavior: "smooth", block: "start" });
  },

  openAdminView() {
    const listView = document.getElementById("listView");
    const detailView = document.getElementById("detailView");
    const toolsView = document.getElementById("toolsView");
    const adminView = document.getElementById("adminView");
    if (listView) listView.style.display = "none";
    if (detailView) detailView.style.display = "none";
    if (toolsView) toolsView.style.display = "none";
    if (adminView) adminView.style.display = "block";
  },

  hideManager(resetActive = true) {
    const panel = document.getElementById("imageManagerPanel");
    if (panel) panel.style.display = "none";
    this.setMainVisibility(true);
    if (resetActive) this.setActiveNav("sidebarTeamsBtn");
  },

  setMainVisibility(visible) {
    ["adminHint", "adminTeamList", "editorPanel"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.style.display = visible ? "" : "none";
    });
  },

  setActiveNav(activeId) {
    document.querySelectorAll(".admin-nav-item").forEach((item) => {
      item.classList.toggle("active", item.id === activeId);
    });
  },

  folders() {
    if (typeof HERO_TIERS === "undefined") return [];
    const seen = new Set();
    return HERO_TIERS.map((tier) => ({
      folder: tier.folder,
      label: tier.label,
      count: (tier.names || []).length,
    })).filter((item) => {
      if (seen.has(item.folder)) return false;
      seen.add(item.folder);
      return true;
    });
  },

  renderFolders() {
    const grid = document.getElementById("imageFolderGrid");
    if (!grid) return;
    const folders = this.folders();
    if (!this.selectedFolder && folders.length) this.selectedFolder = folders[0].folder;

    grid.innerHTML = folders.map((item) => `
      <button class="image-folder-card ${item.folder === this.selectedFolder ? "active" : ""}" data-folder="${this.escapeHtml(item.folder)}" type="button">
        <span>${this.escapeHtml(item.label)}</span>
        <b>${this.escapeHtml(item.folder)}</b>
        <small>${item.count} ตัวละคร</small>
      </button>
    `).join("");

    grid.querySelectorAll("[data-folder]").forEach((btn) => {
      btn.addEventListener("click", () => this.selectFolder(btn.dataset.folder));
    });
    this.updateUploadState();
  },

  selectFolder(folder) {
    this.selectedFolder = folder;
    this.selectedFiles = [];
    this.renderFolders();
    this.renderEmpty();
  },

  updateUploadState() {
    const pickBtn = document.getElementById("heroImagePickBtn");
    const title = document.getElementById("imageUploadTitle");
    const sub = document.getElementById("imageUploadSub");
    if (pickBtn) pickBtn.disabled = !this.selectedFolder;
    if (title) title.textContent = this.selectedFolder ? `เพิ่มรูปเข้า ${this.selectedFolder}` : "เลือก folder ก่อน";
    if (sub) sub.textContent = this.selectedFolder
      ? `ไฟล์ที่เลือกจะถูกเตรียมไว้สำหรับ public/images/${this.selectedFolder}/`
      : "หลังเลือก folder แล้วกดเพิ่มไฟล์หรือลากรูปมาวางตรงนี้";
  },

  addFiles(files) {
    if (!this.selectedFolder) {
      this.renderMessage("กรุณาเลือก folder ก่อนเพิ่มไฟล์", "warn");
      return;
    }

    const imageFiles = files.filter((file) => /\.(png|jpe?g|webp|gif)$/i.test(file.name));
    if (!imageFiles.length) {
      this.renderMessage("ไม่เจอไฟล์รูปภาพในสิ่งที่เลือก", "warn");
      return;
    }

    this.selectedFiles = imageFiles.map((file) => this.fileToEntry(file));
    this.renderSelectedFiles();
  },

  fileToEntry(file) {
    const targetPath = `${this.selectedFolder}/${file.name}`;
    const matchingHero = this.heroesInSelectedFolder().find((hero) => `${hero.name}.png` === file.name);
    const objectUrl = URL.createObjectURL(file);
    return {
      file,
      objectUrl,
      targetPath,
      status: matchingHero ? "match" : "unknown",
      heroName: matchingHero?.name || "",
    };
  },

  heroesInSelectedFolder() {
    if (typeof HERO_TIERS === "undefined" || !this.selectedFolder) return [];
    return HERO_TIERS
      .filter((tier) => tier.folder === this.selectedFolder)
      .flatMap((tier) => (tier.names || []).map((name) => ({ name, tier: tier.label })));
  },

  renderEmpty() {
    const result = document.getElementById("imageManagerResult");
    if (!result) return;
    result.innerHTML = `
      <div class="image-manager-empty">
        เลือก folder แล้วเพิ่มไฟล์รูป ระบบจะแสดง preview และ path ปลายทางให้ตรวจอีกครั้ง
      </div>
    `;
  },

  renderMessage(message, tone = "") {
    const result = document.getElementById("imageManagerResult");
    if (!result) return;
    result.innerHTML = `<div class="image-manager-empty ${tone}">${this.escapeHtml(message)}</div>`;
  },

  renderSelectedFiles() {
    const result = document.getElementById("imageManagerResult");
    if (!result) return;
    const matchCount = this.selectedFiles.filter((item) => item.status === "match").length;
    const unknownCount = this.selectedFiles.length - matchCount;

    result.innerHTML = `
      <div class="image-manager-summary">
        <div><span>Folder</span><b>${this.escapeHtml(this.selectedFolder)}</b></div>
        <div><span>ไฟล์ทั้งหมด</span><b>${this.selectedFiles.length}</b></div>
        <div><span>ชื่อตรงตัวละคร</span><b>${matchCount}</b></div>
        <div><span>ต้องตรวจชื่อ</span><b>${unknownCount}</b></div>
      </div>
      <div class="image-file-grid">
        ${this.selectedFiles.map((item) => `
          <div class="image-file-card ${item.status}">
            <img src="${item.objectUrl}" alt="">
            <div class="image-file-info">
              <b>${this.escapeHtml(item.file.name)}</b>
              <code>public/images/${this.escapeHtml(item.targetPath)}</code>
              <span>${item.status === "match" ? "ชื่อไฟล์ตรงกับตัวละคร" : "ชื่อไฟล์ยังไม่ตรงกับรายชื่อตัวละครใน folder นี้"}</span>
            </div>
          </div>
        `).join("")}
      </div>
      <div class="image-check-note">ตอนนี้เป็นขั้นเตรียม/ตรวจไฟล์ ยังไม่ได้เขียนไฟล์เข้า GitHub หรือ Cloudflare อัตโนมัติ</div>
    `;
  },

  async filesFromDataTransfer(dataTransfer) {
    const items = Array.from(dataTransfer?.items || []);
    if (!items.length) return Array.from(dataTransfer?.files || []);

    const entries = items
      .map((item) => (typeof item.webkitGetAsEntry === "function" ? item.webkitGetAsEntry() : null))
      .filter(Boolean);

    if (!entries.length) return Array.from(dataTransfer.files || []);

    const nested = await Promise.all(entries.map((entry) => this.walkEntry(entry)));
    return nested.flat();
  },

  walkEntry(entry, basePath = "") {
    return new Promise((resolve) => {
      if (entry.isFile) {
        entry.file((file) => resolve([file]), () => resolve([]));
        return;
      }
      if (!entry.isDirectory) {
        resolve([]);
        return;
      }
      const reader = entry.createReader();
      const allEntries = [];
      const readBatch = () => {
        reader.readEntries(async (batch) => {
          if (!batch.length) {
            const nested = await Promise.all(allEntries.map((child) => this.walkEntry(child, basePath)));
            resolve(nested.flat());
            return;
          }
          allEntries.push(...batch);
          readBatch();
        }, () => resolve([]));
      };
      readBatch();
    });
  },

  escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  },
};