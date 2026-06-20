import React, { useState, useEffect, useCallback } from "react";
import { SAMPLE_QUIZ, SAMPLE_NOTES, NOTE_SECTIONS, GS_TAGS } from "../lib/constants";

const TIMER_SECONDS = 60;

function TimerRing({ seconds, total }) {
  const r = 22, circ = 2 * Math.PI * r;
  const offset = circ * (1 - seconds / total);
  const color = seconds > 20 ? "var(--green)" : seconds > 10 ? "var(--amber)" : "var(--red)";
  return (
    <div className="quiz-timer-wrap">
      <svg width="56" height="56" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="28" cy="28" r={r} fill="none" stroke="var(--border)" strokeWidth="4" />
        <circle cx="28" cy="28" r={r} fill="none" stroke={color} strokeWidth="4"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s" }}
        />
      </svg>
      <span className="quiz-timer-num" style={{ color }}>{seconds}</span>
    </div>
  );
}

export default function QuizMode({ onNavigate }) {
  const [phase,       setPhase]     = useState("setup");   // setup | question | answered | finished
  const [noteId,      setNoteId]    = useState("1");
  const [timerOn,     setTimerOn]   = useState(false);
  const [questions,   setQuestions] = useState([]);
  const [idx,         setIdx]       = useState(0);
  const [selected,    setSelected]  = useState(null);
  const [timeLeft,    setTimeLeft]  = useState(TIMER_SECONDS);
  const [results,     setResults]   = useState([]);        // { q, chosen, correct }

  const q = questions[idx];

  /* ── Timer ── */
  useEffect(() => {
    if (phase !== "question" || !timerOn) return;
    if (timeLeft <= 0) { submitAnswer(null); return; }
    const t = setInterval(() => setTimeLeft(s => s - 1), 1000);
    return () => clearInterval(t);
  }, [phase, timerOn, timeLeft]);

  const startQuiz = () => {
    const pool = SAMPLE_QUIZ.filter(q => q.topic === (SAMPLE_NOTES.find(n => n.id === noteId)?.topic || "Women Empowerment"));
    setQuestions(pool.length ? pool : SAMPLE_QUIZ);
    setIdx(0); setResults([]); setSelected(null);
    setTimeLeft(TIMER_SECONDS);
    setPhase("question");
  };

  const submitAnswer = useCallback((choice) => {
    if (phase !== "question") return;
    const isCorrect = q.type === "tf"
      ? choice === q.correct
      : choice === q.correct;
    setResults(prev => [...prev, { q, chosen: choice, correct: isCorrect }]);
    setSelected(choice);
    setPhase("answered");
  }, [phase, q]);

  const next = () => {
    const nextIdx = idx + 1;
    if (nextIdx >= questions.length) {
      setPhase("finished");
    } else {
      setIdx(nextIdx);
      setSelected(null);
      setTimeLeft(TIMER_SECONDS);
      setPhase("question");
    }
  };

  const restart = () => {
    setIdx(0); setResults([]); setSelected(null);
    setTimeLeft(TIMER_SECONDS);
    setPhase("question");
  };

  /* ── Helper ── */
  const getSectionLabel = (id) => NOTE_SECTIONS.find(s => s.id === id)?.label || id;
  const getSectionIcon  = (id) => NOTE_SECTIONS.find(s => s.id === id)?.icon  || "📋";

  /* ════════════ SETUP SCREEN ════════════ */
  if (phase === "setup") {
    return (
      <div className="page">
        <div className="page-header">
          <div>
            <p className="page-eyebrow">Quiz Mode</p>
            <h1 className="page-title">Self-Test Your Notes</h1>
          </div>
        </div>

        <div className="quiz-setup-wrap">
          <div className="quiz-setup-card">
            <div className="quiz-setup-icon">⚡</div>
            <h2 className="quiz-setup-title">Choose a note to quiz yourself on</h2>
            <p className="quiz-setup-sub">
              Questions are drawn from every section of the note — MCQs and True/False — covering key data, schemes, judgements, and concepts.
            </p>

            <div className="quiz-note-grid">
              {SAMPLE_NOTES.map(n => {
                const tag = GS_TAGS.find(g => g.id === n.gs);
                const qCount = SAMPLE_QUIZ.filter(q => q.topic === n.topic).length;
                return (
                  <div
                    key={n.id}
                    className={`fc-note-card ${noteId === n.id ? "fc-note-selected" : ""}`}
                    onClick={() => setNoteId(n.id)}
                  >
                    <div className="fc-note-top">
                      {tag && <span className="gs-pill" style={{ background: tag.bg, color: tag.color }}>{tag.label}</span>}
                      <span className="fc-note-cnt">{qCount || "—"} Qs</span>
                    </div>
                    <div className="fc-note-title">{n.topic}</div>
                    <div className="fc-note-meta">{n.wordCount.toLocaleString()} words · {n.date}</div>
                  </div>
                );
              })}
            </div>

            <div className="quiz-options-row">
              <label className="quiz-toggle-label">
                <input
                  type="checkbox"
                  checked={timerOn}
                  onChange={e => setTimerOn(e.target.checked)}
                  className="quiz-toggle-input"
                />
                <span className="quiz-toggle-track">
                  <span className="quiz-toggle-thumb" />
                </span>
                <span>60-second timer per question</span>
              </label>
            </div>

            <button className="primary-btn large quiz-start-btn" onClick={startQuiz}>
              ⚡ Start Quiz ({SAMPLE_QUIZ.filter(q =>
                q.topic === (SAMPLE_NOTES.find(n => n.id === noteId)?.topic || "Women Empowerment")
              ).length || SAMPLE_QUIZ.length} questions)
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ════════════ FINISHED SCREEN ════════════ */
  if (phase === "finished") {
    const correct = results.filter(r => r.correct).length;
    const total   = results.length;
    const pct     = Math.round((correct / total) * 100);
    const noteInfo = SAMPLE_NOTES.find(n => n.id === noteId);
    const tag      = GS_TAGS.find(g => g.id === noteInfo?.gs);

    return (
      <div className="page">
        <div className="quiz-finish-wrap">
          <div className="quiz-finish-card">
            <div className="quiz-finish-emoji">
              {pct >= 80 ? "🏆" : pct >= 60 ? "💪" : "📚"}
            </div>
            <h2 className="quiz-finish-title">Quiz Complete!</h2>
            <div className="quiz-finish-topic">
              {noteInfo?.topic}
              {tag && <span className="gs-pill" style={{ background: tag.bg, color: tag.color, marginLeft: 8 }}>{tag.label}</span>}
            </div>

            <div className="quiz-score-ring-wrap">
              <div className="quiz-score-big" style={{ color: pct >= 80 ? "var(--green)" : pct >= 60 ? "var(--amber)" : "var(--red)" }}>
                {pct}%
              </div>
              <div className="quiz-score-sub">{correct} / {total} correct</div>
            </div>

            <div className="quiz-finish-bar-wrap">
              <div className="quiz-finish-bar">
                <div className="quiz-finish-fill" style={{
                  width: `${pct}%`,
                  background: pct >= 80 ? "var(--green)" : pct >= 60 ? "var(--amber)" : "var(--red)"
                }} />
              </div>
            </div>

            {/* Per-question review */}
            <div className="quiz-review-list">
              <div className="quiz-review-label">Question breakdown</div>
              {results.map((r, i) => (
                <div key={i} className={`quiz-review-item ${r.correct ? "quiz-r-correct" : "quiz-r-wrong"}`}>
                  <span className="quiz-review-icon">{r.correct ? "✓" : "✗"}</span>
                  <div className="quiz-review-body">
                    <div className="quiz-review-q">{r.q.question}</div>
                    {!r.correct && (
                      <div className="quiz-review-exp">
                        <strong>Correct:</strong> {r.q.type === "tf"
                          ? (r.q.correct ? "True" : "False")
                          : r.q.options[r.q.correct]
                        }
                        {" — "}{r.q.explanation}
                      </div>
                    )}
                    <div className="quiz-review-section">
                      {getSectionIcon(r.q.sectionId)} {getSectionLabel(r.q.sectionId)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="quiz-finish-actions">
              <button className="primary-btn" onClick={restart}>Retake Quiz</button>
              <button className="viewer-action-btn" onClick={() => setPhase("setup")}>Change Note</button>
              <button className="viewer-action-btn" onClick={() => onNavigate && onNavigate("viewer", { noteId })}>
                Review Note
              </button>
              <button className="viewer-action-btn" onClick={() => onNavigate && onNavigate("revision")}>
                Mark as Revised →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ════════════ ACTIVE QUESTION ════════════ */
  const pct = Math.round(((idx) / questions.length) * 100);
  const isAnswered = phase === "answered";

  return (
    <div className="page quiz-active-page">
      {/* Top strip */}
      <div className="quiz-topstrip">
        <button className="viewer-back-btn" onClick={() => setPhase("setup")}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m15 18-6-6 6-6"/></svg>
          Exit
        </button>
        <div className="quiz-progress-label">
          Question {idx + 1} of {questions.length}
        </div>
        {timerOn
          ? <TimerRing seconds={timeLeft} total={TIMER_SECONDS} />
          : <div className="quiz-score-chip">
              {results.filter(r => r.correct).length} ✓ correct
            </div>
        }
      </div>

      {/* Progress bar */}
      <div className="quiz-prog-bar-wrap">
        <div className="quiz-prog-bar">
          <div className="quiz-prog-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Question card */}
      <div className="quiz-card">
        <div className="quiz-card-meta">
          <span className="quiz-section-badge">
            {getSectionIcon(q.sectionId)} {getSectionLabel(q.sectionId)}
          </span>
          <span className="quiz-type-badge">{q.type === "tf" ? "True / False" : "MCQ"}</span>
        </div>
        <div className="quiz-question">{q.question}</div>

        {/* Options */}
        {q.type === "tf" ? (
          <div className="quiz-tf-row">
            {[true, false].map(val => {
              let state = "";
              if (isAnswered) {
                if (val === q.correct) state = "quiz-opt-correct";
                else if (val === selected) state = "quiz-opt-wrong";
              }
              return (
                <button
                  key={String(val)}
                  className={`quiz-tf-btn ${state} ${isAnswered ? "quiz-opt-locked" : ""}`}
                  onClick={() => !isAnswered && submitAnswer(val)}
                >
                  {val ? "✓ True" : "✗ False"}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="quiz-options">
            {q.options.map((opt, i) => {
              let state = "";
              if (isAnswered) {
                if (i === q.correct) state = "quiz-opt-correct";
                else if (i === selected) state = "quiz-opt-wrong";
              }
              return (
                <button
                  key={i}
                  className={`quiz-option ${state} ${isAnswered ? "quiz-opt-locked" : ""}`}
                  onClick={() => !isAnswered && submitAnswer(i)}
                >
                  <span className="quiz-opt-letter">{String.fromCharCode(65 + i)}</span>
                  <span className="quiz-opt-text">{opt}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Explanation — shown after answering */}
        {isAnswered && (
          <div className={`quiz-explanation ${results[results.length - 1]?.correct ? "quiz-exp-correct" : "quiz-exp-wrong"}`}>
            <div className="quiz-exp-header">
              {results[results.length - 1]?.correct ? "✓ Correct!" : "✗ Incorrect"}
            </div>
            <div className="quiz-exp-text">{q.explanation}</div>
          </div>
        )}
      </div>

      {/* Next button */}
      {isAnswered && (
        <div className="quiz-next-wrap">
          <button className="primary-btn large quiz-next-btn" onClick={next}>
            {idx + 1 >= questions.length ? "See Results →" : "Next Question →"}
          </button>
        </div>
      )}

      {/* Skip option before answering */}
      {!isAnswered && (
        <div className="quiz-skip-wrap">
          <button className="quiz-skip-btn" onClick={() => submitAnswer(-1)}>Skip question</button>
        </div>
      )}
    </div>
  );
}
