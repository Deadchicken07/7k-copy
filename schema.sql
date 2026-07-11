-- D1 schema
-- สร้างครั้งแรก: wrangler d1 execute guild-sessions --file=schema.sql --remote

CREATE TABLE IF NOT EXISTS sessions (
  sid          TEXT    PRIMARY KEY,
  discord_id   TEXT    NOT NULL,
  username     TEXT    NOT NULL,
  display_name TEXT    NOT NULL,
  is_member    INTEGER NOT NULL DEFAULT 1,
  role         TEXT    NOT NULL DEFAULT 'user',   -- 'admin' | 'user'
  expires_at   INTEGER NOT NULL,
  created_at   INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS login_logs (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  discord_id   TEXT    NOT NULL,
  username     TEXT    NOT NULL,
  display_name TEXT    NOT NULL,
  is_member    INTEGER NOT NULL DEFAULT 0,
  ip           TEXT,
  user_agent   TEXT,
  created_at   INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions (expires_at);

-- ── Migration: ถ้า sessions table มีอยู่แล้วแต่ยังไม่มีคอลัมน์ role ──────────
-- รันคำสั่งนี้แยกถ้า table เดิมมีอยู่แล้ว:
-- ALTER TABLE sessions ADD COLUMN role TEXT NOT NULL DEFAULT 'user';
-- ALTER TABLE sessions ADD COLUMN created_at INTEGER NOT NULL DEFAULT (unixepoch());
