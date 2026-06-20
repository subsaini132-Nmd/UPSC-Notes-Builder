import React, { useState, useRef, useEffect } from "react";
import { ESSAY_TOPICS, ESSAY_CATEGORIES, ESSAY_STRUCTURE, ESSAY_SAMPLES, GS_TAGS } from "../lib/constants";

function wordCount(text) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function WordBar({ count, target }) {
  const pct = Math.min(100, Math.round((count / target) * 100));
  const color = pct < 50 ? "var(--red)" : pct < 85 ? "var(--amber)" : "var(--green)";
  return (
    <div className="essay-word-bar-wrap">
      <div className="essay-word-bar">
        <div className="essay-word-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="essay-word-count" style={{ color }}>
        {count} / {target} words
      </span>
    </div>
  );
}

function AutoTextarea({ value, onChange, placeholder, className }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = ref.current.scrollHeight + "px";
    }
  }, [value]);
  return (
    <textarea
      ref={ref}
      className={className}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={3}
    />
  );
}

export default function EssayBuilder({ onNavigate }) {
  const [category, setCategory] = useState("All");
  const [selectedTopic, setTopic] = useState(ESSAY_TOPICS[0]);
  const [customTopic, setCustom]  = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [content, setContent]     = useState({});
  const [loadedSample, setLoaded] = useState(false);
  const [previewOpen, setPreview] = useState(false);
  const [expandedSec, setExpSec]  = useState("hook");

  const essayTag = GS_TAGS.find(g => g.id === "ess");

  const filtered = category === "All"
    ? ESSAY_TOPICS
    : ESSAY_TOPICS.filter(t => t.category === category);

  const totalWords = ESSAY_STRUCTURE.reduce((s, sec) => s + wordCount(content[sec.id] || ""), 0);
  const totalTarget = ESSAY_STRUCTURE.reduce((s, sec) => s + sec.wordTarget, 0);
  const totalPct = Math.round((totalWords / totalTarget) * 100);

  const hasSample = !useCustom && selectedTopic && ESSAY_SAMPLES[selectedTopic.id];

  const loadSample = () => {
    if (hasSample) {
      setContent(ESSAY_SAMPLES[selectedTopic.id]);
      setLoaded(true);
    }
  };

  const clearAll = () => { setContent({}); setLoaded(false); };

  const fullEssayText = ESSAY_STRUCTURE
    .map(s => content[s.id] || "")
    .filter(Boolean)
    .join("\n\n");

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Essay Builder</p>
          <h1 className="page-title">Structure & Write Essays</h1>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span className="essay-word-total">
            {totalWords} / {totalTarget} words ({totalPct}%)
          </span>
          {totalWords > 0 && (
            <button className="viewer-action-btn" onClick={() => setPreview(true)}>
              Full Preview
            </button>
          )}
        </div>
      </div>

      <div className="essay-layout">
        {/* ── LEFT: Topic selector ── */}
        <div className="essay-left">
          <div className="essay-panel-title">Choose Topic</div>

          <div className="essay-custom-toggle-row">
            <label className="quiz-toggle-label" style={{ fontSize: 13 }}>
              <input type="checkbox" checked={useCustom} onChange={e => setUseCustom(e.target.checked)} className="quiz-toggle-input" />
              <span className="quiz-toggle-track"><span className="quiz-toggle-thumb" /></span>
              Custom topic
            </label>
          </div>

          {useCustom ? (
            <div className="essay-custom-input-wrap">
              <input
                className="search-big-input"
                placeholder="Type your essay topic…"
                value={customTopic}
                onChange={e => setCustom(e.target.value)}
              />
            </div>
          ) : (
            <>
              <div className="essay-cat-pills">
                {ESSAY_CATEGORIES.map(c => (
                  <button
                    key={c}
                    className={`filter-pill ${category === c ? "active" : ""}`}
                    onClick={() => setCategory(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <div className="essay-topic-list">
                {filtered.map(t => (
                  <div
                    key={t.id}
                    className={`essay-topic-item ${selectedTopic?.id === t.id ? "essay-topic-selected" : ""}`}
                    onClick={() => { setTopic(t); setContent({}); setLoaded(false); }}
                  >
                    <div className="essay-topic-cat">{t.category}{t.year ? ` · ${t.year}` : ""}</div>
                    <div className="essay-topic-title">{t.title}</div>
                    <div className="essay-topic-diff">
                      <span className={`essay-diff-badge ${t.difficulty}`}>{t.difficulty}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {hasSample && (
            <button className="primary-btn essay-sample-btn" onClick={loadSample} disabled={loadedSample}>
              {loadedSample ? "✓ Sample loaded" : "Load sample essay"}
            </button>
          )}
          {loadedSample && (
            <button className="viewer-action-btn" onClick={clearAll} style={{ width: "100%", marginTop: 8, justifyContent: "center" }}>
              Clear all
            </button>
          )}

          <div className="essay-tip-box">
            <div className="essay-tip-title">UPSC Essay Tips</div>
            <ul className="essay-tip-list">
              <li>Target 1000–1200 words</li>
              <li>3 dimensions: social, political, way forward</li>
              <li>2 quotes minimum (opening + closing)</li>
              <li>Use concrete data and examples</li>
              <li>Acknowledge counter-views</li>
            </ul>
          </div>
        </div>

        {/* ── RIGHT: Structure sections ── */}
        <div className="essay-right">
          <div className="essay-selected-topic">
            <span className="gs-pill" style={{ background: essayTag?.bg, color: essayTag?.color }}>Essay</span>
            <span className="essay-sel-text">
              {useCustom ? (customTopic || "Enter a topic…") : selectedTopic?.title}
            </span>
          </div>

          {/* Overall word bar */}
          <div className="essay-overall-bar">
            <div className="essay-prog-bar">
              <div
                className="essay-prog-fill"
                style={{
                  width: `${totalPct}%`,
                  background: totalPct < 50 ? "var(--red)" : totalPct < 85 ? "var(--amber)" : "var(--green)"
                }}
              />
            </div>
            <span className="essay-prog-label">{totalWords} words written</span>
          </div>

          <div className="essay-sections">
            {ESSAY_STRUCTURE.map(sec => {
              const text   = content[sec.id] || "";
              const wc     = wordCount(text);
              const isOpen = expandedSec === sec.id;
              return (
                <div key={sec.id} className={`essay-sec-card ${isOpen ? "essay-sec-open" : ""} ${wc > 0 ? "essay-sec-has-content" : ""}`}>
                  <div className="essay-sec-header" onClick={() => setExpSec(isOpen ? null : sec.id)}>
                    <span className="essay-sec-icon">{sec.icon}</span>
                    <div className="essay-sec-title-wrap">
                      <span className="essay-sec-title">{sec.label}</span>
                      <span className="essay-sec-target">~{sec.wordTarget} words</span>
                    </div>
                    {wc > 0 && (
                      <span className="essay-sec-wc-chip">{wc}w</span>
                    )}
                    <svg
                      width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth="2" strokeLinecap="round"
                      style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0, color: "var(--text-muted)" }}
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </div>

                  {isOpen && (
                    <div className="essay-sec-body">
                      <div className="essay-sec-hint">{sec.hint}</div>
                      <AutoTextarea
                        value={text}
                        onChange={val => setContent(prev => ({ ...prev, [sec.id]: val }))}
                        placeholder={`Write your ${sec.label.toLowerCase()}…`}
                        className="essay-textarea"
                      />
                      <WordBar count={wc} target={sec.wordTarget} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Full Preview Modal ── */}
      {previewOpen && (
        <div className="modal-overlay" onClick={() => setPreview(false)}>
          <div className="essay-preview-modal" onClick={e => e.stopPropagation()}>
            <div className="essay-preview-header">
              <h2 className="essay-preview-title">
                {useCustom ? customTopic : selectedTopic?.title}
              </h2>
              <div className="essay-preview-meta">{totalWords} words</div>
              <button className="modal-close-btn" onClick={() => setPreview(false)}>✕</button>
            </div>
            <div className="essay-preview-body">
              {ESSAY_STRUCTURE.map(sec => {
                const text = content[sec.id];
                if (!text) return null;
                return (
                  <div key={sec.id} className="essay-preview-section">
                    <div className="essay-preview-sec-label">{sec.icon} {sec.label}</div>
                    <p className="essay-preview-para">{text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
