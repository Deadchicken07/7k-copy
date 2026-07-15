// GET /auth/login
// Starts Discord OAuth for local Cloudflare Pages dev and production Pages.

function requiredEnv(env, requestUrl) {
  const missing = [];
  if (!env.DISCORD_CLIENT_ID) missing.push("DISCORD_CLIENT_ID");
  if (!env.DISCORD_REDIRECT_URI) missing.push("DISCORD_REDIRECT_URI");
  if (missing.length) {
    return new Response(
      `Missing env: ${missing.join(", ")}\n\nFor local dev, create .dev.vars and add DISCORD_REDIRECT_URI=${requestUrl.origin}/auth/callback`,
      { status: 500, headers: { "Content-Type": "text/plain; charset=utf-8" } }
    );
  }
  return null;
}

function httpOnlyCookie(name, value, maxAge) {
  return `${name}=${encodeURIComponent(value)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAge}`;
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const envError = requiredEnv(env, url);
  if (envError) return envError;

  const redirect = url.searchParams.get("redirect") || "/";
  const state = crypto.randomUUID();

  const authUrl = new URL("https://discord.com/oauth2/authorize");
  authUrl.searchParams.set("client_id", env.DISCORD_CLIENT_ID);
  authUrl.searchParams.set("redirect_uri", env.DISCORD_REDIRECT_URI);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "identify guilds.members.read");
  authUrl.searchParams.set("state", JSON.stringify({ state, redirect }));

  return new Response(null, {
    status: 302,
    headers: {
      Location: authUrl.toString(),
      "Set-Cookie": httpOnlyCookie("oauth_state", state, 300),
    },
  });
}