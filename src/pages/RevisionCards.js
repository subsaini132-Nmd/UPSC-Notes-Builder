import React, { useState, useCallback } from "react";
import { SAMPLE_NOTES, SAMPLE_NOTE_CONTENT, GS_TAGS, NOTE_SECTIONS } from "../lib/constants";

const REV_KEY = "upsc_revised_notes";
function loadRevised() {
  try { return new Set(JSON.parse(localStorage.getItem(REV_KEY) || "[]")); } catch { return new Set(); }
}
function saveRevised(set) {
  localStorage.setItem(REV_KEY, JSON.stringify([...set]));
}

const KEY_SECTION_IDS = ["definition", "context", "way-forward", "conclusion"];

function getKeyContent(content) {
  if (!content?.sections) return {};
  const out = {};
  KEY_SECTION_IDS.forEach(id => {
    const v = content.sections[id];
    if (v && typeof v === "string" && !v.startsWith('{"src"')) {
      out[id] = v.trim().slice(0, 220) + (v.length > 220 ? "…" : "");
    }
  });
  return out;
}

function getSectionLabel(id) {
  const s = NOTE_SECTIONS?.find(s => s.id === id);
  return s?.label || id;
}

const GS_FILTERS = [
  { id: "all",  label: "All" },
  { id: "gs1",  label: "GS I" },
  { id: "gs2",  label: "GS II" },
  { id: "gs3",  label: "GS III" },
  { id: "gs4",  label: "GS IV" },
];

