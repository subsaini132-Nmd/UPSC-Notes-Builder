import React, { useState, useCallback, useEffect, useRef } from "react";
import { UPSC_SYLLABUS, NOTE_SECTIONS } from "../lib/constants";

const STORAGE_KEY = "upsc_syllabus_covered";

function loadCovered() {
  try { return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")); }
  catch { return new Set(); }
}
function saveCovered(set) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
}

const PAPER_KEYS = Object.keys(UPSC_SYLLABUS);
const ALL_TOPICS = PAPER_KEYS.flatMap(k =>
  UPSC_SYLLABUS[k].sections.flatMap(s => s.topics)
);

function toWikiSlug(text) {
  return encodeURIComponent(
    text
      .replace(/[–—]/g, "-")
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "_")
  );
}

/* Panel that slides in from the right to show topic notes / Wikipedia summary */
function TopicPanel({ topic, notes, noteContents, onNavigate, onClose }) {
  const [wikiData, setWikiData] = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);
  const panelRef = useRef(null);

  // Find a matching note (case-insensitive keyword match)
  const matchingNote = notes?.find(n =>
    n.topic.toLowerCase().includes(topic.text.toLowerCase().slice(0, 20)) ||
    topic.text.toLowerCase().includes(n.topic.toLowerCase().slice(0, 20))
  );
  const noteContent = matchingNote ? noteContents?.[matchingNote.id] : null;

  useEffect(() => {
    if (matchingNote) return; // have a local note, no need to fetch

    setLoading(true);
    setError(null);
    setWikiData(null);

    const slug = toWikiSlug(topic.text);
    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${slug}`)
      .then(r => {
        if (!r.ok) throw new Error("not_found");
        return r.json();
      })
      .then(data => {
        if (data.type === "disambiguation" || !data.extract) {
          // Try a search fallback
          return fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(topic.text)}&format=json&origin=*&srlimit=1`)
            .then(r => r.json())
            .then(res => {
              const first = res?.query?.search?.[0];
              if (!first) throw new Error("not_found");
              return fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(first.title)}`);
            })
            .then(r => r.json());
        }
        return data;
      })
      .then(data => {
        setWikiData(data);
        setLoading(false);
      })
      .catch(() => {
        setError("No Wikipedia summary found for this topic.");
        setLoading(false);
      });
  }, [topic.id, matchingNote]);

  // Close on Escape
  useEffect(() => {
    const handler = e => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const isDiagram = s => typeof s === "string" && s.startsWith('{"src"');

  return (
    <>
      <div className="syl-panel-overlay" onClick={onClose} />
      <div className="syl-panel" ref={panelRef}>
        {/* Header */}
        <div className="syl-panel-hdr">
          <div className="syl-panel-title">{topic.text}</div>
          <div className="syl-panel-hdr-actions">
            {!matchingNote && (
              <button
                className="syl-panel-gen-btn"
                onClick={() => { onNavigate("generator"); onClose(); }}
              >
                + Generate Note
              </button>
            )}
            <button className="syl-panel-close" onClick={onClose} title="Close (Esc)">✕</button>
          </div>
        </div>

        <div className="syl-panel-body">
          {/* ── Local note found ── */}
          {matchingNote && noteContent ? (
            <div className="syl-panel-note">
              <div className="syl-panel-source-badge syl-badge-local">
                <span>📝</span> Your Note — {matchingNote.topic}
              </div>
              <div className="syl-panel-note-meta">
                {matchingNote.date} · {matchingNote.wordCount?.toLocaleString()} words · {matchingNote.sections} sections
              </div>

              {NOTE_SECTIONS?.map(sec => {
                const text = noteContent.sections?.[sec.id];
                if (!text || isDiagram(text)) return null;
                return (
                  <div key={sec.id} className="syl-panel-sec">
                    <div className="syl-panel-sec-label">{sec.label}</div>
                    <div className="syl-panel-sec-text">{text}</div>
                  </div>
                );
              })}

              <button
                className="syl-panel-view-btn"
                onClick={() => { onNavigate("viewer", { noteId: matchingNote.id }); onClose(); }}
              >
                Open Full Note →
              </button>
            </div>
          ) : loading ? (
            <div className="syl-panel-loading">
              <div className="syl-panel-spinner" />
              <div>Fetching notes from Wikipedia…</div>
            </div>
          ) : error ? (
            <div className="syl-panel-error">
              <div className="syl-panel-error-icon">📭</div>
              <div>{error}</div>
              <button
                className="syl-panel-gen-btn"
                style={{ marginTop: 14 }}
                onClick={() => { onNavigate("generator"); onClose(); }}
              >
                Generate a note on this topic →
              </button>
            </div>
          ) : wikiData ? (
            <div className="syl-panel-wiki">
              <div className="syl-panel-source-badge syl-badge-wiki">
                <span>🌐</span> Wikipedia · {wikiData.titles?.normalized || wikiData.title}
              </div>

              {wikiData.thumbnail?.source && (
                <img
                  className="syl-panel-wiki-img"
                  src={wikiData.thumbnail.source}
                  alt={wikiData.title}
                />
              )}

              <p className="syl-panel-wiki-extract">{wikiData.extract}</p>

              <div className="syl-panel-wiki-actions">
                <a
                  className="syl-panel-wiki-link"
                  href={wikiData.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${toWikiSlug(topic.text)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read full article on Wikipedia ↗
                </a>
                <button
                  className="syl-panel-gen-btn"
                  onClick={() => { onNavigate("generator"); onClose(); }}
                >
                  Generate UPSC Note →
                </button>
              </div>

              <div className="syl-panel-wiki-disclaimer">
                Content from Wikipedia under CC BY-SA 4.0. For UPSC depth, generate a structured note.
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}

export default function SyllabusTracker({ onNavigate, notes = [], noteContents = {} }) {
  const [paper,    setPaper]    = useState("gs1");
  const [filter,   setFilter]   = useState("all");
  const [covered,  setCovered]  = useState(loadCovered);
  const [viewTopic, setViewTopic] = useState(null);

  const toggle = useCallback((id) => {
    setCovered(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      saveCovered(next);
      return next;
    });
  }, []);

  const markAll = (ids, value) => {
    setCovered(prev => {
      const next = new Set(prev);
      ids.forEach(id => value ? next.add(id) : next.delete(id));
      saveCovered(next);
      return next;
    });
  };

  const resetAll = () => { setCovered(new Set()); saveCovered(new Set()); };

  const cur = UPSC_SYLLABUS[paper];
  const curTopics = cur.sections.flatMap(s => s.topics);
  const coveredInPaper = curTopics.filter(t => covered.has(t.id)).length;
  const paperPct = curTopics.length ? Math.round((coveredInPaper / curTopics.length) * 100) : 0;
  const totalPct  = ALL_TOPICS.length ? Math.round((covered.size / ALL_TOPICS.length) * 100) : 0;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Syllabus Tracker</p>
          <h1 className="page-title">UPSC Mains Syllabus</h1>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <div className="syl-total-badge">
            {covered.size} / {ALL_TOPICS.length} covered · <strong>{totalPct}%</strong>
          </div>
          <button className="viewer-action-btn" onClick={resetAll}>Reset All</button>
        </div>
      </div>

      {/* Overall progress cards */}
      <div className="syl-overview">
        {PAPER_KEYS.map(key => {
          const p = UPSC_SYLLABUS[key];
          const topics = p.sections.flatMap(s => s.topics);
          const done = topics.filter(t => covered.has(t.id)).length;
          const pct  = topics.length ? Math.round((done / topics.length) * 100) : 0;
          return (
            <button
              key={key}
              className={`syl-paper-card ${paper === key ? "syl-paper-active" : ""}`}
              style={{ borderColor: paper === key ? p.color : undefined }}
              onClick={() => setPaper(key)}
            >
              <div className="syl-paper-label" style={{ color: p.color }}>{p.label}</div>
              <div className="syl-paper-desc">{p.desc}</div>
              <div className="syl-paper-pct" style={{ color: p.color }}>{pct}%</div>
              <div className="syl-paper-bar-track">
                <div className="syl-paper-bar-fill" style={{ width: `${pct}%`, background: p.color }} />
              </div>
              <div className="syl-paper-sub">{done}/{topics.length} topics</div>
            </button>
          );
        })}
      </div>

      {/* Filter + paper title */}
      <div className="syl-filter-row">
        <div className="syl-filter-info">
          <span className="syl-filter-paper" style={{ color: cur.color }}>{cur.label}</span>
          <span className="syl-filter-stat">{coveredInPaper}/{curTopics.length} topics · {paperPct}% covered</span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <div className="syl-filter-tabs">
            {["all", "covered", "pending"].map(f => (
              <button
                key={f}
                className={`syl-filter-btn ${filter === f ? "syl-filter-active" : ""}`}
                style={filter === f ? { borderColor: cur.color, color: cur.color } : {}}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <button
            className="viewer-action-btn"
            onClick={() => markAll(curTopics.map(t => t.id), true)}
          >
            ✓ Mark all
          </button>
          <button
            className="viewer-action-btn"
            onClick={() => markAll(curTopics.map(t => t.id), false)}
          >
            Clear paper
          </button>
        </div>
      </div>

      {/* Sections */}
      <div className="syl-sections">
        {cur.sections.map((sec, si) => {
          const visible = filter === "all"      ? sec.topics
            : filter === "covered" ? sec.topics.filter(t =>  covered.has(t.id))
            :                        sec.topics.filter(t => !covered.has(t.id));
          if (visible.length === 0) return null;

          const secDone = sec.topics.filter(t => covered.has(t.id)).length;
          const secPct  = sec.topics.length ? Math.round((secDone / sec.topics.length) * 100) : 0;

          return (
            <div key={sec.id} className="syl-section">
              <div className="syl-section-hdr">
                <span className="syl-section-num">{String(si + 1).padStart(2, "0")}</span>
                <span className="syl-section-title">{sec.title}</span>
                <div className="syl-section-progress">
                  <span className="syl-section-pct" style={{ color: cur.color }}>{secDone}/{sec.topics.length}</span>
                  <div className="syl-section-bar-track">
                    <div className="syl-section-bar-fill" style={{ width: `${secPct}%`, background: cur.color }} />
                  </div>
                </div>
              </div>

              <div className="syl-topics">
                {visible.map(topic => (
                  <div key={topic.id} className={`syl-topic-row ${covered.has(topic.id) ? "syl-topic-done" : ""}`}>
                    <label className="syl-topic-label">
                      <input
                        type="checkbox"
                        className="syl-checkbox"
                        checked={covered.has(topic.id)}
                        onChange={() => toggle(topic.id)}
                      />
                      <span className="syl-topic-text">{topic.text}</span>
                    </label>
                    <button
                      className="syl-view-btn"
                      onClick={() => setViewTopic(topic)}
                      title="View notes or fetch from internet"
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {filter !== "all" && cur.sections.every(sec => {
        const visible = filter === "covered"
          ? sec.topics.filter(t =>  covered.has(t.id))
          : sec.topics.filter(t => !covered.has(t.id));
        return visible.length === 0;
      }) && (
        <div className="empty-state">
          <div className="empty-icon">{filter === "covered" ? "📭" : "🎉"}</div>
          <div className="empty-title">
            {filter === "covered" ? "No topics marked yet" : "All topics in this paper are covered!"}
          </div>
          <button className="viewer-action-btn" onClick={() => setFilter("all")}>Show All</button>
        </div>
      )}

      {/* Topic notes panel */}
      {viewTopic && (
        <TopicPanel
          topic={viewTopic}
          notes={notes}
          noteContents={noteContents}
          onNavigate={onNavigate}
          onClose={() => setViewTopic(null)}
        />
      )}
    </div>
  );
}
