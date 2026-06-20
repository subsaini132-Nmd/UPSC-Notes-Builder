import React, { useState, useMemo } from "react";
import { SAMPLE_NOTES, SAMPLE_NOTE_CONTENT, NOTE_SECTIONS, GS_TAGS } from "../lib/constants";

function highlight(text, query) {
  if (!query.trim()) return text;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase()
      ? <mark key={i} className="search-mark">{part}</mark>
      : part
  );
}

function excerpt(text, query, len = 180) {
  if (!query.trim()) return text.slice(0, len) + "…";
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text.slice(0, len) + "…";
  const start = Math.max(0, idx - 60);
  const end   = Math.min(text.length, idx + len - 60);
  return (start > 0 ? "…" : "") + text.slice(start, end) + (end < text.length ? "…" : "");
}

export default function Search({ onNavigate }) {
  const [query, setQuery]   = useState("");
  const [gsFilter, setGs]   = useState("all");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const out = [];

    SAMPLE_NOTES.forEach(note => {
      if (gsFilter !== "all" && note.gs !== gsFilter) return;

      const content = SAMPLE_NOTE_CONTENT[note.id];

      // Match on topic
      if (note.topic.toLowerCase().includes(q)) {
        out.push({
          noteId: note.id, noteTopic: note.topic, noteGs: note.gs,
          sectionId: null, sectionLabel: "Topic match", sectionIcon: "📝",
          snippet: note.topic, score: 3,
        });
      }

      // Match in sections
      if (content) {
        NOTE_SECTIONS.forEach(sec => {
          const body = content.sections[sec.id] || "";
          if (body.toLowerCase().includes(q)) {
            out.push({
              noteId: note.id, noteTopic: note.topic, noteGs: note.gs,
              sectionId: sec.id, sectionLabel: sec.label, sectionIcon: sec.icon,
              snippet: excerpt(body, query.trim()),
              score: 2,
            });
          }
        });
      }
    });

    return out.sort((a, b) => b.score - a.score);
  }, [query, gsFilter]);

  const getTag = (gsId) => GS_TAGS.find(g => g.id === gsId);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Search</p>
          <h1 className="page-title">Search All Notes</h1>
        </div>
      </div>

      {/* Search input */}
      <div className="search-hero">
        <div className="search-input-wrap">
          <svg className="search-icon-svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            className="search-big-input"
            placeholder="Search across all your notes — try 'SHG', 'judiciary', 'Rajasthan'…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
          />
          {query && (
            <button className="search-clear-btn" onClick={() => setQuery("")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          )}
        </div>

        {/* GS filter */}
        <div className="search-gs-filter">
          <span className="search-filter-label">Filter:</span>
          <button className={`filter-pill ${gsFilter === "all" ? "active" : ""}`} onClick={() => setGs("all")}>All</button>
          {GS_TAGS.map(g => (
            <button
              key={g.id}
              className={`filter-pill ${gsFilter === g.id ? "active" : ""}`}
              style={gsFilter === g.id ? { background: g.bg, color: g.color, borderColor: g.color } : {}}
              onClick={() => setGs(gsFilter === g.id ? "all" : g.id)}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {query.trim() === "" && (
        <div className="search-empty-state">
          <div className="search-suggestions">
            <div className="search-sugg-label">Try searching for</div>
            <div className="search-sugg-chips">
              {["Women Empowerment", "SHG", "constitutional provisions", "Rajasthan", "way forward", "judiciary", "ethics dimension", "data statistics"].map(s => (
                <button key={s} className="suggestion-chip search-chip" onClick={() => setQuery(s)}>{s}</button>
              ))}
            </div>
          </div>
          <div className="search-scope-info">
            <div className="search-scope-item">
              <span className="search-scope-num">5</span>
              <span className="search-scope-label">Notes indexed</span>
            </div>
            <div className="search-scope-div" />
            <div className="search-scope-item">
              <span className="search-scope-num">22</span>
              <span className="search-scope-label">Sections per note</span>
            </div>
            <div className="search-scope-div" />
            <div className="search-scope-item">
              <span className="search-scope-num">2,840+</span>
              <span className="search-scope-label">Words searchable</span>
            </div>
          </div>
        </div>
      )}

      {query.trim() !== "" && results.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <div className="empty-title">No results for "{query}"</div>
          <div className="empty-sub">Try a different keyword, or generate more notes to expand your library</div>
          <button className="primary-btn" onClick={() => onNavigate && onNavigate("generator")}>Generate a Note</button>
        </div>
      )}

      {results.length > 0 && (
        <>
          <div className="search-result-meta">
            {results.length} result{results.length !== 1 ? "s" : ""} for <strong>"{query}"</strong>
          </div>
          <div className="search-results">
            {results.map((r, i) => {
              const tag = getTag(r.noteGs);
              return (
                <div key={i} className="search-result-card" onClick={() => onNavigate && onNavigate("viewer")}>
                  <div className="src-top">
                    <div className="src-left">
                      {tag && <span className="gs-pill" style={{ background: tag.bg, color: tag.color }}>{tag.label}</span>}
                      <span className="src-section-badge">
                        <span>{r.sectionIcon}</span>
                        <span>{r.sectionLabel}</span>
                      </span>
                    </div>
                    <div className="src-arrow">→</div>
                  </div>
                  <div className="src-topic">{highlight(r.noteTopic, query)}</div>
                  <div className="src-snippet">{highlight(r.snippet, query)}</div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
