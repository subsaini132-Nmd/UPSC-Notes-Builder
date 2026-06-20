import React, { useState, useEffect, useRef, useCallback } from "react";
import { SAMPLE_PYQS, GS_TAGS, PRACTICE_HISTORY } from "../lib/constants";

const WORD_LIMITS = [
  { words: 150,  minutes: 10, label: "150 words — 10 min" },
  { words: 250,  minutes: 15, label: "250 words — 15 min" },
  { words: 500,  minutes: 30, label: "500 words — 30 min" },
  { words: 1000, minutes: 45, label: "1000 words — 45 min" },
];

const RUBRIC_CRITERIA = [
  { id: "intro",      label: "Introduction",  hint: "Did you define the topic or frame the question clearly?" },
  { id: "structure",  label: "Structure",     hint: "Well-organized with headings, flow, and logical progression?" },
  { id: "content",    label: "Content",       hint: "Relevant facts, schemes, data, judgements, and committees?" },
  { id: "examples",   label: "Examples",      hint: "Concrete case studies, states, global comparisons?" },
  { id: "conclusion", label: "Conclusion",    hint: "Forward-looking, decisive, and memorable close?" },
];

function wordCount(text) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function fmtTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function StarRating({ value, onChange }) {
  return (
    <div className="ap-stars">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          className={`ap-star ${n <= value ? "ap-star-on" : ""}`}
          onClick={() => onChange(n)}
        >
          ★
        </button>
      ))}
      <span className="ap-star-val">{value}/5</span>
    </div>
  );
}

