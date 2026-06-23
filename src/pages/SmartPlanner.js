import React, { useState, useEffect, useMemo } from "react";
import { EXAM_DATE, GS_TAGS, PLANNER_TASKS, WEEKLY_TARGETS } from "../lib/constants";

// ── Constants ─────────────────────────────────────────────────────────────────

const TASKS_KEY   = "upsc_smart_tasks";
const TODAY_STR   = new Date().toISOString().slice(0, 10);
const EXAM        = new Date(EXAM_DATE);
const TODAY_DATE  = new Date(TODAY_STR);
const DAYS_LEFT   = Math.max(0, Math.ceil((EXAM - TODAY_DATE) / 864e5));

const PC = {
  gs1: { color: "#7C3AED", bg: "#F5F3FF", label: "GS I"   },
  gs2: { color: "#0369A1", bg: "#F0F9FF", label: "GS II"  },
  gs3: { color: "#047857", bg: "#ECFDF5", label: "GS III" },
  gs4: { color: "#B45309", bg: "#FFFBEB", label: "GS IV"  },
  ess: { color: "#9D174D", bg: "#FFF1F2", label: "Essay"  },
  ant: { color: "#1E3A5F", bg: "#EFF6FF", label: "Anthro" },
};

const PRI_COLOR = { high: "#DC2626", medium: "#F59E0B", low: "#059669" };

// 7-day window starting from today
function buildWeekDays() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(TODAY_DATE);
    d.setDate(d.getDate() + i);
    return d.toISOString().slice(0, 10);
  });
}

// Generate an auto plan for a given date (GS rotation + default tasks)
const GS_ROTATION = ["gs1", "gs2", "gs3", "gs4", "gs1", "gs2", "ess"];
const TASK_TEMPLATES = {
  gs1: [
    { task: "Read / generate 1 GS I note",          priority: "high"   },
    { task: "Revise 5 flashcards — History/Society", priority: "medium" },
    { task: "Map 2 PYQs to your notes",              priority: "medium" },
  ],
  gs2: [
    { task: "Read / generate 1 GS II note",          priority: "high"   },
    { task: "Read Constitution article summary",     priority: "high"   },
    { task: "Revise 5 flashcards — Polity/Governance",priority: "medium"},
  ],
  gs3: [
    { task: "Read / generate 1 GS III note",         priority: "high"   },
    { task: "Note key data from Economic Survey",    priority: "medium" },
    { task: "Revise 5 flashcards — Economy/Env",     priority: "medium" },
  ],
  gs4: [
    { task: "Practice 2 Ethics case studies",        priority: "high"   },
    { task: "Read / generate 1 GS IV note",          priority: "high"   },
    { task: "Revise values & thinkers flashcards",   priority: "medium" },
  ],
  ess: [
    { task: "Write a 1200-word essay outline",       priority: "high"   },
    { task: "Read 2 Current Affairs items",          priority: "medium" },
    { task: "Link 1 CA story to a note topic",       priority: "low"    },
  ],
  ant: [
    { task: "Read / generate 1 Anthropology note",   priority: "high"   },
    { task: "Revise 5 Anthro flashcards",            priority: "medium" },
    { task: "Solve 1 PYQ — Anthropology Paper I",    priority: "medium" },
  ],
};

function autoTasksForDate(dateStr) {
  const dayIdx   = Math.floor((new Date(dateStr) - new Date("2026-06-21")) / 864e5);
  const paper    = GS_ROTATION[((dayIdx % 7) + 7) % 7];
  const templates = TASK_TEMPLATES[paper] || TASK_TEMPLATES.gs1;
  return [
    ...templates.map((t, i) => ({
      id:     `auto_${dateStr}_${i}`,
      date:   dateStr,
      paper,
      topic:  "",
      task:   t.task,
      status: "pending",
      priority: t.priority,
      auto:   true,
    })),
    {
      id: `ca_${dateStr}`,
      date: dateStr, paper: "gs2", topic: "Current Affairs",
      task: "Read today's The Hindu / PIB headlines", status: "pending", priority: "medium", auto: true,
    },
  ];
}

// ── Storage ───────────────────────────────────────────────────────────────────

function loadTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem(TASKS_KEY) || "[]");
    return saved.length ? saved : [...PLANNER_TASKS];
  } catch { return [...PLANNER_TASKS]; }
}
function saveTasks(t) {
  try { localStorage.setItem(TASKS_KEY, JSON.stringify(t)); } catch {}
}

// ── Sub-components ────────────────────────────────────────────────────────────

