const AdminTools = {
  render() {
    const view = document.getElementById("toolsView");

    const days = Array.from({ length: 2 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return {
        label: i === 0 ? "วันนี้" : i === 1 ? "พรุ่งนี้" : `+${i} วัน`,
        date: d.toLocaleDateString("th-TH", {
          weekday: "short", day: "numeric", month: "short", year: "numeric",
        }),
        code: getDailyCode(i),
        displayCode: i === 0
          ? getDailyCode(i)
          : getDailyCode(i).slice(0, -4) + '<span class="code-masked">XXXX</span>',
        isToday: i === 0,
      };
    });

    const today = days[0];

    view.innerHTML = `
      <div class="tools-page">
        <button class="detail-back-btn" id="toolsBackBtn">← กลับ</button>
        <h2 class="tools-title">🔧 Admin Tools</h2>

        <div class="tools-card">
          <div class="tools-card-title">🗓️ รหัสสมาชิกประจำวัน</div>
          <div class="tools-today">
            <div class="tools-today-date">${today.date}</div>
            <div class="tools-today-code">${today.code}</div>
            <div class="tools-today-actions">
              <button class="btn btn-primary" id="copyTodayBtn">📋 คัดลอกรหัส</button>
              <button class="btn" id="lineMessageBtn">💬 สร้างข้อความ LINE</button>
            </div>
          </div>

          <table class="tools-code-table">
            <thead>
              <tr><th>วัน</th><th>วันที่</th><th>รหัส</th></tr>
            </thead>
            <tbody>
              ${days.map((r) => `
                <tr class="${r.isToday ? "tools-row-today" : ""}">
                  <td>${r.label}</td>
                  <td>${r.date}</td>
                  <td class="tools-code-cell">${r.displayCode}</td>
                </tr>`).join("")}
            </tbody>
          </table>
        </div>

        <div class="tools-card">
          <div class="tools-card-title">ℹ️ วิธีการใช้งาน</div>
          <p class="hint">รหัสประจำวันถูกสร้างจาก <b>วันที่ + Salt</b> ที่อยู่ในโค้ดเว็บ
            รหัสจะเปลี่ยนอัตโนมัติทุกเที่ยงคืน ส่งรหัสวันนี้ให้สมาชิกทุกวันผ่าน LINE</p>
          <p class="hint"><b>รหัสสำรอง (ไม่หมดอายุ):</b>
            <span class="tools-static-codes">${GUILD_CODES.join(" · ")}</span>
          </p>
          <p class="hint">หากต้องการเปลี่ยน Salt (ทำให้รหัสเก่าใช้ไม่ได้) ให้แก้ไขค่า
            <code>GUILD_SALT</code> ในไฟล์ <code>js/auth.js</code> แล้ว export + อัปโหลดใหม่</p>
        </div>
      </div>
    `;

    document.getElementById("toolsBackBtn").addEventListener("click", () => App.showList());

    document.getElementById("copyTodayBtn").addEventListener("click", () => {
      navigator.clipboard.writeText(today.code).then(() => toast("คัดลอกรหัสแล้ว"));
    });

    document.getElementById("lineMessageBtn").addEventListener("click", () => {
      const msg =
        `🛡️ ICONYX & LEGENDS Guild War Hub\n` +
        `📅 ${today.date}\n` +
        `🔑 รหัสสมาชิก: ${today.code}\n\n` +
        `นำรหัสนี้ไปกรอกที่หน้าเว็บเพื่อเข้าดูทีมที่แนะนำ\n` +
        `⚠️ รหัสนี้ใช้ได้เฉพาะวันนี้เท่านั้น`;
      document.getElementById("lineText").textContent = msg;
      document.getElementById("lineModal").classList.add("open");
    });
  },
};
