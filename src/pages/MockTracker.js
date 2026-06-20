import React, { useState } from "react";
import { MOCK_TESTS, GS_TAGS } from "../lib/constants";

const MAX_PER_PAPER = 250;
const MAX_TOTAL     = 1250;
const PAPERS        = ["gs1", "gs2", "gs3", "gs4", "essay"];
const PAPER_LABELS  = { gs1: "GS I", gs2: "GS II", gs3: "GS III", gs4: "GS IV", essay: "Essay" };
const PAPER_COLORS  = {
  gs1:   "#7C3AED",
  gs2:   "#0369A1",
  gs3:   "#047857",
  gs4:   "#B45309",
  essay: "#9D174D",
};

function total(scores) {
  return Object.values(scores).reduce((s, v) => s + (Number(v) || 0), 0);
}
function pct(scores) {
  return Math.round((total(scores) / MAX_TOTAL) * 100);
}

function TrendChart({ tests }) {
  if (tests.length < 2) return null;
  const W = 560, H = 160, PAD = { top: 16, right: 20, bottom: 36, left: 44 };
  const iW = W - PAD.left - PAD.right;
  const iH = H - PAD.top - PAD.bottom;

  const minPct = 40, maxPct = 100;
  const xs = tests.map((_, i) => PAD.left + (i / (tests.length - 1)) * iW);
  const ys = tests.map(t => PAD.top + iH - ((pct(t.scores) - minPct) / (maxPct - minPct)) * iH);
  const polyline = xs.map((x, i) => `${x},${ys[i]}`).join(" ");

  const yTicks = [40, 50, 60, 70, 80];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mock-chart-svg">
      {/* Grid lines */}
      {yTicks.map(tick => {
        const y = PAD.top + iH - ((tick - minPct) / (maxPct - minPct)) * iH;
        return (
          <g key={tick}>
            <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} stroke="var(--border)" strokeWidth="1" />
            <text x={PAD.left - 6} y={y + 4} textAnchor="end" fontSize="10" fill="var(--text-muted)">{tick}%</text>
          </g>
        );
      })}

      {/* Gradient fill under line */}
      <defs>
        <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon
        points={`${xs[0]},${PAD.top + iH} ${polyline} ${xs[xs.length - 1]},${PAD.top + iH}`}
        fill="url(#trendGrad)"
      />

      {/* Trend line */}
      <polyline points={polyline} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Data points */}
      {tests.map((t, i) => (
        <g key={t.id}>
          <circle cx={xs[i]} cy={ys[i]} r="5" fill="var(--accent)" stroke="white" strokeWidth="2" />
          <text x={xs[i]} y={ys[i] - 10} textAnchor="middle" fontSize="10" fontWeight="700" fill="var(--accent-dark)">
            {pct(t.scores)}%
          </text>
        </g>
      ))}

      {/* X axis labels */}
      {tests.map((t, i) => (
        <text key={t.id} x={xs[i]} y={H - 4} textAnchor="middle" fontSize="9" fill="var(--text-muted)">
          {t.series.split(" ").slice(-2).join(" ")}
        </text>
      ))}
    </svg>
  );
}

function PaperBars({ scores }) {
  return (
    <div className="mock-paper-bars">
      {PAPERS.map(p => {
        const s   = scores[p] || 0;
        const pct = Math.round((s / MAX_PER_PAPER) * 100);
        return (
          <div key={p} className="mock-paper-bar-row">
            <span className="mock-paper-label" style={{ color: PAPER_COLORS[p] }}>{PAPER_LABELS[p]}</span>
            <div className="mock-paper-bar">
              <div className="mock-paper-fill" style={{ width: `${pct}%`, background: PAPER_COLORS[p] }} />
            </div>
            <span className="mock-paper-score">{s}/250</span>
          </div>
        );
      })}
    </div>
  );
}

const emptyScores = () => ({ gs1: "", gs2: "", gs3: "", gs4: "", essay: "" });

