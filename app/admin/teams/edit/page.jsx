"use client";

// /admin/teams/edit?id=<teamId>
// Static route (no dynamic segment) — avoids Next.js 16 generateStaticParams bug.
// Uses search params to read the team ID so it works with output: "export".

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { EditTeamFeature } from "../../../../components/features/EditTeamFeature";

function AdminTeamEditInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const [authState, setAuthState] = useState("checking");
  const [team, setTeam] = useState(null);
  const [teamLoadState, setTeamLoadState] = useState("loading");

  // 1. Admin guard
  useEffect(() => {
    let alive = true;
    fetch("/auth/me", { cache: "no-store", credentials: "include" })
      .then((res) => (res.ok ? res.json() : { loggedIn: false }))
      .then((data) => {
        if (!alive) return;
        if (!data.loggedIn) {
          window.location.assign(`/auth/login?redirect=/admin/teams/edit${id ? `?id=${id}` : ""}`);
          return;
        }
        if (!data.isAdmin) {
          setAuthState("denied");
          setTimeout(() => router.replace("/teams"), 1500);
          return;
        }
        setAuthState("ready");
      })
      .catch(() => {
        if (!alive) return;
        setAuthState("error");
      });
    return () => {
      alive = false;
    };
  }, [router, id]);

  // 2. Load team data once authed
  useEffect(() => {
    if (authState !== "ready") return;
    if (!id) {
      setTeamLoadState("no-id");
      return;
    }
    let alive = true;
    fetch("/data/teams.json", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data) => {
        if (!alive) return;
        const found = (data.teams || []).find((t) => String(t.id) === String(id));
        setTeam(found || null);
        setTeamLoadState("ready");
      })
      .catch(() => {
        if (!alive) return;
        setTeamLoadState("error");
      });
    return () => {
      alive = false;
    };
  }, [authState, id]);

  if (authState === "checking") {
    return <div className="gate-screen">กำลังตรวจสอบสิทธิ์ admin...</div>;
  }
  if (authState === "denied") {
    return <div className="gate-screen">คุณไม่มีสิทธิ์ admin — กำลังเปลี่ยนหน้า...</div>;
  }
  if (authState === "error") {
    return (
      <div className="gate-screen">
        <h1>ตรวจสอบสิทธิ์ไม่สำเร็จ</h1>
        <a className="primary-link" href={`/auth/login?redirect=/admin/teams/edit${id ? `?id=${id}` : ""}`}>Login ด้วย Discord</a>
      </div>
    );
  }

  if (teamLoadState === "no-id") {
    return <div className="gate-screen">ไม่พบ ID ทีม — กลับไปที่ <a href="/admin">Admin</a></div>;
  }
  if (teamLoadState === "loading") {
    return <div className="gate-screen">กำลังโหลดข้อมูลทีม...</div>;
  }
  if (teamLoadState === "error") {
    return <div className="gate-screen">โหลดข้อมูลทีมไม่สำเร็จ</div>;
  }
  if (!team) {
    return <div className="gate-screen">ไม่พบทีม id: {id}</div>;
  }

  return (
    <div className="app-shell">
      <main className="workspace">
        <section className="content-panel">
          <EditTeamFeature team={team} />
        </section>
      </main>
    </div>
  );
}

export default function AdminTeamEditPage() {
  return (
    <Suspense fallback={<div className="gate-screen">กำลังโหลด...</div>}>
      <AdminTeamEditInner />
    </Suspense>
  );
}