export default function RevisionCards({ onNavigate, notes = SAMPLE_NOTES, noteContents = SAMPLE_NOTE_CONTENT }) {
  const [revised,   setRevised]   = useState(loadRevised);
  const [gsFilter,  setGsFilter]  = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(null);
  const [flashMode, setFlashMode] = useState(false);
  const [flashIdx,  setFlashIdx]  = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const toggleRevised = useCallback((id) => {
    setRevised(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      saveRevised(next);
      return next;
    });
  }, []);

  const filtered = notes.filter(n => {
    if (gsFilter !== "all" && n.gs !== gsFilter) return false;
    if (statusFilter === "pending"  &&  revised.has(n.id)) return false;
    if (statusFilter === "revised"  && !revised.has(n.id)) return false;
    return true;
  });

  const pendingCount  = notes.filter(n => !revised.has(n.id)).length;
  const revisedCount  = notes.filter(n =>  revised.has(n.id)).length;

  // ── Flash-card mode ──
  if (flashMode) {
    const deck = filtered;
    if (deck.length === 0) {
      return (
        <div className="page rc-page">
          <div className="rc-flash-empty">
            <div>No cards in this filter.</div>
            <button className="rc-exit-flash" onClick={() => setFlashMode(false)}>← Back</button>
          </div>
        </div>
      );
    }
    const card  = deck[flashIdx % deck.length];
    const gsTag = GS_TAGS.find(g => g.id === card.gs);
    const content = noteContents[card.id];
    const keySecs = getKeyContent(content);

    return (
      <div className="page rc-page">
        <div className="rc-flash-header">
          <button className="rc-exit-flash" onClick={() => { setFlashMode(false); setShowAnswer(false); }}>← Exit Flash Mode</button>
          <div className="rc-flash-progress">Card {(flashIdx % deck.length) + 1} / {deck.length}</div>
          <button className="rc-mark-btn" onClick={() => toggleRevised(card.id)}>
            {revised.has(card.id) ? "✓ Revised" : "Mark Revised"}
          </button>
        </div>

        <div className="rc-flash-card">
          <div className="rc-flash-gs">
            {gsTag && <span className="gs-pill" style={{ background: gsTag.bg, color: gsTag.color }}>{gsTag.label}</span>}
          </div>
          <div className="rc-flash-topic">{card.topic}</div>
          <div className="rc-flash-sub">{card.subject}</div>

          {!showAnswer ? (
            <button className="rc-show-btn" onClick={() => setShowAnswer(true)}>
              Show Key Points ↓
            </button>
          ) : (
            <div className="rc-flash-body">
              {Object.entries(keySecs).length > 0
                ? Object.entries(keySecs).map(([id, text]) => (
                    <div key={id} className="rc-flash-sec">
                      <div className="rc-flash-sec-label">{getSectionLabel(id)}</div>
                      <div className="rc-flash-sec-text">{text}</div>
                    </div>
                  ))
                : <div className="rc-flash-no-content">No key sections filled yet.</div>
              }
            </div>
          )}
        </div>

        <div className="rc-flash-nav">
          <button
            className="rc-nav-btn"
            disabled={flashIdx === 0}
            onClick={() => { setFlashIdx(i => i - 1); setShowAnswer(false); }}
          >← Prev</button>
          <div className="rc-flash-dots">
            {deck.slice(0, Math.min(deck.length, 7)).map((_, i) => (
              <div key={i} className={`rc-dot ${i === flashIdx % deck.length ? "active" : ""} ${revised.has(deck[i].id) ? "done" : ""}`} />
            ))}
            {deck.length > 7 && <span className="rc-dots-more">+{deck.length - 7}</span>}
          </div>
          <button
            className="rc-nav-btn"
            disabled={flashIdx >= deck.length - 1}
            onClick={() => { setFlashIdx(i => i + 1); setShowAnswer(false); }}
          >Next →</button>
        </div>
      </div>
    );
  }

  // ── Grid mode ──
  return (
    <div className="page rc-page">
      {/* Header */}
      <div className="rc-header">
        <div>
          <p className="page-eyebrow">Day 8</p>
          <h1 className="page-title">Revision Cards</h1>
          <p className="page-sub">Quick-review mode for all your notes</p>
        </div>
        <button
          className="rc-flash-mode-btn"
          onClick={() => { setFlashMode(true); setFlashIdx(0); setShowAnswer(false); }}
        >
          ⚡ Flash Mode ({filtered.length})
        </button>
      </div>

      {/* Progress bar */}
      <div className="rc-progress-bar-wrap">
        <div className="rc-progress-meta">
          <span>{revisedCount} of {notes.length} revised</span>
          <span>{Math.round((revisedCount / Math.max(notes.length, 1)) * 100)}%</span>
        </div>
        <div className="rc-progress-track">
          <div className="rc-progress-fill" style={{ width: `${(revisedCount / Math.max(notes.length, 1)) * 100}%` }} />
        </div>
      </div>

      {/* Filters */}
      <div className="rc-filter-row">
        <div className="rc-filter-group">
          {GS_FILTERS.map(g => (
            <button
              key={g.id}
              className={`rc-gs-pill ${gsFilter === g.id ? "active" : ""}`}
              onClick={() => setGsFilter(g.id)}
            >{g.label}</button>
          ))}
        </div>
        <div className="rc-filter-group">
          {[
            { id: "all",     label: `All (${notes.length})` },
            { id: "pending", label: `Pending (${pendingCount})` },
            { id: "revised", label: `Revised (${revisedCount})` },
          ].map(s => (
            <button
              key={s.id}
              className={`rc-status-pill ${statusFilter === s.id ? "active" : ""}`}
              onClick={() => setStatusFilter(s.id)}
            >{s.label}</button>
          ))}
        </div>
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="rc-empty">
          <div className="rc-empty-icon">📚</div>
          <div>No notes match this filter.</div>
        </div>
      ) : (
        <div className="rc-grid">
          {filtered.map(note => {
            const gsTag   = GS_TAGS.find(g => g.id === note.gs);
            const content = noteContents[note.id];
            const keySecs = getKeyContent(content);
            const isExpanded  = expandedId === note.id;
            const isDone      = revised.has(note.id);

            return (
              <div key={note.id} className={`rc-card ${isDone ? "rc-card-done" : ""}`}>
                {/* Card top */}
                <div className="rc-card-top">
                  <div className="rc-card-meta">
                    {gsTag && <span className="gs-pill" style={{ background: gsTag.bg, color: gsTag.color }}>{gsTag.label}</span>}
                    <span className="rc-card-date">{note.date}</span>
                  </div>
                  <button
                    className={`rc-check-btn ${isDone ? "checked" : ""}`}
                    onClick={() => toggleRevised(note.id)}
                    title={isDone ? "Unmark" : "Mark as revised"}
                  >
                    {isDone ? "✓" : "○"}
                  </button>
                </div>

                {/* Topic */}
                <div className="rc-topic">{note.topic}</div>
                <div className="rc-subject">{note.subject}</div>

                {/* Word count + sections */}
                <div className="rc-card-stats">
                  <span>{note.wordCount?.toLocaleString() || 0} words</span>
                  <span>·</span>
                  <span>{note.sections} sections</span>
                </div>

                {/* Key sections preview */}
                {Object.keys(keySecs).length > 0 && (
                  <div className={`rc-preview ${isExpanded ? "expanded" : ""}`}>
                    {Object.entries(keySecs).map(([id, text]) => (
                      <div key={id} className="rc-preview-sec">
                        <div className="rc-preview-label">{getSectionLabel(id)}</div>
                        <div className="rc-preview-text">{text}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="rc-card-actions">
                  {Object.keys(keySecs).length > 0 && (
                    <button className="rc-expand-btn" onClick={() => setExpandedId(isExpanded ? null : note.id)}>
                      {isExpanded ? "Hide ↑" : "Preview ↓"}
                    </button>
                  )}
                  <button className="rc-view-btn" onClick={() => onNavigate("viewer", { noteId: note.id })}>
                    View Note →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
