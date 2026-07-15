/**
 * POST /api/vote
 * Body: { teamId: string, counterIdx: number, voteType: "like" | "dislike" }
 *
 * Reads teams.json from GitHub, updates likes/dislikes for the target counter,
 * and writes the file back. Retries on 409 (SHA conflict) up to 2 times.
 *
 * Required env vars (Cloudflare Pages → Settings → Environment Variables):
 *   GH_TOKEN   — GitHub Personal Access Token with repo write scope
 *   GH_REPO    — e.g. "Deadchicken07/7k-copy"
 *   GH_FILE    — e.g. "data/teams.json"
 *   GH_BRANCH  — e.g. "main"
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

async function castVote({ teamId, counterIdx, voteType, prevVote, env, retries = 2 }) {
  const { GH_TOKEN, GH_REPO, GH_FILE, GH_BRANCH } = env;
  const apiBase = `https://api.github.com/repos/${GH_REPO}/contents/${GH_FILE}`;
  const headers = {
    Authorization: `Bearer ${GH_TOKEN}`,
    Accept: "application/vnd.github+json",
    "User-Agent": "7k-guild-hub",
  };

  // 1. Fetch current file + SHA
  const getRes = await fetch(`${apiBase}?ref=${GH_BRANCH}`, { headers });
  if (!getRes.ok) {
    return json({ error: `โหลด teams.json ไม่ได้ (${getRes.status})` }, 502);
  }
  const fileInfo = await getRes.json();
  const sha = fileInfo.sha;
  const data = JSON.parse(decodeContent(fileInfo.content));

  // 2. Locate team + counter
  const team = (data.teams || []).find((t) => String(t.id) === String(teamId));
  if (!team) return json({ error: "ไม่พบทีม" }, 404);
  const counter = (team.counters || [])[counterIdx];
  if (!counter) return json({ error: "ไม่พบ counter" }, 404);

  // 3. Toggle logic: if prevVote === voteType → cancel vote (newVote = null)
  const newVote = prevVote === voteType ? null : voteType;

  if (prevVote === "like")       counter.likes    = Math.max(0, (counter.likes    || 0) - 1);
  if (prevVote === "dislike")    counter.dislikes = Math.max(0, (counter.dislikes || 0) - 1);
  if (newVote  === "like")       counter.likes    = (counter.likes    || 0) + 1;
  if (newVote  === "dislike")    counter.dislikes = (counter.dislikes || 0) + 1;

  // 4. Push updated file
  const newJson = JSON.stringify(data, null, 2);
  const putRes = await fetch(apiBase, {
    method: "PUT",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "chore: update votes",
      content: encodeContent(newJson),
      sha,
      branch: GH_BRANCH,
    }),
  });

  // 409 = SHA conflict (concurrent write) — retry
  if (putRes.status === 409 && retries > 0) {
    return castVote({ teamId, counterIdx, voteType, prevVote, env, retries: retries - 1 });
  }
  if (!putRes.ok) {
    const errBody = await putRes.json().catch(() => ({}));
    return json({ error: errBody.message || `บันทึกไม่ได้ (${putRes.status})` }, 502);
  }

  return json({
    ok: true,
    newVote,
    likes: counter.likes || 0,
    dislikes: counter.dislikes || 0,
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  // Validate env
  if (!env.GH_TOKEN || !env.GH_REPO || !env.GH_FILE || !env.GH_BRANCH) {
    return json({ error: "missing GitHub env vars on server" }, 500);
  }

  // Optional: require login (must have valid sid cookie → D1 session)
  // Uncomment to enforce:
  // const sid = parseCookies(request)[SESSION_COOKIE];
  // if (!sid) return json({ error: "ต้อง login ก่อน" }, 401);
  // const nowSec = Math.floor(Date.now() / 1000);
  // const session = await env.DB?.prepare(
  //   `SELECT discord_id FROM sessions WHERE sid = ? AND is_member = 1 AND expires_at > ?`
  // ).bind(sid, nowSec).first();
  // if (!session) return json({ error: "session หมดอายุหรือไม่ถูกต้อง" }, 401);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid JSON body" }, 400);
  }

  const { teamId, counterIdx, voteType, prevVote } = body;

  if (!teamId) return json({ error: "ต้องระบุ teamId" }, 400);
  if (typeof counterIdx !== "number" || counterIdx < 0)
    return json({ error: "counterIdx ต้องเป็น number >= 0" }, 400);
  if (!["like", "dislike"].includes(voteType))
    return json({ error: 'voteType ต้องเป็น "like" หรือ "dislike"' }, 400);

  return castVote({ teamId, counterIdx, voteType, prevVote: prevVote || null, env });
}
