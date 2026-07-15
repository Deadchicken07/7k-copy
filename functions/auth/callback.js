// GET /auth/callback
// Completes Discord OAuth, checks guild membership, stores session in D1, and sets sid cookie.

const SESSION_COOKIE = "sid";

function getCookie(request, name) {
  const raw = request.headers.get("Cookie") || "";
  for (const part of raw.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return decodeURIComponent(v.join("="));
  }
  return "";
}

function httpOnlyCookie(name, value, maxAge) {
  return `${name}=${encodeURIComponent(value)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAge}`;
}

function redirectTo(url, path, reason) {
  const dest = new URL(path, url.origin);
  if (reason) dest.searchParams.set("auth", reason);
  return Response.redirect(dest.toString(), 302);
}

function missingEnv(env) {
  return [
    "DISCORD_CLIENT_ID",
    "DISCORD_CLIENT_SECRET",
    "DISCORD_REDIRECT_URI",
    "DISCORD_GUILD_ID",
    "DB",
  ].filter((key) => !env[key]);
}

async function ensureAuthTables(env) {
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

  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS login_logs (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      discord_id   TEXT    NOT NULL,
      username     TEXT    NOT NULL,
      display_name TEXT    NOT NULL,
      is_member    INTEGER NOT NULL DEFAULT 0,
      ip           TEXT,
      user_agent   TEXT,
      created_at   INTEGER NOT NULL DEFAULT (unixepoch())
    )
  `).run();

  await env.DB.prepare(`CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions (expires_at)`).run();
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const missing = missingEnv(env);
  if (missing.length) {
    return new Response(`Missing env: ${missing.join(", ")}`, {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  await ensureAuthTables(env);

  const code = url.searchParams.get("code");
  const rawState = url.searchParams.get("state") || "{}";
  let parsedState = {};
  try {
    parsedState = JSON.parse(rawState);
  } catch (_) {
    return redirectTo(url, "/", "bad_state");
  }

  const { state, redirect = "/" } = parsedState;
  const savedState = getCookie(request, "oauth_state");
  if (!code || !state || state !== savedState) {
    return redirectTo(url, "/", "failed");
  }

  const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: env.DISCORD_CLIENT_ID,
      client_secret: env.DISCORD_CLIENT_SECRET,
      grant_type: "authorization_code",
      code,
      redirect_uri: env.DISCORD_REDIRECT_URI,
    }),
  });

  if (!tokenRes.ok) {
    const detail = await tokenRes.text();
    return new Response(`Discord token exchange failed: ${detail}`, {
      status: 502,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const { access_token } = await tokenRes.json();
  const userRes = await fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  if (!userRes.ok) return redirectTo(url, "/", "failed");
  const user = await userRes.json();

  const memberRes = await fetch(
    `https://discord.com/api/users/@me/guilds/${env.DISCORD_GUILD_ID}/member`,
    { headers: { Authorization: `Bearer ${access_token}` } }
  );

  const ip = request.headers.get("CF-Connecting-IP") || "";
  const userAgent = request.headers.get("User-Agent") || "";
  const displayName = user.global_name || user.username || "";
  const isMember = memberRes.ok ? 1 : 0;

  await env.DB.prepare(`
    INSERT INTO login_logs (discord_id, username, display_name, is_member, ip, user_agent)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(user.id, user.username || "", displayName, isMember, ip, userAgent).run();

  if (!isMember) return redirectTo(url, "/", "denied");

  const member = await memberRes.clone().json().catch(() => ({ roles: [] }));
  const allowedRoleIds = (env.ALLOWED_ROLE_IDS || "").split(",").map((s) => s.trim()).filter(Boolean);
  const adminRoleIds = (env.ADMIN_ROLE_IDS || "").split(",").map((s) => s.trim()).filter(Boolean);
  const roles = member.roles || [];
  const isAllowed = allowedRoleIds.length === 0 || roles.some((rid) => allowedRoleIds.includes(rid));
  const isAdmin = roles.some((rid) => adminRoleIds.includes(rid));

  if (!isAllowed && !isAdmin) return redirectTo(url, "/", "denied_role");

  const role = isAdmin ? "admin" : "user";
  const sid = crypto.randomUUID();
  const nowSec = Math.floor(Date.now() / 1000);
  const expiresAt = nowSec + 60 * 60 * 24 * 7;

  await env.DB.prepare(`
    INSERT OR REPLACE INTO sessions
      (sid, discord_id, username, display_name, is_member, role, expires_at, created_at)
    VALUES (?, ?, ?, ?, 1, ?, ?, ?)
  `).bind(sid, user.id, user.username || "", displayName, role, expiresAt, nowSec).run();

  const dest = redirect.startsWith("/") ? redirect : "/";
  const headers = new Headers({ Location: dest });
  headers.append("Set-Cookie", httpOnlyCookie(SESSION_COOKIE, sid, 60 * 60 * 24 * 7));
  headers.append("Set-Cookie", httpOnlyCookie("oauth_state", "", 0));
  headers.append("Set-Cookie", `7k_role=${role}; SameSite=Lax; Path=/; Max-Age=86400`);

  return new Response(null, { status: 302, headers });
}