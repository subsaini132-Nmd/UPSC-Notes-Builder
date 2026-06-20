import React, { useState, useCallback } from "react";
import { GS_TAGS, ANSWER_FRAMEWORKS } from "../lib/constants";

const HIST_KEY = "upsc_eval_history";
const WORD_LIMITS = [150, 250, 500, 1000];

function loadHistory() {
  try { return JSON.parse(localStorage.getItem(HIST_KEY) || "[]"); } catch { return []; }
}
function saveHistory(h) {
  localStorage.setItem(HIST_KEY, JSON.stringify(h.slice(0, 20)));
}

/* ── Core evaluation engine ── */
function evaluateAnswer(answer, wordLimit, gs) {
  const words = answer.trim().split(/\s+/).filter(Boolean);
  const wc    = words.length;
  const lower = answer.toLowerCase();

  /* 1. Word Count (20 pts) */
  const ratio = wc / wordLimit;
  const wcScore = ratio >= 0.85 && ratio <= 1.2  ? 20
                : ratio >= 0.70 && ratio <= 1.35  ? 14
                : ratio >= 0.50                   ? 8 : 3;
  const wcTip = ratio < 0.70  ? `Too short (${wc}/${wordLimit}). Aim for ≥85% of the word limit.`
              : ratio > 1.35  ? `Too long (${wc}/${wordLimit}). Practice concision.`
              : "Good length.";

  /* 2. Structure (25 pts) */
  const hasIntro  = /\b(introduction|in this (answer|context)|firstly|to begin|the term|refers to|is defined as|means)\b/.test(lower);
  const hasConc   = /\b(conclusion|to conclude|in conclusion|thus|therefore|way forward|hence|in sum|summing up)\b/.test(lower);
  const hasWF     = /\b(way forward|suggest|recommend|need to|should be|must be|going forward|steps (to|for))\b/.test(lower);
  const paraCount = (answer.match(/\n\n+/g) || []).length;
  const hasBody   = paraCount >= 2 || words.length > 100;
  let stScore = 0;
  if (hasIntro) stScore += 8;
  if (hasBody)  stScore += 5;
  if (hasConc)  stScore += 7;
  if (hasWF)    stScore += 5;
  const stTips = [!hasIntro && "Add a clear introduction with definition/context", !hasWF && "Include 'Way Forward' recommendations", !hasConc && "Add a proper conclusion"].filter(Boolean);

  /* 3. UPSC Keywords (20 pts) */
  const upscKw = ["critically","analyze","analyse","examine","evaluate","discuss","significance",
    "challenges","impact","constitutional","governance","sustainable","inclusive","multidimensional",
    "socio-economic","accountability","transparency","reforms","implementation","mechanism"];
  const found = upscKw.filter(k => lower.includes(k));
  const kwScore = Math.min(20, found.length * 2 + (found.length > 5 ? 4 : 0));
  const kwTip = found.length < 3
    ? `Use more analytical words: ${upscKw.filter(k => !found.includes(k)).slice(0,4).join(", ")}…`
    : `Good vocabulary. Keywords found: ${found.slice(0,5).join(", ")}`;

  /* 4. Data & Evidence (20 pts) */
  const hasStat   = /\d+(\.\d+)?(\s*%|\s*(crore|lakh|million|billion|thousand))/.test(answer);
  const hasYear   = /\b(19|20)\d{2}\b/.test(answer);
  const hasScheme = /\b(PM |Pradhan Mantri|Mission|Scheme|Act|Article|Policy|Committee|Report|Commission)\b/.test(answer);
  const hasQuote  = /[""“”]/.test(answer) || /\s—\s/.test(answer);
  const hasCaseSt = /\b(for example|for instance|case of|such as|viz\.|e\.g\.)\b/i.test(answer);
  let evScore = 0;
  if (hasStat)   evScore += 5;
  if (hasYear)   evScore += 3;
  if (hasScheme) evScore += 6;
  if (hasQuote)  evScore += 3;
  if (hasCaseSt) evScore += 3;
  const evTips = [!hasStat && "Add statistics (%, crore, etc.)", !hasScheme && "Cite a scheme/act/policy/committee", !hasQuote && "Include a quote or expert view"].filter(Boolean);

  /* 5. Multi-dimensional (15 pts) */
  const dims = {
    "Economic":       /\b(economic|gdp|trade|market|fiscal|revenue|growth|poverty|income)\b/.test(lower),
    "Social":         /\b(social|community|society|women|gender|tribal|marginali[sz]ed|caste)\b/.test(lower),
    "Political":      /\b(political|parliament|government|policy|democracy|election|federali[sz]m)\b/.test(lower),
    "Environmental":  /\b(environment|climate|carbon|ecology|forest|pollution|sustainab)\b/.test(lower),
    "Constitutional": /\b(constitution|article|fundamental|directive|right|judiciary|supreme court)\b/.test(lower),
    "Historical":     /\b(histor|colonial|independence|partition|ancient|medieval|modern)\b/.test(lower),
    "Ethical":        /\b(ethic|moral|integrity|probity|value|character|virtue|accountability)\b/.test(lower),
    "International":  /\b(international|global|world|un |sdg|foreign|bilateral|multilateral)\b/.test(lower),
  };
  const coveredDims = Object.entries(dims).filter(([, v]) => v).map(([k]) => k);
  const dimScore = Math.min(15, coveredDims.length * 2 + (coveredDims.length >= 4 ? 3 : 0));
  const missingDims = Object.entries(dims).filter(([, v]) => !v).map(([k]) => k).slice(0, 3);

  const totalScore = wcScore + stScore + kwScore + evScore + dimScore;
  const grade = totalScore >= 85 ? "A+" : totalScore >= 70 ? "A" : totalScore >= 55 ? "B+" : totalScore >= 40 ? "B" : "C";

  const missing = [
    ...stTips,
    ...(evTips.length ? evTips : []),
    coveredDims.length < 3 && `Cover more dimensions: ${missingDims.join(", ")}`,
    wc < 20 && "Write a complete answer — this appears to be too short",
  ].filter(Boolean);

  return {
    totalScore,
    grade,
    wordCount: wc,
    wordLimit,
    breakdown: [
      { label: "Word Count",       score: wcScore, max: 20, tip: wcTip,        color: "#0369A1" },
      { label: "Structure",        score: stScore, max: 25, tip: stTips[0] || "Good structure", color: "#7C3AED" },
      { label: "UPSC Keywords",    score: kwScore, max: 20, tip: kwTip,        color: "#047857" },
      { label: "Data & Evidence",  score: evScore, max: 20, tip: evTips[0] || "Good use of evidence", color: "#B45309" },
      { label: "Multi-dimensional",score: dimScore,max: 15, tip: coveredDims.length < 3 ? `Missing: ${missingDims.join(", ")}` : `Covers: ${coveredDims.join(", ")}`, color: "#9D174D" },
    ],
    coveredDims,
    missing,
  };
}