export default function AnswerPractice({ onNavigate }) {
  const [phase,      setPhase]    = useState("setup");   // setup | writing | review | history
  const [pyqId,      setPyqId]    = useState(SAMPLE_PYQS[0].id);
  const [useCustom,  setCustom]   = useState(false);
  const [customQ,    setCustomQ]  = useState("");
  const [limitIdx,   setLimitIdx] = useState(1);
  const [answer,     setAnswer]   = useState("");
  const [timeLeft,   setTimeLeft] = useState(0);
  const [paused,     setPaused]   = useState(false);
  const [rubric,     setRubric]   = useState({ intro: 0, structure: 0, content: 0, examples: 0, conclusion: 0 });
  const [history,    setHistory]  = useState(PRACTICE_HISTORY);
  const [startTime,  setStartTime]= useState(null);
  const textareaRef = useRef(null);

  const limit    = WORD_LIMITS[limitIdx];
  const totalSec = limit.minutes * 60;
  const question = useCustom
    ? { question: customQ, paper: "gs2" }
    : SAMPLE_PYQS.find(q => q.id === pyqId) || SAMPLE_PYQS[0];
  const wc     = wordCount(answer);
  const wcPct  = Math.min(100, Math.round((wc / limit.words) * 100));
  const timePct= Math.round(((totalSec - timeLeft) / totalSec) * 100);

  useEffect(() => {
    if (phase !== "writing" || paused || timeLeft <= 0) return;
    const t = setInterval(() => setTimeLeft(s => {
      if (s <= 1) { clearInterval(t); setPhase("review"); return 0; }
      return s - 1;
    }), 1000);
    return () => clearInterval(t);
  }, [phase, paused, timeLeft]);

  useEffect(() => {
    if (phase === "writing" && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [phase, answer]);

  const startPractice = () => {
    setAnswer(""); setTimeLeft(totalSec); setPaused(false);
    setRubric({ intro: 0, structure: 0, content: 0, examples: 0, conclusion: 0 });
    setStartTime(Date.now());
    setPhase("writing");
  };

  const submit = useCallback(() => {
    setPhase("review");
  }, []);

  const rubricTotal = Object.values(rubric).reduce((s, v) => s + v, 0);
  const rubricPct   = Math.round((rubricTotal / 25) * 100);
  const rubricGrade = rubricPct >= 80 ? "A" : rubricPct >= 64 ? "B" : rubricPct >= 48 ? "C" : rubricPct >= 32 ? "D" : "F";
  const GRADE_COLORS = { A: "var(--green)", B: "#0369A1", C: "var(--amber)", D: "var(--red)", F: "var(--red)" };

  const saveAndReset = () => {
    const timeTaken = startTime ? Math.round((Date.now() - startTime) / 60000) : limit.minutes;
    setHistory(prev => [{
      id: `ph-${Date.now()}`,
      date: "2026-06-20",
      questionId: useCustom ? "custom" : pyqId,
      questionText: question.question.slice(0, 80) + "…",
      wordLimit: limit.words,
      wordsWritten: wc,
      timeTaken,
      rubric: { ...rubric },
      total: rubricTotal,
    }, ...prev]);
    setPhase("history");
  };

  const gsTag = (paperId) => GS_TAGS.find(g => g.id === paperId);

  // ── SETUP ──
  if (phase === "setup") return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Answer Practice</p>
          <h1 className="page-title">Timed Answer Writing</h1>
        </div>
        <button className="viewer-action-btn" onClick={() => setPhase("history")}>
          View History ({history.length})
        </button>
      </div>

      <div className="ap-setup-layout">
        <div className="ap-setup-left">
          <div className="ap-setup-section-title">Select Question</div>
          <div className="ap-custom-row">
            <label className="quiz-toggle-label">
              <input type="checkbox" checked={useCustom} onChange={e => setCustom(e.target.checked)} className="quiz-toggle-input" />
              <span className="quiz-toggle-track"><span className="quiz-toggle-thumb" /></span>
              Use custom question
            </label>
          </div>

          {useCustom ? (
            <textarea
              className="ap-custom-q-input"
              placeholder="Paste your question here…"
              value={customQ}
              onChange={e => setCustomQ(e.target.value)}
              rows={4}
            />
          ) : (
            <div className="ap-pyq-list">
              {SAMPLE_PYQS.slice(0, 8).map(q => {
                const tag = gsTag(q.paper);
                return (
                  <div
                    key={q.id}
                    className={`ap-pyq-item ${pyqId === q.id ? "ap-pyq-selected" : ""}`}
                    onClick={() => setPyqId(q.id)}
                  >
                    <div className="ap-pyq-meta">
                      {tag && <span className="gs-pill" style={{ background: tag.bg, color: tag.color }}>{tag.label}</span>}
                      <span className="ap-pyq-year">{q.year} · {q.marks}m</span>
                    </div>
                    <div className="ap-pyq-q">{q.question}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="ap-setup-right">
          <div className="ap-setup-section-title">Word Limit & Time</div>
          <div className="ap-wl-grid">
            {WORD_LIMITS.map((wl, i) => (
              <button
                key={i}
                className={`ap-wl-card ${limitIdx === i ? "ap-wl-selected" : ""}`}
                onClick={() => setLimitIdx(i)}
              >
                <div className="ap-wl-words">{wl.words}</div>
                <div className="ap-wl-label">words</div>
                <div className="ap-wl-time">{wl.minutes} min</div>
              </button>
            ))}
          </div>

          <div className="ap-selected-q-preview">
            <div className="ap-setup-section-title" style={{ marginBottom: 8 }}>Selected Question</div>
            <div className="ap-preview-q">
              {useCustom ? (customQ || "Enter a custom question above") : question.question}
            </div>
          </div>

          <div className="ap-tips">
            <div className="ap-tips-title">Writing Tips</div>
            <ul className="essay-tip-list">
              <li>Open with a hook, definition, or quote</li>
              <li>Use 3 dimensions: social, economic, political</li>
              <li>Include data, schemes, and case studies</li>
              <li>Write a strong, forward-looking conclusion</li>
            </ul>
          </div>

          <button
            className="primary-btn large ap-start-btn"
            onClick={startPractice}
            disabled={useCustom && !customQ.trim()}
          >
            ▶ Start Practice ({limit.minutes} min timer)
          </button>
        </div>
      </div>
    </div>
  );

  // ── WRITING ──
  if (phase === "writing") {
    const urgent = timeLeft < 120;
    return (
      <div className="page ap-writing-page">
        <div className="ap-writing-topbar">
          <button className="viewer-back-btn" onClick={() => { if (window.confirm("Abandon this attempt?")) setPhase("setup"); }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m15 18-6-6 6-6"/></svg>
            Exit
          </button>

          <div className="ap-timer-wrap" style={{ color: urgent ? "var(--red)" : "var(--text-primary)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
            </svg>
            <span className="ap-timer-num" style={{ color: urgent ? "var(--red)" : undefined }}>
              {fmtTime(timeLeft)}
            </span>
          </div>

          <div className="ap-wc-chip">
            <span style={{ color: wcPct >= 90 ? "var(--green)" : "var(--text-secondary)" }}>{wc}</span>
            <span className="ap-wc-sep">/ {limit.words} words</span>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button className="viewer-action-btn" onClick={() => setPaused(!paused)}>
              {paused ? "▶ Resume" : "⏸ Pause"}
            </button>
            <button className="primary-btn" onClick={submit}>Submit →</button>
          </div>
        </div>

        <div className="ap-time-bar">
          <div className="ap-time-fill" style={{
            width: `${timePct}%`,
            background: urgent ? "var(--red)" : "var(--accent)"
          }} />
        </div>

        <div className="ap-writing-layout">
          <div className="ap-question-panel">
            <div className="ap-q-label">Question</div>
            <div className="ap-q-text">{question.question}</div>
            {question.approach && (
              <details className="ap-q-approach">
                <summary className="ap-q-approach-toggle">Approach hints (reveal after writing)</summary>
                <div className="ap-q-approach-body">{question.approach}</div>
              </details>
            )}
            <div className="ap-q-wl-note">Target: {limit.words} words in {limit.minutes} min</div>
          </div>

          <div className="ap-answer-panel">
            <div className="ap-wc-progress">
              <div className="ap-wc-bar">
                <div
                  className="ap-wc-fill"
                  style={{
                    width: `${wcPct}%`,
                    background: wcPct >= 100 ? "var(--red)" : wcPct >= 80 ? "var(--green)" : "var(--accent)"
                  }}
                />
              </div>
              <span className="ap-wc-pct">{wcPct}%</span>
            </div>
            <textarea
              ref={textareaRef}
              className="ap-answer-textarea"
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              placeholder="Start writing your answer here…"
              disabled={paused}
            />
          </div>
        </div>

        {paused && (
          <div className="ap-pause-overlay">
            <div className="ap-pause-card">
              <div style={{ fontSize: 40 }}>⏸</div>
              <div className="ap-pause-title">Paused</div>
              <button className="primary-btn" onClick={() => setPaused(false)}>▶ Resume</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── REVIEW ──
  if (phase === "review") {
    return (
      <div className="page">
        <div className="page-header">
          <div>
            <p className="page-eyebrow">Answer Practice</p>
            <h1 className="page-title">Self-Evaluation</h1>
          </div>
          <div className="ap-grade-badge" style={{ color: GRADE_COLORS[rubricGrade] }}>
            {rubricGrade !== "F" ? rubricGrade : "Incomplete"}
          </div>
        </div>

        <div className="ap-review-layout">
          <div className="ap-review-left">
            <div className="ap-panel-label">Your Answer ({wc} words)</div>
            <div className="ap-answer-review">{answer || <em style={{ color: "var(--text-muted)" }}>No answer written.</em>}</div>
          </div>

          <div className="ap-review-right">
            <div className="ap-panel-label">Self-Evaluation Rubric</div>
            <div className="ap-rubric-list">
              {RUBRIC_CRITERIA.map(c => (
                <div key={c.id} className="ap-rubric-row">
                  <div className="ap-rubric-header">
                    <span className="ap-rubric-label">{c.label}</span>
                    <StarRating value={rubric[c.id]} onChange={v => setRubric(prev => ({ ...prev, [c.id]: v }))} />
                  </div>
                  <div className="ap-rubric-hint">{c.hint}</div>
                </div>
              ))}
            </div>

            <div className="ap-score-box">
              <div className="ap-score-row">
                <span className="ap-score-label">Total Score</span>
                <span className="ap-score-val">{rubricTotal} / 25</span>
              </div>
              <div className="ap-score-row">
                <span className="ap-score-label">Grade</span>
                <span className="ap-score-grade" style={{ color: GRADE_COLORS[rubricGrade] }}>
                  {rubricGrade}
                </span>
              </div>
              <div className="ap-rubric-bar">
                <div className="ap-rubric-fill" style={{
                  width: `${rubricPct}%`,
                  background: GRADE_COLORS[rubricGrade]
                }} />
              </div>
              <div className="ap-rubric-pct">{rubricPct}% score</div>
            </div>

            <div className="ap-review-actions">
              <button className="primary-btn" onClick={saveAndReset} disabled={rubricTotal === 0}>
                Save & Finish
              </button>
              <button className="viewer-action-btn" onClick={() => setPhase("writing")}>
                ← Edit Answer
              </button>
              <button className="viewer-action-btn" onClick={() => setPhase("setup")}>
                New Practice
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── HISTORY ──
  const avgScore = history.length
    ? Math.round(history.reduce((s, h) => s + (h.total || 0), 0) / history.length)
    : 0;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Answer Practice</p>
          <h1 className="page-title">Practice History</h1>
        </div>
        <button className="primary-btn" onClick={() => setPhase("setup")}>+ New Practice</button>
      </div>

      <div className="ap-history-stats">
        <div className="ap-hstat"><span className="ap-hstat-val">{history.length}</span><span className="ap-hstat-label">attempts</span></div>
        <div className="ap-hstat"><span className="ap-hstat-val">{avgScore}/25</span><span className="ap-hstat-label">avg score</span></div>
        <div className="ap-hstat"><span className="ap-hstat-val">{history.reduce((s, h) => s + (h.wordsWritten || 0), 0).toLocaleString()}</span><span className="ap-hstat-label">words written</span></div>
        <div className="ap-hstat"><span className="ap-hstat-val">{history.reduce((s, h) => s + (h.timeTaken || 0), 0)} min</span><span className="ap-hstat-label">time practiced</span></div>
      </div>

      {history.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">✍️</div>
          <div className="empty-title">No practice sessions yet</div>
          <div className="empty-sub">Start your first timed answer writing session</div>
          <button className="primary-btn" onClick={() => setPhase("setup")}>Start Practice</button>
        </div>
      ) : (
        <div className="ap-history-list">
          {history.map(h => {
            const total     = h.total || 0;
            const pct       = Math.round((total / 25) * 100);
            const grade     = pct >= 80 ? "A" : pct >= 64 ? "B" : pct >= 48 ? "C" : pct >= 32 ? "D" : "F";
            const pyq       = SAMPLE_PYQS.find(q => q.id === h.questionId);
            const qText     = h.questionText || pyq?.question || "Custom question";
            return (
              <div key={h.id} className="ap-history-card">
                <div className="ap-history-header">
                  <span className="ap-history-date">{h.date}</span>
                  <span className="ap-history-wl">{h.wordLimit}-word limit</span>
                  <span className="ap-history-grade" style={{ color: GRADE_COLORS[grade] }}>{grade}</span>
                  <span className="ap-history-score">{total}/25</span>
                </div>
                <div className="ap-history-q">{qText}</div>
                <div className="ap-history-meta">
                  {h.wordsWritten} words written · {h.timeTaken} min taken
                </div>
                <div className="ap-history-rubric-row">
                  {RUBRIC_CRITERIA.map(c => (
                    <div key={c.id} className="ap-history-rubric-item">
                      <span className="ap-history-rubric-label">{c.label.slice(0, 4)}</span>
                      <span className="ap-history-rubric-val">{h.rubric?.[c.id] ?? "—"}/5</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
