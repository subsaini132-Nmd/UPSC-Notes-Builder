import React, { useState, useEffect, useRef } from "react";

const STORAGE_KEY = "upsc_study_sessions";
const TODAY = new Date().toISOString().slice(0, 10);

const PRESETS = [
  { id: "focus25", label: "Focus",       mins: 25, type: "focus", icon: "🎯", color: "#1E3A5F" },
  { id: "focus50", label: "Deep Work",   mins: 50, type: "focus", icon: "🔥", color: "#1E3A5F" },
  { id: "break5",  label: "Short Break", mins:  5, type: "break", icon: "☕", color: "#047857" },
  { id: "break10", label: "Long Break",  mins: 10, type: "break", icon: "🌿", color: "#047857" },
];

function loadSessions() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
  catch { return []; }
}
function saveSessions(arr) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

export default function StudyTimer() {
  const [preset,    setPreset]    = useState(PRESETS[0]);
  const [timeLeft,  setTimeLeft]  = useState(PRESETS[0].mins * 60);
  const [running,   setRunning]   = useState(false);
  const [sessions,  setSessions]  = useState(loadSessions);
  const [completed, setCompleted] = useState(false);
  const intervalRef = useRef(null);

  const isFocus    = preset.type === "focus";
  const timerColor = preset.color;
  const totalSecs  = preset.mins * 60;
  const circumference = 2 * Math.PI * 96;
  const strokeOffset  = circumference * (timeLeft / totalSecs);

  // Countdown effect
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            setCompleted(true);
            if (isFocus) {
              setSessions(prev2 => {
                const newSession = { id: Date.now(), date: TODAY, mins: preset.mins, label: preset.label, type: "focus" };
                const next = [newSession, ...prev2].slice(0, 200);
                saveSessions(next);
                return next;
              });
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, isFocus, preset.mins, preset.label]);

  const selectPreset = (p) => {
    clearInterval(intervalRef.current);
    setPreset(p);
    setTimeLeft(p.mins * 60);
    setRunning(false);
    setCompleted(false);
  };

  const reset = () => {
    clearInterval(intervalRef.current);
    setTimeLeft(preset.mins * 60);
    setRunning(false);
    setCompleted(false);
  };

  const todaySessions = sessions.filter(s => s.date === TODAY && s.type === "focus");
  const todayMins     = todaySessions.reduce((s, sess) => s + sess.mins, 0);
  const totalAll      = sessions.filter(s => s.type === "focus").length;

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const ss = String(timeLeft % 60).padStart(2, "0");

  // 7-day weekly bars
  const weekData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const ds = d.toISOString().slice(0, 10);
    const dayMins = sessions.filter(s => s.date === ds && s.type === "focus").reduce((a, s) => a + s.mins, 0);
    return { ds, dayMins, isToday: ds === TODAY, dayLetter: ["S","M","T","W","T","F","S"][d.getDay()] };
  });
  const maxMins = Math.max(...weekData.map(d => d.dayMins), 60);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Study Timer</p>
          <h1 className="page-title">Focus Session</h1>
        </div>
        <div className="timer-header-stats">
          <div className="timer-hstat"><span className="timer-hstat-val">{todaySessions.length}</span><span className="timer-hstat-label">today</span></div>
          <div className="timer-hstat"><span className="timer-hstat-val">{todayMins}m</span><span className="timer-hstat-label">focus time</span></div>
          <div className="timer-hstat"><span className="timer-hstat-val">{totalAll}</span><span className="timer-hstat-label">total sessions</span></div>
        </div>
      </div>

      <div className="timer-layout">
        {/* ── Left: Timer ── */}
        <div className="timer-main-panel">
          {/* Preset selector */}
          <div className="timer-presets">
            {PRESETS.map(p => (
              <button
                key={p.id}
                className={`timer-preset-btn ${preset.id === p.id ? "timer-preset-active" : ""}`}
                style={preset.id === p.id ? { borderColor: p.color, color: p.color, background: p.color + "12" } : {}}
                onClick={() => selectPreset(p)}
              >
                <span className="timer-preset-icon">{p.icon}</span>
                <span className="timer-preset-label">{p.label}</span>
                <span className="timer-preset-mins">{p.mins}m</span>
              </button>
            ))}
          </div>

          {/* Circular ring */}
          <div className="timer-ring-wrap">
            <svg className="timer-ring-svg" viewBox="0 0 220 220">
              <circle cx="110" cy="110" r="96" fill="none" stroke="var(--border)" strokeWidth="10" />
              <circle
                cx="110" cy="110" r="96"
                fill="none"
                stroke={timerColor}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeOffset}
                style={{ transform: "rotate(-90deg)", transformOrigin: "center", transition: running ? "stroke-dashoffset 1s linear" : "none" }}
              />
            </svg>
            <div className="timer-ring-inner">
              {completed ? (
                <div className="timer-done-wrap">
                  <div className="timer-done-icon">{isFocus ? "🎉" : "✅"}</div>
                  <div className="timer-done-text">{isFocus ? "Session complete!" : "Break done!"}</div>
                </div>
              ) : (
                <>
                  <div className="timer-digits" style={{ color: timerColor }}>{mm}:{ss}</div>
                  <div className="timer-mode-label">{preset.label}</div>
                </>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="timer-controls">
            <button className="timer-reset-btn" onClick={reset}>↺</button>
            <button
              className="timer-main-btn"
              style={{ background: timerColor }}
              onClick={() => { setRunning(r => !r); setCompleted(false); }}
            >
              {running ? "⏸ Pause" : completed ? "↺ Again" : "▶ Start"}
            </button>
            {!running && !completed && (
              <button
                className="timer-skip-btn"
                onClick={() => selectPreset(isFocus ? PRESETS[2] : PRESETS[0])}
              >
                {isFocus ? "Skip → Break" : "Skip → Focus"}
              </button>
            )}
          </div>

          {/* Tip */}
          <div className="timer-tip-card">
            <span className="timer-tip-icon">💡</span>
            <span className="timer-tip-text">
              {isFocus
                ? "Close social media, set your phone to DND, and work on one UPSC topic."
                : "Step away. Stretch, drink water, and rest your eyes for a genuine break."}
            </span>
          </div>
        </div>

        {/* ── Right: Log + Weekly ── */}
        <div className="timer-log-panel">
          <div className="timer-weekly-section">
            <div className="timer-log-title">This Week</div>
            <div className="timer-weekly-bars">
              {weekData.map(d => (
                <div key={d.ds} className="timer-week-col">
                  <div className="timer-week-bar-track">
                    <div
                      className="timer-week-bar-fill"
                      style={{
                        height: `${maxMins > 0 ? (d.dayMins / maxMins) * 100 : 0}%`,
                        background: d.isToday ? "var(--accent)" : timerColor,
                        opacity: d.isToday ? 1 : 0.65,
                      }}
                    />
                  </div>
                  {d.dayMins > 0 && <div className="timer-week-mins">{d.dayMins}m</div>}
                  <div className={`timer-week-day ${d.isToday ? "timer-week-today" : ""}`}>{d.dayLetter}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="timer-log-divider" />

          <div className="timer-log-title">Today's Sessions</div>
          {todaySessions.length === 0 ? (
            <div className="timer-log-empty">
              <div className="timer-log-empty-icon">⏳</div>
              <div className="timer-log-empty-text">No focus sessions yet</div>
              <div className="timer-log-empty-sub">Start a Focus timer to log your study time</div>
            </div>
          ) : (
            <div className="timer-log-list">
              {todaySessions.map((s, i) => (
                <div key={s.id} className="timer-log-item">
                  <div className="timer-log-item-dot" style={{ background: timerColor }} />
                  <div className="timer-log-item-body">
                    <div className="timer-log-item-label">{s.label}</div>
                    <div className="timer-log-item-mins">{s.mins} min focus</div>
                  </div>
                  <div className="timer-log-item-seq">#{todaySessions.length - i}</div>
                </div>
              ))}
            </div>
          )}

          {todaySessions.length > 0 && (
            <div className="timer-log-total">
              Total today: <strong>{todayMins} min</strong> across {todaySessions.length} session{todaySessions.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
