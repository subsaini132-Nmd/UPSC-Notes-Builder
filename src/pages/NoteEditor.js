import React, { useState, useRef, useEffect } from "react";
import { SAMPLE_NOTE_CONTENT, NOTE_SECTIONS, GS_TAGS } from "../lib/constants";

export default function NoteEditor({ noteId, noteContents, onUpdateContent, onBack, onNavigate }) {
  const allContents = noteContents || SAMPLE_NOTE_CONTENT;
  const note    = allContents[noteId] || SAMPLE_NOTE_CONTENT["1"];
  const gsTag   = GS_TAGS.find(g => g.id === note.gs);
  const withContent = NOTE_SECTIONS.filter(s => note.sections[s.id]);

  const [sections,  setSections]  = useState(() => ({ ...note.sections }));
  const [active,    setActive]    = useState(withContent[0]?.id || null);
  const [edited,    setEdited]    = useState(new Set());
  const [saved,     setSaved]     = useState(false);
  const [showExit,  setShowExit]  = useState(false);
  const textareaRef = useRef(null);

  const hasChanges = edited.size > 0;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [active, sections]);

  const updateSection = (id, val) => {
    setSections(prev => ({ ...prev, [id]: val }));
    setEdited(prev => new Set([...prev, id]));
    setSaved(false);
  };

  const handleSave = () => {
    if (onUpdateContent) {
      Object.entries(sections).forEach(([secId, text]) => {
        onUpdateContent(noteId, secId, text);
      });
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  const handleDiscard = () => {
    setSections({ ...note.sections });
    setEdited(new Set());
    setSaved(false);
  };

  const handleBack = () => {
    if (hasChanges) { setShowExit(true); } else { onBack(); }
  };

  const activeContent = sections[active] || "";
  const activeWc      = activeContent.split(/\s+/).filter(Boolean).length;
  const activeSec     = NOTE_SECTIONS.find(s => s.id === active);
  const originalWc    = (note.sections[active] || "").split(/\s+/).filter(Boolean).length;
  const wcDelta       = activeWc - originalWc;

  const totalWc = Object.values(sections).reduce(
    (n, t) => n + t.split(/\s+/).filter(Boolean).length, 0
  );

  return (
    <div className="viewer-shell">
      {/* Top bar */}
      <div className="viewer-topbar">
        <button className="viewer-back-btn" onClick={handleBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m15 18-6-6 6-6"/></svg>
          View Note
        </button>
        <div className="viewer-topbar-center">
          {gsTag && <span className="gs-pill" style={{ background: gsTag.bg, color: gsTag.color }}>{gsTag.label}</span>}
          <span className="viewer-topbar-title">
            <span className="editor-mode-badge">EDIT</span>
            {note.topic}
          </span>
        </div>
        <div className="viewer-topbar-actions">
          {hasChanges && (
            <button className="viewer-action-btn" onClick={handleDiscard}>Discard</button>
          )}
          <button
            className={`viewer-action-btn primary ${saved ? "btn-saved" : ""}`}
            onClick={handleSave}
            disabled={!hasChanges && !saved}
          >
            {saved ? "✓ Saved" : `Save Changes${edited.size > 0 ? ` (${edited.size})` : ""}`}
          </button>
        </div>
      </div>

      <div className="viewer-layout">
        {/* Section list panel */}
        <aside className="viewer-toc">
          <div className="toc-meta">
            <div className="toc-heading">Sections</div>
            <div className="toc-sub">
              {edited.size > 0 ? `${edited.size} edited · ` : ""}{withContent.length} total
            </div>
          </div>
          <div className="toc-list">
            {withContent.map((s, i) => {
              const wc   = (sections[s.id] || "").split(/\s+/).filter(Boolean).length;
              const isEd = edited.has(s.id);
              return (
                <button
                  key={s.id}
                  className={`toc-item ${active === s.id ? "toc-active" : ""}`}
                  onClick={() => setActive(s.id)}
                >
                  <span className="toc-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="toc-icon">{s.icon}</span>
                  <span className="toc-label">{s.label}</span>
                  {isEd
                    ? <span className="toc-edited-dot" title="Edited" />
                    : <span className="toc-wc-tiny">{wc}w</span>
                  }
                </button>
              );
            })}
          </div>

          {/* Summary */}
          <div className="editor-toc-footer">
            <div className="editor-stat">
              <span className="editor-stat-val">{edited.size}</span>
              <span className="editor-stat-label">sections edited</span>
            </div>
            <div className="editor-stat">
              <span className="editor-stat-val">{totalWc.toLocaleString()}</span>
              <span className="editor-stat-label">total words</span>
            </div>
          </div>
        </aside>

        {/* Editor area */}
        <div className="editor-main">
          {active && activeSec ? (
            <>
              {/* Section header */}
              <div className="editor-section-hdr">
                <span className="editor-section-icon">{activeSec.icon}</span>
                <span className="editor-section-title">{activeSec.label}</span>
                <div className="editor-section-meta">
                  <span className="editor-wc-badge">{activeWc}w</span>
                  {wcDelta !== 0 && edited.has(active) && (
                    <span className={`editor-wc-delta ${wcDelta > 0 ? "plus" : "minus"}`}>
                      {wcDelta > 0 ? "+" : ""}{wcDelta}
                    </span>
                  )}
                  {edited.has(active) && <span className="editor-edited-chip">Edited</span>}
                </div>
              </div>

              {/* Textarea */}
              <div className="editor-textarea-wrap">
                <textarea
                  ref={textareaRef}
                  className="editor-textarea"
                  value={activeContent}
                  onChange={e => updateSection(active, e.target.value)}
                  placeholder="Write content for this section…"
                  spellCheck={false}
                />
              </div>

              {/* Toolbar */}
              <div className="editor-toolbar">
                <span className="editor-hint">
                  Use <code className="editor-code"> | </code> as separator to render as a bullet list in the viewer.
                </span>
                <div className="editor-toolbar-right">
                  {edited.has(active) && (
                    <button
                      className="editor-reset-btn"
                      onClick={() => {
                        updateSection(active, note.sections[active] || "");
                        setEdited(prev => {
                          const n = new Set(prev);
                          n.delete(active);
                          return n;
                        });
                      }}
                    >
                      Reset section
                    </button>
                  )}
                  <button
                    className="editor-nav-btn"
                    disabled={withContent.findIndex(s => s.id === active) === 0}
                    onClick={() => {
                      const idx = withContent.findIndex(s => s.id === active);
                      if (idx > 0) setActive(withContent[idx - 1].id);
                    }}
                  >
                    ↑ Prev
                  </button>
                  <button
                    className="editor-nav-btn"
                    disabled={withContent.findIndex(s => s.id === active) === withContent.length - 1}
                    onClick={() => {
                      const idx = withContent.findIndex(s => s.id === active);
                      if (idx < withContent.length - 1) setActive(withContent[idx + 1].id);
                    }}
                  >
                    ↓ Next
                  </button>
                </div>
              </div>

              {/* Original text reference */}
              {edited.has(active) && (
                <details className="editor-original-wrap">
                  <summary className="editor-original-toggle">Show original text</summary>
                  <div className="editor-original-text">{note.sections[active]}</div>
                </details>
              )}
            </>
          ) : (
            <div className="ab-placeholder">
              <div className="ab-placeholder-icon">✏️</div>
              <div className="ab-placeholder-title">Select a section to edit</div>
              <div className="ab-placeholder-sub">Click any section in the left panel to start editing.</div>
            </div>
          )}
        </div>
      </div>

      {/* Unsaved-changes exit dialog */}
      {showExit && (
        <div className="dialog-overlay" onClick={() => setShowExit(false)}>
          <div className="dialog-box" onClick={e => e.stopPropagation()}>
            <div className="dialog-title">Unsaved changes</div>
            <div className="dialog-body">
              You have edited {edited.size} section{edited.size !== 1 ? "s" : ""}. Leaving will discard these changes.
            </div>
            <div className="dialog-actions">
              <button className="viewer-action-btn" onClick={() => setShowExit(false)}>Keep editing</button>
              <button className="viewer-action-btn" onClick={() => { handleSave(); setShowExit(false); onBack(); }}>Save & exit</button>
              <button className="viewer-action-btn danger" onClick={() => { handleDiscard(); setShowExit(false); onBack(); }}>Discard & exit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
