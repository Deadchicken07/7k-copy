const GH_REPO   = "Deadchicken07/7k-copy";
const GH_FILE   = "data/teams.json";
const GH_BRANCH = window.location.hostname.startsWith("staging.") ? "staging" : "main";
const GH_TOKEN  = "";

const Publisher = {
  _busy: false,

  async publish() {
    if (this._busy) return;
    this._busy = true;
    const btn = document.getElementById("publishBtn");
    btn.disabled = true;
    btn.classList.add("btn-publishing");
    const origHtml = btn.innerHTML;
    btn.innerHTML = `<svg class="spin-icon" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> กำลังเผยแพร่...`;

    try {
      // 1. Get current file SHA + content (required for update; also preserves votes)
      const getRes = await fetch(
        `https://api.github.com/repos/${GH_REPO}/contents/${GH_FILE}?ref=${GH_BRANCH}`,
        { headers: { Authorization: `Bearer ${GH_TOKEN}`, Accept: "application/vnd.github+json" } }
      );
      if (!getRes.ok) throw new Error("เชื่อม GitHub ไม่ได้ (status " + getRes.status + ")");
      const fileInfo = await getRes.json();
      const sha = fileInfo.sha;

      // 2. Merge remote → vote counts + Smart Merge (teams added by others)
      let localData = JSON.parse(JSON.stringify(Store.data));
      try {
        const rawBin = atob(fileInfo.content.replace(/\n/g, ""));
        const rawBytes = new Uint8Array(rawBin.length);
        for (let i = 0; i < rawBin.length; i++) rawBytes[i] = rawBin.charCodeAt(i);
        const remoteData = JSON.parse(new TextDecoder().decode(rawBytes));

        // 2a. Merge vote counts
        (localData.teams || []).forEach((team) => {
          const rt = (remoteData.teams || []).find((t) => t.id === team.id);
          if (!rt) return;
          (team.counters || []).forEach((counter, idx) => {
            const rc = (rt.counters || [])[idx];
            if (!rc) return;
            counter.likes    = Math.max(counter.likes    || 0, rc.likes    || 0);
            counter.dislikes = Math.max(counter.dislikes || 0, rc.dislikes || 0);
          });
        });

        // 2b. Smart Merge: bring in teams added by others during concurrent edit
        // "ของคนอื่น" = อยู่ใน remote แต่ไม่เคยอยู่ใน base ตอนโหลดหน้า
        if (Store._baseTeamIds) {
          const localIds = new Set((localData.teams || []).map((t) => t.id));
          (remoteData.teams || []).forEach((rt) => {
            if (!Store._baseTeamIds.has(rt.id) && !localIds.has(rt.id)) {
              localData.teams.push(rt);
            }
          });
          // อัปเดต base หลัง publish สำเร็จ (ทำด้านล่างหลัง PUT)
        }
      } catch (_) { /* fallback: publish without merge */ }

      // 3. UTF-8–safe base64 encode
      const json = JSON.stringify(localData, null, 2);
      const bytes = new TextEncoder().encode(json);
      const binStr = Array.from(bytes, (b) => String.fromCharCode(b)).join("");
      const content = btoa(binStr);

      // 4. Push updated file
      const putRes = await fetch(
        `https://api.github.com/repos/${GH_REPO}/contents/${GH_FILE}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${GH_TOKEN}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: "chore: update teams.json via admin panel",
            content,
            sha,
            branch: GH_BRANCH,
          }),
        }
      );
      if (!putRes.ok) {
        const errBody = await putRes.json().catch(() => ({}));
        throw new Error(errBody.message || "อัปโหลดไม่สำเร็จ (status " + putRes.status + ")");
      }

      // อัปเดต base หลัง publish สำเร็จ ให้ publish ครั้งต่อไปใช้ base ใหม่
      Store.data = localData;
      Store._baseTeamIds = new Set((localData.teams || []).map((t) => t.id));
      Store.saveDraft();

      btn.innerHTML = `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> เผยแพร่แล้ว!`;
      btn.classList.remove("btn-publishing");
      btn.classList.add("btn-published");
      toast("เผยแพร่สำเร็จ! เว็บจะอัปเดตภายใน 1-2 นาที");
      setTimeout(() => {
        btn.innerHTML = origHtml;
        btn.classList.remove("btn-published");
        btn.disabled = false;
      }, 3000);
    } catch (err) {
      toast("เผยแพร่ไม่สำเร็จ: " + err.message);
      btn.innerHTML = origHtml;
      btn.classList.remove("btn-publishing");
      btn.disabled = false;
    } finally {
      this._busy = false;
    }
  },
};

