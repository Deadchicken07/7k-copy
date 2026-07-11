// guild-auth-worker — entry point for ALL traffic
// Flow: validate session → proxy to Pages site (env.SITE_URL)
//
// Env vars needed (Cloudflare Worker → Settings → Variables):
//   DISCORD_CLIENT_ID
//   DISCORD_CLIENT_SECRET   (Secret)
//   DISCORD_REDIRECT_URI    = https://guild-auth-worker.deadchicken07.workers.dev/auth/callback
//   DISCORD_GUILD_ID
//   DISCORD_BOT_TOKEN       (Secret) — ใช้ fetch role IDs
//   ADMIN_ROLE_IDS          = comma-separated role IDs ที่ได้ admin
//   SITE_URL                = https://YOUR-PAGES-SITE.pages.dev
//   DB                      = D1 binding

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // ── Auth routes: ไม่ต้องตรวจ session ──────────────────────────────────
    if (url.pathname === "/auth/login")    return handleLogin(url, env);
    if (url.pathname === "/auth/callback") return handleCallback(request, url, env);
    if (url.pathname === "/auth/me")       return handleMe(request, env);
    if (url.pathname === "/auth/logout")   return handleLogout(request, env);
    if (url.pathname === "/debug/member")  return debugMember(url, env);

    // ── ทุก route อื่นต้องมี session ──────────────────────────────────────
    const session = await getSession(request, env);
    if (!session) {
      const loginUrl = new URL("/auth/login", url.origin);
      loginUrl.searchParams.set("redirect", url.pathname + url.search);
      return Response.redirect(loginUrl.toString(), 302);
    }

    // ── Proxy ไปที่ Pages site ─────────────────────────────────────────────
    const pagesUrl = new URL(url.pathname + url.search, env.SITE_URL);
    const pagesRes = await fetch(pagesUrl.toString(), {
      method:  request.method,
      headers: request.headers,
      body:    ["GET", "HEAD"].includes(request.method) ? undefined : request.body,
    });

    // Stamp 7k_role cookie (ไม่ HttpOnly เพื่อให้ JS อ่านได้)
    const res = new Response(pagesRes.body, pagesRes);
    res.headers.append("Set-Cookie",
      `7k_role=${session.role}; Path=/; SameSite=Lax; Max-Age=86400`
    );
    return res;
  },
};

// ── Session helper ──────────────────────────────────────────────────────────
async function getSession(request, env) {
  const sid = getCookie(request, "sid");
  if (!sid) return null;
  const nowSec = Math.floor(Date.now() / 1000);
  return env.DB.prepare(`
    SELECT discord_id, username, display_name, role, is_member
    FROM sessions
    WHERE sid = ? AND is_member = 1 AND expires_at > ?
  `).bind(sid, nowSec).first();
}

// ── /auth/login ─────────────────────────────────────────────────────────────
function handleLogin(url, env) {
  const redirect = url.searchParams.get("redirect") || "/";
  const state    = crypto.randomUUID();

  const authUrl = new URL("https://discord.com/oauth2/authorize");
  authUrl.searchParams.set("client_id",     env.DISCORD_CLIENT_ID);
  authUrl.searchParams.set("redirect_uri",  env.DISCORD_REDIRECT_URI);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope",         "identify guilds.members.read");
  authUrl.searchParams.set("state",         JSON.stringify({ state, redirect }));

  return new Response(null, {
    status: 302,
    headers: {
      Location:     authUrl.toString(),
      "Set-Cookie": httpOnlyCookie("oauth_state", state, 300),
    },
  });
}

