'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { TabBar } from '../TabBar';
import { FilterBar } from '../FilterBar';
import { TeamCard } from '../TeamCard';

export function TeamListFeature({ teams: teamsProp, user, isAdmin }) {
  const router = useRouter();

  // If teams not passed as prop, fetch from /data/teams.json
  const [fetchedTeams, setFetchedTeams] = useState(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (teamsProp !== undefined) return; // using prop
    fetch('/data/teams.json', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => setFetchedTeams(data.teams || []))
      .catch(() => {
        setFetchedTeams([]);
        setLoadError(true);
      });
  }, [teamsProp]);

  const allTeams = teamsProp !== undefined ? teamsProp : (fetchedTeams ?? []);
  const isLoading = teamsProp === undefined && fetchedTeams === null;

  // Filter state
  const [query, setQuery]       = useState('');
  const [category, setCategory] = useState('');
  const [tab, setTab]           = useState('attack');
  const [guild, setGuild]       = useState('');

  const filtered = useMemo(() => {
    return allTeams.filter((t) => {
      if (t.hidden) return false;
      if (t.tab && t.tab !== tab) return false;
      if (category && t.category !== category) return false;
      if (guild && t.guild !== guild) return false;
      if (query) {
        const q = query.toLowerCase();
        const haystack = [t.name, t.guild, t.category].filter(Boolean).join(' ').toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [allTeams, tab, category, guild, query]);

  const handleCardClick = (team) => {
    if (router) {
      router.push(`/teams/detail?id=${team.id}`);
    }
  };

  return (
    <div>
      <TabBar tab={tab} onTabChange={setTab} />

      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          type="search"
          placeholder="ค้นหาทีม..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <FilterBar
        category={category}
        guild={guild}
        onCategoryChange={setCategory}
        onGuildChange={setGuild}
      />

      {isLoading && (
        <div className="empty-state">กำลังโหลดทีม...</div>
      )}

      {loadError && !isLoading && (
        <div className="empty-state">โหลด data/teams.json ไม่สำเร็จ</div>
      )}

      {!isLoading && !loadError && filtered.length === 0 && (
        <div className="empty-state">ไม่พบทีมที่ตรงกับเงื่อนไข</div>
      )}

      {!isLoading && filtered.length > 0 && (
        <div className="team-grid">
          {filtered.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              onClick={() => handleCardClick(team)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
