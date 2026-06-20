import React, { useState } from "react";
import { GS_TOPICS, GS_TAGS, REVISION_DATA } from "../lib/constants";

function RingProgress({ pct, color, size = 110, sw = 9 }) {
  const r      = (size - sw) / 2;
  const circ   = 2 * Math.PI * r;
  const offset = circ * (1 - pct / 100);
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth={sw} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={sw}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.9s ease" }}
      />
    </svg>
  );
}

function StatusIcon({ status }) {
  if (status === "noted")
    return <span className="gsp-status-icon noted" title="Note created">✓</span>;
  return <span className="gsp-status-icon pending" title="Not yet noted">○</span>;
}

export default function GSProgress({ onNavigate }) {
  const [expanded, setExpanded] = useState(null);

  const paperIds = ["gs1", "gs2", "gs3", "gs4"];

  const stats = paperIds.map(pid => {
    const paper   = GS_TOPICS[pid];
    const total   = paper.topics.length;
    const noted   = paper.topics.filter(t => t.status === "noted").length;
    const revised = paper.topics.filter(t => t.revisions > 0).length;
    const pct     = Math.round((noted / total) * 100);
    const tag     = GS_TAGS.find(g => g.id === pid);
    return { pid, paper, total, noted, revised, pct, tag };
  });

  const overall = {
    total:   stats.reduce((s, p) => s + p.total, 0),
    noted:   stats.reduce((s, p) => s + p.noted, 0),
    revised: stats.reduce((s, p) => s + p.revised, 0),
  };
  const overallPct = Math.round((overall.noted / overall.total) * 100);

  const nextTopics = stats.flatMap(s =>
    s.paper.topics
      .filter(t => t.status === "pending")
      .slice(0, 2)
      .map(t => ({ ...t, paper: s.pid, color: s.tag?.color, bg: s.tag?.bg, label: s.tag?.label }))
  );

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">GS Progress</p>
          <h1 className="page-title">Paper-wise Preparation Tracker</h1>
        </div>
        <button className="primary-btn" onClick={() => onNavigate && onNavigate("generator")}>
          + Generate Note
        </button>
      </div>

      {/* Overall summary */}
      <div className="gsp-overall-card">
        <div className="gsp-overall-ring">
          <RingProgress pct={overallPct} color="var(--accent)" size={120} sw={10} />
          <div className="gsp-overall-center">
            <span className="gsp-overall-pct">{overallPct}%</span>
            <span className="gsp-overall-sub">overall</span>
          </div>
        </div>
        <div className="gsp-overall-stats">
          <div className="gsp-ostat">
            <span className="gsp-ostat-val">{overall.noted}</span>
            <span className="gsp-ostat-label">Topics noted</span>
          </div>
          <div className="gsp-ostat">
            <span className="gsp-ostat-val">{overall.total - overall.noted}</span>
            <span className="gsp-ostat-label">Topics pending</span>
          </div>
          <div className="gsp-ostat">
            <span className="gsp-ostat-val">{overall.revised}</span>
            <span className="gsp-ostat-label">Topics revised</span>
          </div>
          <div className="gsp-ostat">
            <span className="gsp-ostat-val">{overall.total}</span>
            <span className="gsp-ostat-label">Total topics</span>
          </div>
        </div>
        <div className="gsp-overall-bar-wrap">
          <div className="gsp-overall-bar">
            <div className="gsp-overall-fill" style={{ width: `${overallPct}%` }} />
          </div>
          <span className="gsp-overall-target">Target: 100% by exam</span>
        </div>
      </div>

      {/* Paper cards 2x2 */}
      <div className="gsp-papers-grid">
        {stats.map(({ pid, paper, total, noted, revised, pct, tag }) => {
          const isOpen = expanded === pid;
          return (
            <div key={pid} className={`gsp-paper-card ${isOpen ? "gsp-paper-open" : ""}`}>
              {/* Card header */}
              <div className="gsp-paper-header" onClick={() => setExpanded(isOpen ? null : pid)}>
                <div className="gsp-paper-ring-wrap">
                  <RingProgress pct={pct} color={tag?.color || "#888"} size={90} sw={8} />
                  <div className="gsp-paper-ring-center">
                    <span className="gsp-paper-pct" style={{ color: tag?.color }}>{pct}%</span>
                  </div>
                </div>
                <div className="gsp-paper-info">
                  <span className="gs-pill" style={{ background: tag?.bg, color: tag?.color }}>
                    {tag?.label}
                  </span>
                  <div className="gsp-paper-name">{paper.label.split(" — ")[1]}</div>
                  <div className="gsp-paper-meta">
                    <span className="gsp-p-noted">{noted}/{total} noted</span>
                    <span className="gsp-p-sep">·</span>
                    <span className="gsp-p-revised">{revised} revised</span>
                  </div>
                  <div className="gsp-paper-mini-bar">
                    <div
                      className="gsp-paper-mini-fill"
                      style={{ width: `${pct}%`, background: tag?.color }}
                    />
                  </div>
                </div>
                <svg
                  width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" className="gsp-expand-icon"
                  style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>

              {/* Expanded topic list */}
              {isOpen && (
                <div className="gsp-topic-list">
                  {paper.topics.map(t => (
                    <div key={t.id} className={`gsp-topic-row ${t.status}`}>
                      <StatusIcon status={t.status} />
                      <span className="gsp-topic-name">{t.name}</span>
                      <div className="gsp-topic-right">
                        {t.revisions > 0 && (
                          <span className="gsp-topic-rev">{t.revisions}× revised</span>
                        )}
                        {t.status === "pending" ? (
                          <button
                            className="gsp-gen-btn"
                            onClick={() => onNavigate && onNavigate("generator")}
                          >
                            + Note
                          </button>
                        ) : (
                          <button
                            className="gsp-view-btn"
                            onClick={() => onNavigate && onNavigate("notes")}
                          >
                            View
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Suggested next topics */}
      <div className="gsp-suggest-section">
        <div className="section-header">
          <div className="section-title">Suggested Next Topics</div>
          <span className="section-count">{nextTopics.length} pending across papers</span>
        </div>
        <div className="gsp-suggest-grid">
          {nextTopics.map(t => (
            <div key={t.id} className="gsp-suggest-card">
              <div className="gsp-suggest-top">
                <span className="gs-pill" style={{ background: t.bg, color: t.color }}>{t.label}</span>
              </div>
              <div className="gsp-suggest-name">{t.name}</div>
              <button
                className="primary-btn gsp-suggest-btn"
                onClick={() => onNavigate && onNavigate("generator")}
              >
                Generate Note →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Revision data crosslink */}
      <div className="gsp-revision-link">
        <div className="gsp-rl-text">
          <div className="gsp-rl-title">Revision status</div>
          <div className="gsp-rl-sub">
            {REVISION_DATA.filter(r => {
              const diff = Math.floor((new Date(r.nextDue) - new Date("2026-06-20")) / 864e5);
              return diff < 0;
            }).length} notes overdue for revision
          </div>
        </div>
        <button className="viewer-action-btn primary" onClick={() => onNavigate && onNavigate("revision")}>
          Open Revision Tracker →
        </button>
      </div>
    </div>
  );
}
