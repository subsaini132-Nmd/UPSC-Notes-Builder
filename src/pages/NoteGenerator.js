import React, { useState, useEffect, useCallback } from "react";
import {
  SAMPLE_TOPICS, GS_TAGS, SAMPLE_PDFS,
  getSectionsForTopic, detectTopicCategory, TOPIC_CATEGORIES,
} from "../lib/constants";
import { searchPdfContent, getTopicSuggestions } from "../lib/pdfExtract";

const TODAY = new Date().toISOString().slice(0, 10);

// ── Source docs from localStorage ────────────────────────────────────────────

function loadIndexedDocs() {
  try {
    const saved = localStorage.getItem("upsc_library_docs");
    if (saved) return JSON.parse(saved).filter(d => d.status === "indexed");
  } catch {}
  return SAMPLE_PDFS.filter(d => d.status === "indexed");
}

// ── GS auto-detect ────────────────────────────────────────────────────────────

function detectGs(topic) {
  const t = topic.toLowerCase();
  if (/history|heritage|culture|art|society|social|gender|women|tribe|geography|river|climate|disaster|ancient|medieval|mughal|empire|civilization|freedom|colonial|nationalism|bhakti|sufi|sculpture|painting|architecture|maratha/.test(t)) return "gs1";
  if (/polity|governance|constitution|parliament|federal|rights|welfare|international|policy|scheme|foreign|bilateral|judiciary|election|amendment|panchayat|lokpal|rti/.test(t)) return "gs2";
  if (/economy|agriculture|food|energy|infrastructure|technology|science|environment|biodiversity|security|cyber|digital|industry|msme|gst|gdp|manufacturing|startup/.test(t)) return "gs3";
  if (/ethics|integrity|attitude|aptitude|corruption|probity|emotional|case study|civil servant|public service|whistle|dilemma/.test(t)) return "gs4";
  return "gs2";
}

// ── Wikipedia fetching ────────────────────────────────────────────────────────

async function resolveWikiTitle(topic) {
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(topic)}&limit=3&format=json&origin=*`;
    const res  = await fetch(url, { signal: AbortSignal.timeout(6000) });
    const data = await res.json();
    return data[1]?.[0] || topic;
  } catch { return topic; }
}

async function fetchWikiExtract(title) {
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query` +
      `&titles=${encodeURIComponent(title)}` +
      `&prop=extracts&format=json&origin=*` +
      `&explaintext=true&exsectionformat=plain&exchars=18000`;
    const res  = await fetch(url, { signal: AbortSignal.timeout(8000) });
    const data = await res.json();
    const pages = data?.query?.pages || {};
    const page  = Object.values(pages)[0];
    if (!page || page.missing || !page.extract) return null;
    return { title: page.title, extract: page.extract };
  } catch { return null; }
}

function parseWikiSections(extract) {
  const sections = {};
  let currentKey = "__intro__";
  let buffer     = [];
  for (const line of extract.split("\n")) {
    const m = line.match(/^={2,4}\s*(.+?)\s*={2,4}$/);
    if (m) {
      sections[currentKey] = buffer.join("\n").trim();
      currentKey = m[1].toLowerCase();
      buffer     = [];
    } else {
      buffer.push(line);
    }
  }
  sections[currentKey] = buffer.join("\n").trim();
  return sections;
}

