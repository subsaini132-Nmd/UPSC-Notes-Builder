import React, { useState } from "react";
import { ANSWER_FRAMEWORKS } from "../lib/constants";

const GS_FILTERS = [
  { id: "all",   label: "All" },
  { id: "gs1",   label: "GS I" },
  { id: "gs2",   label: "GS II" },
  { id: "gs3",   label: "GS III" },
  { id: "gs4",   label: "GS IV" },
  { id: "essay", label: "Essay" },
];

export default function AnswerFrameworks({ onNavigate }) {
  const [active,    setActive]    = useState(null);
  const [gsFilter,  setGsFilter]  = useState("all");
  const [wordGuide, setWordGuide] = useState(null);

  const filtered = ANSWER_FRAMEWORKS.filter(f =>
    gsFilter === "all" || f.gs.includes(gsFilter)
  );

  const activeF = active ? ANSWER_FRAMEWORKS.find(f => f.id === active) : null;

  return (
    <div className="page fw-page">
      {/* Header */}
      <div className="fw-header">
        <div>
          <p className="page-eyebrow">Day 8</p>
          <h1 className="page-title">Answer Frameworks</h1>
          <p className="page-sub">12 pre-built templates for every question type in UPSC Mains</p>
        </div>
        <div className="fw-header-stat">
          <span className="fw-count">{ANSWER_FRAMEWORKS.length}</span>
          <span className="fw-count-label">frameworks</span>
        </div>
      </div>

      {/* GS filter */}
      <div className="fw-filter-row">
        {GS_FILTERS.map(g => (
          <button
            key={g.id}
            className={`fw-gs-pill ${gsFilter === g.id ? "active" : ""}`}
            onClick={() => setGsFilter(g.id)}
          >
            {g.label}
          </button>
        ))}
        <span className="fw-filter-count">{filtered.length} templates</span>
      </div>

      <div className="fw-layout">
        {/* Left: framework list */}
        <div className="fw-list">
          {filtered.map(f => (
            <button
              key={f.id}
              className={`fw-list-item ${active === f.id ? "active" : ""}`}
              style={active === f.id ? { borderLeftColor: f.color } : {}}
              onClick={() => { setActive(f.id); setWordGuide(null); }}
            >
              <div className="fw-list-type" style={{ color: f.color }}>{f.type}</div>
              <div className="fw-list-desc">{f.desc}</div>
              <div className="fw-list-gs">
                {f.gs.map(g => <span key={g} className="fw-gs-tag">{g.toUpperCase()}</span>)}
              </div>
            </button>
          ))}
        </div>

        {/* Right: detail panel */}
        <div className="fw-detail">
          {!activeF ? (
            <div className="fw-empty">
              <div className="fw-empty-icon">📋</div>
              <div className="fw-empty-text">Select a framework to view its structure</div>
              <div className="fw-empty-hint">Each template includes structure, dos & don'ts, and a sample question</div>
            </div>
          ) : (
            <div className="fw-detail-inner">
              {/* Title */}
              <div className="fw-detail-head" style={{ borderTopColor: activeF.color }}>
                <div className="fw-detail-type" style={{ color: activeF.color }}>{activeF.type}</div>
                <div className="fw-detail-desc">{activeF.desc}</div>
                <div className="fw-detail-keywords">
                  Keywords: {activeF.keywords.map(k => <code key={k} className="fw-kw">{k}</code>)}
                </div>
              </div>

              {/* Word guide selector */}
              {activeF.wordGuide && (
                <div className="fw-word-guide-row">
                  <span className="fw-wg-label">Word limit guide:</span>
                  {Object.entries(activeF.wordGuide).map(([words, guide]) => (
                    <button
                      key={words}
                      className={`fw-wg-btn ${wordGuide === words ? "active" : ""}`}
                      style={wordGuide === words ? { background: activeF.color, borderColor: activeF.color, color: "#fff" } : {}}
                      onClick={() => setWordGuide(w => w === words ? null : words)}
                    >
                      {words} words — <em>{guide}</em>
                    </button>
                  ))}
                </div>
              )}

              {/* Structure blocks */}
              <div className="fw-structure-label">Answer Structure</div>
              <div className="fw-structure">
                {activeF.structure.map((s, i) => (
                  <div key={i} className="fw-section-row">
                    <div className="fw-section-icon">{s.icon}</div>
                    <div className="fw-section-body">
                      <div className="fw-section-title">
                        <span>{s.part}</span>
                        <span className="fw-section-pct" style={{ background: activeF.color + "20", color: activeF.color }}>
                          ~{s.pct}%
                        </span>
                      </div>
                      <div className="fw-section-bar-wrap">
                        <div className="fw-section-bar" style={{ width: `${s.pct}%`, background: activeF.color }} />
                      </div>
                      <div className="fw-section-tip">{s.tip}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dos and Don'ts */}
              <div className="fw-dos-grid">
                <div className="fw-dos-col">
                  <div className="fw-dos-head fw-do-head">✅ Do</div>
                  {activeF.dos.map((d, i) => <div key={i} className="fw-do-item">• {d}</div>)}
                </div>
                <div className="fw-dos-col">
                  <div className="fw-dos-head fw-dont-head">❌ Don't</div>
                  {activeF.donts.map((d, i) => <div key={i} className="fw-dont-item">• {d}</div>)}
                </div>
              </div>

              {/* Sample question */}
              <div className="fw-sample">
                <div className="fw-sample-label">Sample Question</div>
                <div className="fw-sample-text">"{activeF.example}"</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