function ScoreRing({ score, max = 100, size = 110, color = "#1E3A5F" }) {
  const r    = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const off  = circ * (1 - score / max);
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border)" strokeWidth="10"/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="10"
        strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.8s ease" }}/>
    </svg>
  );
}

export default function AnswerEvaluator({ onNavigate }) {
  const [question,  setQuestion]  = useState("");
  const [answer,    setAnswer]    = useState("");
  const [wordLimit, setWordLimit] = useState(250);
  const [gs,        setGs]        = useState("gs2");
  const [result,    setResult]    = useState(null);
  const [history,   setHistory]   = useState(loadHistory);
  const [activeTab, setTab]       = useState("write");   // write | result | history
  const [framework, setFramework] = useState(null);

  const wc = answer.trim() ? answer.trim().split(/\s+/).length : 0;

  const evaluate = useCallback(() => {
    if (!answer.trim() || answer.trim().split(/\s+/).length < 20) return;
    const res = evaluateAnswer(answer, wordLimit, gs);
    setResult({ ...res, question, answer, gs, wordLimit, ts: Date.now() });
    const updated = [{ ...res, question: question.slice(0,80), ts: Date.now(), grade: res.grade }, ...history];
    setHistory(updated);
    saveHistory(updated);
    setTab("result");
  }, [answer, wordLimit, gs, question, history]);

  const reset = () => { setQuestion(""); setAnswer(""); setResult(null); setTab("write"); setFramework(null); };

  const gradeColor = g => g === "A+" ? "#059669" : g === "A" ? "#0369A1" : g === "B+" ? "#7C3AED" : g === "B" ? "#B45309" : "#DC2626";

  return (
    <div className="page ev-page">
      <div className="ev-header">
        <div>
          <p className="page-eyebrow">Day 9</p>
          <h1 className="page-title">Answer Grader</h1>
          <p className="page-sub">Paste any UPSC answer for instant heuristic scoring across 5 dimensions</p>
        </div>
        <div className="ev-tabs">
          {[["write","Write & Evaluate"],["result","Results"],["history","History"]].map(([id,label]) => (
            <button key={id} className={`ev-tab ${activeTab === id ? "active" : ""}`}
              onClick={() => setTab(id)}>
              {label}
              {id === "history" && history.length > 0 && <span className="ev-tab-badge">{history.length}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* ── WRITE TAB ── */}
      {activeTab === "write" && (
        <div className="ev-write-layout">
          {/* Left: inputs */}
          <div className="ev-left">
            {/* Controls */}
            <div className="ev-controls">
              <div className="ev-control-row">
                <label className="ev-label">GS Paper</label>
                <div className="ev-pills">
                  {GS_TAGS.slice(0,5).map(g => (
                    <button key={g.id}
                      className={`ev-pill ${gs === g.id ? "active" : ""}`}
                      style={gs === g.id ? { background: g.color, borderColor: g.color, color: "#fff" } : {}}
                      onClick={() => setGs(g.id)}>
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="ev-control-row">
                <label className="ev-label">Word Limit</label>
                <div className="ev-pills">
                  {WORD_LIMITS.map(w => (
                    <button key={w}
                      className={`ev-pill ${wordLimit === w ? "active" : ""}`}
                      onClick={() => setWordLimit(w)}>
                      {w}
                    </button>
                  ))}
                </div>
              </div>
              <div className="ev-control-row">
                <label className="ev-label">Framework (optional)</label>
                <select className="ev-select" value={framework || ""} onChange={e => setFramework(e.target.value || null)}>
                  <option value="">None — free write</option>
                  {ANSWER_FRAMEWORKS.map(f => (
                    <option key={f.id} value={f.id}>{f.type}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Framework hint */}
            {framework && (() => {
              const f = ANSWER_FRAMEWORKS.find(x => x.id === framework);
              return f ? (
                <div className="ev-framework-hint">
                  <div className="ev-fhint-title" style={{ color: f.color }}>{f.type} Framework</div>
                  <div className="ev-fhint-parts">
                    {f.structure.map((s,i) => (
                      <div key={i} className="ev-fhint-part">
                        <span className="ev-fhint-icon">{s.icon}</span>
                        <span>{s.part} <em>({s.pct}%)</em></span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null;
            })()}

            {/* Question input */}
            <div className="ev-field">
              <label className="ev-label">Question <span className="ev-optional">(optional)</span></label>
              <input className="ev-question-input" placeholder="Paste the question here for context…"
                value={question} onChange={e => setQuestion(e.target.value)} />
            </div>
          </div>

          {/* Right: textarea */}
          <div className="ev-right">
            <div className="ev-answer-top">
              <label className="ev-label">Your Answer</label>
              <span className={`ev-wc-badge ${wc > wordLimit * 1.2 ? "over" : wc >= wordLimit * 0.85 ? "good" : ""}`}>
                {wc} / {wordLimit} words
              </span>
            </div>
            <textarea
              className="ev-textarea"
              placeholder="Write or paste your UPSC answer here…&#10;&#10;Tip: Include an intro, 2-3 body paragraphs, way forward, and conclusion."
              value={answer}
              onChange={e => setAnswer(e.target.value)}
            />
            <div className="ev-answer-bar">
              <div className="ev-wc-track">
                <div className="ev-wc-fill" style={{ width: `${Math.min(100, (wc/wordLimit)*100)}%`,
                  background: wc > wordLimit*1.2 ? "#DC2626" : wc >= wordLimit*0.85 ? "#059669" : "#B45309"}} />
              </div>
              <button className="ev-evaluate-btn" onClick={evaluate} disabled={wc < 20}>
                {wc < 20 ? "Write your answer first" : "Evaluate Answer →"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── RESULTS TAB ── */}
      {activeTab === "result" && result && (
        <div className="ev-result-layout">
          {/* Score overview */}
          <div className="ev-score-card">
            <div className="ev-score-ring-wrap">
              <ScoreRing score={result.totalScore} color={gradeColor(result.grade)} />
              <div className="ev-score-center">
                <div className="ev-score-num" style={{ color: gradeColor(result.grade) }}>{result.totalScore}</div>
                <div className="ev-score-denom">/100</div>
              </div>
            </div>
            <div className="ev-score-meta">
              <div className="ev-grade-badge" style={{ background: gradeColor(result.grade) + "18", color: gradeColor(result.grade) }}>
                Grade {result.grade}
              </div>
              <div className="ev-score-words">{result.wordCount} words · Target: {result.wordLimit}</div>
              {result.question && <div className="ev-score-q">"{result.question.slice(0,80)}{result.question.length > 80 ? "…" : ""}"</div>}
            </div>
            <button className="ev-retry-btn" onClick={() => setTab("write")}>Edit & Re-evaluate</button>
            <button className="ev-new-btn" onClick={reset}>New Answer</button>
          </div>

          {/* Breakdown bars */}
          <div className="ev-breakdown">
            <div className="ev-breakdown-title">Score Breakdown</div>
            {result.breakdown.map(b => {
              const pct = Math.round((b.score / b.max) * 100);
              return (
                <div key={b.label} className="ev-breakdown-row">
                  <div className="ev-bd-header">
                    <span className="ev-bd-label">{b.label}</span>
                    <span className="ev-bd-score" style={{ color: b.color }}>{b.score}/{b.max}</span>
                  </div>
                  <div className="ev-bd-track">
                    <div className="ev-bd-fill" style={{ width: `${pct}%`, background: b.color }} />
                  </div>
                  <div className="ev-bd-tip">{b.tip}</div>
                </div>
              );
            })}
          </div>

          {/* Dimensions & Missing */}
          <div className="ev-feedback-grid">
            <div className="ev-feedback-col">
              <div className="ev-fb-title">✅ Dimensions Covered</div>
              {result.coveredDims.length > 0
                ? result.coveredDims.map(d => <div key={d} className="ev-dim-chip ev-dim-ok">{d}</div>)
                : <div className="ev-fb-empty">No dimensions detected</div>}
            </div>
            <div className="ev-feedback-col">
              <div className="ev-fb-title">⚠️ What's Missing</div>
              {result.missing.length > 0
                ? result.missing.map((m,i) => <div key={i} className="ev-missing-item">• {m}</div>)
                : <div className="ev-fb-empty ev-all-good">All key elements present!</div>}
            </div>
          </div>
        </div>
      )}

      {activeTab === "result" && !result && (
        <div className="ev-empty">
          <div className="ev-empty-icon">📋</div>
          <div>No evaluation yet. Write and evaluate an answer first.</div>
          <button className="ev-evaluate-btn" style={{marginTop:14}} onClick={() => setTab("write")}>Go to Write tab</button>
        </div>
      )}

      {/* ── HISTORY TAB ── */}
      {activeTab === "history" && (
        <div className="ev-history">
          {history.length === 0 ? (
            <div className="ev-empty">
              <div className="ev-empty-icon">📂</div>
              <div>No evaluation history yet.</div>
            </div>
          ) : (
            <>
              <div className="ev-history-header">
                <span>{history.length} evaluations</span>
                <button className="viewer-action-btn" onClick={() => { setHistory([]); saveHistory([]); }}>Clear History</button>
              </div>
              <div className="ev-history-list">
                {history.map((h,i) => (
                  <div key={i} className="ev-history-row">
                    <div className="ev-hist-grade" style={{ background: gradeColor(h.grade) + "18", color: gradeColor(h.grade) }}>
                      {h.grade}
                    </div>
                    <div className="ev-hist-body">
                      <div className="ev-hist-q">{h.question || "Untitled answer"}</div>
                      <div className="ev-hist-meta">{h.totalScore}/100 · {new Date(h.ts).toLocaleDateString("en-IN")}</div>
                    </div>
                    <div className="ev-hist-score">{h.totalScore}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