// Pick best Wikipedia content for a dynamic section using its key phrases
function pickWikiForSection(sec, wikiSecs) {
  const phrases   = (sec.pdfKeyPhrases || []).map(p => p.toLowerCase());
  const labelWords = sec.label.toLowerCase().split(/\W+/).filter(w => w.length > 3);

  let best = { score: 0, text: null, key: "" };

  for (const [wKey, wText] of Object.entries(wikiSecs)) {
    if (!wText || wText.length < 80) continue;
    const lower     = wText.toLowerCase();
    const wKeyLower = wKey.toLowerCase();
    const phraseHits = phrases.reduce((s, p) => s + (lower.includes(p) ? 3 : 0), 0);
    const labelHits  = labelWords.reduce((s, w) => s + (wKeyLower.includes(w) ? 2 : 0), 0);
    const score = phraseHits + labelHits;
    if (score > best.score) best = { score, text: wText, key: wKey };
  }

  // Always fall back to intro for definition/overview sections
  const isIntroSection = /overview|introduction|definition|concept|about|location/i.test(sec.label);
  if ((!best.text || best.score < 2) && wikiSecs["__intro__"]) {
    if (isIntroSection || !best.text) best.text = wikiSecs["__intro__"];
  }

  if (!best.text) return null;

  // Format: extract meaningful paragraphs, cap at ~100 words
  const paras = best.text.split("\n\n").filter(p => p.trim().length > 40);
  if (!paras.length) return null;
  const words = paras.slice(0, 3).join("\n\n").replace(/\[\d+\]/g, "").trim().split(/\s+/);
  return words.slice(0, 120).join(" ");
}

// Build a UPSC-style template for any section using its label and hint
function buildFallback(sec, topic) {
  const { label, hint, id } = sec;
  if (id === "wayforward" || /way forward/i.test(label)) {
    return `Way Forward for ${topic}:\n• Short-term: [Immediate administrative and policy actions]\n• Medium-term: [Legislative reforms, institutional capacity]\n• Long-term: [Structural transformation, SDG alignment]\n• Key stakeholders: Government | Civil Society | Private Sector | International`;
  }
  if (id === "conclusion") {
    return `${topic} represents a critical area that demands coordinated multi-stakeholder action. ${hint || "A comprehensive policy framework addressing root causes while leveraging India's strengths is essential."} Political will, institutional capacity, and citizen participation must converge for sustainable outcomes.`;
  }
  // Generic UPSC-template
  return `${label} — ${topic}:\n• ${hint || "Add dimension-specific analysis"}\n• [Cite relevant data: NITI Aayog / Economic Survey / MHA / PIB / CAG]\n• [Add examples from Indian states or global best practices]\n• [Include policy/constitutional/legal angle where applicable]`;
}

// ── Content generation ────────────────────────────────────────────────────────

// sectionConfigs: array of { id, label, icon, pdfKeyPhrases, hint }
async function generateContent(topic, gs, sectionConfigs, docIds = []) {
  // Priority 1 — Search PDF library using section-specific phrases
  let pdfChunks = {};
  try {
    pdfChunks = await searchPdfContent(docIds, topic, sectionConfigs);
  } catch {}

  // Priority 2 — Wikipedia
  let wikiSecs = null;
  const wikiTitle = await resolveWikiTitle(topic);
  const wikiData  = await fetchWikiExtract(wikiTitle);
  if (wikiData?.extract) wikiSecs = parseWikiSections(wikiData.extract);

  const sections  = {};
  const _sources  = {};

  for (const sec of sectionConfigs) {
    const sid = sec.id;
    let content = null;
    let source  = "template";

    // PDF content — pre-formatted text from searchPdfContent
    if (pdfChunks[sid] && pdfChunks[sid].length >= 50) {
      content = pdfChunks[sid];
      source  = "pdf";
    }

    // Wikipedia — phrase-guided section matching
    if (!content && wikiSecs) {
      const wikiText = pickWikiForSection(sec, wikiSecs);
      if (wikiText && wikiText.trim().length >= 50) {
        content = wikiText;
        source  = "wiki";
      }
    }

    // Fallback template
    if (!content) {
      content = buildFallback(sec, topic);
      source  = "template";
    }

    sections[sid] = content;
    _sources[sid] = source;
  }

  return {
    topic,
    gs,
    date:           TODAY,
    wordCount:      sectionConfigs.length * 80,
    wikiTitle:      wikiData?.title || null,
    _sources,
    _sectionConfig: sectionConfigs.map(({ id, label, icon }) => ({ id, label, icon })),
    sections,
  };
}

