const VOTE_STORE_KEY = "7kcombo_votes_v1";

const Vote = {
  _getAll() {
    try { return JSON.parse(localStorage.getItem(VOTE_STORE_KEY) || "{}"); }
    catch { return {}; }
  },

  getLocal(teamId, counterIdx) {
    return this._getAll()[`${teamId}:${counterIdx}`] || null;
  },

  _setLocal(teamId, counterIdx, voteType) {
    const all = this._getAll();
    const key = `${teamId}:${counterIdx}`;
    if (voteType) all[key] = voteType;
    else delete all[key];
    localStorage.setItem(VOTE_STORE_KEY, JSON.stringify(all));
  },

  _decodeContent(b64) {
    const binStr = atob(b64.replace(/\n/g, ""));
    const bytes = new Uint8Array(binStr.length);
    for (let i = 0; i < binStr.length; i++) bytes[i] = binStr.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  },

  _encodeContent(str) {
    const bytes = new TextEncoder().encode(str);
    return btoa(Array.from(bytes, (b) => String.fromCharCode(b)).join(""));
  },

  async cast(teamId, counterIdx, voteType, retries = 2) {
    const prev = this.getLocal(teamId, counterIdx);
    const newVote = prev === voteType ? null : voteType;

    // 1. Fetch latest file + SHA
    const getRes = await fetch(
      `https://api.github.com/repos/${GH_REPO}/contents/${GH_FILE}?ref=${GH_BRANCH}`,
      { headers: { Authorization: `Bearer ${GH_TOKEN}`, Accept: "application/vnd.github+json" } }
    );
    if (!getRes.ok) throw new Error("โหลดข้อมูลไม่ได้ (" + getRes.status + ")");
    const fileInfo = await getRes.json();
    const sha = fileInfo.sha;
    const json = JSON.parse(this._decodeContent(fileInfo.content));

    // 2. Update vote counts
    const team = json.teams.find((t) => t.id === teamId);
    if (!team) throw new Error("ไม่พบทีม");
    const counter = (team.counters || [])[counterIdx];
    if (!counter) throw new Error("ไม่พบทีมตอบโต้");

    if (prev === "like")       counter.likes    = Math.max(0, (counter.likes    || 0) - 1);
    if (prev === "dislike")    counter.dislikes = Math.max(0, (counter.dislikes || 0) - 1);
    if (newVote === "like")    counter.likes    = (counter.likes    || 0) + 1;
    if (newVote === "dislike") counter.dislikes = (counter.dislikes || 0) + 1;

    // 3. Push back
    const newJsonStr = JSON.stringify(json, null, 2);
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
          message: "chore: update votes",
          content: this._encodeContent(newJsonStr),
          sha,
          branch: GH_BRANCH,
        }),
      }
    );

    if (putRes.status === 409 && retries > 0) {
      return this.cast(teamId, counterIdx, voteType, retries - 1);
    }
    if (!putRes.ok) {
      const err = await putRes.json().catch(() => ({}));
      throw new Error(err.message || "บันทึกไม่ได้ (" + putRes.status + ")");
    }

    // 4. Save to localStorage
    this._setLocal(teamId, counterIdx, newVote);

    // 5. Sync in-memory Store.data and snapshot (prevents false update banner)
    const localTeam = Store.getTeam(teamId);
    if (localTeam?.counters?.[counterIdx]) {
      localTeam.counters[counterIdx].likes    = counter.likes;
      localTeam.counters[counterIdx].dislikes = counter.dislikes;
    }
    Store._remoteSnapshot = newJsonStr;

    return { newVote, likes: counter.likes || 0, dislikes: counter.dislikes || 0 };
  },
};
