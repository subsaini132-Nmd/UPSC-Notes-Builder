import React, { useState } from "react";
import { SAMPLE_NOTES, GS_TAGS } from "../lib/constants";

export default function MyNotes({ onNavigate, notes = SAMPLE_NOTES }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = notes.filter(n => {
    const matchGs = filter === "all" || n.gs === filter;
    const matchQ  = n.topic.toLowerCase().includes(search.toLowerCase());
    return matchGs && matchQ;
  });

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">My Notes</p>
          <h1 className="page-title">All Generated Notes</h1>
        </div>
        <button className="primary-btn" onClick={() => onNavigate("generator")}>+ New Note</button>
      </div>

      {/* Filter bar */}
      <div className="filter-bar">
        <input className="filter-search" placeholder="Search notes…" value={search}
          onChange={e => setSearch(e.target.value)} />
        <div className="filter-pills">
          <button className={`filter-pill ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>All</button>
          {GS_TAGS.map(g => (
            <button key={g.id}
              className={`filter-pill ${filter === g.id ? "active" : ""}`}
              style={filter === g.id ? { background: g.bg, color: g.color, borderColor: g.color } : {}}
              onClick={() => setFilter(filter === g.id ? "all" : g.id)}>
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notes grid */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <div className="empty-title">No notes yet</div>
          <div className="empty-sub">Generate your first note from a UPSC topic</div>
          <button className="primary-btn" onClick={() => onNavigate("generator")}>Generate Note</button>
        </div>
      ) : (
        <div className="notes-grid">
          {filtered.map(note => {
            const gsTag = GS_TAGS.find(g => g.id === note.gs);
            return (
              <div key={note.id} className="note-card" onClick={() => onNavigate("viewer", { noteId: note.id })}>
                <div className="note-card-header">
                  {gsTag && (
                    <span className="gs-pill" style={{ background: gsTag.bg, color: gsTag.color }}>
                      {gsTag.label}
                    </span>
                  )}
                  <span className={`status-pill ${note.status}`}>{note.status}</span>
                </div>
                <h3 className="note-card-title">{note.topic}</h3>
                <div className="note-card-meta">
                  <span>{note.sections} sections</span>
                  <span>·</span>
                  <span>{note.wordCount.toLocaleString()} words</span>
                  <span>·</span>
                  <span>{note.date}</span>
                </div>
                <div className="note-card-footer">
                  <button className="card-action-btn" onClick={e => { e.stopPropagation(); onNavigate("editor", { noteId: note.id }); }}>Edit</button>
                  <button className="card-action-btn" onClick={e => { e.stopPropagation(); }}>Export</button>
                  <button className="card-action-btn primary" onClick={e => { e.stopPropagation(); onNavigate("viewer", { noteId: note.id }); }}>Open →</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
