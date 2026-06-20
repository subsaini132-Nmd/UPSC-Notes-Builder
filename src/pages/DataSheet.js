import React, { useState } from "react";
import { DATA_SHEET } from "../lib/constants";

const CATEGORY_IDS = Object.keys(DATA_SHEET);

export default function DataSheet({ onNavigate }) {
  const [activeTab, setActiveTab] = useState("all");
  const [search,    setSearch]    = useState("");
  const [copied,    setCopied]    = useState(null);

  const handleCopy = (key, value) => {
    const text = `${key}: ${value}`;
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  const matchesSearch = (item) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      item.key.toLowerCase().includes(q) ||
      item.value.toLowerCase().includes(q) ||
      (item.note || "").toLowerCase().includes(q) ||
      (item.source || "").toLowerCase().includes(q)
    );
  };

  const categoriesVisible = activeTab === "all"
    ? CATEGORY_IDS
    : CATEGORY_IDS.filter(id => id === activeTab);

  const visibleItems = categoriesVisible.flatMap(catId => {
    const cat = DATA_SHEET[catId];
    return cat.items
      .filter(matchesSearch)
      .map(item => ({ ...item, catId, cat }));
  });

  const totalItems = CATEGORY_IDS.reduce((s, id) => s + DATA_SHEET[id].items.length, 0);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Data Sheet</p>
          <h1 className="page-title">Key Facts & Figures</h1>
        </div>
        <span className="ds-total-badge">{totalItems} data points</span>
      </div>

      {/* Search */}
      <div className="ds-search-wrap">
        <div className="search-input-wrap">
          <svg className="search-icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            className="search-big-input"
            placeholder="Search facts, figures, sources…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="ds-clear-btn" onClick={() => setSearch("")}>✕</button>
          )}
        </div>
        {search && (
          <span className="ds-result-count">{visibleItems.length} results</span>
        )}
      </div>

      {/* Category tabs */}
      <div className="ds-tabs">
        <button
          className={`ds-tab ${activeTab === "all" ? "ds-tab-active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          All ({totalItems})
        </button>
        {CATEGORY_IDS.map(id => {
          const cat = DATA_SHEET[id];
          return (
            <button
              key={id}
              className={`ds-tab ${activeTab === id ? "ds-tab-active" : ""}`}
              style={activeTab === id ? { borderColor: cat.color, color: cat.color } : {}}
              onClick={() => setActiveTab(id)}
            >
              {cat.icon} {cat.label}
            </button>
          );
        })}
      </div>

      {/* Items grid */}
      {visibleItems.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <div className="empty-title">No results for "{search}"</div>
          <div className="empty-sub">Try different keywords or clear the search</div>
          <button className="viewer-action-btn" onClick={() => setSearch("")}>Clear search</button>
        </div>
      ) : (
        <>
          {(activeTab === "all" && !search) ? (
            /* Category sections */
            CATEGORY_IDS.map(catId => {
              const cat = DATA_SHEET[catId];
              return (
                <div key={catId} className="ds-category-section">
                  <div className="ds-cat-header">
                    <span className="ds-cat-icon">{cat.icon}</span>
                    <span className="ds-cat-title" style={{ color: cat.color }}>{cat.label}</span>
                    <span className="ds-cat-count">{cat.items.length} items</span>
                  </div>
                  <div className="ds-grid">
                    {cat.items.map(item => (
                      <DataCard
                        key={item.key}
                        item={item}
                        cat={cat}
                        copied={copied}
                        onCopy={handleCopy}
                        onNavigate={onNavigate}
                      />
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            /* Flat search / filtered grid */
            <div className="ds-grid ds-grid-flat">
              {visibleItems.map(item => (
                <DataCard
                  key={`${item.catId}-${item.key}`}
                  item={item}
                  cat={item.cat}
                  copied={copied}
                  onCopy={handleCopy}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          )}
        </>
      )}

      <div className="info-box" style={{ marginTop: 28 }}>
        <div className="info-box-icon">📌</div>
        <div>
          <div className="info-box-title">How to use Data Sheet</div>
          <div className="info-box-desc">
            Click any card to copy the key-value to clipboard. These figures are curated from official sources for UPSC Mains answer writing — cite the source when writing answers. Data is current as of June 2026.
          </div>
        </div>
      </div>
    </div>
  );
}

function DataCard({ item, cat, copied, onCopy, onNavigate }) {
  const isCopied = copied === item.key;
  return (
    <div className="ds-card" onClick={() => onCopy(item.key, item.value)}>
      <div className="ds-card-top">
        <span className="ds-card-cat-dot" style={{ background: cat.color }} />
        <span className="ds-card-key">{item.key}</span>
        <button
          className={`ds-copy-btn ${isCopied ? "ds-copy-done" : ""}`}
          onClick={e => { e.stopPropagation(); onCopy(item.key, item.value); }}
          title="Copy to clipboard"
        >
          {isCopied ? "✓" : "⧉"}
        </button>
      </div>
      <div className="ds-card-value">{item.value}</div>
      {item.note && <div className="ds-card-note">{item.note}</div>}
      <div className="ds-card-source">Source: {item.source}</div>
    </div>
  );
}
