"use client";

// Root page: auth check then redirect to /teams.
// The original single-page app shell has been preserved below as a comment
// in case you want to roll back to it. The new router-based layout lives in
// app/teams/page.jsx, app/admin/page.jsx, etc.

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // AuthGate in /teams/page.jsx handles the login check.
    // We just redirect immediately — no flash of content.
    router.replace("/teams");
  }, [router]);

  // Render nothing while redirecting.
  return <div className="gate-screen">กำลังโหลด...</div>;
}

/*
 * ---- ORIGINAL SINGLE-PAGE SHELL (kept for reference) ----
 *
 * "use client";
 * import { useEffect, useMemo, useState } from "react";
 * import { AuthGate } from "../components/AuthGate";
 * import { Header } from "../components/Header";
 * import { TeamListFeature } from "../components/features/TeamListFeature";
 * import { AddTeamFeature } from "../components/features/AddTeamFeature";
 * import { EditTeamFeature } from "../components/features/EditTeamFeature";
 * import { HeroImageManagerFeature } from "../components/features/HeroImageManagerFeature";
 * import { SystemOverviewFeature } from "../components/features/SystemOverviewFeature";
 * import { loadTeams } from "../lib/teams";
 * ... (full original code)
 */