// ── Category display config ───────────────────────────────────────────────────

const CAT_META = {
  GEOGRAPHY:     { label: "Geography",          icon: "🗺️",  color: "#0369A1", bg: "#F0F9FF" },
  HISTORY:       { label: "History & Culture",  icon: "📜",  color: "#7C3AED", bg: "#F5F3FF" },
  SECURITY:      { label: "Internal Security",  icon: "🛡️",  color: "#DC2626", bg: "#FEF2F2" },
  ENVIRONMENT:   { label: "Environment",        icon: "🌿",  color: "#059669", bg: "#ECFDF5" },
  ECONOMY:       { label: "Economy",            icon: "📈",  color: "#D97706", bg: "#FFFBEB" },
  POLITY:        { label: "Polity & Governance",icon: "⚖️",  color: "#1E3A5F", bg: "#EFF6FF" },
  SCIENCE_TECH:  { label: "Science & Tech",     icon: "🔬",  color: "#0891B2", bg: "#ECFEFF" },
  SOCIETY:       { label: "Society & Social",   icon: "👥",  color: "#7C2D12", bg: "#FFF7ED" },
  INTERNATIONAL: { label: "International",      icon: "🌐",  color: "#065F46", bg: "#ECFDF5" },
  ETHICS:        { label: "Ethics",             icon: "🧭",  color: "#92400E", bg: "#FFFBEB" },
  GENERIC:       { label: "General Topic",      icon: "📖",  color: "#4A4A6A", bg: "#F7F5F0" },
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function NoteGenerator({ onNavigate, onCreateNote }) {
  const [topic,          setTopic]          = useState("");
  const [gsPaper,        setGsPaper]        = useState("auto");
  const [step,           setStep]           = useState("input");
  const [sourcePdf,      setSourcePdf]      = useState("all");
  const [genLabel,       setGenLabel]       = useState("");
  const [pdfSuggestions, setPdfSuggestions] = useState([]);
  const [loadingSugg,    setLoadingSugg]    = useState(false);

  // Dynamic section state
  const [dynamicSections, setDynamicSections] = useState([]);
  const [topicCategory,   setTopicCategory]   = useState("GENERIC");
  const [selected,        setSelected]        = useState([]); // section IDs to include

  const [indexedDocs, setIndexedDocs] = useState(loadIndexedDocs);
  useEffect(() => { setIndexedDocs(loadIndexedDocs()); }, []);

  const refreshDocs = useCallback(() => setIndexedDocs(loadIndexedDocs()), []);

  const activeDocs   = sourcePdf === "all" ? indexedDocs : indexedDocs.filter(d => d.id === sourcePdf);
  const activeChunks = activeDocs.reduce((s, d) => s + (d.chunks || 0), 0);

  // Re-classify topic and update sections whenever topic changes
  useEffect(() => {
    if (!topic.trim()) {
      setDynamicSections([]);
      setTopicCategory("GENERIC");
      setSelected([]);
      return;
    }
    const cat  = detectTopicCategory(topic.trim());
    const secs = getSectionsForTopic(topic.trim());
    setTopicCategory(cat);
    setDynamicSections(secs);
    setSelected(secs.map(s => s.id)); // default: all selected
  }, [topic]);

  // PDF topic suggestions
  useEffect(() => {
    const ids = activeDocs.map(d => d.id);
    if (ids.length === 0) { setPdfSuggestions([]); return; }
    setLoadingSugg(true);
    getTopicSuggestions(ids)
      .then(s => { setPdfSuggestions(s); setLoadingSugg(false); })
      .catch(() => setLoadingSugg(false));
  // eslint-disable-next-line
  }, [sourcePdf, indexedDocs]);

  const toggleSection = (id) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const selectedConfigs = dynamicSections.filter(s => selected.includes(s.id));

  const handleGenerate = async () => {
    if (!topic.trim() || selectedConfigs.length === 0) return;
    setStep("generating");

    const resolvedGs = gsPaper === "auto" ? detectGs(topic) : gsPaper;
    const noteId     = `note-${Date.now()}`;
    const catMeta    = CAT_META[topicCategory] || CAT_META.GENERIC;

    setGenLabel(`Classified: ${catMeta.label} — searching PDFs…`);
    const content = await generateContent(
      topic.trim(), resolvedGs, selectedConfigs, activeDocs.map(d => d.id)
    );

    setGenLabel("Building adaptive note structure…");
    await new Promise(r => setTimeout(r, 500));

    const meta = {
      id:        noteId,
      topic:     topic.trim(),
      gs:        resolvedGs,
      category:  topicCategory,
      wordCount: selectedConfigs.length * 80,
      date:      TODAY,
      sections:  selectedConfigs.length,
      status:    "draft",
    };

    if (onCreateNote) {
      onCreateNote(meta, content);
    } else {
      onNavigate("notes");
    }
  };

  // ── Generating screen ─────────────────────────────────────────────────────

  if (step === "generating") {
    const catMeta = CAT_META[topicCategory] || CAT_META.GENERIC;
    return (
      <div className="page generating-page">
        <div className="generating-card">
          <div className="generating-spinner" />
          <div className="gen-category-badge" style={{ background: catMeta.bg, color: catMeta.color }}>
            {catMeta.icon} {catMeta.label}
          </div>
          <div className="generating-topic">{topic}</div>
          <div className="generating-label">{genLabel}</div>
          <div className="generating-steps">
            {[
              `Classifying as ${catMeta.label} topic`,
              "Searching your PDF library",
              "Fetching Wikipedia content",
              `Building ${selectedConfigs.length} adaptive sections`,
            ].map((s, i) => (
              <div key={s} className="gen-step">
                <div className="gen-step-dot active" style={{ animationDelay: `${i * 0.5}s` }} />
                <span>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Input screen ──────────────────────────────────────────────────────────

  const catMeta = topic.trim() ? (CAT_META[topicCategory] || CAT_META.GENERIC) : null;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Note Generator</p>
          <h1 className="page-title">Generate a UPSC Mains Note</h1>
        </div>
      </div>

      <div className="gen-input-card">
        <label className="gen-field-label">Topic</label>
        <div className="gen-topic-row">
          <input
            className="gen-input"
            placeholder="e.g. Siliguri Corridor, Vijayanagara Empire, Left Wing Extremism…"
            value={topic}
            onChange={e => setTopic(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleGenerate()}
          />
          {catMeta && (
            <div className="gen-category-badge" style={{ background: catMeta.bg, color: catMeta.color }}>
              {catMeta.icon} {catMeta.label}
            </div>
          )}
        </div>

        {/* Quick topic chips */}
        <div className="gen-suggestions">
          {SAMPLE_TOPICS.slice(0, 8).map(t => (
            <button key={t} className="suggestion-chip" onClick={() => setTopic(t)}>{t}</button>
          ))}
        </div>

        <div className="gen-row">
          <div className="gen-field">
            <label className="gen-field-label">GS Paper</label>
            <select className="gen-select" value={gsPaper} onChange={e => setGsPaper(e.target.value)}>
              <option value="auto">Auto-detect</option>
              {GS_TAGS.map(g => <option key={g.id} value={g.id}>{g.label} — {g.desc}</option>)}
            </select>
          </div>
          <div className="gen-field">
            <div className="gen-src-label-row">
              <label className="gen-field-label">Source PDFs</label>
              <button className="gen-refresh-btn" onClick={refreshDocs} title="Reload from PDF Library">
                ↻ Refresh ({indexedDocs.length})
              </button>
            </div>
            <select className="gen-select" value={sourcePdf} onChange={e => setSourcePdf(e.target.value)}>
              <option value="all">All indexed docs ({indexedDocs.length} source{indexedDocs.length !== 1 ? "s" : ""})</option>
              {indexedDocs.map(d => (
                <option key={d.id} value={d.id}>{d.name} ({(d.chunks || 0).toLocaleString()} chunks)</option>
              ))}
            </select>
            {indexedDocs.length === 0 && (
              <div className="gen-no-docs-hint">
                No indexed documents —{" "}
                <button className="gen-link" onClick={() => onNavigate && onNavigate("library")}>upload in PDF Library</button>
              </div>
            )}
          </div>
        </div>

        {/* PDF topic suggestions */}
        {(pdfSuggestions.length > 0 || loadingSugg) && (
          <div className="gen-pdf-topics">
            <div className="gen-pdf-topics-label">
              <span className="gen-pdf-topics-icon">📄</span>
              Topics detected in your PDFs — click to use:
            </div>
            {loadingSugg
              ? <div className="gen-pdf-topics-loading">Scanning PDF content…</div>
              : (
                <div className="gen-pdf-topics-chips">
                  {pdfSuggestions.map(t => (
                    <button key={t} className="gen-pdf-chip" onClick={() => setTopic(t)}>{t}</button>
                  ))}
                </div>
              )
            }
          </div>
        )}

        <div className="gen-wiki-note">
          <span className="gen-wiki-icon">✦</span>
          Sections auto-adapt to the topic type · PDFs first · Wikipedia fallback · UPSC templates last
        </div>
      </div>

      {/* Adaptive section picker */}
      <div className="gen-section-card">
        {!topic.trim() ? (
          <div className="gen-section-empty">
            <div className="gen-section-empty-icon">🎯</div>
            <div className="gen-section-empty-title">Enter a topic above to see relevant UPSC sections</div>
            <div className="gen-section-empty-sub">
              Sections adapt to the topic type: Geography notes get different dimensions than Security or History notes.
            </div>
          </div>
        ) : (
          <>
            <div className="gen-section-header">
              <div className="gen-section-title-wrap">
                <div className="gen-section-title">
                  {catMeta?.icon} {catMeta?.label} Note Sections
                </div>
                <div className="gen-section-hint">
                  These dimensions are specifically chosen for this topic type
                </div>
              </div>
              <div className="gen-section-actions">
                <button className="gen-link" onClick={() => setSelected(dynamicSections.map(s => s.id))}>Select all</button>
                <span>·</span>
                <button className="gen-link" onClick={() => setSelected([])}>Clear</button>
                <span className="gen-section-count">{selected.length}/{dynamicSections.length} selected</span>
              </div>
            </div>
            <div className="section-picker-list">
              {dynamicSections.map(s => (
                <label
                  key={s.id}
                  className={`section-picker-row ${selected.includes(s.id) ? "picked" : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(s.id)}
                    onChange={() => toggleSection(s.id)}
                  />
                  <span className="sp-icon">{s.icon}</span>
                  <div className="sp-info">
                    <span className="sp-label">{s.label}</span>
                    {s.hint && <span className="sp-hint">{s.hint}</span>}
                  </div>
                </label>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="gen-footer">
        <div className="gen-footer-info">
          <span className="gen-footer-icon">🔍</span>
          Will search <strong>{activeChunks.toLocaleString()} chunks</strong> across{" "}
          {sourcePdf === "all"
            ? <><strong>{indexedDocs.length}</strong> doc{indexedDocs.length !== 1 ? "s" : ""}</>
            : <strong>{activeDocs[0]?.name || "selected doc"}</strong>
          }
          {" + Wikipedia"}
        </div>
        <button
          className="primary-btn large"
          onClick={handleGenerate}
          disabled={!topic.trim() || selectedConfigs.length === 0}
        >
          ✦ Generate Note ({selectedConfigs.length} sections)
        </button>
      </div>
    </div>
  );
}
