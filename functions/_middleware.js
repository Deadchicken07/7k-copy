// Auth is enforced by the Worker (guild-auth-worker) before requests reach here.
// This middleware just passes everything through.
export async function onRequest({ next }) {
  return next();
}
