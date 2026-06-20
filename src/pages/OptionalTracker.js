import React, { useState, useEffect, useRef, useCallback } from "react";
import { ANTHROPOLOGY_SYLLABUS, NOTE_SECTIONS } from "../lib/constants";

/* ── Ring progress SVG ── */
function RingProgress({ pct, color, size = 100, sw = 8 }) {
  const r      = (size - sw) / 2;
  const circ   = 2 * Math.PI * r;
  const offset = circ * (1 - pct / 100);
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth={sw} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={sw}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.9s ease" }}
      />
    </svg>
  );
}

function paperStats(paper) {
  const allTopics = paper.units.flatMap(u => u.topics);
  const total     = allTopics.length;
  const noted     = allTopics.filter(t => t.status === "noted").length;
  const revised   = allTopics.filter(t => t.revisions > 0).length;
  const pct       = total > 0 ? Math.round((noted / total) * 100) : 0;
  return { total, noted, revised, pct };
}

/* ══════════════════════════════════════════════════
   AGENT — multi-step Wikipedia fetch
══════════════════════════════════════════════════ */
const AGENT_STEPS = [
  { id: 1, label: "Searching anthropology knowledge base…" },
  { id: 2, label: "Ranking and selecting best source…"     },
  { id: 3, label: "Fetching full article content…"         },
  { id: 4, label: "Extracting & structuring UPSC notes…"  },
];

function splitIntoParagraphs(text) {
  return (text || "").split(/\n+/).map(p => p.trim()).filter(p => p.length > 40);
}

function scoreResult(title, topicName) {
  const t = title.toLowerCase();
  const q = topicName.toLowerCase();
  const keywords = q.split(/\W+/).filter(w => w.length > 3);
  let score = 0;
  keywords.forEach(kw => { if (t.includes(kw)) score += 2; });
  if (t.includes("anthropolog")) score += 3;
  if (t.includes("human"))      score += 1;
  if (t.includes("evolution"))  score += 1;
  return score;
}

function parseIntoSections(rawText, topicName) {
  const paras = splitIntoParagraphs(rawText);
  if (paras.length === 0) return null;

  /* heuristic keyword mapping → section buckets */
  const buckets = {
    definition:    [],
    classification:[],
    features:      [],
    history:       [],
    significance:  [],
    india:         [],
    scholars:      [],
    extra:         [],
  };

  const classify = p => {
    const lp = p.toLowerCase();
    if (lp.match(/defin|meaning|concept|term|refers to|is (a|an|the)/))   return "definition";
    if (lp.match(/classif|type|species|genus|order|family|taxon|variet/))  return "classification";
    if (lp.match(/character|feature|morpho|trait|structure|form|appear/))  return "features";
    if (lp.match(/histor|origin|discov|19\d\d|20\d\d|century|first found/))return "history";
    if (lp.match(/significance|importan|upsc|exam|relevance|role|impact/)) return "significance";
    if (lp.match(/india|south asia|subcontinent|indian|dravidian|aryan/))  return "india";
    if (lp.match(/scholar|researcher|anthropologist|proposed|argued|stated/))return "scholars";
    return "extra";
  };

  paras.forEach(p => buckets[classify(p)].push(p));

  /* build output — combine short buckets into "extra" */
  const out = {};
  const sectionMap = [
    { key: "definition",     label: "Definition & Introduction",  min: 1 },
    { key: "classification", label: "Classification & Types",     min: 1 },
    { key: "features",       label: "Key Characteristics",        min: 1 },
    { key: "history",        label: "Historical Development",     min: 1 },
    { key: "india",          label: "Indian Perspective",         min: 1 },
    { key: "scholars",       label: "Key Scholars & Theories",    min: 1 },
    { key: "significance",   label: "Significance for UPSC",      min: 1 },
  ];

  sectionMap.forEach(({ key, label }) => {
    const content = buckets[key];
    if (content.length >= 1) {
      out[label] = content.slice(0, 3).join(" ");
    }
  });

  /* fallback: if we barely got anything, chunk by position */
  if (Object.keys(out).length < 2) {
    const chunks = [
      ["Definition & Introduction",   paras.slice(0, 2)],
      ["Key Characteristics",         paras.slice(2, 5)],
      ["Historical Development",      paras.slice(5, 8)],
      ["Significance for UPSC",       paras.slice(8, 11)],
    ];
    chunks.forEach(([label, ps]) => {
      if (ps.length > 0) out[label] = ps.join(" ");
    });
  }

  return out;
}