// ── /auth/callback ──────────────────────────────────────────────────────────
async function handleCallback(request, url, env) {
  const code      = url.searchParams.get("code");
  const rawState  = url.searchParams.get("state") || "{}";
  const { state, redirect = "/" } = JSON.parse(rawState);
  const savedState = getCookie(request, "oauth_state");

  if (!code || !state || state !== savedState) {
    return redirectHome(url, "failed");
  }

  // 1. Exchange code → access_token
  const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id:     env.DISCORD_CLIENT_ID,
      client_secret: env.DISCORD_CLIENT_SECRET,
      grant_type:    "authorization_code",
      code,
      redirect_uri:  env.DISCORD_REDIRECT_URI,
    }),
  });
  if (!tokenRes.ok) return redirectHome(url, "failed");
  const { access_token } = await tokenRes.json();

  // 2. Get Discord user info
  const userRes = await fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  if (!userRes.ok) return redirectHome(url, "failed");
  const user = await userRes.json();

  // 3. Get guild member info → role IDs (ใช้ user token + guilds.members.read scope)
  const memberRes = await fetch(
    `https://discord.com/api/users/@me/guilds/${env.DISCORD_GUILD_ID}/member`,
    { headers: { Authorization: `Bearer ${access_token}` } }
  );

  const ip          = request.headers.get("CF-Connecting-IP") || "";
  const userAgent   = request.headers.get("User-Agent") || "";
  const displayName = user.global_name || user.username || "";
  const isMember    = memberRes.ok ? 1 : 0;

  // Log every login attempt
  await env.DB.prepare(`
    INSERT INTO login_logs (discord_id, username, display_name, is_member, ip, user_agent)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(user.id, user.username || "", displayName, isMember, ip, userAgent).run();

  if (!isMember) return redirectHome(url, "denied");

  // 4. Map role IDs → "admin" | "user"
  const member = await memberRes.clone().json().catch(() => ({ roles: [] }));
  const adminRoleIds = (env.ADMIN_ROLE_IDS || "")
    .split(",").map((s) => s.trim()).filter(Boolean);
  const role = (member.roles || []).some((rid) => adminRoleIds.includes(rid))
    ? "admin"
    : "user";

  // 5. Upsert session ลง D1
  const sid      = crypto.randomUUID();
  const nowSec   = Math.floor(Date.now() / 1000);
  const expiresAt = nowSec + 60 * 60 * 24 * 7;

  await env.DB.prepare(`
    INSERT OR REPLACE INTO sessions
      (sid, discord_id, username, display_name, is_member, role, expires_at, created_at)
    VALUES (?, ?, ?, ?, 1, ?, ?, ?)
  `).bind(sid, user.id, user.username || "", displayName, role, expiresAt, nowSec).run();

  // 6. Set cookie และ redirect กลับ Pages site
  const dest = redirect.startsWith("/") ? new URL(redirect, env.SITE_URL).toString() : env.SITE_URL;
  const headers = new Headers({ Location: dest });
  headers.append("Set-Cookie", httpOnlyCookie("sid", sid, 60 * 60 * 24 * 7));
  headers.append("Set-Cookie", httpOnlyCookie("oauth_state", "", 0));

  return new Response(null, { status: 302, headers });
}

// ── /auth/me ────────────────────────────────────────────────────────────────
async function handleMe(request, env) {
  const sid = getCookie(request, "sid");
  if (!sid) return json({ loggedIn: false });

  const nowSec = Math.floor(Date.now() / 1000);
  const row = await env.DB.prepare(`
    SELECT discord_id, username, display_name, role, is_member
    FROM sessions
    WHERE sid = ? AND is_member = 1 AND expires_at > ?
  `).bind(sid, nowSec).first();

  if (!row) return json({ loggedIn: false });

  return json({
    loggedIn:    true,
    isAdmin:     row.role === "admin",
    isMember:    true,
    displayName: row.display_name,
  });
}

// ── /auth/logout ────────────────────────────────────────────────────────────
async function handleLogout(request, env) {
  const sid = getCookie(request, "sid");
  if (sid) {
    await env.DB.prepare("DELETE FROM sessions WHERE sid = ?").bind(sid).run();
  }
  return new Response(null, {
    status: 302,
    headers: {
      Location:     new URL("/auth/login", env.SITE_URL).toString(),
      "Set-Cookie": httpOnlyCookie("sid", "", 0),
    },
  });
}

// ── /debug/member ───────────────────────────────────────────────────────────
async function debugMember(url, env) {
  const userId = url.searchParams.get("id");
  if (!userId) return json({ ok: false, error: "missing id" });

  const res  = await fetch(
    `https://discord.com/api/guilds/${env.DISCORD_GUILD_ID}/members/${userId}`,
    { headers: { Authorization: `Bot ${env.DISCORD_BOT_TOKEN}` } }
  );
  const data = await res.json();
  return json({ ok: res.ok, status: res.status, data });
}

// ── Utilities ───────────────────────────────────────────────────────────────
function redirectHome(url, reason) {
  return Response.redirect(new URL(`/auth/login?auth=${reason}`, url.origin).toString(), 302);
}

function json(data) {
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
}

function getCookie(request, name) {
  const raw = request.headers.get("Cookie") || "";
  for (const part of raw.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return decodeURIComponent(v.join("="));
  }
  return "";
}

// HttpOnly สำหรับ session cookies (ไม่ให้ JS แตะ)
function httpOnlyCookie(name, value, maxAge) {
  return `${name}=${encodeURIComponent(value)}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${maxAge}`;
}
