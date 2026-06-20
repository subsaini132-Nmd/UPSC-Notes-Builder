import React, { useState, useCallback } from "react";
import { SAMPLE_NOTES, SAMPLE_NOTE_CONTENT, NOTE_SECTIONS, GS_TAGS } from "../lib/constants";

function ProgressBar({ current, total, known }) {
  return (
    <div className="fc-progress-wrap">
      <div className="fc-progress-bar">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={`fc-progress-seg ${
              i < current ? (i < known ? "fc-seg-known" : "fc-seg-review") : "fc-seg-empty"
            }`}
          />
        ))}
      </div>
      <span className="fc-progress-label">{current} / {total}</span>
    </div>
  );
}

export default function Flashcards({ onNavigate }) {
  const [deckId,    setDeckId]    = useState("1");
  const [started,   setStarted]   = useState(false);
  const [flipped,   setFlipped]   = useState(false);
  const [idx,       setIdx]       = useState(0);
  const [knownSet,  setKnownSet]  = useState(new Set());
  const [reviewIds, setReviewIds] = useState([]);
  const [finished,  setFinished]  = useState(false);
  const [reviewMode,setReviewMode]= useState(false);

  const note     = SAMPLE_NOTE_CONTENT[deckId] || SAMPLE_NOTE_CONTENT["1"];
  const noteInfo = SAMPLE_NOTES.find(n => n.id === deckId) || SAMPLE_NOTES[0];
  const gsTag    = GS_TAGS.find(g => g.id === noteInfo.gs);

  const allCards   = NOTE_SECTIONS.filter(s => note?.sections[s.id]);
  const reviewCards= allCards.filter(s => reviewIds.includes(s.id));
  const cards      = reviewMode ? reviewCards : allCards;
  const card       = cards[idx];

  const advance = useCallback((wasKnown) => {
    setFlipped(false);
    setTimeout(() => {
      if (idx + 1 >= cards.length) {
        setFinished(true);
      } else {
        setIdx(i => i + 1);
      }
    }, 160);
  }, [idx, cards.length]);

  const handleKnow = () => {
    setKnownSet(prev => new Set([...prev, card.id]));
    advance(true);
  };

  const handleReview = () => {
    if (!reviewIds.includes(card.id)) {
      setReviewIds(prev => [...prev, card.id]);
    }
    advance(false);
  };

  const restart = (mode = false) => {
    setIdx(0);
    setFlipped(false);
    setFinished(false);
    setReviewMode(mode);
    if (!mode) {
      setKnownSet(new Set());
      setReviewIds([]);
    }
    setStarted(true);
  };

  /* ── Pre-session screen ── */
  if (!started) {
    return (
      <div className="page">
        <div className="page-header">
          <div>
            <p className="page-eyebrow">Flashcards</p>
            <h1 className="page-title">Active Recall Study</h1>
          </div>
        </div>

        <div className="fc-setup">
          <div className="fc-setup-card">
            <div className="fc-setup-icon">🃏</div>
            <h2 className="fc-setup-title">Choose a note to study</h2>
            <p className="fc-setup-sub">Each section of the note becomes a flashcard. Flip to reveal the content, then mark it as known or flag for review.</p>

            <div className="fc-note-grid">
              {SAMPLE_NOTES.map(n => {
                const tag = GS_TAGS.find(g => g.id === n.gs);
                const cnt = NOTE_SECTIONS.filter(s => SAMPLE_NOTE_CONTENT[n.id]?.sections[s.id]).length;
                return (
                  <div
                    key={n.id}
                    className={`fc-note-card ${deckId === n.id ? "fc-note-selected" : ""}`}
                    onClick={() => setDeckId(n.id)}
                  >
                    <div className="fc-note-top">
                      {tag && <span className="gs-pill" style={{ background: tag.bg, color: tag.color }}>{tag.label}</span>}
                      {cnt > 0 && <span className="fc-note-cnt">{cnt} cards</span>}
                    </div>
                    <div className="fc-note-title">{n.topic}</div>
                    <div className="fc-note-meta">{n.wordCount.toLocaleString()} words · {n.date}</div>
                  </div>
                );
              })}
            </div>

            <div className="fc-setup-info">
              <div className="fc-info-item">
                <span className="fc-info-icon">🟢</span>
                <span><strong>Know it</strong> — section marked as confident, moves to next</span>
              </div>
              <div className="fc-info-item">
                <span className="fc-info-icon">🔁</span>
                <span><strong>Review again</strong> — flagged for a second pass at the end</span>
              </div>
            </div>

            <button
              className="primary-btn large fc-start-btn"
              onClick={() => restart(false)}
            >
              ✦ Start Flashcards ({NOTE_SECTIONS.filter(s => note?.sections[s.id]).length} cards)
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Finished screen ── */
  if (finished) {
    const total   = reviewMode ? reviewCards.length : allCards.length;
    const known   = reviewMode ? (total - reviewIds.filter(id => !knownSet.has(id)).length) : knownSet.size;
    const pending = reviewIds.filter(id => !knownSet.has(id)).length;
    const pct     = Math.round((known / total) * 100);

    return (
      <div className="page">
        <div className="fc-finish-screen">
          <div className="fc-finish-card">
            <div className="fc-finish-emoji">{pct >= 80 ? "🎉" : pct >= 50 ? "💪" : "📚"}</div>
            <h2 className="fc-finish-title">
              {reviewMode ? "Review Pass Complete" : "Session Complete"}
            </h2>
            <div className="fc-finish-topic">
              {noteInfo.topic}
              {gsTag && <span className="gs-pill" style={{ background: gsTag.bg, color: gsTag.color, marginLeft: 8 }}>{gsTag.label}</span>}
            </div>

            <div className="fc-finish-stats">
              <div className="fc-fstat">
                <span className="fc-fstat-val" style={{ color: "var(--green)" }}>{known}</span>
                <span className="fc-fstat-label">Known</span>
              </div>
              <div className="fc-fstat">
                <span className="fc-fstat-val" style={{ color: "var(--amber)" }}>{pending}</span>
                <span className="fc-fstat-label">To review</span>
              </div>
              <div className="fc-fstat">
                <span className="fc-fstat-val">{total}</span>
                <span className="fc-fstat-label">Total cards</span>
              </div>
              <div className="fc-fstat">
                <span className="fc-fstat-val" style={{ color: pct >= 80 ? "var(--green)" : "var(--amber)" }}>{pct}%</span>
                <span className="fc-fstat-label">Recall rate</span>
              </div>
            </div>

            <div className="fc-finish-score-bar">
              <div className="fc-finish-fill" style={{ width: `${pct}%` }} />
            </div>

            <div className="fc-finish-actions">
              {pending > 0 && (
                <button className="primary-btn" onClick={() => restart(true)}>
                  🔁 Review {pending} flagged card{pending !== 1 ? "s" : ""}
                </button>
              )}
              <button className="viewer-action-btn" onClick={() => restart(false)}>Restart full deck</button>
              <button className="viewer-action-btn" onClick={() => { setStarted(false); setFinished(false); }}>Change note</button>
              <button className="viewer-action-btn" onClick={() => onNavigate && onNavigate("revision")}>
                Mark as revised →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Active card ── */
  const sectionContent = note.sections[card?.id] || "";

  return (
    <div className="page fc-active-page">
      {/* Top strip */}
      <div className="fc-topstrip">
        <button className="viewer-back-btn" onClick={() => { setStarted(false); setFinished(false); setIdx(0); }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m15 18-6-6 6-6"/></svg>
          Exit
        </button>
        <div className="fc-deck-label">
          {gsTag && <span className="gs-pill" style={{ background: gsTag.bg, color: gsTag.color }}>{gsTag.label}</span>}
          <span>{noteInfo.topic}</span>
          {reviewMode && <span className="fc-review-badge">Review Pass</span>}
        </div>
        <div className="fc-known-counter">
          <span className="fc-kc-green">{knownSet.size} ✓</span>
          {reviewIds.length > 0 && <span className="fc-kc-amber">{reviewIds.filter(id => !knownSet.has(id)).length} 🔁</span>}
        </div>
      </div>

      {/* Progress */}
      <ProgressBar current={idx} total={cards.length} known={knownSet.size} />

      {/* Card stage */}
      <div className="fc-stage">
        <div
          className={`fc-card-wrap ${flipped ? "fc-flipped" : ""}`}
          onClick={() => setFlipped(f => !f)}
        >
          {/* Front */}
          <div className="fc-face fc-front">
            <div className="fc-front-num">{String(allCards.indexOf(card) + 1).padStart(2, "0")}</div>
            <div className="fc-front-icon">{card?.icon}</div>
            <div className="fc-front-label">{card?.label}</div>
            <div className="fc-tap-hint">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12H3M3 12l6-6M3 12l6 6"/></svg>
              Tap to reveal content
            </div>
          </div>

          {/* Back */}
          <div className="fc-face fc-back">
            <div className="fc-back-section">
              <span>{card?.icon}</span>
              <span>{card?.label}</span>
            </div>
            <div className="fc-back-content">
              {sectionContent.split(" | ").length > 1
                ? (
                  <ul className="fc-back-list">
                    {sectionContent.split(" | ").map((pt, i) => <li key={i}>{pt.trim()}</li>)}
                  </ul>
                )
                : <p>{sectionContent}</p>
              }
            </div>
            <div className="fc-back-wc">
              {sectionContent.split(/\s+/).filter(Boolean).length} words
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons — appear after flip */}
      <div className={`fc-actions ${flipped ? "fc-actions-visible" : ""}`}>
        <button className="fc-btn fc-btn-review" onClick={handleReview}>
          <span className="fc-btn-icon">🔁</span>
          <span>Review Again</span>
        </button>
        <div className="fc-flip-hint" onClick={() => setFlipped(f => !f)}>
          {flipped ? "↺ flip back" : "tap card to flip"}
        </div>
        <button className="fc-btn fc-btn-know" onClick={handleKnow}>
          <span className="fc-btn-icon">✓</span>
          <span>Know It</span>
        </button>
      </div>

      {!flipped && (
        <div className="fc-unflipped-actions">
          <button className="fc-btn fc-btn-review fc-btn-sm" onClick={handleReview}>Skip / Review later</button>
        </div>
      )}
    </div>
  );
}
