'use client';

import { useState } from 'react';
import { AuthGate } from '../../components/AuthGate';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { TeamListFeature } from '../../components/features/TeamListFeature';

export default function TeamsPage() {
  const [user, setUser]       = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleSession = (session) => {
    setUser(session);
    setIsAdmin(!!session?.isAdmin);
  };

  const handleLogout = () => {
    window.location.assign('/auth/logout');
  };

  return (
    <AuthGate onSession={handleSession}>
      <div className="app-shell">
        <Header
          user={user}
          isAdmin={isAdmin}
          onAdminToggle={() => {}}
          onLogout={handleLogout}
        />
        <main style={{ flex: 1 }}>
          {/* TeamListFeature fetches /data/teams.json internally when no prop given */}
          <TeamListFeature user={user} isAdmin={isAdmin} />
        </main>
        <Footer />
      </div>
    </AuthGate>
  );
}
