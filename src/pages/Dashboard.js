import React, { useState } from "react";
import { SAMPLE_NOTES, SAMPLE_PDFS, SAMPLE_TOPICS, GS_TAGS, NOTE_SECTIONS } from "../lib/constants";

export default function Dashboard({ onNavigate }) {
  const [topicInput, setTopicInput] = useState("");

  const totalChunks = SAMPLE_PDFS.filter(p => p.status === "indexed").reduce((s, p) => s + p.chunks, 0);

  const handleGenerate = () => {
    if (topicInput.trim()) onNavigate("generator");
  };

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Dashboard</p>
          <h1 className="page-title">Your Mains Preparation Hub</h1>
        </div>
        <div className="header-meta">
          <div className="meta-chip">
            <span className="meta-chip-dot green" />
            {SAMPLE_PDFS.filter(p => p.status === "indexed").length} PDFs indexed
          </div>
          <div className="meta-chip">
            <span className="meta-chip-dot blue" />
            {totalChunks.toLocaleString()} chunks ready
          </div>
        </div>
      </div>

      {/* Hero — Topic Input */}
      <div className="hero-input-card">
        <div className="hero-input-label">
          <span className="sparkle-icon">✦</span>
          Generate a UPSC Mains Note
        </div>
        <h2 className="hero-input-heading">What topic do you want notes on?</h2>
        <div className="hero-input-row">
          <input
            className="hero-input"
            placeholder="e.g. Women Empowerment, Urban Flooding, Climate Change…"
            value={topicInput}
            onChange={e => setTopicInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleGenerate()}
          />
          <button className="hero-btn" onClick={handleGenerate}>
            Generate Note →
          </button>
        </div>
        <div className="hero-suggestions">
          <span className="suggestions-label">Try:</span>
          {SAMPLE_TOPICS.slice(0, 6).map(t => (
            <button key={t} className="suggestion-chip" onClick={() => { setTopicInput(t); }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="stats-row">
        {[
          { val: SAMPLE_NOTES.length, label: "Notes Created", icon: "📝" },
          { val: SAMPLE_PDFS.length, label: "PDFs Uploaded", icon: "📁" },
          { val: totalChunks.toLocaleString(), label: "Chunks Indexed", icon: "🔍" },
          { val: "22", label: "Sections per Note", icon: "📋" },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-val">{s.val}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Two-column */}
      <div className="dashboard-grid">
        {/* Recent Notes */}
        <div className="dash-col">
          <div className="section-header">
            <div className="section-title">Recent Notes</div>
            <button className="section-link" onClick={() => onNavigate("notes")}>View all →</button>
          </div>
          <div className="notes-list">
            {SAMPLE_NOTES.map(note => {
              const gsTag = GS_TAGS.find(g => g.id === note.gs);
              return (
                <div key={note.id} className="note-row" onClick={() => onNavigate("viewer", { noteId: note.id })}>
                  <div className="note-row-left">
                    <div className="note-row-topic">{note.topic}</div>
                    <div className="note-row-meta">
                      {note.sections} sections · {note.wordCount.toLocaleString()} words · {note.date}
                    </div>
                  </div>
                  <div className="note-row-right">
                    {gsTag && (
                      <span className="gs-pill" style={{ background: gsTag.bg, color: gsTag.color }}>
                        {gsTag.label}
                      </span>
                    )}
                    <span className={`status-pill ${note.status}`}>{note.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PDF Library preview */}
        <div className="dash-col">
          <div className="section-header">
            <div className="section-title">PDF Library</div>
            <button className="section-link" onClick={() => onNavigate("library")}>Manage →</button>
          </div>
          <div className="pdfs-list">
            {SAMPLE_PDFS.map(pdf => (
              <div key={pdf.id} className="pdf-row">
                <div className="pdf-icon">📄</div>
                <div className="pdf-info">
                  <div className="pdf-name">{pdf.name}</div>
                  <div className="pdf-meta">{pdf.pages} pages · {pdf.size}</div>
                </div>
                <div className="pdf-status-wrap">
                  <span className={`pdf-status ${pdf.status}`}>
                    {pdf.status === "indexed" && `${pdf.chunks.toLocaleString()} chunks`}
                    {pdf.status === "processing" && "⚙ Processing…"}
                    {pdf.status === "queued" && "⏳ Queued"}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button className="upload-btn" onClick={() => onNavigate("library")}>
            + Upload PDF
          </button>
        </div>
      </div>

      {/* Note Structure Preview */}
      <div className="structure-section">
        <div className="section-header">
          <div className="section-title">Note Structure — Every generated note contains</div>
          <span className="section-count">{NOTE_SECTIONS.length} sections</span>
        </div>
        <div className="structure-grid">
          {NOTE_SECTIONS.map((s, i) => (
            <div key={s.id} className="structure-chip">
              <span className="structure-num">{String(i + 1).padStart(2, "0")}</span>
              <span className="structure-icon">{s.icon}</span>
              <span className="structure-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
