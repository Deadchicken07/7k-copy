'use client'

import { useState } from "react";
import { TEAM_TABS, CATEGORIES, saveDraft, loadDraft, uid } from "../../lib/teams";
import { PATTERN_LIST } from "../../lib/formations";

// Default empty counter shape
function emptyCounter() {
  return {
    id: uid(),
    name: "",
    pattern: "basic",
    slots: {},
    dotOrder: [],
    pets: {},
    gear: {},
    teamNote: "",
    likes: 0,
    dislikes: 0,
  };
}

// Default empty team shape
function emptyTeam() {
  return {
    id: uid(),
    name: "",
    tab: "attack",
    category: "physical",
    guild: "",
    hidden: false,
    enemy: { pattern: "basic", slots: {}, dotOrder: [] },
    counters: [emptyCounter()],
  };
}

// Simple text slot inputs representing the formation grid (placeholder for full grid UI)
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
      {/* TODO: replace SlotInputs with full FormationGrid component once hero picker is built */}
    </div>
  );
}

export function AddTeamFeature({ onSaved }) {
  const [team, setTeam] = useState(() => emptyTeam());
  const [status, setStatus] = useState(null); // null | "saving" | "ok" | "error"
  const [errorMsg, setErrorMsg] = useState("");

  // Update a top-level field
  function setField(key, value) {
    setTeam((prev) => ({ ...prev, [key]: value }));
  }

  // Update enemy formation field
  function setEnemyField(key, value) {
    setTeam((prev) => ({ ...prev, enemy: { ...prev.enemy, [key]: value } }));
  }

  // Update a counter field by index
  function setCounterField(idx, key, value) {
    setTeam((prev) => {
      const counters = prev.counters.map((c, i) =>
        i === idx ? { ...c, [key]: value } : c
      );
      return { ...prev, counters };
    });
  }

  function addCounter() {
    setTeam((prev) => ({
      ...prev,
      counters: [...prev.counters, emptyCounter()],
    }));
  }

  function removeCounter(idx) {
    setTeam((prev) => ({
      ...prev,
      counters: prev.counters.filter((_, i) => i !== idx),
    }));
  }

  async function handleSave() {
    if (!team.name.trim()) {
      setErrorMsg("กรุณาใส่ชื่อทีม");
      return;
    }
    setStatus("saving");
    setErrorMsg("");

    try {
      // Try POST to Cloudflare Function first
      const res = await fetch("/api/admin/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(team),
      });

      if (res.ok) {
        setStatus("ok");
        setTeam(emptyTeam());
        onSaved?.("add", team);
        return;
      }

      // Fallback: save as localStorage draft
      const draft = loadDraft() || { teams: [] };
      draft.teams.push(team);
      saveDraft(draft.teams);
      setStatus("ok");
      setTeam(emptyTeam());
      onSaved?.("draft", team);
    } catch {
      // Network error → save draft locally
      const draft = loadDraft() || { teams: [] };
      draft.teams.push(team);
      saveDraft(draft.teams);
      setStatus("ok");
      setTeam(emptyTeam());
      onSaved?.("draft", team);
    }
  }

  function handleReset() {
    setTeam(emptyTeam());
    setStatus(null);
    setErrorMsg("");
  }

  return (
    <section className="feature-block">
      <div className="feature-head">
        <div>
          <p className="feature-kicker">Admin</p>
          <h2>เพิ่มทีมใหม่</h2>
        </div>
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
              placeholder="เช่น ทีมสปีดบ้าน"
              value={team.name}
              onChange={(e) => setField("name", e.target.value)}
            />
          </label>

          <label className="form-label">
            ประเภท (Tab)
            <select
              className="form-input"
              value={team.tab}
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
              value={team.category}
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
              placeholder="เช่น PokkyRebirth"
              value={team.guild}
              onChange={(e) => setField("guild", e.target.value)}
            />
          </label>

          <label className="form-label form-label--checkbox">
            <input
              type="checkbox"
              checked={team.hidden}
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
          รูปแบบ (Pattern)
          <select
            className="form-input"
            value={team.enemy.pattern}
            onChange={(e) => setEnemyField("pattern", e.target.value)}
          >
            {PATTERN_LIST.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label} — {p.displayLabel}
              </option>
            ))}
          </select>
        </label>

        {/* TODO: replace with full interactive FormationGrid component */}
        <SlotInputs
          label="ตัวละครศัตรู (สูงสุด 3 ตัว)"
          slots={team.enemy.slots}
          onChange={(slots) => setEnemyField("slots", slots)}
        />
      </fieldset>

      {/* ── Counter teams ── */}
      <fieldset className="form-fieldset">
        <legend>ทีมแก้ ({team.counters.length} ทีม)</legend>

        {team.counters.map((counter, idx) => (
          <div key={counter.id} className="counter-card">
            <div className="counter-card-head">
              <strong>ทีมแก้ที่ {idx + 1}</strong>
              {team.counters.length > 1 && (
                <button
                  className="btn btn-icon btn-icon-danger"
                  type="button"
                  onClick={() => removeCounter(idx)}
                  title="ลบทีมแก้นี้"
                >
                  ✕
                </button>
              )}
            </div>

            <label className="form-label">
              ชื่อทีมแก้
              <input
                type="text"
                className="form-input"
                placeholder="เช่น ทีมสปีดแก้"
                value={counter.name}
                onChange={(e) => setCounterField(idx, "name", e.target.value)}
              />
            </label>

            <label className="form-label">
              รูปแบบ
              <select
                className="form-input"
                value={counter.pattern}
                onChange={(e) => setCounterField(idx, "pattern", e.target.value)}
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
              label="ตัวละครทีมแก้ (สูงสุด 3 ตัว)"
              slots={counter.slots}
              onChange={(slots) => setCounterField(idx, "slots", slots)}
            />

            <label className="form-label">
              หมายเหตุทีมแก้
              <textarea
                className="form-input"
                placeholder="เช่น ต้องใส่แหวนบล็อค..."
                value={counter.teamNote}
                onChange={(e) =>
                  setCounterField(idx, "teamNote", e.target.value)
                }
              />
            </label>
          </div>
        ))}

        <button
          className="btn"
          type="button"
          onClick={addCounter}
        >
          + เพิ่มทีมแก้
        </button>
      </fieldset>

      {/* ── Actions ── */}
      {errorMsg && <p className="form-error">{errorMsg}</p>}

      {status === "ok" && (
        <p className="form-success">
          บันทึกแล้ว{" "}
          <span className="muted">(ตรวจสอบใน Draft หรือรอ Publish)</span>
        </p>
      )}

      <div className="form-actions">
        <button
          className="btn btn-primary"
          type="button"
          disabled={status === "saving"}
          onClick={handleSave}
        >
          {status === "saving" ? "กำลังบันทึก..." : "บันทึกทีม"}
        </button>
        <button
          className="btn"
          type="button"
          onClick={handleReset}
        >
          รีเซ็ต
        </button>
      </div>

      {/* TODO: integrate FormationGrid (interactive hero drag-drop)
               HeroPicker palette (search + tier filter)
               PetSlots panel
               GearEditor (rings, sets, stats)
               DotOrder picker on formation slots
      */}
    </section>
  );
}
