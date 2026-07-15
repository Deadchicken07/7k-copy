"use client";

// /teams/detail?id=<teamId>
// Static route (no dynamic segment) — avoids Next.js 16 generateStaticParams bug.
// Uses search params to read the team ID so it works with output: "export".

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { AuthGate } from "../../../components/AuthGate";

// Placeholder TeamDetail component
function TeamDetail({ team }) {
  if (!team) {
    return <div className="empty-state">ไม่พบทีม</div>;
  }
  return (
    <section className="feature-block">
      <div className="feature-head">
        <div>
          <p>Team Detail</p>
          <h2>{team.name || team.id}</h2>
        </div>
      </div>
      <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
        {JSON.stringify(team, null, 2)}
      </pre>
    </section>
  );
}

function TeamDetailInner() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [session, setSession] = useState(null);
  const [team, setTeam] = useState(null);
  const [loadState, setLoadState] = useState("loading");

  useEffect(() => {
    if (!id) {
      setLoadState("ready");
      return;
    }
    let alive = true;
    fetch("/data/teams.json", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data) => {
        if (!alive) return;
        const found = (data.teams || []).find((t) => String(t.id) === String(id));
        setTeam(found || null);
        setLoadState("ready");
      })
      .catch(() => {
        if (!alive) return;
        setLoadState("error");
      });
    return () => {
      alive = false;
    };
  }, [id]);

  return (
    <AuthGate onSession={setSession}>
      {loadState === "loading" && <div className="gate-screen">กำลังโหลดข้อมูลทีม...</div>}
      {loadState === "error" && <div className="gate-screen">โหลดข้อมูลทีมไม่สำเร็จ</div>}
      {loadState === "ready" && <TeamDetail team={team} />}
    </AuthGate>
  );
}

export default function TeamDetailPage() {
  return (
    <Suspense fallback={<div className="gate-screen">กำลังโหลด...</div>}>
      <TeamDetailInner />
    </Suspense>
  );
}
