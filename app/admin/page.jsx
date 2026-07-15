"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SystemOverviewFeature } from "../../components/features/SystemOverviewFeature";
import { loadTeams } from "../../lib/teams";

// Minimal sidebar — replace with a real AdminSidebar component when ready.
function AdminSidebar({ session, activePage, onNavigate }) {
  const links = [
    { id: "overview", label: "ภาพรวมระบบ" },
    { id: "teams-new", label: "เพิ่มทีม", href: "/admin/teams/new" },
    { id: "images", label: "จัดการรูปภาพ", href: "/admin/images" },
  ];
  return (
    <aside className="side-nav" aria-label="Admin menu">
      <div className="side-brand">
        <span className="brand-mark">7K</span>
        <div>
          <strong>Guild Hub</strong>
          <small>Admin</small>
        </div>
      </div>
      <nav>
        {links.map((link) => (
          <button
            key={link.id}
            type="button"
            className={activePage === link.id ? "active" : ""}
            onClick={() => link.href ? (window.location.href = link.href) : onNavigate(link.id)}
          >
            {link.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [authState, setAuthState] = useState("checking"); // "checking" | "ready" | "denied" | "error"
  const [teams, setTeams] = useState([]);
  const [loadState, setLoadState] = useState("loading");
  const [activePage, setActivePage] = useState("overview");

  // 1. Check auth/admin
  useEffect(() => {
    let alive = true;
    fetch("/auth/me", { cache: "no-store", credentials: "include" })
      .then((res) => (res.ok ? res.json() : { loggedIn: false }))
      .then((data) => {
        if (!alive) return;
        if (!data.loggedIn) {
          window.location.assign("/auth/login?redirect=/admin");
          return;
        }
        if (!data.isAdmin) {
          setAuthState("denied");
          // Redirect non-admins after brief pause
          setTimeout(() => router.replace("/teams"), 1500);
          return;
        }
        setSession(data);
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

  // 2. Load teams once authed
  useEffect(() => {
    if (authState !== "ready") return;
    let alive = true;
    loadTeams()
      .then((data) => {
        if (!alive) return;
        // loadTeams() returns the array directly (not {teams: []})
        setTeams(Array.isArray(data) ? data : (data.teams || []));
        setLoadState("ready");
      })
      .catch(() => {
        if (!alive) return;
        setLoadState("error");
      });
    return () => {
      alive = false;
    };
  }, [authState]);

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
        <a className="primary-link" href="/auth/login?redirect=/admin">Login ด้วย Discord</a>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <main className="workspace">
        <AdminSidebar session={session} activePage={activePage} onNavigate={setActivePage} />
        <section className="content-panel">
          {activePage === "overview" && (
            <SystemOverviewFeature session={session} teams={teams} loadState={loadState} />
          )}
        </section>
      </main>
    </div>
  );
}
