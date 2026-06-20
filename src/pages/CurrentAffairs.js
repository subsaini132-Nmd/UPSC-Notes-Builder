import React, { useState } from "react";
import { SAMPLE_CURRENT_AFFAIRS, GS_TAGS } from "../lib/constants";

const SOURCE_COLORS = {
  "The Hindu": "#DC2626", "PIB": "#047857", "MoSPI": "#0369A1",
  "IPCC / Down to Earth": "#7C3AED", "Times of India": "#B45309",
  "MeitY": "#0369A1", "NCRB": "#DC2626", "MoEF&CC": "#047857",
};

const DATE_FILTERS = [
  { id: "all",  label: "All" },
  { id: "7",    label: "Last 7 days" },
  { id: "15",   label: "Last 15 days" },
];

export default function CurrentAffairs({ onNavigate }) {
  const [items, setItems]     = useState(SAMPLE_CURRENT_AFFAIRS);
  const [gsFilter, setGs]     = useState("all");
  const [dateFilter, setDate] = useState("all");
  const [expanded, setExp]    = useState(null);
  const [search, setSearch]   = useState("");

  const TODAY = new Date("2026-06-20");

  const toggle = (id) => {
    setExp(prev => prev === id ? null : id);
    setItems(prev => prev.map(c => c.id === id ? { ...c, read: true } : c));
  };

  const markAllRead = () => setItems(prev => prev.map(c => ({ ...c, read: true })));

  const filtered = items.filter(c => {
    const matchGs   = gsFilter === "all" || c.gs.includes(gsFilter);
    const matchDate = dateFilter === "all" || (() => {
      const diff = Math.floor((TODAY - new Date(c.date)) / 864e5);
      return diff <= Number(dateFilter);
    })();
    const matchQ    = !search || c.headline.toLowerCase().includes(search.toLowerCase())
                              || c.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchGs && matchDate && matchQ;
  });

  const unread = items.filter(c => !c.read).length;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Current Affairs</p>
          <h1 className="page-title">Daily CA — Linked to Your Notes</h1>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {unread > 0 && (
            <span className="ca-unread-badge">{unread} unread</span>
          )}
          <button className="viewer-action-btn" onClick={markAllRead}>Mark all read</button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="ca-filter-bar">
        <div className="search-input-wrap" style={{ flex: 1, maxWidth: 360 }}>
          <svg className="search-icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input
            className="search-big-input ca-search"
            placeholder="Search headlines or tags…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="ca-filter-group">
          <span className="ca-filter-label">GS Paper</span>
          <div className="filter-pills">
            <button className={`filter-pill ${gsFilter === "all" ? "active" : ""}`} onClick={() => setGs("all")}>All</button>
            {GS_TAGS.slice(0, 5).map(g => (
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

        <div className="ca-filter-group">
          <span className="ca-filter-label">Period</span>
          <div className="filter-pills">
            {DATE_FILTERS.map(f => (
              <button
                key={f.id}
                className={`filter-pill ${dateFilter === f.id ? "active" : ""}`}
                onClick={() => setDate(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="ca-stats-strip">
        <span className="ca-stats-item">
          <strong>{filtered.length}</strong> items
        </span>
        <span className="ca-stats-sep">·</span>
        <span className="ca-stats-item">
          <strong>{filtered.filter(c => !c.read).length}</strong> unread
        </span>
        <span className="ca-stats-sep">·</span>
        <span className="ca-stats-item">
          <strong>{[...new Set(filtered.flatMap(c => c.tags))].length}</strong> unique tags
        </span>
      </div>

      {/* Feed */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📰</div>
          <div className="empty-title">No CA items match</div>
          <div className="empty-sub">Try adjusting the filter or date range</div>
        </div>
      ) : (
        <div className="ca-feed">
          {filtered.map(item => {
            const isOpen  = expanded === item.id;
            const srcColor = SOURCE_COLORS[item.source] || "var(--text-muted)";
            return (
              <div
                key={item.id}
                className={`ca-card ${!item.read ? "ca-card-unread" : ""} ${isOpen ? "ca-card-open" : ""}`}
              >
                {/* Card header — always visible */}
                <div className="ca-card-header" onClick={() => toggle(item.id)}>
                  <div className="ca-card-meta">
                    <span className="ca-date">{item.date}</span>
                    <span className="ca-source" style={{ color: srcColor }}>
                      {item.source}
                    </span>
                    {!item.read && <span className="ca-new-dot" title="Unread" />}
                  </div>
                  <div className="ca-headline">{item.headline}</div>
                  <div className="ca-tags-row">
                    {item.gs.map(g => {
                      const tag = GS_TAGS.find(t => t.id === g);
                      return tag ? (
                        <span key={g} className="gs-pill" style={{ background: tag.bg, color: tag.color }}>
                          {tag.label}
                        </span>
                      ) : null;
                    })}
                    {item.tags.map(t => (
                      <span key={t} className="ca-tag-chip">{t}</span>
                    ))}
                    <span className="ca-toggle-hint">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                        style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                        <path d="m6 9 6 6 6-6"/>
                      </svg>
                    </span>
                  </div>
                </div>

                {/* Expanded body */}
                {isOpen && (
                  <div className="ca-card-body">
                    <div className="ca-summary-label">Summary</div>
                    <p className="ca-summary-text">{item.summary}</p>

                    <div className="ca-relevance-box">
                      <div className="ca-relevance-label">
                        <span>📌</span> Relevance to your notes
                      </div>
                      <div className="ca-relevance-text">{item.relevance}</div>
                    </div>

                    <div className="ca-card-actions">
                      <button
                        className="viewer-action-btn"
                        onClick={() => onNavigate && onNavigate("viewer", { noteId: item.noteId })}
                      >
                        Open Related Note
                      </button>
                      <button
                        className="viewer-action-btn"
                        onClick={() => onNavigate && onNavigate("editor", { noteId: item.noteId })}
                      >
                        ✏ Add to Note
                      </button>
                      <button
                        className="viewer-action-btn primary"
                        onClick={() => onNavigate && onNavigate("answers")}
                      >
                        Build Answer →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Info box */}
      <div className="info-box" style={{ marginTop: 28 }}>
        <div className="info-box-icon">💡</div>
        <div>
          <div className="info-box-title">How to use Current Affairs</div>
          <div className="info-box-desc">
            Each CA item is tagged to the GS paper and related note topic. Open an item to read the summary and see exactly which section of your note it enriches. Use "Add to Note" to jump directly to the editor for that section.
          </div>
        </div>
      </div>
    </div>
  );
}
