import React, { useState } from "react";
import { EXAM_DATE, PLANNER_TASKS, WEEKLY_TARGETS, GS_TAGS } from "../lib/constants";

const TODAY_STR = "2026-06-20";
const TODAY     = new Date(TODAY_STR);
const EXAM      = new Date(EXAM_DATE);
const DAYS_LEFT = Math.ceil((EXAM - TODAY) / 864e5);

const PAPER_COLORS = {
  gs1: { color: "#7C3AED", bg: "#F5F3FF" },
  gs2: { color: "#0369A1", bg: "#F0F9FF" },
  gs3: { color: "#047857", bg: "#ECFDF5" },
  gs4: { color: "#B45309", bg: "#FFFBEB" },
  ess: { color: "#9D174D", bg: "#FFF1F2" },
  ant: { color: "#1E3A5F", bg: "#EFF6FF" },
};

const PRIORITY_COLORS = { high: "var(--red)", medium: "var(--amber)", low: "var(--green)" };
const STATUS_ORDER    = ["pending", "in-progress", "done"];

function daysFromToday(dateStr) {
  const d    = new Date(dateStr);
  const diff = Math.ceil((d - TODAY) / 864e5);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff === -1) return "Yesterday";
  if (diff > 0)  return `In ${diff} days`;
  return `${-diff} days ago`;
}

