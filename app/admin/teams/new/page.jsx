"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AddTeamFeature } from "../../../../components/features/AddTeamFeature";

export default function AdminTeamsNewPage() {
  const router = useRouter();
  const [authState, setAuthState] = useState("checking"); // "checking" | "ready" | "denied" | "error"

  useEffect(() => {
    let alive = true;
    fetch("/auth/me", { cache: "no-store", credentials: "include" })
      .then((res) => (res.ok ? res.json() : { loggedIn: false }))
      .then((data) => {
        if (!alive) return;
        if (!data.loggedIn) {
          window.location.assign("/auth/login?redirect=/admin/teams/new");
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
  }, [router]);

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
        <a className="primary-link" href="/auth/login?redirect=/admin/teams/new">Login ด้วย Discord</a>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <main className="workspace">
        <section className="content-panel">
          <AddTeamFeature />
        </section>
      </main>
    </div>
  );
}