async function runFetchAgent(topicName, onStep) {
  /* Step 1: search with anthropology qualifier */
  onStep(1);
  const query = encodeURIComponent(`${topicName} anthropology UPSC`);
  const searchRes = await fetch(
    `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${query}&format=json&origin=*&srlimit=8`
  );
  if (!searchRes.ok) throw new Error("search_failed");
  const searchData = await searchRes.json();
  const hits = searchData.query?.search || [];
  if (hits.length === 0) throw new Error("no_results");

  /* Step 2: rank results by relevance */
  onStep(2);
  await new Promise(r => setTimeout(r, 250));
  const ranked = [...hits].sort((a, b) => scoreResult(b.title, topicName) - scoreResult(a.title, topicName));
  const bestTitle = ranked[0].title;
  const altSources = ranked.slice(1, 4).map(h => h.title);

  /* Step 3: fetch full article text */
  onStep(3);
  const contentRes = await fetch(
    `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(bestTitle)}&prop=extracts|pageimages&exintro=0&explaintext=1&piprop=original&format=json&origin=*`
  );
  if (!contentRes.ok) throw new Error("fetch_failed");
  const contentData = await contentRes.json();
  const page = Object.values(contentData.query.pages)[0];
  if (!page || page.missing !== undefined) throw new Error("page_missing");

  /* Step 4: parse & structure */
  onStep(4);
  await new Promise(r => setTimeout(r, 300));
  const sections = parseIntoSections(page.extract, topicName);
  if (!sections || Object.keys(sections).length === 0) throw new Error("parse_failed");

  return {
    title:       page.title,
    thumbnail:   page.original?.source || null,
    url:         `https://en.wikipedia.org/wiki/${encodeURIComponent(bestTitle)}`,
    altSources,
    sections,
  };
}

