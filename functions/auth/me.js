// GET /auth/me
// Returns the current session info for the client-side AuthGate.

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
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
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
  await env.DB.prepare(`CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions (expires_at)`).run();
}

export async function onRequestGet({ request, env }) {
  if (!env.DB) return json({ loggedIn: false, error: "missing DB binding" }, 500);
  await ensureSessionsTable(env);

  const sid = parseCookies(request)[SESSION_COOKIE];
  if (!sid) return json({ loggedIn: false });

  const nowSec = Math.floor(Date.now() / 1000);
  const session = await env.DB.prepare(
    `SELECT discord_id, username, display_name, role, is_member
     FROM sessions
     WHERE sid = ? AND is_member = 1 AND expires_at > ?`
  ).bind(sid, nowSec).first();

  if (!session) return json({ loggedIn: false });

  return json({
    loggedIn: true,
    isAdmin: session.role === "admin",
    isMember: session.is_member === 1,
    displayName: session.display_name,
  });
}