export default function MockTracker({ onNavigate }) {
  const [tests,     setTests]    = useState(MOCK_TESTS);
  const [showForm,  setShowForm] = useState(false);
  const [form,      setForm]     = useState({ date: "2026-06-20", series: "", ...emptyScores() });
  const [expanded,  setExpanded] = useState(null);

  const addTest = () => {
    const scores = {};
    PAPERS.forEach(p => { scores[p] = Number(form[p]) || 0; });
    setTests(prev => [{
      id: `mt-${Date.now()}`,
      date:   form.date,
      series: form.series || "My Test",
      scores,
    }, ...prev]);
    setForm({ date: "2026-06-21", series: "", ...emptyScores() });
    setShowForm(false);
  };

  const sorted   = [...tests].sort((a, b) => new Date(a.date) - new Date(b.date));
  const latest   = sorted[sorted.length - 1];
  const first    = sorted[0];
  const avgTotal = Math.round(sorted.reduce((s, t) => s + total(t.scores), 0) / sorted.length);
  const improvement = latest && first ? total(latest.scores) - total(first.scores) : 0;

  const weakPaper = () => {
    const avgs = PAPERS.map(p => ({
      p,
      avg: sorted.reduce((s, t) => s + (t.scores[p] || 0), 0) / sorted.length,
    }));
    return avgs.sort((a, b) => a.avg - b.avg)[0];
  };
  const weak = weakPaper();

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Mock Tracker</p>
          <h1 className="page-title">Test Series Score Tracker</h1>
        </div>
        <button className="primary-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? "✕ Cancel" : "+ Log Test"}
        </button>
      </div>

      {/* Add test form */}
      {showForm && (
        <div className="mock-form-card">
          <div className="mock-form-title">Log a Mock Test</div>
          <div className="mock-form-row">
            <div className="mock-form-field">
              <label className="gen-field-label">Date</label>
              <input type="date" className="gen-input" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
            <div className="mock-form-field" style={{ flex: 2 }}>
              <label className="gen-field-label">Test Series Name</label>
              <input className="gen-input" placeholder="e.g. Vision IAS Test 3" value={form.series} onChange={e => setForm(f => ({ ...f, series: e.target.value }))} />
            </div>
          </div>
          <div className="mock-form-scores">
            {PAPERS.map(p => (
              <div key={p} className="mock-form-score-field">
                <label className="gen-field-label" style={{ color: PAPER_COLORS[p] }}>{PAPER_LABELS[p]}</label>
                <input
                  type="number" min="0" max="250"
                  className="gen-input mock-score-input"
                  placeholder="0–250"
                  value={form[p]}
                  onChange={e => setForm(f => ({ ...f, [p]: e.target.value }))}
                />
              </div>
            ))}
          </div>
          <div className="mock-form-footer">
            <div className="mock-form-preview">
              Total: <strong>{PAPERS.reduce((s, p) => s + (Number(form[p]) || 0), 0)}</strong> / 1250
              ({Math.round((PAPERS.reduce((s, p) => s + (Number(form[p]) || 0), 0) / MAX_TOTAL) * 100)}%)
            </div>
            <button className="primary-btn" onClick={addTest}>Save Test</button>
          </div>
        </div>
      )}

      {/* Stats row */}
      <div className="mock-stats-row">
        <div className="mock-stat">
          <span className="mock-stat-val">{tests.length}</span>
          <span className="mock-stat-label">Tests taken</span>
        </div>
        <div className="mock-stat">
          <span className="mock-stat-val">{Math.round((avgTotal / MAX_TOTAL) * 100)}%</span>
          <span className="mock-stat-label">Avg score</span>
        </div>
        <div className="mock-stat">
          <span className="mock-stat-val">{latest ? pct(latest.scores) : 0}%</span>
          <span className="mock-stat-label">Latest</span>
        </div>
        <div className="mock-stat">
          <span className="mock-stat-val" style={{ color: improvement >= 0 ? "var(--green)" : "var(--red)" }}>
            {improvement >= 0 ? "+" : ""}{improvement}m
          </span>
          <span className="mock-stat-label">Total improvement</span>
        </div>
        <div className="mock-stat">
          <span className="mock-stat-val" style={{ color: PAPER_COLORS[weak?.p] }}>
            {PAPER_LABELS[weak?.p]}
          </span>
          <span className="mock-stat-label">Weak paper</span>
        </div>
      </div>

      {/* SVG trend chart */}
      {sorted.length >= 2 && (
        <div className="mock-chart-card">
          <div className="mock-chart-title">Score Trend (% of 1250)</div>
          <TrendChart tests={sorted} />
        </div>
      )}

      {/* Test list */}
      <div className="section-header">
        <div className="section-title">All Tests</div>
        <span className="section-count">{tests.length} tests logged</span>
      </div>

      <div className="mock-test-list">
        {[...tests].sort((a, b) => new Date(b.date) - new Date(a.date)).map(t => {
          const tot  = total(t.scores);
          const p    = pct(t.scores);
          const isEx = expanded === t.id;
          return (
            <div key={t.id} className={`mock-test-card ${isEx ? "mock-test-open" : ""}`}>
              <div className="mock-test-header" onClick={() => setExpanded(isEx ? null : t.id)}>
                <div className="mock-test-left">
                  <div className="mock-test-series">{t.series}</div>
                  <div className="mock-test-date">{t.date}</div>
                </div>
                <div className="mock-test-score-wrap">
                  <div className="mock-test-pct" style={{ color: p >= 65 ? "var(--green)" : p >= 50 ? "var(--amber)" : "var(--red)" }}>
                    {p}%
                  </div>
                  <div className="mock-test-total">{tot}/1250</div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round"
                  style={{ transform: isEx ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0, color: "var(--text-muted)" }}>
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
              {isEx && (
                <div className="mock-test-body">
                  <PaperBars scores={t.scores} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