/* ══════════════════════════════════════════════════
   TOPIC VIEW PANEL
══════════════════════════════════════════════════ */
function TopicPanel({ topic, notes, noteContents, onNavigate, onClose }) {
  const [step,      setStep]    = useState(0);   // 0 = idle/done, 1-4 = running
  const [result,    setResult]  = useState(null);
  const [error,     setError]   = useState(null);
  const [altIdx,    setAltIdx]  = useState(null); // currently viewing alternative
  const abortRef = useRef(false);

  /* find a matching local note by name overlap */
  const matchingNote = notes?.find(n => {
    const a = n.topic.toLowerCase();
    const b = topic.name.toLowerCase();
    const words = b.split(/\W+/).filter(w => w.length > 4);
    return words.some(w => a.includes(w));
  });
  const noteContent = matchingNote ? noteContents?.[matchingNote.id] : null;
  const isDiagram = s => typeof s === "string" && s.startsWith('{"src"');

  /* auto-fetch if no local note */
  useEffect(() => {
    if (matchingNote) return;
    abortRef.current = false;
    (async () => {
      try {
        const res = await runFetchAgent(topic.name, step => {
          if (!abortRef.current) setStep(step);
        });
        if (!abortRef.current) { setResult(res); setStep(0); }
      } catch (e) {
        if (!abortRef.current) { setError(e.message); setStep(0); }
      }
    })();
    return () => { abortRef.current = true; };
  }, [topic.id]);

  /* close on Escape */
  useEffect(() => {
    const h = e => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  const retryAlt = useCallback(async (altTitle) => {
    setError(null); setResult(null); setStep(1); setAltIdx(altTitle);
    try {
      const contentRes = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(altTitle)}&prop=extracts|pageimages&exintro=0&explaintext=1&piprop=original&format=json&origin=*`
      );
      const contentData = await contentRes.json();
      const page = Object.values(contentData.query.pages)[0];
      setStep(4);
      await new Promise(r => setTimeout(r, 200));
      const sections = parseIntoSections(page.extract, topic.name);
      setResult({
        title:     page.title,
        thumbnail: page.original?.source || null,
        url:       `https://en.wikipedia.org/wiki/${encodeURIComponent(altTitle)}`,
        altSources: [],
        sections,
      });
      setStep(0);
    } catch {
      setError("Could not load this article."); setStep(0);
    }
  }, [topic.name]);

  const isRunning = step > 0;

  return (
    <>
      <div className="syl-panel-overlay" onClick={onClose} />
      <div className="syl-panel opt-panel">
        {/* Header */}
        <div className="syl-panel-hdr">
          <div style={{ flex: 1 }}>
            <div className="opt-panel-paper-tag">Anthropology Optional</div>
            <div className="syl-panel-title">{topic.name}</div>
          </div>
          <div className="syl-panel-hdr-actions">
            {!matchingNote && (
              <button className="syl-panel-gen-btn" onClick={() => { onNavigate("generator"); onClose(); }}>
                + Generate Note
              </button>
            )}
            <button className="syl-panel-close" onClick={onClose}>✕</button>
          </div>
        </div>

        <div className="syl-panel-body">
          {/* ── Local note ── */}
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
              <button className="syl-panel-view-btn"
                onClick={() => { onNavigate("viewer", { noteId: matchingNote.id }); onClose(); }}>
                Open Full Note →
              </button>
            </div>

          ) : isRunning ? (
            /* ── Agent progress ── */
            <div className="opt-agent-progress">
              <div className="opt-agent-icon">🤖</div>
              <div className="opt-agent-title">Fetch Agent Running</div>
              <div className="opt-agent-steps">
                {AGENT_STEPS.map(s => (
                  <div key={s.id} className={`opt-agent-step ${s.id < step ? "done" : s.id === step ? "active" : "pending"}`}>
                    <span className="opt-step-icon">
                      {s.id < step ? "✓" : s.id === step ? <span className="opt-step-spinner" /> : "○"}
                    </span>
                    <span className="opt-step-label">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

          ) : error ? (
            /* ── Error ── */
            <div className="syl-panel-error">
              <div className="syl-panel-error-icon">📭</div>
              <div>Could not fetch notes for this topic.</div>
              <button className="syl-panel-gen-btn" style={{ marginTop: 14 }}
                onClick={() => { onNavigate("generator"); onClose(); }}>
                Generate a note instead →
              </button>
            </div>

          ) : result ? (
            /* ── Agent result ── */
            <div className="opt-agent-result">
              {/* Source bar */}
              <div className="opt-result-source-bar">
                <span className="syl-panel-source-badge syl-badge-wiki">
                  <span>🤖</span> Agent · Wikipedia — {result.title}
                </span>
                <a className="syl-panel-wiki-link" href={result.url} target="_blank" rel="noopener noreferrer">
                  Full article ↗
                </a>
              </div>

              {/* Thumbnail */}
              {result.thumbnail && (
                <img className="syl-panel-wiki-img" src={result.thumbnail} alt={result.title} />
              )}

              {/* Structured sections */}
              {Object.entries(result.sections).map(([label, text]) => (
                <div key={label} className="opt-result-sec">
                  <div className="opt-result-sec-label">{label}</div>
                  <div className="opt-result-sec-text">{text}</div>
                </div>
              ))}

              {/* Alternative sources */}
              {result.altSources?.length > 0 && (
                <div className="opt-alt-sources">
                  <div className="opt-alt-label">Try alternative sources:</div>
                  <div className="opt-alt-chips">
                    {result.altSources.map(alt => (
                      <button
                        key={alt}
                        className={`opt-alt-chip ${altIdx === alt ? "active" : ""}`}
                        onClick={() => retryAlt(alt)}
                      >
                        {alt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="syl-panel-wiki-actions" style={{ marginTop: 10 }}>
                <button className="syl-panel-gen-btn" onClick={() => { onNavigate("generator"); onClose(); }}>
                  Generate Full UPSC Note →
                </button>
              </div>

              <div className="syl-panel-wiki-disclaimer">
                Content sourced from Wikipedia (CC BY-SA 4.0) via Fetch Agent. For exam-ready depth, generate a structured note.
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════
   UNIT ROW
══════════════════════════════════════════════════ */
function UnitRow({ unit, onViewTopic }) {
  const [open, setOpen] = useState(false);
  const noted = unit.topics.filter(t => t.status === "noted").length;
  const total = unit.topics.length;
  const pct   = Math.round((noted / total) * 100);

  return (
    <div className={`opt-unit ${open ? "opt-unit-open" : ""}`}>
      <div className="opt-unit-header" onClick={() => setOpen(!open)}>
        <div className="opt-unit-mini-bar">
          <div className="opt-unit-mini-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="opt-unit-name">{unit.name}</span>
        <span className="opt-unit-meta">{noted}/{total}</span>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round"
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0, color: "var(--text-muted)" }}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>

      {open && (
        <div className="opt-topic-list">
          {unit.topics.map(t => (
            <div key={t.id} className={`opt-topic-row ${t.status}`}>
              <span className={`opt-status-icon ${t.status}`}>
                {t.status === "noted" ? "✓" : "○"}
              </span>
              <span className="opt-topic-name">{t.name}</span>
              <div className="opt-topic-right">
                {t.revisions > 0 && (
                  <span className="gsp-topic-rev">{t.revisions}× revised</span>
                )}
                <button
                  className={t.status === "noted" ? "gsp-view-btn opt-view-trigger" : "gsp-gen-btn opt-view-trigger"}
                  onClick={() => onViewTopic(t)}
                >
                  {t.status === "noted" ? "View" : "Fetch Notes"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   PAPER SECTION
══════════════════════════════════════════════════ */
function PaperSection({ paper, color, onViewTopic }) {
  const stats = paperStats(paper);
  return (
    <div className="opt-paper-section">
      <div className="opt-paper-header">
        <div className="opt-paper-ring-wrap">
          <RingProgress pct={stats.pct} color={color} size={90} sw={8} />
          <div className="opt-paper-ring-center">
            <span className="opt-paper-pct" style={{ color }}>{stats.pct}%</span>
          </div>
        </div>
        <div className="opt-paper-info">
          <div className="opt-paper-title">{paper.label}</div>
          <div className="opt-paper-stats-row">
            <span className="opt-pstat"><strong style={{ color: "var(--green)" }}>{stats.noted}</strong> noted</span>
            <span className="opt-psep">·</span>
            <span className="opt-pstat"><strong>{stats.total - stats.noted}</strong> pending</span>
            <span className="opt-psep">·</span>
            <span className="opt-pstat"><strong style={{ color: "var(--amber)" }}>{stats.revised}</strong> revised</span>
          </div>
          <div className="opt-paper-bar">
            <div className="opt-paper-bar-fill" style={{ width: `${stats.pct}%`, background: color }} />
          </div>
        </div>
      </div>
      <div className="opt-units">
        {paper.units.map(u => (
          <UnitRow key={u.id} unit={u} onViewTopic={onViewTopic} />
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════ */
export default function OptionalTracker({ onNavigate, notes = [], noteContents = {} }) {
  const [viewTopic, setViewTopic] = useState(null);

  const p1 = paperStats(ANTHROPOLOGY_SYLLABUS.paper1);
  const p2 = paperStats(ANTHROPOLOGY_SYLLABUS.paper2);
  const overall = {
    total:   p1.total + p2.total,
    noted:   p1.noted + p2.noted,
    revised: p1.revised + p2.revised,
  };
  const overallPct = Math.round((overall.noted / overall.total) * 100);

  const PAPER1_COLOR = "#1E3A5F";
  const PAPER2_COLOR = "#0369A1";

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Optional Subject</p>
          <h1 className="page-title">Anthropology Syllabus Tracker</h1>
        </div>
        <button className="primary-btn" onClick={() => onNavigate && onNavigate("generator")}>
          + Generate Note
        </button>
      </div>

      {/* Overall stats */}
      <div className="opt-overall-card">
        <div className="opt-overall-ring-wrap">
          <RingProgress pct={overallPct} color={PAPER1_COLOR} size={120} sw={10} />
          <div className="opt-overall-center">
            <span className="gsp-overall-pct">{overallPct}%</span>
            <span className="gsp-overall-sub">covered</span>
          </div>
        </div>
        <div className="opt-overall-stats">
          <div className="gsp-ostat">
            <span className="gsp-ostat-val">{overall.noted}</span>
            <span className="gsp-ostat-label">Topics noted</span>
          </div>
          <div className="gsp-ostat">
            <span className="gsp-ostat-val">{overall.total - overall.noted}</span>
            <span className="gsp-ostat-label">Topics pending</span>
          </div>
          <div className="gsp-ostat">
            <span className="gsp-ostat-val">{overall.revised}</span>
            <span className="gsp-ostat-label">Topics revised</span>
          </div>
          <div className="gsp-ostat">
            <span className="gsp-ostat-val">{overall.total}</span>
            <span className="gsp-ostat-label">Total topics</span>
          </div>
        </div>
        <div className="opt-overall-pills">
          <div className="opt-paper-pill" style={{ background: "#EFF6FF", color: PAPER1_COLOR }}>
            Paper I: {p1.pct}%
          </div>
          <div className="opt-paper-pill" style={{ background: "#F0F9FF", color: PAPER2_COLOR }}>
            Paper II: {p2.pct}%
          </div>
        </div>
      </div>

      {/* Info box */}
      <div className="info-box" style={{ marginBottom: 24 }}>
        <div className="info-box-icon">🤖</div>
        <div>
          <div className="info-box-title">Fetch Agent Enabled</div>
          <div className="info-box-desc">
            Click <strong>View</strong> (noted) or <strong>Fetch Notes</strong> (pending) on any topic. If no local note exists, a 4-step agent searches Wikipedia, ranks sources by anthropology relevance, fetches full content, and structures it into UPSC study sections automatically.
          </div>
        </div>
      </div>

      {/* Syllabus info box */}
      <div className="info-box" style={{ marginBottom: 24 }}>
        <div className="info-box-icon">📚</div>
        <div>
          <div className="info-box-title">Anthropology Optional — UPSC CSE</div>
          <div className="info-box-desc">
            Paper I covers Foundations, Biological Anthropology &amp; Primatology, Fossil Hominids, and Socio-Cultural theory (250 marks). Paper II covers Indian Anthropology — prehistory, caste, tribes, language and applied anthropology (250 marks). Total: 500 marks.
          </div>
        </div>
      </div>

      {/* Paper sections */}
      <div className="opt-papers-layout">
        <PaperSection
          paper={ANTHROPOLOGY_SYLLABUS.paper1}
          color={PAPER1_COLOR}
          onViewTopic={setViewTopic}
        />
        <PaperSection
          paper={ANTHROPOLOGY_SYLLABUS.paper2}
          color={PAPER2_COLOR}
          onViewTopic={setViewTopic}
        />
      </div>

      {/* Topic panel */}
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
