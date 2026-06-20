import React, { useState } from "react";
import { REVISION_DATA, GS_TAGS } from "../lib/constants";

const TODAY      = new Date("2026-06-20");
const INTERVALS  = [1, 3, 7, 14, 30];     // Leitner-style spacing in days
const STARS      = 5;

function daysDiff(dateStr) {
  const d = new Date(dateStr);
  return Math.floor((d - TODAY) / (1000 * 60 * 60 * 24));
}

function nextInterval(count) {
  return INTERVALS[Math.min(count, INTERVALS.length - 1)];
}

function addDays(days) {
  const d = new Date(TODAY);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function StatusChip({ nextDue }) {
  const diff = daysDiff(nextDue);
  if (diff < 0)  return <span className="rv-status overdue">{Math.abs(diff)}d overdue</span>;
  if (diff === 0) return <span className="rv-status today">Due today</span>;
  if (diff <= 3)  return <span className="rv-status soon">In {diff}d</span>;
  return <span className="rv-status upcoming">In {diff}d</span>;
}

function RevisionStars({ count }) {
  return (
    <div className="rv-stars" title={`Revised ${count} time${count !== 1 ? "s" : ""}`}>
      {Array.from({ length: STARS }, (_, i) => (
        <span key={i} className={`rv-star ${i < count ? "rv-star-filled" : ""}`}>★</span>
      ))}
    </div>
  );
}

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH     = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function WeekCalendar({ data }) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(TODAY);
    d.setDate(d.getDate() + i - 1); // show yesterday + 6 days ahead
    return d;
  });

  return (
    <div className="rv-week-cal">
      {days.map((d, i) => {
        const iso  = d.toISOString().slice(0, 10);
        const isToday = iso === TODAY.toISOString().slice(0, 10);
        const notes = data.filter(r => r.nextDue === iso);
        const overdue = daysDiff(iso) < 0;
        return (
          <div key={i} className={`rv-cal-day ${isToday ? "rv-cal-today" : ""} ${overdue && notes.length ? "rv-cal-overdue" : ""}`}>
            <div className="rv-cal-dayname">{WEEK_DAYS[d.getDay()]}</div>
            <div className="rv-cal-date">{d.getDate()} {MONTH[d.getMonth()]}</div>
            <div className="rv-cal-notes">
              {notes.length === 0
                ? <span className="rv-cal-empty">—</span>
                : notes.map(r => (
                    <span key={r.noteId} className="rv-cal-chip">{r.topic.split(" ")[0]}</span>
                  ))
              }
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function RevisionPlanner({ onNavigate }) {
  const [data, setData] = useState(REVISION_DATA);
  const [justRevised, setJustRevised] = useState(new Set());

  const sorted   = [...data].sort((a, b) => new Date(a.nextDue) - new Date(b.nextDue));
  const overdue  = sorted.filter(r => daysDiff(r.nextDue) < 0);
  const dueToday = sorted.filter(r => daysDiff(r.nextDue) === 0);
  const upcoming = sorted.filter(r => daysDiff(r.nextDue) > 0);

  const markRevised = (noteId) => {
    setData(prev => prev.map(r => {
      if (r.noteId !== noteId) return r;
      const newCount = r.revisionCount + 1;
      return {
        ...r,
        lastRevised:   TODAY.toISOString().slice(0, 10),
        revisionCount: newCount,
        nextDue:       addDays(nextInterval(newCount)),
      };
    }));
    setJustRevised(prev => new Set([...prev, noteId]));
    setTimeout(() => {
      setJustRevised(prev => { const n = new Set(prev); n.delete(noteId); return n; });
    }, 2000);
  };

  const totalRevisions = data.reduce((s, r) => s + r.revisionCount, 0);
  const avgInterval    = Math.round(data.reduce((s, r) => s + nextInterval(r.revisionCount), 0) / data.length);

  const NoteRow = ({ r }) => {
    const tag     = GS_TAGS.find(g => g.id === r.gs);
    const diff    = daysDiff(r.nextDue);
    const done    = justRevised.has(r.noteId);
    const nxtIntv = nextInterval(r.revisionCount + 1);

    return (
      <div className={`rv-row ${diff < 0 ? "rv-row-overdue" : diff === 0 ? "rv-row-today" : ""} ${done ? "rv-row-done" : ""}`}>
        <div className="rv-row-left">
          {tag && <span className="gs-pill" style={{ background: tag.bg, color: tag.color }}>{tag.label}</span>}
          <div className="rv-row-info">
            <div className="rv-row-topic">{r.topic}</div>
            <div className="rv-row-meta">
              Last revised: {r.lastRevised}
              <span className="rv-dot">·</span>
              Next interval: {nxtIntv}d
              <span className="rv-dot">·</span>
              <span className="rv-row-cnt">Revised {r.revisionCount}×</span>
            </div>
          </div>
        </div>
        <div className="rv-row-right">
          <RevisionStars count={Math.min(r.revisionCount, STARS)} />
          <StatusChip nextDue={r.nextDue} />
          <button
            className={`rv-mark-btn ${done ? "rv-mark-done" : ""}`}
            onClick={() => markRevised(r.noteId)}
            disabled={done}
          >
            {done ? "✓ Marked!" : "Mark Revised"}
          </button>
          <button className="viewer-action-btn" onClick={() => onNavigate && onNavigate("flashcards")}>
            Flashcards
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Revision Tracker</p>
          <h1 className="page-title">Spaced Repetition Planner</h1>
        </div>
        <button className="primary-btn" onClick={() => onNavigate && onNavigate("flashcards")}>
          Open Flashcards →
        </button>
      </div>

      {/* Summary stats */}
      <div className="rv-stats-row">
        <div className={`rv-stat ${overdue.length ? "rv-stat-danger" : ""}`}>
          <span className="rv-stat-val">{overdue.length}</span>
          <span className="rv-stat-label">Overdue</span>
          {overdue.length > 0 && <span className="rv-stat-badge danger">Revise now</span>}
        </div>
        <div className={`rv-stat ${dueToday.length ? "rv-stat-warn" : ""}`}>
          <span className="rv-stat-val">{dueToday.length}</span>
          <span className="rv-stat-label">Due today</span>
        </div>
        <div className="rv-stat">
          <span className="rv-stat-val">{upcoming.length}</span>
          <span className="rv-stat-label">Upcoming</span>
        </div>
        <div className="rv-stat">
          <span className="rv-stat-val">{totalRevisions}</span>
          <span className="rv-stat-label">Total revisions</span>
        </div>
        <div className="rv-stat">
          <span className="rv-stat-val">{avgInterval}d</span>
          <span className="rv-stat-label">Avg. next interval</span>
        </div>
      </div>

      {/* Week calendar */}
      <div className="rv-section">
        <div className="section-header">
          <div className="section-title">7-Day Schedule</div>
          <span className="section-count">
            {[...overdue, ...dueToday].length} need attention
          </span>
        </div>
        <WeekCalendar data={data} />
      </div>

      {/* Spaced repetition explanation */}
      <div className="rv-srep-box">
        <div className="rv-srep-icon">🧠</div>
        <div>
          <div className="rv-srep-title">Leitner Spaced Repetition System</div>
          <div className="rv-srep-desc">
            Intervals grow with each successful revision:
            <span className="rv-srep-intervals">
              {INTERVALS.map((n, i) => (
                <span key={n} className="rv-interval-chip">
                  {i + 1}st → {n}d
                </span>
              ))}
              <span className="rv-interval-chip rv-interval-final">5th+ → 30d</span>
            </span>
          </div>
        </div>
      </div>

      {/* Overdue */}
      {overdue.length > 0 && (
        <div className="rv-section">
          <div className="section-header">
            <div className="section-title" style={{ color: "var(--red)" }}>⚠ Overdue</div>
            <span className="section-count">{overdue.length} note{overdue.length !== 1 ? "s" : ""}</span>
          </div>
          <div className="rv-list">
            {overdue.map(r => <NoteRow key={r.noteId} r={r} />)}
          </div>
        </div>
      )}

      {/* Due today */}
      {dueToday.length > 0 && (
        <div className="rv-section">
          <div className="section-header">
            <div className="section-title" style={{ color: "var(--amber)" }}>📅 Due Today</div>
            <span className="section-count">{dueToday.length} note{dueToday.length !== 1 ? "s" : ""}</span>
          </div>
          <div className="rv-list">
            {dueToday.map(r => <NoteRow key={r.noteId} r={r} />)}
          </div>
        </div>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <div className="rv-section">
          <div className="section-header">
            <div className="section-title">📆 Upcoming</div>
            <span className="section-count">{upcoming.length} note{upcoming.length !== 1 ? "s" : ""}</span>
          </div>
          <div className="rv-list">
            {upcoming.map(r => <NoteRow key={r.noteId} r={r} />)}
          </div>
        </div>
      )}
    </div>
  );
}