function TaskCard({ task, onStatusChange }) {
  const pc = PAPER_COLORS[task.paper] || {};
  const gs = GS_TAGS.find(g => g.id === task.paper);
  return (
    <div className={`planner-task-card planner-task-${task.status}`}>
      <div className="planner-task-header">
        <span className="gs-pill" style={{ background: pc.bg, color: pc.color }}>
          {gs?.label || task.paper.toUpperCase()}
        </span>
        <span
          className="planner-priority-dot"
          style={{ background: PRIORITY_COLORS[task.priority] }}
          title={`${task.priority} priority`}
        />
      </div>
      <div className="planner-task-topic">{task.topic}</div>
      <div className="planner-task-desc">{task.task}</div>
      <div className="planner-task-footer">
        <span className="planner-task-date">{daysFromToday(task.date)}</span>
        <div className="planner-task-actions">
          {STATUS_ORDER.filter(s => s !== task.status).map(s => (
            <button
              key={s}
              className="planner-status-btn"
              onClick={() => onStatusChange(task.id, s)}
            >
              {s === "done" ? "✓ Done" : s === "in-progress" ? "▶ Start" : "↩ Reset"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MainsPlanner({ onNavigate }) {
  const [tasks, setTasks] = useState(PLANNER_TASKS);
  const [viewDate, setViewDate] = useState(TODAY_STR);

  const changeStatus = (id, status) =>
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));

  const todayTasks = tasks.filter(t => t.date === TODAY_STR);
  const donePct    = todayTasks.length
    ? Math.round((todayTasks.filter(t => t.status === "done").length / todayTasks.length) * 100)
    : 0;

  const pending    = tasks.filter(t => t.status === "pending" && t.date === TODAY_STR);
  const inProgress = tasks.filter(t => t.status === "in-progress");
  const done       = tasks.filter(t => t.status === "done");

  // Next 7 days for the mini calendar
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(TODAY);
    d.setDate(d.getDate() + i);
    const ds = d.toISOString().split("T")[0];
    return {
      dateStr: ds,
      label:   d.toLocaleDateString("en-IN", { weekday: "short" }),
      day:     d.getDate(),
      taskCount: tasks.filter(t => t.date === ds).length,
      doneCount: tasks.filter(t => t.date === ds && t.status === "done").length,
    };
  });

  // Months to exam broken down
  const monthsLeft = Math.floor(DAYS_LEFT / 30);
  const weeksLeft  = Math.floor(DAYS_LEFT / 7);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Mains Planner</p>
          <h1 className="page-title">Exam Countdown & Daily Tasks</h1>
        </div>
        <button className="primary-btn" onClick={() => onNavigate && onNavigate("generator")}>
          + New Note
        </button>
      </div>

      {/* ── Countdown Hero ── */}
      <div className="planner-countdown-card">
        <div className="planner-countdown-main">
          <div className="planner-days-num">{DAYS_LEFT}</div>
          <div className="planner-days-label">days to UPSC Mains 2026</div>
          <div className="planner-exam-date">Exam: {new Date(EXAM_DATE).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</div>
        </div>
        <div className="planner-countdown-stats">
          <div className="planner-cstat">
            <span className="planner-cstat-val">{weeksLeft}</span>
            <span className="planner-cstat-label">weeks left</span>
          </div>
          <div className="planner-cstat">
            <span className="planner-cstat-val">{monthsLeft}</span>
            <span className="planner-cstat-label">months left</span>
          </div>
          <div className="planner-cstat">
            <span className="planner-cstat-val">{donePct}%</span>
            <span className="planner-cstat-label">today done</span>
          </div>
          <div className="planner-cstat">
            <span className="planner-cstat-val">7</span>
            <span className="planner-cstat-label">day streak 🔥</span>
          </div>
        </div>
      </div>

      {/* ── Weekly mini-calendar ── */}
      <div className="planner-week-strip">
        {week.map(d => (
          <div
            key={d.dateStr}
            className={`planner-week-cell ${d.dateStr === TODAY_STR ? "planner-week-today" : ""} ${d.dateStr === viewDate ? "planner-week-selected" : ""}`}
            onClick={() => setViewDate(d.dateStr)}
          >
            <span className="planner-week-dow">{d.label}</span>
            <span className="planner-week-day">{d.day}</span>
            {d.taskCount > 0 && (
              <div className="planner-week-dots">
                {Array.from({ length: Math.min(d.taskCount, 3) }, (_, i) => (
                  <span
                    key={i}
                    className="planner-week-dot"
                    style={{ background: i < d.doneCount ? "var(--green)" : "var(--amber)" }}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Daily progress bar ── */}
      <div className="planner-day-progress">
        <div className="planner-day-label">
          {viewDate === TODAY_STR ? "Today" : new Date(viewDate).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" })}
          — {todayTasks.filter(t => t.status === "done").length}/{todayTasks.length} tasks done
        </div>
        <div className="planner-dp-bar">
          <div className="planner-dp-fill" style={{ width: `${donePct}%` }} />
        </div>
      </div>

      {/* ── Kanban board ── */}
      <div className="planner-kanban">
        <div className="planner-col">
          <div className="planner-col-header">
            <span className="planner-col-title">To Do</span>
            <span className="planner-col-count">{pending.length}</span>
          </div>
          {pending.length === 0
            ? <div className="planner-col-empty">All clear for today!</div>
            : pending.map(t => <TaskCard key={t.id} task={t} onStatusChange={changeStatus} />)
          }
        </div>
        <div className="planner-col">
          <div className="planner-col-header">
            <span className="planner-col-title">In Progress</span>
            <span className="planner-col-count" style={{ background: "var(--amber-bg)", color: "var(--amber)" }}>{inProgress.length}</span>
          </div>
          {inProgress.length === 0
            ? <div className="planner-col-empty">Nothing started yet</div>
            : inProgress.map(t => <TaskCard key={t.id} task={t} onStatusChange={changeStatus} />)
          }
        </div>
        <div className="planner-col">
          <div className="planner-col-header">
            <span className="planner-col-title">Done</span>
            <span className="planner-col-count" style={{ background: "var(--green-bg)", color: "var(--green)" }}>{done.length}</span>
          </div>
          {done.length === 0
            ? <div className="planner-col-empty">Nothing done yet — let's go!</div>
            : done.map(t => <TaskCard key={t.id} task={t} onStatusChange={changeStatus} />)
          }
        </div>
      </div>

      {/* ── Weekly paper targets ── */}
      <div className="section-header" style={{ marginTop: 32 }}>
        <div className="section-title">Weekly Paper Targets</div>
        <span className="section-count">w/e 2026-06-22</span>
      </div>
      <div className="planner-targets-grid">
        {WEEKLY_TARGETS.map(wt => {
          const tag = GS_TAGS.find(g => g.id === wt.paper);
          const pc  = PAPER_COLORS[wt.paper] || {};
          const pct = Math.round((wt.done / wt.targetNotes) * 100);
          return (
            <div key={wt.paper} className="planner-target-card">
              <div className="planner-target-header">
                <span className="gs-pill" style={{ background: pc.bg, color: pc.color }}>
                  {tag?.label || wt.paper.toUpperCase()}
                </span>
                <span className="planner-target-fraction">{wt.done}/{wt.targetNotes}</span>
              </div>
              <div className="planner-target-name">{tag?.desc || wt.paper}</div>
              <div className="planner-target-bar">
                <div
                  className="planner-target-fill"
                  style={{ width: `${pct}%`, background: pct >= 100 ? "var(--green)" : pc.color }}
                />
              </div>
              <div className="planner-target-pct">{pct}% of weekly target</div>
            </div>
          );
        })}
      </div>

      {/* ── Quick nav shortcuts ── */}
      <div className="planner-shortcuts">
        <button className="planner-shortcut-btn" onClick={() => onNavigate && onNavigate("revision")}>
          📅 Revision Tracker
        </button>
        <button className="planner-shortcut-btn" onClick={() => onNavigate && onNavigate("progress")}>
          📊 GS Progress
        </button>
        <button className="planner-shortcut-btn" onClick={() => onNavigate && onNavigate("quiz")}>
          ⚡ Quick Quiz
        </button>
        <button className="planner-shortcut-btn" onClick={() => onNavigate && onNavigate("essay")}>
          ✍️ Essay Builder
        </button>
      </div>
    </div>
  );
}
