// GET /auth/me
// Returns the current session info for client-side auth.js (Auth.initDiscord)
// Expected shape: { loggedIn, isAdmin, isMember, displayName }

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
    headers: { "Content-Type": "application/json" },
  });
}

export async function onRequestGet({ request, env }) {
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
    loggedIn:    true,
    isAdmin:     session.role === "admin",
    isMember:    session.is_member === 1,
    displayName: session.display_name,
  });
}
