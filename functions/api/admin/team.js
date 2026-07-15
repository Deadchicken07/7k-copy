/**
 * Cloudflare Pages Function: /api/admin/team
 *
 * POST  — add a new team
 *
 * NOTE: This is currently a STUB.
 * The data store for this project is a static teams.json file committed to GitHub.
 * Full implementation requires:
 *   1. Reading the current teams.json from GitHub (via GitHub REST API or a D1 sync)
 *   2. Appending the new team
 *   3. Committing the updated file back to GitHub (or upserting into D1)
 * Until then, the function returns 501 Not Implemented so the client-side
 * code can fall back to localStorage draft.
 *
 * TODO: implement one of:
 *   A) GitHub file approach:
 *      - GET /repos/{owner}/{repo}/contents/public/data/teams.json  (GitHub API)
 *      - Decode base64 content, JSON.parse, push new team, JSON.stringify
 *      - PUT back with updated sha
 *   B) Cloudflare D1 approach:
 *      - INSERT INTO teams (...) VALUES (...)
 *      - Add a separate /api/admin/publish endpoint that dumps D1 → teams.json
 */

export async function onRequestPost(context) {
  // TODO: verify admin session (check Discord OAuth session cookie / KV token)
  // const session = await getAdminSession(context);
  // if (!session) {
  //   return new Response(JSON.stringify({ error: "Unauthorized" }), {
  //     status: 401,
  //     headers: { "Content-Type": "application/json" },
  //   });
  // }

  let body;
  try {
    body = await context.request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Basic validation
  if (!body || typeof body.name !== "string" || !body.name.trim()) {
    return new Response(JSON.stringify({ error: "Missing required field: name" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // TODO: persist the team (GitHub API or D1)
  // For now, acknowledge receipt but indicate it is not yet persisted server-side.
  return new Response(
    JSON.stringify({
      ok: false,
      error: "Not implemented — server-side persistence is pending. Use localStorage draft for now.",
    }),
    {
      status: 501,
      headers: { "Content-Type": "application/json" },
    }
  );
}
