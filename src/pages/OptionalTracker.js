import React, { useState } from "react";
import { ANTHROPOLOGY_SYLLABUS } from "../lib/constants";

function RingProgress({ pct, color, size = 100, sw = 8 }) {
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

function paperStats(paper) {
  const allTopics  = paper.units.flatMap(u => u.topics);
  const total      = allTopics.length;
  const noted      = allTopics.filter(t => t.status === "noted").length;
  const revised    = allTopics.filter(t => t.revisions > 0).length;
  const pct        = total > 0 ? Math.round((noted / total) * 100) : 0;
  return { total, noted, revised, pct };
}

function UnitRow({ unit, onNavigate }) {
  const [open, setOpen] = useState(false);
  const noted  = unit.topics.filter(t => t.status === "noted").length;
  const total  = unit.topics.length;
  const pct    = Math.round((noted / total) * 100);
  return (
    <div className={`opt-unit ${open ? "opt-unit-open" : ""}`}>
      <div className="opt-unit-header" onClick={() => setOpen(!open)}>
        <div className="opt-unit-mini-bar">
          <div className="opt-unit-mini-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="opt-unit-name">{unit.name}</span>
        <span className="opt-unit-meta">{noted}/{total}</span>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round"
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0, color: "var(--text-muted)" }}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
      {open && (
        <div className="opt-topic-list">
          {unit.topics.map(t => (
            <div key={t.id} className={`opt-topic-row ${t.status}`}>
              <span className={`opt-status-icon ${t.status}`}>
                {t.status === "noted" ? "✓" : "○"}
              </span>
              <span className="opt-topic-name">{t.name}</span>
              <div className="opt-topic-right">
                {t.revisions > 0 && (
                  <span className="gsp-topic-rev">{t.revisions}× revised</span>
                )}
                {t.status === "pending"
                  ? <button className="gsp-gen-btn" onClick={() => onNavigate && onNavigate("generator")}>+ Note</button>
                  : <button className="gsp-view-btn" onClick={() => onNavigate && onNavigate("notes")}>View</button>
                }
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PaperSection({ paperId, paper, color, onNavigate }) {
  const stats = paperStats(paper);
  return (
    <div className="opt-paper-section">
      <div className="opt-paper-header">
        <div className="opt-paper-ring-wrap">
          <RingProgress pct={stats.pct} color={color} size={90} sw={8} />
          <div className="opt-paper-ring-center">
            <span className="opt-paper-pct" style={{ color }}>{stats.pct}%</span>
          </div>
        </div>
        <div className="opt-paper-info">
          <div className="opt-paper-title">{paper.label}</div>
          <div className="opt-paper-stats-row">
            <span className="opt-pstat"><strong style={{ color: "var(--green)" }}>{stats.noted}</strong> noted</span>
            <span className="opt-psep">·</span>
            <span className="opt-pstat"><strong>{stats.total - stats.noted}</strong> pending</span>
            <span className="opt-psep">·</span>
            <span className="opt-pstat"><strong style={{ color: "var(--amber)" }}>{stats.revised}</strong> revised</span>
          </div>
          <div className="opt-paper-bar">
            <div className="opt-paper-bar-fill" style={{ width: `${stats.pct}%`, background: color }} />
          </div>
        </div>
      </div>

      <div className="opt-units">
        {paper.units.map(u => (
          <UnitRow key={u.id} unit={u} onNavigate={onNavigate} />
        ))}
      </div>
    </div>
  );
}

export default function OptionalTracker({ onNavigate }) {
  const p1 = paperStats(ANTHROPOLOGY_SYLLABUS.paper1);
  const p2 = paperStats(ANTHROPOLOGY_SYLLABUS.paper2);
  const overall = {
    total:   p1.total + p2.total,
    noted:   p1.noted + p2.noted,
    revised: p1.revised + p2.revised,
  };
  const overallPct = Math.round((overall.noted / overall.total) * 100);

  const PAPER1_COLOR = "#1E3A5F";
  const PAPER2_COLOR = "#0369A1";

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Optional Subject</p>
          <h1 className="page-title">Anthropology Syllabus Tracker</h1>
        </div>
        <button className="primary-btn" onClick={() => onNavigate && onNavigate("generator")}>
          + Generate Note
        </button>
      </div>

      {/* Overall stats */}
      <div className="opt-overall-card">
        <div className="opt-overall-ring-wrap">
          <RingProgress pct={overallPct} color={PAPER1_COLOR} size={120} sw={10} />
          <div className="opt-overall-center">
            <span className="gsp-overall-pct">{overallPct}%</span>
            <span className="gsp-overall-sub">covered</span>
          </div>
        </div>
        <div className="opt-overall-stats">
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
        <div className="opt-overall-pills">
          <div className="opt-paper-pill" style={{ background: "#EFF6FF", color: PAPER1_COLOR }}>
            Paper I: {p1.pct}%
          </div>
          <div className="opt-paper-pill" style={{ background: "#F0F9FF", color: PAPER2_COLOR }}>
            Paper II: {p2.pct}%
          </div>
        </div>
      </div>

      {/* Syllabus info box */}
      <div className="info-box" style={{ marginBottom: 24 }}>
        <div className="info-box-icon">📚</div>
        <div>
          <div className="info-box-title">Anthropology Optional — UPSC CSE</div>
          <div className="info-box-desc">
            Paper I covers Foundations, Biological Anthropology & Primatology, Fossil Hominids, and Socio-Cultural theory (250 marks). Paper II covers Indian Anthropology — prehistory, caste, tribes, language and applied anthropology (250 marks). Total: 500 marks.
          </div>
        </div>
      </div>

      {/* Paper sections side by side */}
      <div className="opt-papers-layout">
        <PaperSection
          paperId="paper1"
          paper={ANTHROPOLOGY_SYLLABUS.paper1}
          color={PAPER1_COLOR}
          onNavigate={onNavigate}
        />
        <PaperSection
          paperId="paper2"
          paper={ANTHROPOLOGY_SYLLABUS.paper2}
          color={PAPER2_COLOR}
          onNavigate={onNavigate}
        />
      </div>
    </div>
  );
}
