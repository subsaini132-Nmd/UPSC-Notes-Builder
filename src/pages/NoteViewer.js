import React, { useState, useEffect, useRef } from "react";
import { SAMPLE_NOTE_CONTENT, NOTE_SECTIONS, GS_TAGS } from "../lib/constants";

export default function NoteViewer({ noteId, noteContents, onBack, onNavigate }) {
  const [activeSection, setActiveSection] = useState(null);
  const contentRef = useRef(null);

  const allContents = noteContents || SAMPLE_NOTE_CONTENT;
  const note = allContents[noteId] || SAMPLE_NOTE_CONTENT["1"];
  const gsTag = GS_TAGS.find(g => g.id === note.gs);
  const sectionsWithContent = NOTE_SECTIONS.filter(s => note.sections[s.id]);

  const scrollToSection = (id) => {
    const el = document.getElementById(`vs-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(id);
    }
  };

  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;
    const onScroll = () => {
      for (let i = sectionsWithContent.length - 1; i >= 0; i--) {
        const el = document.getElementById(`vs-${sectionsWithContent[i].id}`);
        if (el && el.getBoundingClientRect().top < 180) {
          setActiveSection(sectionsWithContent[i].id);
          return;
        }
      }
      setActiveSection(null);
    };
    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, [sectionsWithContent]);

  const wordCount = Object.values(note.sections).reduce(
    (n, txt) => n + txt.split(/\s+/).filter(Boolean).length, 0
  );

  return (
    <div className="viewer-shell">
      {/* Top bar */}
      <div className="viewer-topbar">
        <button className="viewer-back-btn" onClick={onBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m15 18-6-6 6-6"/></svg>
          My Notes
        </button>
        <div className="viewer-topbar-center">
          {gsTag && (
            <span className="gs-pill" style={{ background: gsTag.bg, color: gsTag.color }}>{gsTag.label}</span>
          )}
          <span className="viewer-topbar-title">{note.topic}</span>
        </div>
        <div className="viewer-topbar-actions">
          <button className="viewer-action-btn" onClick={() => onNavigate && onNavigate("pyq")}>PYQ Map</button>
          <button className="viewer-action-btn" onClick={() => onNavigate && onNavigate("answers")}>Answer Builder</button>
          <button className="viewer-action-btn" onClick={() => onNavigate && onNavigate("editor", { noteId })}>✏ Edit Note</button>
          <button className="viewer-action-btn primary" onClick={() => window.print()}>Print / Export</button>
        </div>
      </div>

      <div className="viewer-layout">
        {/* TOC */}
        <aside className="viewer-toc">
          <div className="toc-meta">
            <div className="toc-heading">Contents</div>
            <div className="toc-sub">{sectionsWithContent.length} sections · {wordCount.toLocaleString()} words</div>
          </div>
          <div className="toc-list">
            {sectionsWithContent.map((s, i) => (
              <button
                key={s.id}
                className={`toc-item ${activeSection === s.id ? "toc-active" : ""}`}
                onClick={() => scrollToSection(s.id)}
              >
                <span className="toc-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="toc-icon">{s.icon}</span>
                <span className="toc-label">{s.label}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Content */}
        <div className="viewer-content" ref={contentRef}>
          {/* Note header */}
          <div className="viewer-note-header">
            <p className="viewer-note-eyebrow">Generated Note</p>
            <h1 className="viewer-note-title">{note.topic}</h1>
            <div className="viewer-note-meta">
              {gsTag && <span className="gs-pill" style={{ background: gsTag.bg, color: gsTag.color }}>{gsTag.label} — {gsTag.desc}</span>}
              <span className="viewer-meta-dot" />
              <span>{note.date}</span>
              <span className="viewer-meta-dot" />
              <span>{sectionsWithContent.length} sections</span>
              <span className="viewer-meta-dot" />
              <span>{wordCount.toLocaleString()} words</span>
            </div>
          </div>

          {/* Sections */}
          {sectionsWithContent.map((s, i) => (
            <div key={s.id} id={`vs-${s.id}`} className="viewer-section">
              <div className="viewer-section-hdr">
                <span className="viewer-section-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="viewer-section-icon">{s.icon}</span>
                <span className="viewer-section-title">{s.label}</span>
                <span className="viewer-section-wc">
                  {note.sections[s.id].split(/\s+/).filter(Boolean).length}w
                </span>
              </div>
              <div className="viewer-section-body">
                {note.sections[s.id].split(" | ").length > 1
                  ? (
                    <ul className="viewer-list">
                      {note.sections[s.id].split(" | ").map((pt, j) => (
                        <li key={j}>{pt.trim()}</li>
                      ))}
                    </ul>
                  )
                  : <p>{note.sections[s.id]}</p>
                }
              </div>
            </div>
          ))}

          {/* Footer */}
          <div className="viewer-footer">
            <div className="viewer-footer-left">
              <span>Note generated on {note.date}</span>
              <span className="viewer-meta-dot" />
              <span>{wordCount.toLocaleString()} words total</span>
            </div>
            <div className="viewer-footer-right">
              <button className="viewer-action-btn" onClick={() => onNavigate && onNavigate("pyq")}>Map to PYQs →</button>
              <button className="viewer-action-btn primary" onClick={() => onNavigate && onNavigate("answers")}>Build Answers →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
