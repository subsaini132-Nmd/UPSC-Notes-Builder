import React, { useState, useEffect, useCallback } from "react";

// ── Storage ───────────────────────────────────────────────────────────────────

const STREAK_KEY = "upsc_streak_data";
const TODAY_STR  = new Date().toISOString().slice(0, 10);

function yesterday() {
  const d = new Date(TODAY_STR);
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function defaultData() {
  return {
    streak:      1,
    longest:     1,
    lastDate:    TODAY_STR,
    totalXP:     120,
    totalDays:   1,
    log:         [{ date: TODAY_STR, xp: 120, actions: ["Session started"] }],
    achievements: [],
  };
}

function loadData() {
  try {
    const saved = JSON.parse(localStorage.getItem(STREAK_KEY));
    if (!saved) return defaultData();
    // Check if streak should continue or reset
    if (saved.lastDate === TODAY_STR) return saved;
    if (saved.lastDate === yesterday()) {
      return { ...saved, streak: saved.streak + 1, longest: Math.max(saved.longest, saved.streak + 1), lastDate: TODAY_STR, totalDays: saved.totalDays + 1 };
    }
    // Streak broken
    return { ...saved, streak: 1, lastDate: TODAY_STR, totalDays: saved.totalDays + 1 };
  } catch { return defaultData(); }
}

function saveData(d) {
  try { localStorage.setItem(STREAK_KEY, JSON.stringify(d)); } catch {}
}

// ── XP Config ─────────────────────────────────────────────────────────────────

const XP_EVENTS = [
  { id: "daily_login",    label: "Daily Login",          xp: 10,  icon: "🔥" },
  { id: "generate_note",  label: "Generate a Note",       xp: 50,  icon: "✦"  },
  { id: "flashcard_deck", label: "Complete Flashcard Deck",xp: 30,  icon: "🃏" },
  { id: "eval_answer",    label: "Evaluate an Answer",    xp: 20,  icon: "📋" },
  { id: "pyq_mapped",     label: "Map a PYQ",             xp: 15,  icon: "🎯" },
  { id: "quiz_session",   label: "Quiz Session",          xp: 25,  icon: "⚡" },
  { id: "read_ca",        label: "Read Current Affairs",  xp: 10,  icon: "📰" },
  { id: "essay_draft",    label: "Essay Draft",           xp: 40,  icon: "✍️" },
  { id: "revision_done",  label: "Revision Session",      xp: 15,  icon: "🔄" },
  { id: "note_shared",    label: "Export / Print Note",   xp: 5,   icon: "📤" },
];

// ── Level Config ──────────────────────────────────────────────────────────────

const LEVELS = [
  { level: 1, title: "Beginner",   minXP: 0,    color: "#6B7280", badge: "🌱" },
  { level: 2, title: "Aspirant",   minXP: 200,  color: "#0369A1", badge: "📖" },
  { level: 3, title: "Analyst",    minXP: 500,  color: "#7C3AED", badge: "🔍" },
  { level: 4, title: "Strategist", minXP: 1000, color: "#047857", badge: "🏛" },
  { level: 5, title: "Topper",     minXP: 2000, color: "#B45309", badge: "🏆" },
];

function getLevel(xp) {
  return [...LEVELS].reverse().find(l => xp >= l.minXP) || LEVELS[0];
}

function getNextLevel(xp) {
  return LEVELS.find(l => l.minXP > xp);
}

// ── Achievement Config ────────────────────────────────────────────────────────

const ACHIEVEMENTS = [
  { id: "first_note",   title: "First Note",      desc: "Generate your first note",     icon: "✦",  xpReq: 50  },
  { id: "streak_3",     title: "Hat Trick",        desc: "3-day study streak",           icon: "🔥",  strReq: 3  },
  { id: "streak_7",     title: "Week Warrior",     desc: "7-day study streak",           icon: "⚔️", strReq: 7  },
  { id: "streak_30",    title: "Iron Will",        desc: "30-day study streak",          icon: "🛡",  strReq: 30 },
  { id: "xp_500",       title: "Rising Star",      desc: "Earn 500 XP",                  icon: "⭐",  xpReq: 500 },
  { id: "xp_1000",      title: "Knowledge Seeker", desc: "Earn 1,000 XP",               icon: "🌟",  xpReq: 1000},
  { id: "xp_2000",      title: "UPSC Topper",       desc: "Earn 2,000 XP",              icon: "🏆",  xpReq: 2000},
  { id: "day_10",       title: "10-Day Scholar",    desc: "Study for 10 days total",    icon: "📅",  dayReq: 10 },
  { id: "day_50",       title: "Committed",         desc: "Study for 50 days total",    icon: "🎖",  dayReq: 50 },
  { id: "day_100",      title: "Centurion",         desc: "Study for 100 days total",   icon: "💯",  dayReq: 100},
];

function computeAchievements(data) {
  return ACHIEVEMENTS.map(a => ({
    ...a,
    unlocked: (a.xpReq  && data.totalXP   >= a.xpReq)
           || (a.strReq && data.streak     >= a.strReq)
           || (a.dayReq && data.totalDays  >= a.dayReq),
  }));
}

// ── Activity heatmap (last 7 weeks × 7 days) ─────────────────────────────────

function buildHeatmap(log) {
  const map = {};
  log.forEach(e => { map[e.date] = (map[e.date] || 0) + e.xp; });

  const cells = [];
  for (let i = 48; i >= 0; i--) {
    const d = new Date(TODAY_STR);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    cells.push({ date: key, xp: map[key] || 0 });
  }
  return cells;
}

function heatColor(xp) {
  if (xp === 0)  return "var(--border)";
  if (xp < 30)   return "#BAE6FD";
  if (xp < 60)   return "#38BDF8";
  if (xp < 100)  return "#0EA5E9";
  return "#0369A1";
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function StudyStreaks({ onNavigate }) {
  const [data,    setData]    = useState(loadData);
  const [tab,     setTab]     = useState("overview");
  const [claimed, setClaimed] = useState(new Set());

  useEffect(() => { saveData(data); }, [data]);

  const level      = getLevel(data.totalXP);
  const nextLevel  = getNextLevel(data.totalXP);
  const xpInLevel  = data.totalXP - level.minXP;
  const xpNeeded   = nextLevel ? nextLevel.minXP - level.minXP : 1;
  const levelPct   = nextLevel ? Math.min(100, Math.round((xpInLevel / xpNeeded) * 100)) : 100;

  const achievements = computeAchievements(data);
  const heatmap      = buildHeatmap(data.log);

  const earnXP = useCallback((event) => {
    if (claimed.has(event.id)) return;
    setClaimed(prev => new Set([...prev, event.id]));
    setData(prev => {
      const today = prev.log.find(l => l.date === TODAY_STR);
      const newLog = today
        ? prev.log.map(l => l.date === TODAY_STR
            ? { ...l, xp: l.xp + event.xp, actions: [...l.actions, event.label] }
            : l)
        : [...prev.log, { date: TODAY_STR, xp: event.xp, actions: [event.label] }];
      return { ...prev, totalXP: prev.totalXP + event.xp, log: newLog.slice(-90) };
    });
  }, [claimed]);

  const todayXP = data.log.find(l => l.date === TODAY_STR)?.xp || 0;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Day 3 · Study Streaks</p>
          <h1 className="page-title">Your Study Journey</h1>
        </div>
        <div className="ss-header-right">
          <div className="ss-xp-pill">
            <span className="ss-xp-icon">⚡</span>
            <span className="ss-xp-val">{data.totalXP.toLocaleString()} XP</span>
          </div>
        </div>
      </div>

      {/* ── Level banner ── */}
      <div className="ss-level-banner" style={{ borderColor: level.color }}>
        <div className="ss-level-badge" style={{ background: level.color }}>{level.badge}</div>
        <div className="ss-level-body">
          <div className="ss-level-title" style={{ color: level.color }}>
            Level {level.level} — {level.title}
          </div>
          <div className="ss-level-bar-wrap">
            <div className="ss-level-bar">
              <div className="ss-level-fill" style={{ width: `${levelPct}%`, background: level.color }} />
            </div>
            <span className="ss-level-bar-label">
              {nextLevel ? `${xpInLevel} / ${xpNeeded} XP to ${nextLevel.title}` : "Max Level!"}
            </span>
          </div>
        </div>
        <div className="ss-level-stats">
          <div className="ss-ls-item">
            <div className="ss-ls-num" style={{ color: "#F59E0B" }}>{data.streak}</div>
            <div className="ss-ls-label">🔥 Streak</div>
          </div>
          <div className="ss-ls-item">
            <div className="ss-ls-num">{data.longest}</div>
            <div className="ss-ls-label">Best</div>
          </div>
          <div className="ss-ls-item">
            <div className="ss-ls-num">{data.totalDays}</div>
            <div className="ss-ls-label">Total Days</div>
          </div>
          <div className="ss-ls-item">
            <div className="ss-ls-num" style={{ color: "#0369A1" }}>{todayXP}</div>
            <div className="ss-ls-label">Today XP</div>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="ss-tabs">
        {[["overview","Overview"],["earn","Earn XP"],["achievements","Achievements"],["heatmap","Activity"]].map(([id,lbl]) => (
          <button key={id} className={`ss-tab ${tab === id ? "active" : ""}`} onClick={() => setTab(id)}>
            {lbl}
            {id === "achievements" && (
              <span className="ss-tab-badge">{achievements.filter(a => a.unlocked).length}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── Overview tab ── */}
      {tab === "overview" && (
        <div className="ss-overview">
          <div className="ss-streak-display">
            <div className="ss-streak-fire">🔥</div>
            <div className="ss-streak-num">{data.streak}</div>
            <div className="ss-streak-label">Day Streak</div>
            <div className="ss-streak-sub">Keep going! Come back tomorrow to extend your streak.</div>
          </div>

          <div className="ss-overview-grid">
            {[
              { label: "Total XP",    val: data.totalXP.toLocaleString(), icon: "⚡", color: "#0369A1" },
              { label: "Best Streak", val: data.longest,                  icon: "🏆", color: "#B45309" },
              { label: "Days Active", val: data.totalDays,                icon: "📅", color: "#047857" },
              { label: "Level",       val: level.title,                   icon: level.badge, color: level.color },
              { label: "Achievements",val: `${achievements.filter(a=>a.unlocked).length}/${achievements.length}`, icon: "🎖", color: "#7C3AED" },
              { label: "Today XP",    val: todayXP,                       icon: "✦",  color: "#9D174D" },
            ].map(s => (
              <div key={s.label} className="ss-overview-card" style={{ borderTopColor: s.color }}>
                <div className="ss-ov-icon">{s.icon}</div>
                <div className="ss-ov-val" style={{ color: s.color }}>{s.val}</div>
                <div className="ss-ov-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Recent activity */}
          <div className="ss-recent">
            <div className="ss-recent-title">Recent Activity</div>
            {data.log.slice().reverse().slice(0, 5).map((entry, i) => (
              <div key={i} className="ss-log-row">
                <div className="ss-log-date">{entry.date}</div>
                <div className="ss-log-body">
                  <div className="ss-log-actions">{entry.actions.join(" · ")}</div>
                </div>
                <div className="ss-log-xp">+{entry.xp} XP</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Earn XP tab ── */}
      {tab === "earn" && (
        <div className="ss-earn">
          <div className="ss-earn-intro">
            Tap any activity below to log it and earn XP. Each activity can be claimed once per session.
          </div>
          <div className="ss-earn-grid">
            {XP_EVENTS.map(ev => {
              const done = claimed.has(ev.id);
              return (
                <button
                  key={ev.id}
                  className={`ss-earn-card ${done ? "claimed" : ""}`}
                  onClick={() => earnXP(ev)}
                  disabled={done}
                >
                  <div className="ss-earn-icon">{ev.icon}</div>
                  <div className="ss-earn-label">{ev.label}</div>
                  <div className="ss-earn-xp" style={{ color: done ? "#9CA3AF" : "#0369A1" }}>
                    {done ? "✓ Claimed" : `+${ev.xp} XP`}
                  </div>
                </button>
              );
            })}
          </div>
          <div className="ss-earn-note">
            💡 Navigate to features (flashcards, quiz, notes) to actually do the activity, then come back to claim your XP.
          </div>
        </div>
      )}

      {/* ── Achievements tab ── */}
      {tab === "achievements" && (
        <div className="ss-achievements">
          <div className="ss-ach-grid">
            {achievements.map(a => (
              <div key={a.id} className={`ss-ach-card ${a.unlocked ? "unlocked" : "locked"}`}>
                <div className="ss-ach-icon">{a.unlocked ? a.icon : "🔒"}</div>
                <div className="ss-ach-title">{a.title}</div>
                <div className="ss-ach-desc">{a.desc}</div>
                {a.unlocked && <div className="ss-ach-badge">Unlocked!</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Heatmap tab ── */}
      {tab === "heatmap" && (
        <div className="ss-heatmap-panel">
          <div className="ss-heatmap-title">Activity — Last 7 Weeks</div>
          <div className="ss-heatmap">
            {heatmap.map((cell, i) => (
              <div
                key={i}
                className="ss-hm-cell"
                style={{ background: heatColor(cell.xp) }}
                title={`${cell.date}: ${cell.xp} XP`}
              />
            ))}
          </div>
          <div className="ss-hm-legend">
            <span>Less</span>
            {[0, 20, 50, 80, 120].map(xp => (
              <div key={xp} className="ss-hm-cell" style={{ background: heatColor(xp), display: "inline-block" }} />
            ))}
            <span>More</span>
          </div>

          <div className="ss-activity-list">
            <div className="ss-recent-title">Daily Log</div>
            {data.log.slice().reverse().map((entry, i) => (
              <div key={i} className="ss-log-row">
                <div className="ss-log-date">{entry.date}</div>
                <div className="ss-log-body">
                  <div className="ss-log-actions">{entry.actions.join(" · ")}</div>
                </div>
                <div className="ss-log-xp">+{entry.xp} XP</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
