import React, { useState } from "react";
import { SAMPLE_PDFS, SAMPLE_TOPICS, GS_TAGS, SAMPLE_NOTES } from "../lib/constants";

const EXAM_DATE = new Date("2026-09-20");
const TODAY_DATE = new Date("2026-06-21");

function daysLeft() {
  return Math.ceil((EXAM_DATE - TODAY_DATE) / 86400000);
}

const QUICK_ACTIONS = [
  { icon: "✦", label: "Note Generator",    desc: "Create notes on any topic", page: "generator", color: "#C8A96E" },
  { icon: "✏️", label: "Answer Practice",  desc: "Timed writing session",      page: "practice",  color: "#1E3A5F" },
  { icon: "⚡", label: "Quiz Mode",         desc: "Self-test from notes",       page: "quiz",      color: "#7C3AED" },
  { icon: "📋", label: "Syllabus Tracker", desc: "Track topic coverage",        page: "syllabus",  color: "#047857" },
  { icon: "⏱", label: "Study Timer",       desc: "Pomodoro focus session",      page: "timer",     color: "#0369A1" },
  { icon: "📊", label: "GS Progress",       desc: "Paper-wise tracking",         page: "progress",  color: "#B45309" },
];

export default function Dashboard({ onNavigate, notes = SAMPLE_NOTES }) {
  const [topicInput, setTopicInput] = useState("");

  const totalChunks    = SAMPLE_PDFS.filter(p => p.status === "indexed").reduce((s, p) => s + p.chunks, 0);
  const days           = daysLeft();
  const weeksLeft      = Math.floor(days / 7);
  const totalWords     = notes.reduce((s, n) => s + (n.wordCount || 0), 0);

  let coveredCount = 0;
  try { coveredCount = JSON.parse(localStorage.getItem("upsc_syllabus_covered") || "[]").length; } catch {}

  let todaySessions = 0, todayMins = 0;
  try {
    const sessions = JSON.parse(localStorage.getItem("upsc_study_sessions") || "[]");
    const today = new Date().toISOString().slice(0, 10);
    const t = sessions.filter(s => s.date === today && s.type === "focus");
    todaySessions = t.length;
    todayMins = t.reduce((a, s) => a + s.mins, 0);
  } catch {}

  const handleGenerate = () => { if (topicInput.trim()) onNavigate("generator"); };

  const gsDist = GS_TAGS.slice(0, 4).map(g => ({
    ...g,
    count: notes.filter(n => n.gs === g.id).length,
  }));

  return (
    <div className="page">

      {/* ── Header with exam countdown ── */}
      <div className="dash-header-row">
        <div>
          <p className="page-eyebrow">Dashboard</p>
          <h1 className="page-title">Your Mains Preparation Hub</h1>
        </div>
        <div className="exam-countdown-card">
          <div className="exam-days-num">{days}</div>
          <div className="exam-days-meta">
            <div className="exam-days-label">days left</div>
            <div className="exam-days-sub">{weeksLeft} weeks · UPSC Mains 2026</div>
            <div className="exam-days-date">Sep 20, 2026</div>
          </div>
        </div>
      </div>

      {/* ── Hero input ── */}
      <div className="hero-input-card">
        <div className="hero-input-label"><span className="sparkle-icon">✦</span> Generate a UPSC Mains Note</div>
        <h2 className="hero-input-heading">What topic do you want notes on?</h2>
        <div className="hero-input-row">
          <input
            className="hero-input"
            placeholder="e.g. Women Empowerment, Urban Flooding, Climate Change…"
            value={topicInput}
            onChange={e => setTopicInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleGenerate()}
          />
          <button className="hero-btn" onClick={handleGenerate}>Generate Note →</button>
        </div>
        <div className="hero-suggestions">
          <span className="suggestions-label">Try:</span>
          {SAMPLE_TOPICS.slice(0, 6).map(t => (
            <button key={t} className="suggestion-chip" onClick={() => setTopicInput(t)}>{t}</button>
          ))}
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="stats-row">
        {[
          { val: notes.length,                 label: "Notes Created",          icon: "📝" },
          { val: totalWords.toLocaleString(),  label: "Words Written",          icon: "✍️" },
          { val: coveredCount,                 label: "Syllabus Topics Covered",icon: "✅" },
          { val: todayMins > 0 ? `${todayMins}m` : todaySessions > 0 ? `${todaySessions} sessions` : days, label: todayMins > 0 ? "Focus Today" : "Days to Mains", icon: todayMins > 0 ? "⏱" : "📅" },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-val">{s.val}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Quick actions grid ── */}
      <div className="dash-section">
        <div className="section-header">
          <div className="section-title">Quick Access</div>
        </div>
        <div className="dash-qa-grid">
          {QUICK_ACTIONS.map(a => (
            <button key={a.page} className="dash-qa-card" onClick={() => onNavigate(a.page)}>
              <div className="dash-qa-icon" style={{ color: a.color }}>{a.icon}</div>
              <div className="dash-qa-label">{a.label}</div>
              <div className="dash-qa-desc">{a.desc}</div>
              <div className="dash-qa-arrow" style={{ color: a.color }}>→</div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Two-column: Recent Notes + GS Coverage ── */}
      <div className="dashboard-grid">

        {/* Recent Notes */}
        <div className="dash-col">
          <div className="section-header">
            <div className="section-title">Recent Notes</div>
            <button className="section-link" onClick={() => onNavigate("notes")}>View all →</button>
          </div>
          <div className="notes-list">
            {notes.slice(0, 6).map(note => {
              const gsTag = GS_TAGS.find(g => g.id === note.gs);
              return (
                <div key={note.id} className="note-row" onClick={() => onNavigate("viewer", { noteId: note.id })}>
                  <div className="note-row-left">
                    <div className="note-row-topic">{note.topic}</div>
                    <div className="note-row-meta">
                      {note.sections} sections · {(note.wordCount || 0).toLocaleString()} words · {note.date}
                    </div>
                  </div>
                  <div className="note-row-right">
                    {gsTag && <span className="gs-pill" style={{ background: gsTag.bg, color: gsTag.color }}>{gsTag.label}</span>}
                    <span className={`status-pill ${note.status}`}>{note.status}</span>
                  </div>
                </div>
              );
            })}
            {notes.length === 0 && (
              <div className="dash-empty-state">
                No notes yet.
                <button className="section-link" onClick={() => onNavigate("generator")}> Generate your first note →</button>
              </div>
            )}
          </div>
        </div>

        {/* GS Paper Distribution + PDFs */}
        <div className="dash-col">
          <div className="section-header">
            <div className="section-title">Notes by GS Paper</div>
            <button className="section-link" onClick={() => onNavigate("progress")}>Full stats →</button>
          </div>
          <div className="dash-gs-bars">
            {gsDist.map(g => {
              const pct = notes.length > 0 ? Math.round((g.count / notes.length) * 100) : 0;
              return (
                <div key={g.id} className="dash-gs-row">
                  <span className="gs-pill" style={{ background: g.bg, color: g.color, minWidth: 52, textAlign: "center" }}>{g.label}</span>
                  <div className="dash-gs-bar-track">
                    <div className="dash-gs-bar-fill" style={{ width: `${pct || 0}%`, background: g.color }} />
                  </div>
                  <span className="dash-gs-count">{g.count}</span>
                </div>
              );
            })}
          </div>

          <div className="section-header" style={{ marginTop: 22 }}>
            <div className="section-title">PDF Sources</div>
            <button className="section-link" onClick={() => onNavigate("library")}>Manage →</button>
          </div>
          <div className="pdfs-list">
            {SAMPLE_PDFS.slice(0, 4).map(pdf => (
              <div key={pdf.id} className="pdf-row">
                <div className="pdf-icon">📄</div>
                <div className="pdf-info">
                  <div className="pdf-name">{pdf.name}</div>
                  <div className="pdf-meta">{pdf.pages} pages · {pdf.size}</div>
                </div>
                <span className={`pdf-status ${pdf.status}`}>
                  {pdf.status === "indexed" && `${pdf.chunks.toLocaleString()} chunks`}
                  {pdf.status === "processing" && "⚙ Processing…"}
                  {pdf.status === "queued" && "⏳ Queued"}
                </span>
              </div>
            ))}
          </div>
          <button className="upload-btn" onClick={() => onNavigate("library")}>+ Upload PDF</button>
        </div>
      </div>
    </div>
  );
}
