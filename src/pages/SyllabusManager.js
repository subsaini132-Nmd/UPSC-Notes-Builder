import React, { useState } from "react";
import {
  loadSyllabus, saveSyllabus, DEFAULT_SYLLABUS,
} from "../lib/syllabusData";

export default function SyllabusManager({ onNavigate }) {
  const [syllabus,    setSyllabus]    = useState(loadSyllabus);
  const [activePaper, setActivePaper] = useState("gs1");
  const [newText,     setNewText]     = useState("");
  const [editingId,   setEditingId]   = useState(null);
  const [editText,    setEditText]    = useState("");
  const [saved,       setSaved]       = useState(false);

  const persist = (updated) => {
    setSyllabus(updated);
    saveSyllabus(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const activePaperData = syllabus.papers.find(p => p.id === activePaper);

  const addTopic = () => {
    if (!newText.trim()) return;
    const id = `${activePaper}_c${Date.now()}`;
    persist({
      ...syllabus,
      papers: syllabus.papers.map(p =>
        p.id === activePaper
          ? { ...p, topics: [...p.topics, { id, text: newText.trim() }] }
          : p
      ),
    });
    setNewText("");
  };

  const deleteTopic = (paperId, topicId) => {
    persist({
      ...syllabus,
      papers: syllabus.papers.map(p =>
        p.id === paperId
          ? { ...p, topics: p.topics.filter(t => t.id !== topicId) }
          : p
      ),
    });
  };

  const startEdit = (t) => { setEditingId(t.id); setEditText(t.text); };

  const saveEdit = () => {
    if (!editText.trim()) return;
    persist({
      ...syllabus,
      papers: syllabus.papers.map(p =>
        p.id === activePaper
          ? { ...p, topics: p.topics.map(t => t.id === editingId ? { ...t, text: editText.trim() } : t) }
          : p
      ),
    });
    setEditingId(null);
  };

  const resetToDefault = () => {
    if (!window.confirm("Reset all syllabus topics to UPSC Mains default? Custom additions will be lost.")) return;
    persist(DEFAULT_SYLLABUS);
  };

  const totalTopics = syllabus.papers.reduce((s, p) => s + p.topics.length, 0);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Syllabus Manager</p>
          <h1 className="page-title">UPSC Mains Syllabus</h1>
        </div>
        <div className="syl-header-actions">
          {saved && <span className="syl-saved-badge">✓ Saved</span>}
          <button className="syl-reset-btn" onClick={resetToDefault}>↺ Reset to Default</button>
          {onNavigate && (
            <button className="primary-btn" onClick={() => onNavigate("library")}>
              → Go to PDF Library
            </button>
          )}
        </div>
      </div>

      <div className="syl-info-bar">
        <span className="syl-info-icon">📋</span>
        <span>
          <strong>{totalTopics} syllabus topics</strong> across 4 GS papers.
          Add your own topics, edit existing ones, or delete irrelevant ones.
          These topics are used to auto-map content from your uploaded PDFs.
        </span>
      </div>

      <div className="syl-layout">
        {/* Paper sidebar */}
        <div className="syl-paper-tabs">
          {syllabus.papers.map(p => (
            <button
              key={p.id}
              className={`syl-paper-tab ${activePaper === p.id ? "syl-tab-active" : ""}`}
              style={activePaper === p.id ? { background: p.bg, borderColor: p.color, color: p.color } : {}}
              onClick={() => setActivePaper(p.id)}
            >
              <div className="syl-tab-label">{p.label}</div>
              <div className="syl-tab-desc">{p.desc}</div>
              <div
                className="syl-tab-count"
                style={activePaper === p.id ? { background: p.color, color: "#fff" } : {}}
              >
                {p.topics.length}
              </div>
            </button>
          ))}
        </div>

        {/* Topics panel */}
        {activePaperData && (
          <div className="syl-topics-panel">
            <div className="syl-panel-header">
              <div>
                <div className="syl-panel-title" style={{ color: activePaperData.color }}>
                  {activePaperData.label} — {activePaperData.topics.length} topics
                </div>
                <div className="syl-panel-hint">Click any topic to edit · ✕ to remove</div>
              </div>
            </div>

            <div className="syl-topic-list">
              {activePaperData.topics.map((t, i) => (
                <div key={t.id} className="syl-topic-row">
                  <span className="syl-topic-num">{String(i + 1).padStart(2, "0")}</span>

                  {editingId === t.id ? (
                    <div className="syl-edit-wrap">
                      <input
                        className="syl-edit-input"
                        value={editText}
                        onChange={e => setEditText(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === "Enter") saveEdit();
                          if (e.key === "Escape") setEditingId(null);
                        }}
                        autoFocus
                      />
                      <button
                        className="syl-edit-save"
                        style={{ background: activePaperData.color }}
                        onClick={saveEdit}
                      >
                        Save
                      </button>
                      <button className="syl-edit-cancel" onClick={() => setEditingId(null)}>✕</button>
                    </div>
                  ) : (
                    <>
                      <span className="syl-topic-text" onClick={() => startEdit(t)} title="Click to edit">
                        {t.text}
                      </span>
                      <button
                        className="syl-topic-del"
                        onClick={() => deleteTopic(activePaper, t.id)}
                        title="Remove this topic"
                      >
                        ✕
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Add new topic */}
            <div className="syl-add-row">
              <input
                className="syl-add-input"
                placeholder={`Add a custom topic to ${activePaperData.label}…`}
                value={newText}
                onChange={e => setNewText(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addTopic()}
              />
              <button
                className="syl-add-btn"
                style={{ background: activePaperData.color, opacity: newText.trim() ? 1 : 0.5 }}
                onClick={addTopic}
                disabled={!newText.trim()}
              >
                + Add Topic
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
