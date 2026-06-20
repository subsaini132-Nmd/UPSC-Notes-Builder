import React, { useState, useCallback } from "react";
import { QUOTE_BANK, QUOTE_CATEGORIES } from "../lib/constants";

const GS_FILTERS = [
  { id: "all",   label: "All GS" },
  { id: "gs1",   label: "GS I" },
  { id: "gs2",   label: "GS II" },
  { id: "gs3",   label: "GS III" },
  { id: "gs4",   label: "GS IV" },
  { id: "essay", label: "Essay" },
];

const FAV_KEY = "upsc_quote_favs";
function loadFavs() {
  try { return new Set(JSON.parse(localStorage.getItem(FAV_KEY) || "[]")); } catch { return new Set(); }
}
function saveFavs(set) {
  localStorage.setItem(FAV_KEY, JSON.stringify([...set]));
}

export default function QuoteBank({ onNavigate }) {
  const [search,   setSearch]   = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [gsFilter, setGsFilter] = useState("all");
  const [favs,    setFavs]    = useState(loadFavs);
  const [copied,  setCopied]  = useState(null);
  const [showFavsOnly, setShowFavsOnly] = useState(false);

  const toggleFav = useCallback((id) => {
    setFavs(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      saveFavs(next);
      return next;
    });
  }, []);

  const copyQuote = useCallback((q) => {
    const text = `"${q.quote}" — ${q.thinker}`;
    navigator.clipboard.writeText(text).catch(() => {
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    });
    setCopied(q.id);
    setTimeout(() => setCopied(null), 1800);
  }, []);

  const filtered = QUOTE_BANK.filter(q => {
    if (showFavsOnly && !favs.has(q.id)) return false;
    if (catFilter !== "all" && q.category !== catFilter) return false;
    if (gsFilter !== "all" && !q.gs.includes(gsFilter)) return false;
    if (search.trim()) {
      const s = search.toLowerCase();
      return q.quote.toLowerCase().includes(s)
        || q.thinker.toLowerCase().includes(s)
        || q.tags.some(t => t.includes(s))
        || q.context.toLowerCase().includes(s);
    }
    return true;
  });

  const activeCatColor = QUOTE_CATEGORIES.find(c => c.id === catFilter)?.color || "#1E3A5F";

  return (
    <div className="page qb-page">
      {/* Header */}
      <div className="qb-header">
        <div>
          <p className="page-eyebrow">Day 8</p>
          <h1 className="page-title">Quote Bank</h1>
          <p className="page-sub">65 curated quotes for GS answers &amp; essays — one click to copy</p>
        </div>
        <div className="qb-header-meta">
          <div className="qb-stat">{filtered.length}<span>shown</span></div>
          <div className="qb-stat">{favs.size}<span>saved</span></div>
        </div>
      </div>

      {/* Search */}
      <div className="qb-search-row">
        <div className="qb-search-wrap">
          <svg className="qb-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input
            className="qb-search"
            placeholder="Search quotes, thinkers, tags…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && <button className="qb-clear" onClick={() => setSearch("")}>✕</button>}
        </div>
        <button
          className={`qb-fav-toggle ${showFavsOnly ? "active" : ""}`}
          onClick={() => setShowFavsOnly(v => !v)}
        >
          {showFavsOnly ? "★ Saved" : "☆ Saved"} ({favs.size})
        </button>
      </div>

      {/* Category pills */}
      <div className="qb-filters">
        <div className="qb-filter-group">
          {QUOTE_CATEGORIES.map(c => (
            <button
              key={c.id}
              className={`qb-cat-pill ${catFilter === c.id ? "active" : ""}`}
              style={catFilter === c.id ? { background: c.color, borderColor: c.color, color: "#fff" } : {}}
              onClick={() => setCatFilter(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="qb-filter-group">
          {GS_FILTERS.map(g => (
            <button
              key={g.id}
              className={`qb-gs-pill ${gsFilter === g.id ? "active" : ""}`}
              onClick={() => setGsFilter(g.id)}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cards grid */}
      {filtered.length === 0 ? (
        <div className="qb-empty">
          <div className="qb-empty-icon">❝</div>
          <div>No quotes match your filters.</div>
          <button className="qb-reset-btn" onClick={() => { setSearch(""); setCatFilter("all"); setGsFilter("all"); setShowFavsOnly(false); }}>
            Reset filters
          </button>
        </div>
      ) : (
        <div className="qb-grid">
          {filtered.map(q => {
            const catColor = QUOTE_CATEGORIES.find(c => c.id === q.category)?.color || "#1E3A5F";
            return (
              <div key={q.id} className="qb-card" style={{ "--cat-color": catColor }}>
                <div className="qb-card-top">
                  <span className="qb-cat-badge" style={{ background: catColor + "18", color: catColor }}>
                    {QUOTE_CATEGORIES.find(c => c.id === q.category)?.label}
                  </span>
                  <div className="qb-card-actions">
                    <button
                      className={`qb-fav-btn ${favs.has(q.id) ? "favved" : ""}`}
                      onClick={() => toggleFav(q.id)}
                      title={favs.has(q.id) ? "Remove from saved" : "Save quote"}
                    >
                      {favs.has(q.id) ? "★" : "☆"}
                    </button>
                    <button
                      className={`qb-copy-btn ${copied === q.id ? "copied" : ""}`}
                      onClick={() => copyQuote(q)}
                      title="Copy to clipboard"
                    >
                      {copied === q.id ? "✓ Copied" : "Copy"}
                    </button>
                  </div>
                </div>

                <div className="qb-quote-mark">❝</div>
                <p className="qb-quote-text">{q.quote}</p>
                <div className="qb-thinker">— {q.thinker}</div>
                <div className="qb-context">{q.context}</div>

                <div className="qb-card-footer">
                  <div className="qb-tags">
                    {q.tags.slice(0, 3).map(t => (
                      <span key={t} className="qb-tag" onClick={() => setSearch(t)}>{t}</span>
                    ))}
                  </div>
                  <div className="qb-gs-badges">
                    {q.gs.map(g => (
                      <span key={g} className="qb-gs-badge">{g.toUpperCase()}</span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
