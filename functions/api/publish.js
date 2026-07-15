/**
 * POST /api/publish
 * Body: { teams: [...] }
 *
 * Admin-only endpoint. Validates the session cookie against D1, then writes
 * teams.json to GitHub, merging remote vote counts and smart-merging
 * concurrently-added teams before pushing.
 *
 * Required env vars:
 *   GH_TOKEN   — GitHub PAT with repo write scope
 *   GH_REPO    — e.g. "Deadchicken07/7k-copy"
 *   GH_FILE    — e.g. "data/teams.json"
 *   GH_BRANCH  — e.g. "main"
 *   DB         — Cloudflare D1 binding (same as auth functions)
 */

const SESSION_COOKIE = "sid";

function parseCookies(request) {
  const header = request.headers.get("cookie") || "";
  const map = {};
  for (const part of header.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k) map[decodeURIComponent(k.trim())] = decodeURIComponent(v.join("=").trim());
  }
  return map;
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function decodeContent(b64) {
  const binStr = atob(b64.replace(/\n/g, ""));
  const bytes = new Uint8Array(binStr.length);
  for (let i = 0; i < binStr.length; i++) bytes[i] = binStr.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

function encodeContent(str) {
  const bytes = new TextEncoder().encode(str);
  return btoa(Array.from(bytes, (b) => String.fromCharCode(b)).join(""));
}

async function ensureSessionsTable(env) {
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS sessions (
      sid          TEXT    PRIMARY KEY,
      discord_id   TEXT    NOT NULL,
      username     TEXT    NOT NULL,
      display_name TEXT    NOT NULL,
      is_member    INTEGER NOT NULL DEFAULT 1,
      role         TEXT    NOT NULL DEFAULT 'user',
      expires_at   INTEGER NOT NULL,
      created_at   INTEGER NOT NULL DEFAULT (unixepoch())
    )
  `).run();
}

export async function onRequestPost(context) {
  const { request, env } = context;

  // --- Validate env ---
  if (!env.GH_TOKEN || !env.GH_REPO || !env.GH_FILE || !env.GH_BRANCH) {
    return json({ error: "missing GitHub env vars on server" }, 500);
  }
  if (!env.DB) {
    return json({ error: "missing DB binding" }, 500);
  }

  // --- Admin session guard ---
  await ensureSessionsTable(env);
  const sid = parseCookies(request)[SESSION_COOKIE];
  if (!sid) return json({ error: "ต้อง login ก่อน" }, 401);

  const nowSec = Math.floor(Date.now() / 1000);
  const session = await env.DB.prepare(
    `SELECT discord_id, role FROM sessions
     WHERE sid = ? AND is_member = 1 AND expires_at > ?`
  ).bind(sid, nowSec).first();

  if (!session) return json({ error: "session หมดอายุหรือไม่ถูกต้อง" }, 401);
  if (session.role !== "admin") return json({ error: "ต้องเป็น admin เท่านั้น" }, 403);

  // --- Parse body ---
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid JSON body" }, 400);
  }

  const { teams } = body;
  if (!Array.isArray(teams)) {
    return json({ error: "body ต้องมี teams array" }, 400);
  }

  const { GH_TOKEN, GH_REPO, GH_FILE, GH_BRANCH } = env;
  const apiBase = `https://api.github.com/repos/${GH_REPO}/contents/${GH_FILE}`;
  const ghHeaders = {
    Authorization: `Bearer ${GH_TOKEN}`,
    Accept: "application/vnd.github+json",
    "User-Agent": "7k-guild-hub",
  };

  // --- Fetch current remote file + SHA ---
  const getRes = await fetch(`${apiBase}?ref=${GH_BRANCH}`, { headers: ghHeaders });
  if (!getRes.ok) {
    return json({ error: `เชื่อม GitHub ไม่ได้ (${getRes.status})` }, 502);
  }
  const fileInfo = await getRes.json();
  const sha = fileInfo.sha;

  // --- Merge remote votes + smart-merge concurrently-added teams ---
  let localData = { teams: JSON.parse(JSON.stringify(teams)) };

  try {
    const remoteData = JSON.parse(decodeContent(fileInfo.content));
    const remoteTeamMap = new Map((remoteData.teams || []).map((t) => [t.id, t]));

    // 1. Merge vote counts: take max of local vs remote
    localData.teams.forEach((team) => {
      const rt = remoteTeamMap.get(team.id);
      if (!rt) return;
      (team.counters || []).forEach((counter, idx) => {
        const rc = (rt.counters || [])[idx];
        if (!rc) return;
        counter.likes    = Math.max(counter.likes    || 0, rc.likes    || 0);
        counter.dislikes = Math.max(counter.dislikes || 0, rc.dislikes || 0);
      });
    });

    // 2. Smart-merge: bring in teams that exist remotely but not in this payload
    //    (added by someone else during concurrent editing)
    const localIds = new Set(localData.teams.map((t) => t.id));
    (remoteData.teams || []).forEach((rt) => {
      if (!localIds.has(rt.id)) {
        localData.teams.push(rt);
      }
    });
  } catch (_) {
    // Fallback: publish without merge — don't block the write
  }

  // --- Push to GitHub ---
  const newJson = JSON.stringify(localData, null, 2);
  const putRes = await fetch(apiBase, {
    method: "PUT",
    headers: { ...ghHeaders, "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "chore: update teams.json via admin panel",
      content: encodeContent(newJson),
      sha,
      branch: GH_BRANCH,
    }),
  });

  if (!putRes.ok) {
    const errBody = await putRes.json().catch(() => ({}));
    return json({ error: errBody.message || `อัปโหลดไม่สำเร็จ (${putRes.status})` }, 502);
  }

  return json({ ok: true, teamCount: localData.teams.length });
}
