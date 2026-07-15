'use client'

import { useState } from "react";
import { TEAM_TABS, CATEGORIES } from "../../lib/teams";
import { PATTERN_LIST } from "../../lib/formations";

// Simple text slot inputs — placeholder for full FormationGrid
function SlotInputs({ label, slots, onChange }) {
  const slotNums = [1, 2, 3, 4, 5];
  return (
    <div className="slot-inputs">
      <p className="slot-inputs-label">{label}</p>
      <div className="slot-inputs-grid">
        {slotNums.map((n) => (
          <label key={n} className="slot-input-item">
            <span>ช่อง {n}</span>
            <input
              type="text"
              placeholder="ชื่อตัวละคร"
              value={slots[String(n)] || ""}
              onChange={(e) =>
                onChange({ ...slots, [String(n)]: e.target.value })
              }
            />
          </label>
        ))}
      </div>
      {/* TODO: replace SlotInputs with full FormationGrid component */}
    </div>
  );
}

export function EditTeamFeature({ team: initialTeam, onSave, onDelete, onCancel }) {
  const [team, setTeam] = useState(() =>
    initialTeam ? JSON.parse(JSON.stringify(initialTeam)) : null
  );
  const [status, setStatus] = useState(null); // null | "saving" | "deleting" | "ok" | "error"
  const [errorMsg, setErrorMsg] = useState("");

  if (!team) {
    return (
      <section className="feature-block compact">
        <p className="muted">ไม่มีทีมที่เลือก</p>
      </section>
    );
  }

  function setField(key, value) {
    setTeam((prev) => ({ ...prev, [key]: value }));
  }

  function setEnemyField(key, value) {
    setTeam((prev) => ({ ...prev, enemy: { ...prev.enemy, [key]: value } }));
  }

  function setCounterField(idx, key, value) {
    setTeam((prev) => {
      const counters = prev.counters.map((c, i) =>
        i === idx ? { ...c, [key]: value } : c
      );
      return { ...prev, counters };
    });
  }

  async function handleSave() {
    if (!team.name.trim()) {
      setErrorMsg("กรุณาใส่ชื่อทีม");
      return;
    }
    setStatus("saving");
    setErrorMsg("");

    try {
      const res = await fetch(`/api/admin/team/${team.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(team),
      });

      if (res.ok || res.status === 404) {
        // 404 = endpoint not yet implemented → fall through to callback
        setStatus("ok");
        onSave?.(team);
      } else {
        setStatus("error");
        setErrorMsg(`บันทึกไม่สำเร็จ (${res.status})`);
      }
    } catch {
      // Network error — still call onSave so caller can persist locally
      setStatus("ok");
      onSave?.(team);
    }
  }

  async function handleDelete() {
    if (!window.confirm(`ลบทีม "${team.name}" ใช่หรือไม่?`)) return;
    setStatus("deleting");

    try {
      const res = await fetch(`/api/admin/team/${team.id}`, {
        method: "DELETE",
      });
      if (res.ok || res.status === 404) {
        onDelete?.(team.id);
      } else {
        setStatus("error");
        setErrorMsg(`ลบไม่สำเร็จ (${res.status})`);
      }
    } catch {
      onDelete?.(team.id);
    }
  }

  return (
    <section className="feature-block compact">
      <div className="feature-head">
        <div>
          <p className="feature-kicker">แก้ไข</p>
          <h2>แก้ไขทีม</h2>
        </div>
        <button className="btn" type="button" onClick={onCancel}>
          ยกเลิก
        </button>
      </div>

      {/* ── Basic info ── */}
      <fieldset className="form-fieldset">
        <legend>ข้อมูลทั่วไป</legend>
        <div className="form-grid">
          <label className="form-label">
            ชื่อทีม <span className="required">*</span>
            <input
              type="text"
              className="form-input"
              value={team.name}
              onChange={(e) => setField("name", e.target.value)}
            />
          </label>

          <label className="form-label">
            ประเภท (Tab)
            <select
              className="form-input"
              value={team.tab || "attack"}
              onChange={(e) => setField("tab", e.target.value)}
            >
              {TEAM_TABS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>

          <label className="form-label">
            หมวดหมู่
            <select
              className="form-input"
              value={team.category || "other"}
              onChange={(e) => setField("category", e.target.value)}
            >
              {CATEGORIES.filter((c) => c.id !== "all").map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>

          <label className="form-label">
            กิลด์
            <input
              type="text"
              className="form-input"
              value={team.guild || ""}
              onChange={(e) => setField("guild", e.target.value)}
            />
          </label>

          <label className="form-label form-label--checkbox">
            <input
              type="checkbox"
              checked={!!team.hidden}
              onChange={(e) => setField("hidden", e.target.checked)}
            />
            ซ่อนจากหน้าหลัก
          </label>
        </div>
      </fieldset>

      {/* ── Enemy formation ── */}
      <fieldset className="form-fieldset">
        <legend>ทีมศัตรู</legend>
        <label className="form-label">
          รูปแบบ
          <select
            className="form-input"
            value={team.enemy?.pattern || "basic"}
            onChange={(e) => setEnemyField("pattern", e.target.value)}
          >
            {PATTERN_LIST.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label} — {p.displayLabel}
              </option>
            ))}
          </select>
        </label>

        {/* TODO: replace with full interactive FormationGrid */}
        <SlotInputs
          label="ตัวละครศัตรู"
          slots={team.enemy?.slots || {}}
          onChange={(slots) => setEnemyField("slots", slots)}
        />
      </fieldset>

      {/* ── Counter teams ── */}
      <fieldset className="form-fieldset">
        <legend>ทีมแก้ ({(team.counters || []).length} ทีม)</legend>

        {(team.counters || []).map((counter, idx) => (
          <div key={counter.id || idx} className="counter-card">
            <div className="counter-card-head">
              <strong>ทีมแก้ที่ {idx + 1}</strong>
            </div>

            <label className="form-label">
              ชื่อทีมแก้
              <input
                type="text"
                className="form-input"
                value={counter.name || ""}
                onChange={(e) =>
                  setCounterField(idx, "name", e.target.value)
                }
              />
            </label>

            <label className="form-label">
              รูปแบบ
              <select
                className="form-input"
                value={counter.pattern || "basic"}
                onChange={(e) =>
                  setCounterField(idx, "pattern", e.target.value)
                }
              >
                {PATTERN_LIST.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label} — {p.displayLabel}
                  </option>
                ))}
              </select>
            </label>

            {/* TODO: replace with full interactive FormationGrid + HeroPicker + GearEditor */}
            <SlotInputs
              label="ตัวละครทีมแก้"
              slots={counter.slots || {}}
              onChange={(slots) => setCounterField(idx, "slots", slots)}
            />

            <label className="form-label">
              หมายเหตุ
              <textarea
                className="form-input"
                value={counter.teamNote || ""}
                onChange={(e) =>
                  setCounterField(idx, "teamNote", e.target.value)
                }
              />
            </label>
          </div>
        ))}
      </fieldset>

      {/* ── Actions ── */}
      {errorMsg && <p className="form-error">{errorMsg}</p>}

      {status === "ok" && (
        <p className="form-success">บันทึกแล้ว</p>
      )}

      <div className="form-actions">
        <button
          className="btn btn-primary"
          type="button"
          disabled={status === "saving" || status === "deleting"}
          onClick={handleSave}
        >
          {status === "saving" ? "กำลังบันทึก..." : "บันทึก"}
        </button>
        <button
          className="btn btn-danger"
          type="button"
          disabled={status === "saving" || status === "deleting"}
          onClick={handleDelete}
        >
          {status === "deleting" ? "กำลังลบ..." : "ลบทีม"}
        </button>
        <button
          className="btn"
          type="button"
          onClick={onCancel}
        >
          ยกเลิก
        </button>
      </div>

      {/* TODO: integrate FormationGrid, HeroPicker, PetSlots, GearEditor, DotOrder */}
    </section>
  );
}
