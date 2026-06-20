import React, { useState } from "react";
import { SAMPLE_PYQS, SAMPLE_NOTES, GS_TAGS } from "../lib/constants";

const PAPERS = [
  { id: "all", label: "All Papers" },
  { id: "gs1", label: "GS I" },
  { id: "gs2", label: "GS II" },
  { id: "gs3", label: "GS III" },
  { id: "gs4", label: "GS IV" },
  { id: "ess", label: "Essay" },
];

const YEARS = ["All Years", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015", "2014"];

export default function PYQMapper({ onNavigate }) {
  const [paper, setPaper]   = useState("all");
  const [year, setYear]     = useState("All Years");
  const [topic, setTopic]   = useState("Women Empowerment");
  const [expanded, setExpanded] = useState(null);

  const filtered = SAMPLE_PYQS.filter(q => {
    const matchPaper = paper === "all" || q.paper === paper;
    const matchYear  = year === "All Years" || q.year === Number(year);
    return matchPaper && matchYear;
  });

  const grouped = filtered.reduce((acc, q) => {
    acc[q.year] = acc[q.year] || [];
    acc[q.year].push(q);
    return acc;
  }, {});

  const sortedYears = Object.keys(grouped).sort((a, b) => b - a);

  const getGsTag = (paperId) => GS_TAGS.find(g => g.id === paperId);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">PYQ Mapper</p>
          <h1 className="page-title">Past Year Questions</h1>
        </div>
        <button className="primary-btn" onClick={() => onNavigate && onNavigate("answers")}>Answer Builder →</button>
      </div>

      {/* Topic selector */}
      <div className="pyq-topic-bar">
        <div className="pyq-topic-label">Showing PYQs for:</div>
        <div className="pyq-topic-pills">
          {SAMPLE_NOTES.map(n => (
            <button
              key={n.id}
              className={`filter-pill ${topic === n.topic ? "active" : ""}`}
              onClick={() => setTopic(n.topic)}
            >
              {n.topic}
            </button>
          ))}
        </div>
      </div>

      {/* Filter bar */}
      <div className="pyq-filter-bar">
        <div className="pyq-filter-group">
          <label className="pyq-filter-label">GS Paper</label>
          <div className="pyq-filter-pills">
            {PAPERS.map(p => {
              const tag = GS_TAGS.find(g => g.id === p.id);
              return (
                <button
                  key={p.id}
                  className={`filter-pill ${paper === p.id ? "active" : ""}`}
                  style={paper === p.id && tag ? { background: tag.bg, color: tag.color, borderColor: tag.color } : {}}
                  onClick={() => setPaper(p.id)}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="pyq-filter-group">
          <label className="pyq-filter-label">Year</label>
          <select className="gen-select pyq-year-select" value={year} onChange={e => setYear(e.target.value)}>
            {YEARS.map(y => <option key={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {/* Stats banner */}
      <div className="pyq-stats-bar">
        <div className="pyq-stat">
          <span className="pyq-stat-val">{filtered.length}</span>
          <span className="pyq-stat-label">Questions found</span>
        </div>
        <div className="pyq-stat-div" />
        <div className="pyq-stat">
          <span className="pyq-stat-val">{sortedYears.length}</span>
          <span className="pyq-stat-label">Years covered</span>
        </div>
        <div className="pyq-stat-div" />
        <div className="pyq-stat">
          <span className="pyq-stat-val">{filtered.reduce((s, q) => s + q.marks, 0)}</span>
          <span className="pyq-stat-label">Total marks</span>
        </div>
        <div className="pyq-stat-div" />
        <div className="pyq-stat">
          <span className="pyq-stat-val">{topic}</span>
          <span className="pyq-stat-label">Topic</span>
        </div>
      </div>

      {/* PYQ Groups */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎯</div>
          <div className="empty-title">No PYQs match this filter</div>
          <div className="empty-sub">Try changing the paper or year filter</div>
        </div>
      ) : (
        sortedYears.map(yr => (
          <div key={yr} className="pyq-year-group">
            <div className="pyq-year-header">
              <div className="pyq-year-badge">{yr}</div>
              <div className="pyq-year-count">{grouped[yr].length} question{grouped[yr].length > 1 ? "s" : ""}</div>
              <div className="pyq-year-line" />
            </div>
            <div className="pyq-list">
              {grouped[yr].map(q => {
                const tag = getGsTag(q.paper);
                const isOpen = expanded === q.id;
                return (
                  <div key={q.id} className={`pyq-item ${isOpen ? "pyq-item-open" : ""}`}>
                    <div className="pyq-item-header" onClick={() => setExpanded(isOpen ? null : q.id)}>
                      <div className="pyq-item-left">
                        {tag && (
                          <span className="gs-pill" style={{ background: tag.bg, color: tag.color }}>{tag.label}</span>
                        )}
                        <span className="pyq-marks-badge">{q.marks} marks</span>
                        <span className="pyq-item-year">{q.year}</span>
                      </div>
                      <div className="pyq-item-question">{q.question}</div>
                      <div className="pyq-item-toggle">
                        <svg
                          width="16" height="16" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
                        >
                          <path d="m6 9 6 6 6-6"/>
                        </svg>
                      </div>
                    </div>
                    {isOpen && (
                      <div className="pyq-item-body">
                        <div className="pyq-approach-label">Model Approach</div>
                        <div className="pyq-approach-text">{q.approach}</div>
                        <div className="pyq-item-actions">
                          <button className="viewer-action-btn" onClick={() => onNavigate && onNavigate("notes")}>
                            Open Related Note
                          </button>
                          <button
                            className="viewer-action-btn primary"
                            onClick={() => onNavigate && onNavigate("answers")}
                          >
                            ✦ Build Answer ({q.marks <= 10 ? "150" : "250"} words) →
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
