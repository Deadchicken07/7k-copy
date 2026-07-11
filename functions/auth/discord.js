// GET /auth/discord
// Redirects user to Discord OAuth2 authorization page.
//
// Required env vars (Cloudflare Pages → Settings → Environment variables):
//   DISCORD_CLIENT_ID
//   DISCORD_REDIRECT_URI   e.g. https://yourdomain.com/auth/callback

export async function onRequestGet({ request, env }) {
  const url    = new URL(request.url);
  const redirect = url.searchParams.get("redirect") || "/";

  const authUrl = new URL("https://discord.com/oauth2/authorize");
  authUrl.searchParams.set("client_id",     env.DISCORD_CLIENT_ID);
  authUrl.searchParams.set("redirect_uri",  env.DISCORD_REDIRECT_URI);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope",         "identify");
  authUrl.searchParams.set("state",         redirect);

  return Response.redirect(authUrl.toString(), 302);
}
