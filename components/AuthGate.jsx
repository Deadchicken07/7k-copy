'use client';

import { useEffect, useState } from 'react';

export function AuthGate({ children, onSession }) {
  const [state, setState] = useState({ status: 'checking', session: null, error: null });

  useEffect(() => {
    let alive = true;
    fetch('/auth/me', { cache: 'no-store', credentials: 'include' })
      .then((res) => (res.ok ? res.json() : { loggedIn: false }))
      .then((data) => {
        if (!alive) return;
        if (!data.loggedIn) {
          setState({ status: 'gate', session: null, error: null });
          return;
        }
        setState({ status: 'ready', session: data, error: null });
        onSession?.(data);
      })
      .catch(() => {
        if (!alive) return;
        setState({ status: 'error', session: null, error: 'เชื่อมต่อเซิร์ฟเวอร์ไม่สำเร็จ' });
      });
    return () => {
      alive = false;
    };
  }, [onSession]);

  if (state.status === 'checking') {
    return (
      <div id="gateView">
        <div className="gate-box">
          <p className="gate-desc">กำลังตรวจสอบ Discord login...</p>
        </div>
      </div>
    );
  }

  if (state.status === 'gate') {
    return (
      <div id="gateView">
        <div className="gate-box">
          <div className="gate-title">PokkyRebirth Guild Hub</div>
          <p className="gate-desc">
            เข้าสู่ระบบด้วย Discord เพื่อดูทีม Guild War
          </p>
          <a
            className="gate-login-btn btn-discord"
            href={`/auth/login?redirect=${encodeURIComponent('/')}`}
          >
            Login ด้วย Discord
          </a>
        </div>
      </div>
    );
  }

  if (state.status === 'error') {
    return (
      <div id="gateView">
        <div className="gate-box">
          <div className="gate-title">เกิดข้อผิดพลาด</div>
          {state.error && (
            <div className="gate-auth-error">{state.error}</div>
          )}
          <a
            className="gate-login-btn btn-discord"
            href={`/auth/login?redirect=${encodeURIComponent('/')}`}
          >
            ลองใหม่
          </a>
        </div>
      </div>
    );
  }

  return children;
}
