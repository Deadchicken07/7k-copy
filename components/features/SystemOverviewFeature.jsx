export function SystemOverviewFeature({ session, teams, loadState }) {
  return (
    <section className="feature-block">
      <div className="feature-head">
        <div>
          <p>Feature</p>
          <h2>ภาพรวมระบบ</h2>
        </div>
      </div>
      <div className="stats-grid">
        <div><span>Login</span><strong>{session?.loggedIn ? "พร้อมใช้งาน" : "ไม่พบ session"}</strong></div>
        <div><span>Role</span><strong>{session?.isAdmin ? "admin" : "user"}</strong></div>
        <div><span>Teams</span><strong>{teams.length}</strong></div>
        <div><span>Data</span><strong>{loadState}</strong></div>
      </div>
    </section>
  );
}