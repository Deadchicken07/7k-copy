// GET /auth/logout
// Deletes the session from D1 and clears the sid cookie.

const SESSION_COOKIE = "sid";

function parseCookies(request) {
  const map = {};
  for (const part of (request.headers.get("cookie") || "").split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k) map[decodeURIComponent(k.trim())] = decodeURIComponent(v.join("=").trim());
  }
  return map;
}

export async function onRequestGet({ request, env }) {
  const sid = parseCookies(request)[SESSION_COOKIE];
  if (sid) {
    await env.DB.prepare("DELETE FROM sessions WHERE sid = ?").bind(sid).run();
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location:     "/?logged_out=1",
      "Set-Cookie": `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
    },
  });
}
