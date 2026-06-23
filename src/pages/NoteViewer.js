import React, { useState, useEffect, useRef } from "react";
import { SAMPLE_NOTE_CONTENT, NOTE_SECTIONS, GS_TAGS } from "../lib/constants";

// Default display mode per section type
const DEFAULT_POINTS_SECTIONS = new Set([
  "data","challenges","causes","impacts","committees","judgements","intl","casestudies","india","rajasthan","wayforward","schemes"
]);

export default function NoteViewer({ noteId, noteContents, onBack, onNavigate, onUpdateContent, onDeleteNote }) {
  const [activeSection,    setActiveSection]    = useState(null);
  const [deletedSections,  setDeletedSections]  = useState(new Set());
  const [confirmDeleteNote,setConfirmDeleteNote] = useState(false);
  const [sectionModes,     setSectionModes]     = useState({});
  const contentRef = useRef(null);

  const toggleSectionMode = (sectionId) => {
    setSectionModes(prev => {
      const current = prev[sectionId] ?? (DEFAULT_POINTS_SECTIONS.has(sectionId) ? "points" : "para");
      return { ...prev, [sectionId]: current === "points" ? "para" : "points" };
    });
  };

  const getSectionMode = (sectionId, text) => {
    if (sectionModes[sectionId]) return sectionModes[sectionId];
    if (text.includes(" | ")) return "points"; // existing pipe format
    return DEFAULT_POINTS_SECTIONS.has(sectionId) ? "points" : "para";
  };

  const allContents = noteContents || SAMPLE_NOTE_CONTENT;
  const note = allContents[noteId] || SAMPLE_NOTE_CONTENT["1"];
  const gsTag = GS_TAGS.find(g => g.id === note.gs);
  // Use dynamic section config stored at note generation time, fall back to static list
  const sectionConfig = note._sectionConfig || NOTE_SECTIONS;
  const sectionsWithContent = sectionConfig.filter(s =>
    note.sections[s.id] && !deletedSections.has(s.id)
  );

  const deleteSection = (sectionId) => {
    setDeletedSections(prev => new Set([...prev, sectionId]));
    if (onUpdateContent) onUpdateContent(noteId, sectionId, "");
  };

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

  const isDiagram = (str) => typeof str === "string" && str.startsWith('{"src"');
  const parseDiagram = (str) => { try { return JSON.parse(str); } catch { return null; } };

  const wordCount = Object.entries(note.sections).reduce(
    (n, [, txt]) => n + (isDiagram(txt) ? 0 : txt.split(/\s+/).filter(Boolean).length), 0
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
          {onDeleteNote && !confirmDeleteNote && (
            <button className="viewer-action-btn viewer-delete-btn" onClick={() => setConfirmDeleteNote(true)}>
              🗑 Delete
            </button>
          )}
          {confirmDeleteNote && (
            <div className="viewer-delete-confirm">
              <span>Delete this note?</span>
              <button className="viewer-del-yes" onClick={() => { onDeleteNote(noteId); setConfirmDeleteNote(false); }}>Yes, delete</button>
              <button className="viewer-del-no"  onClick={() => setConfirmDeleteNote(false)}>Cancel</button>
            </div>
          )}
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
            {sectionsWithContent.map((s, i) => {
              const src        = note._sources?.[s.id];
              const isTemplate = src === "template";
              const isFromPdf  = src === "pdf";
              return (
                <button
                  key={s.id}
                  className={`toc-item ${activeSection === s.id ? "toc-active" : ""} ${isTemplate ? "toc-item-template" : ""} ${isFromPdf ? "toc-item-pdf" : ""}`}
                  onClick={() => scrollToSection(s.id)}
                >
                  <span className="toc-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="toc-icon">{s.icon}</span>
                  <span className="toc-label">{s.label}</span>
                  {isTemplate && <span className="toc-template-dot" title="Template placeholder" />}
                  {isFromPdf  && <span className="toc-pdf-dot"      title="From your uploaded PDF" />}
                </button>
              );
            })}
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
          {sectionsWithContent.map((s, i) => {
            const src        = note._sources?.[s.id];
            const isTemplate = src === "template";
            const isFromPdf  = src === "pdf";
            const text       = note.sections[s.id];
            const mode       = getSectionMode(s.id, text);
            const isPoints   = mode === "points";

            // Split text into bullet points
            const pointItems = isPoints
              ? (() => {
                  // Try pipe separator first, then sentence split
                  if (text.includes(" | ")) return text.split(" | ").map(t => t.trim()).filter(Boolean);
                  const sentences = text.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(s => s.length > 15);
                  return sentences.length > 1 ? sentences : text.split(/\n+/).map(t => t.trim()).filter(Boolean);
                })()
              : [];

            return (
              <div key={s.id} id={`vs-${s.id}`} className={`viewer-section ${isTemplate ? "viewer-section-template" : ""} ${isFromPdf ? "viewer-section-pdf" : ""}`}>
                <div className="viewer-section-hdr">
                  <span className="viewer-section-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="viewer-section-icon">{s.icon}</span>
                  <span className="viewer-section-title">{s.label}</span>
                  {isTemplate && <span className="viewer-template-badge">⚠ Template</span>}
                  {isFromPdf  && <span className="viewer-pdf-badge">📄 PDF</span>}
                  <span className="viewer-section-wc">
                    {isDiagram(text) ? "img" : `${text.split(/\s+/).filter(Boolean).length}w`}
                  </span>
                  <button
                    className={`viewer-format-toggle ${isPoints ? "active-points" : "active-para"}`}
                    title={isPoints ? "Switch to paragraph" : "Switch to bullet points"}
                    onClick={() => toggleSectionMode(s.id)}
                  >
                    {isPoints ? "¶ Para" : "⁞≡ Points"}
                  </button>
                  <button
                    className="viewer-section-delete-btn"
                    title="Remove this section"
                    onClick={() => deleteSection(s.id)}
                  >✕</button>
                </div>
                <div className="viewer-section-body">
                  {isDiagram(text)
                    ? (() => {
                        const d = parseDiagram(text);
                        return d?.src ? (
                          <div className="viewer-diagram-wrap">
                            <img src={d.src} alt={d.caption || "Diagram"} className="viewer-diagram-img" />
                            {d.caption && <p className="viewer-diagram-caption">{d.caption}</p>}
                          </div>
                        ) : null;
                      })()
                    : isPoints
                      ? (
                        <ul className="viewer-list">
                          {pointItems.map((pt, j) => <li key={j}>{pt.trim().replace(/^[-•]\s*/, "")}</li>)}
                        </ul>
                      )
                      : <p>{text.replace(/ \| /g, " ")}</p>
                  }
                </div>
              </div>
            );
          })}

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