function CountdownRing({ daysLeft }) {
  const total = Math.ceil((EXAM - new Date("2026-01-01")) / 864e5);
  const pct   = Math.max(0, Math.min(1, daysLeft / total));
  const r = 50, sw = 7;
  const circ   = 2 * Math.PI * r;
  const offset = circ * (1 - pct);
  const color  = daysLeft > 90 ? "#059669" : daysLeft > 30 ? "#F59E0B" : "#DC2626";
  return (
    <div className="sp-countdown-ring">
      <svg width={120} height={120} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={60} cy={60} r={r} fill="none" stroke="var(--border)" strokeWidth={sw} />
        <circle cx={60} cy={60} r={r} fill="none" stroke={color} strokeWidth={sw}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease" }} />
      </svg>
      <div className="sp-countdown-inner">
        <div className="sp-countdown-num" style={{ color }}>{daysLeft}</div>
        <div className="sp-countdown-label">days left</div>
      </div>
    </div>
  );
}

function TaskCard({ task, onToggle, onDelete }) {
  const pc  = PC[task.paper] || PC.gs2;
  const done = task.status === "done";
  return (
    <div className={`sp-task-card ${done ? "sp-task-done" : ""}`}>
      <button className={`sp-task-check ${done ? "checked" : ""}`} onClick={() => onToggle(task.id)}>
        {done ? "✓" : ""}
      </button>
      <div className="sp-task-body">
        <div className="sp-task-text">{task.task}</div>
        {task.topic && <div className="sp-task-topic">{task.topic}</div>}
        <div className="sp-task-meta">
          <span className="sp-task-paper" style={{ background: pc.bg, color: pc.color }}>{pc.label}</span>
          <span className="sp-task-pri" style={{ color: PRI_COLOR[task.priority] }}>
            ● {task.priority}
          </span>
        </div>
      </div>
      <button className="sp-task-del" onClick={() => onDelete(task.id)}>✕</button>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function SmartPlanner({ onNavigate }) {
  const [tasks,      setTasks]      = useState(loadTasks);
  const [activeDay,  setActiveDay]  = useState(TODAY_STR);
  const [showAdd,    setShowAdd]    = useState(false);
  const [newTask,    setNewTask]    = useState("");
  const [newPaper,   setNewPaper]   = useState("gs2");
  const [newPri,     setNewPri]     = useState("medium");

  const weekDays = useMemo(buildWeekDays, []);

  useEffect(() => { saveTasks(tasks); }, [tasks]);

  const dayTasks = tasks.filter(t => t.date === activeDay);

  const generatePlan = () => {
    const already = tasks.filter(t => t.date === activeDay);
    if (already.length === 0) {
      setTasks(prev => [...prev, ...autoTasksForDate(activeDay)]);
    }
  };

  const toggleTask = (id) =>
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, status: t.status === "done" ? "pending" : "done" } : t
    ));

  const deleteTask = (id) =>
    setTasks(prev => prev.filter(t => t.id !== id));

  const addTask = () => {
    if (!newTask.trim()) return;
    const t = {
      id: `manual_${Date.now()}`,
      date: activeDay,
      paper: newPaper,
      topic: "",
      task: newTask.trim(),
      status: "pending",
      priority: newPri,
      auto: false,
    };
    setTasks(prev => [...prev, t]);
    setNewTask("");
    setShowAdd(false);
  };

  // Stats
  const todayAll  = tasks.filter(t => t.date === TODAY_STR);
  const todayDone = todayAll.filter(t => t.status === "done").length;
  const weekDone  = tasks.filter(t => weekDays.includes(t.date) && t.status === "done").length;
  const weekTotal = tasks.filter(t => weekDays.includes(t.date)).length;

  const dayDone  = dayTasks.filter(t => t.status === "done").length;
  const dayTotal = dayTasks.length;
  const dayPct   = dayTotal ? Math.round((dayDone / dayTotal) * 100) : 0;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Day 3 · Smart Planner</p>
          <h1 className="page-title">Daily Study Planner</h1>
        </div>
        <button className="primary-btn" onClick={() => onNavigate && onNavigate("revision")}>
          Revision Tracker →
        </button>
      </div>

      {/* ── Top stats row ── */}
      <div className="sp-stats-row">
        <CountdownRing daysLeft={DAYS_LEFT} />

        <div className="sp-stat-cards">
          <div className="sp-stat-card">
            <div className="sp-stat-val">{DAYS_LEFT}</div>
            <div className="sp-stat-label">Days to Exam</div>
            <div className="sp-stat-sub">{EXAM_DATE}</div>
          </div>
          <div className="sp-stat-card">
            <div className="sp-stat-val">{todayDone}/{todayAll.length}</div>
            <div className="sp-stat-label">Today Completed</div>
            <div className="sp-stat-sub">{todayAll.length ? Math.round((todayDone/todayAll.length)*100) : 0}% done</div>
          </div>
          <div className="sp-stat-card">
            <div className="sp-stat-val">{weekDone}/{weekTotal}</div>
            <div className="sp-stat-label">This Week</div>
            <div className="sp-stat-sub">{weekTotal ? Math.round((weekDone/weekTotal)*100) : 0}% on track</div>
          </div>
          <div className="sp-stat-card">
            <div className="sp-stat-val">{Math.round(DAYS_LEFT / 7)}</div>
            <div className="sp-stat-label">Weeks Left</div>
            <div className="sp-stat-sub">avg {DAYS_LEFT > 0 ? Math.round(6 / Math.max(1, Math.round(DAYS_LEFT/7))) : 0} notes/week needed</div>
          </div>
        </div>

        {/* Weekly targets */}
        <div className="sp-weekly-targets">
          <div className="sp-wt-title">Weekly Targets</div>
          {WEEKLY_TARGETS.map(wt => {
            const pc  = PC[wt.paper] || PC.gs2;
            const pct = Math.min(100, Math.round((wt.done / wt.targetNotes) * 100));
            return (
              <div key={wt.paper} className="sp-wt-row">
                <span className="sp-wt-label" style={{ color: pc.color }}>{pc.label}</span>
                <div className="sp-wt-track">
                  <div className="sp-wt-fill" style={{ width: `${pct}%`, background: pc.color }} />
                </div>
                <span className="sp-wt-val">{wt.done}/{wt.targetNotes}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Week strip ── */}
      <div className="sp-week-strip">
        {weekDays.map(d => {
          const dt   = new Date(d);
          const isT  = d === TODAY_STR;
          const isSel= d === activeDay;
          const dTasks= tasks.filter(t => t.date === d);
          const dDone = dTasks.filter(t => t.status === "done").length;
          const dayPct = dTasks.length ? Math.round((dDone / dTasks.length) * 100) : 0;
          return (
            <button key={d} className={`sp-day-btn ${isSel ? "selected" : ""} ${isT ? "today" : ""}`}
              onClick={() => setActiveDay(d)}>
              <div className="sp-day-name">
                {dt.toLocaleDateString("en-IN", { weekday: "short" })}
              </div>
              <div className="sp-day-num">{dt.getDate()}</div>
              <div className="sp-day-dot-row">
                {dTasks.length > 0 && (
                  <div className="sp-day-pct-bar">
                    <div style={{ width: `${dayPct}%`, background: isSel ? "#fff" : "var(--accent)", height: "100%", borderRadius: 3 }} />
                  </div>
                )}
                {dTasks.length === 0 && <div className="sp-day-empty-dot" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Day task list ── */}
      <div className="sp-day-panel">
        <div className="sp-day-header">
          <div>
            <div className="sp-day-title">
              {new Date(activeDay).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
              {activeDay === TODAY_STR && <span className="sp-today-chip">Today</span>}
            </div>
            {dayTotal > 0 && (
              <div className="sp-day-progress-line">
                <div className="sp-day-pct-full">
                  <div style={{ width: `${dayPct}%`, background: "var(--accent)", height: "100%", borderRadius: 3 }} />
                </div>
                <span className="sp-day-pct-text">{dayDone}/{dayTotal} tasks · {dayPct}%</span>
              </div>
            )}
          </div>
          <div className="sp-day-actions">
            {dayTotal === 0 && (
              <button className="primary-btn" onClick={generatePlan}>⚡ Generate Plan</button>
            )}
            <button className="viewer-action-btn" onClick={() => setShowAdd(s => !s)}>
              {showAdd ? "✕ Cancel" : "+ Add Task"}
            </button>
          </div>
        </div>

        {/* Add task form */}
        {showAdd && (
          <div className="sp-add-form">
            <input className="sp-add-input" placeholder="Task description…"
              value={newTask} onChange={e => setNewTask(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addTask()} autoFocus />
            <div className="sp-add-row">
              <select className="gen-select sp-add-sel" value={newPaper} onChange={e => setNewPaper(e.target.value)}>
                {Object.entries(PC).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
              <select className="gen-select sp-add-sel" value={newPri} onChange={e => setNewPri(e.target.value)}>
                <option value="high">High Priority</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <button className="primary-btn" onClick={addTask} disabled={!newTask.trim()}>Add</button>
            </div>
          </div>
        )}

        {dayTasks.length === 0 ? (
          <div className="sp-empty">
            <div className="sp-empty-icon">📅</div>
            <div className="sp-empty-title">No tasks for this day</div>
            <div className="sp-empty-sub">Click "Generate Plan" for a smart schedule, or add tasks manually.</div>
            <button className="primary-btn" style={{ marginTop: 14 }} onClick={generatePlan}>⚡ Generate Plan</button>
          </div>
        ) : (
          <div className="sp-task-list">
            {["pending", "in-progress"].map(s =>
              dayTasks.filter(t => t.status === s).map(t =>
                <TaskCard key={t.id} task={t} onToggle={toggleTask} onDelete={deleteTask} />
              )
            )}
            {dayTasks.filter(t => t.status === "done").length > 0 && (
              <>
                <div className="sp-done-divider">Completed</div>
                {dayTasks.filter(t => t.status === "done").map(t =>
                  <TaskCard key={t.id} task={t} onToggle={toggleTask} onDelete={deleteTask} />
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
