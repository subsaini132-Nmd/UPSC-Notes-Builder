import React, { useState, useEffect, useRef } from "react";
import { GS_TAGS } from "../lib/constants";
import { searchPdfForAnswer } from "../lib/pdfExtract";

// ── Constants ─────────────────────────────────────────────────────────────────

const WORD_LIMITS = [
  { val: 150,  label: "150 words",  mark: "10m",  hint: "~3 sections" },
  { val: 250,  label: "250 words",  mark: "15m",  hint: "~4-5 sections" },
  { val: 350,  label: "350 words",  mark: "20m",  hint: "~6 sections" },
];

const TODAY = new Date().toISOString().slice(0, 10);

// ── Question parser ───────────────────────────────────────────────────────────

const DIRECTIVE_MAP = [
  { re: /critically\s+(analyze|analyse)/i,   key: "critically_analyze" },
  { re: /critically\s+evaluate/i,             key: "critically_evaluate" },
  { re: /critically\s+examine/i,              key: "critically_examine" },
  { re: /critically\s+comment/i,              key: "critically_comment" },
  { re: /\b(analyze|analyse)\b/i,             key: "analyze" },
  { re: /\bevaluate\b/i,                      key: "evaluate" },
  { re: /\bexamine\b/i,                       key: "examine" },
  { re: /\bdiscuss\b/i,                       key: "discuss" },
  { re: /\bcomment\b/i,                       key: "comment" },
  { re: /\bhighlight\b/i,                     key: "highlight" },
  { re: /\belaborate\b|\belucidate\b/i,       key: "elucidate" },
  { re: /\bexplain\b/i,                       key: "explain" },
  { re: /how\s+far|to\s+what\s+extent/i,      key: "how_far" },
  { re: /\bcompare\b|\bcontrast\b/i,          key: "compare" },
  { re: /\bassess\b|\bappraise\b/i,           key: "assess" },
  { re: /\bjustify\b/i,                       key: "justify" },
  { re: /\bthrow\s+light/i,                   key: "explain" },
  { re: /\bbriefly/i,                         key: "comment" },
];

const DIM_WORDS = ["economic","social","political","environmental","cultural","historical",
  "geographical","strategic","security","constitutional","legal","technological","ethical",
  "administrative","scientific","international","diplomatic"];

function parseQuestion(text) {
  if (!text.trim()) return null;

  let directive = "discuss";
  for (const { re, key } of DIRECTIVE_MAP) {
    if (re.test(text)) { directive = key; break; }
  }

  // Extract explicit dimensions mentioned in the question
  const lower = text.toLowerCase();
  const explicitDims = DIM_WORDS.filter(d => lower.includes(d));

  // Best-effort topic extraction: strip directive phrase + framing words
  let topicRaw = text
    .replace(/critically\s+(analyze|analyse|evaluate|examine|comment)\s+(the\s+|on\s+)?/gi, "")
    .replace(/\b(analyze|analyse|evaluate|examine|discuss|comment\s+on|highlight|explain|elaborate|elucidate|assess|justify|briefly)\s+(the\s+|on\s+)?/gi, "")
    .replace(/how\s+far\s+(is|are|has|have|do|does)\s+/gi, "")
    .replace(/to\s+what\s+extent\s+/gi, "")
    .replace(/throw\s+light\s+on\s+(the\s+)?/gi, "")
    .replace(/in\s+(this|the)\s+context[.,]?\s*/gi, "")
    .replace(/with\s+(reference|regard)\s+to\s+/gi, "")
    .replace(/\(\d{4}\)/g, "")
    .replace(/\s+/g, " ")
    .trim();

  // Remove trailing question mark and cleanup
  topicRaw = topicRaw.replace(/[?.]$/, "").trim();

  // Detect GS paper
  let gs = "gs2";
  const l = lower;
  if (/history|heritage|culture|art|society|social|gender|women|tribe|geography|river|climate|disaster|ancient|medieval|mughal|empire|civilization|freedom|colonial|nationalism|bhakti|sufi|sculpture|painting|architecture/.test(l)) gs = "gs1";
  else if (/economy|agriculture|food|energy|infrastructure|technology|science|environment|biodiversity|security|cyber|digital|industry|msme|gst|gdp|manufacturing|startup|extremism|insurgency|disaster/.test(l)) gs = "gs3";
  else if (/ethics|integrity|attitude|aptitude|corruption|probity|emotional|civil servant|public service|whistle|dilemma/.test(l)) gs = "gs4";

  // Build answer sections based on directive + explicit dimensions
  const sections = buildSections(directive, explicitDims, topicRaw);

  return { directive, topic: topicRaw, explicitDims, gs, sections };
}

function buildSections(directive, explicitDims, topic) {
  // If question explicitly mentions dimensions, use those
  if (explicitDims.length >= 2) {
    return [
      ...explicitDims.map(d => ({
        id: d,
        label: d.charAt(0).toUpperCase() + d.slice(1) + " Dimension",
        hints: d + " aspects perspective analysis " + topic,
        icon: dimIcon(d),
      })),
      { id: "wayforward", label: "Way Forward", hints: "recommendations measures solutions steps", icon: "✅" },
    ];
  }

  // Directive-specific structures
  switch (directive) {
    case "critically_analyze":
    case "critically_evaluate":
      return [
        { id: "background",   label: "Background & Context",     hints: "background history context origin evolution",          icon: "🕰" },
        { id: "significance", label: "Significance",             hints: "significance importance role impact need relevance",   icon: "⭐" },
        { id: "strengths",    label: "Strengths / Achievements", hints: "achievements advantages success positive outcomes",     icon: "✅" },
        { id: "challenges",   label: "Challenges / Criticisms",  hints: "challenges issues problems criticism failure gaps",    icon: "⚠️" },
        { id: "wayforward",   label: "Way Forward",              hints: "recommendations solutions reform measures steps",      icon: "🎯" },
      ];
    case "compare":
      return [
        { id: "intro_a",    label: `Overview`,                  hints: "background context introduction overview",             icon: "📖" },
        { id: "similarity", label: "Similarities",              hints: "similarities common features shared aspects",          icon: "🔗" },
        { id: "difference", label: "Differences",               hints: "differences distinctions contrast unlike",             icon: "⚖️" },
        { id: "analysis",   label: "Critical Analysis",         hints: "analysis implications significance impact",            icon: "🔍" },
        { id: "wayforward", label: "Conclusion",                hints: "conclusion summary way forward recommendation",        icon: "🎯" },
      ];
    case "how_far":
    case "evaluate":
    case "assess":
      return [
        { id: "context",    label: "Context",                   hints: "background context origin significance introduction",  icon: "📖" },
        { id: "for",        label: "Arguments in Favour",       hints: "reasons supporting evidence achievements positive",    icon: "✅" },
        { id: "against",    label: "Arguments Against / Gaps",  hints: "gaps criticism failure challenges issues against",     icon: "⚠️" },
        { id: "analysis",   label: "Balanced Assessment",       hints: "balanced view middle ground nuance analysis evidence", icon: "⚖️" },
        { id: "wayforward", label: "Way Forward",               hints: "recommendations reform steps solution measures",       icon: "🎯" },
      ];
    case "discuss":
    default:
      return [
        { id: "background",  label: "Background",               hints: "background history context origin evolution established", icon: "🕰" },
        { id: "significance",label: "Significance / Importance",hints: "significance importance role impact relevance need",       icon: "⭐" },
        { id: "challenges",  label: "Challenges & Issues",      hints: "challenges issues problems concerns threats barriers",     icon: "⚠️" },
        { id: "initiatives", label: "Government Initiatives",   hints: "government schemes policy initiative ministry act law",   icon: "🏛" },
        { id: "wayforward",  label: "Way Forward",              hints: "recommendations measures solutions reform steps",         icon: "🎯" },
      ];
  }
}

function dimIcon(d) {
  const map = { economic:"📈", social:"👥", political:"⚖️", environmental:"🌿", cultural:"🎭",
    historical:"📜", geographical:"🗺️", strategic:"🛡️", security:"🔒", constitutional:"📋",
    legal:"⚖️", technological:"🔬", ethical:"🧭", administrative:"🏛", scientific:"🔭",
    international:"🌐", diplomatic:"🤝" };
  return map[d] || "📌";
}

// ── Wikipedia fallback ────────────────────────────────────────────────────────

async function fetchWikiIntro(topic) {
  try {
    const search = await fetch(
      `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(topic)}&limit=1&format=json&origin=*`,
      { signal: AbortSignal.timeout(5000) }
    );
    const [, titles] = await search.json();
    if (!titles?.[0]) return null;

    const ext = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(titles[0])}&prop=extracts&format=json&origin=*&exintro=true&explaintext=true&exchars=600`,
      { signal: AbortSignal.timeout(6000) }
    );
    const data  = await ext.json();
    const pages = data?.query?.pages || {};
    const page  = Object.values(pages)[0];
    return page?.extract?.trim() || null;
  } catch { return null; }
}

// ── Template fallbacks per dimension ─────────────────────────────────────────

function templateFallback(dim, topic) {
  const t = topic;
  switch (dim.id) {
    case "wayforward":
      return [
        `Strengthening policy implementation framework for ${t}`,
        "Multi-stakeholder coordination: Centre, States, civil society, private sector",
        "Leveraging technology and data analytics for better monitoring and outcomes",
        "Aligning with SDG targets and Viksit Bharat 2047 development goals",
      ];
    case "background":
    case "context":
    case "intro_a":
      return [
        `${t} has been a significant area of focus in India's development trajectory`,
        "Its origins and evolution are rooted in historical, social, and policy contexts",
        "Multiple stakeholders — government, civil society, and communities — are involved",
      ];
    default:
      return [
        `Key ${dim.label.toLowerCase()} dimensions of ${t} require comprehensive analysis`,
        "Evidence from government reports, CAG findings, and academic studies indicates mixed outcomes",
        "A balanced, multi-stakeholder approach is essential for meaningful progress",
      ];
  }
}

// ── Main answer generator ─────────────────────────────────────────────────────

function loadDocs() {
  try {
    const saved = localStorage.getItem("upsc_library_docs");
    if (saved) return JSON.parse(saved).filter(d => d.status === "indexed");
  } catch {}
  return [];
}

async function buildAnswer(parsed, wordLimit, docIds) {
  const { topic, gs, sections } = parsed;

  // How many words per section (intro + N sections + conclusion)
  const totalSections = sections.length + 2; // intro + sections + conclusion
  const wordsPerSection = Math.floor(wordLimit / totalSections);

  const statusCbs = [];
  const result = { topic, gs, sections: [], wordCount: 0, date: TODAY };

  // ── Introduction from Wikipedia ───────────────────────────────────────────
  let introText = null;
  const wikiText = await fetchWikiIntro(topic);
  if (wikiText) {
    const sentences = wikiText.split(/(?<=[.!?])\s+/).slice(0, 3);
    introText = sentences.join(" ").slice(0, 300);
  }
  if (!introText) {
    introText = `${topic} is a significant subject in the UPSC Mains context. Understanding its multiple dimensions — historical, institutional, and contemporary — is essential for a comprehensive answer.`;
  }
  result.intro = { text: introText, source: wikiText ? "wiki" : "template" };

  // ── Section content from PDFs ─────────────────────────────────────────────
  const pdfContent = await searchPdfForAnswer(docIds, topic, sections);

  for (const sec of sections) {
    const pdfData = pdfContent[sec.id];
    let bullets = [];
    let source  = "template";

    if (pdfData?.bullets?.length) {
      bullets = pdfData.bullets;
      source  = "pdf";
    } else {
      bullets = templateFallback(sec, topic);
      source  = "template";
    }

    // Trim to word budget
    const trimmedBullets = [];
    let wc = 0;
    for (const b of bullets) {
      const w = b.split(/\s+/).length;
      if (wc + w > wordsPerSection + 20) break;
      trimmedBullets.push(b); wc += w;
    }

    result.sections.push({ ...sec, bullets: trimmedBullets, source });
    result.wordCount += trimmedBullets.join(" ").split(/\s+/).length;
  }

  // ── Conclusion ─────────────────────────────────────────────────────────────
  const pdfConcl = pdfContent["wayforward"] || pdfContent["conclusion"];
  result.conclusion = {
    text: pdfConcl?.bullets?.[0]
      || `${topic} demands a convergent approach combining strong political will, institutional capacity, and community participation. Aligning efforts with India's constitutional vision and Viksit Bharat 2047 goals is essential for sustainable outcomes.`,
    source: pdfConcl ? "pdf" : "template",
  };
  result.wordCount += (result.intro.text + result.conclusion.text).split(/\s+/).length;

  return result;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function AnswerBuilder({ onNavigate }) {
  const [question,    setQuestion]    = useState("");
  const [parsed,      setParsed]      = useState(null);
  const [wordLimit,   setWordLimit]   = useState(250);
  const [sourcePdf,   setSourcePdf]   = useState("all");
  const [generating,  setGenerating]  = useState(false);
  const [answer,      setAnswer]      = useState(null);
  const [genStatus,   setGenStatus]   = useState("");
  const [indexedDocs, setIndexedDocs] = useState(loadDocs);
  const answerRef = useRef(null);

  // Re-parse when question changes (debounced)
  useEffect(() => {
    if (!question.trim()) { setParsed(null); return; }
    const t = setTimeout(() => setParsed(parseQuestion(question)), 500);
    return () => clearTimeout(t);
  }, [question]);

  useEffect(() => { setIndexedDocs(loadDocs()); }, []);

  const activeDocs = sourcePdf === "all"
    ? indexedDocs
    : indexedDocs.filter(d => d.id === sourcePdf);

  const handleGenerate = async () => {
    if (!parsed || !question.trim()) return;
    setGenerating(true);
    setAnswer(null);
    setGenStatus("Analysing question structure…");

    try {
      setGenStatus(`Searching ${activeDocs.length} coaching PDF(s) for relevant content…`);
      const result = await buildAnswer(parsed, wordLimit, activeDocs.map(d => d.id));
      setGenStatus("Formatting UPSC answer…");
      await new Promise(r => setTimeout(r, 300));
      setAnswer(result);
      setGenStatus("");
      setTimeout(() => answerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (e) {
      console.error(e);
      setGenStatus("Error generating answer. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (!answer) return;
    const lines = [
      question,
      "",
      "Introduction:",
      answer.intro.text,
      "",
      ...answer.sections.flatMap(s => [
        s.label + ":",
        ...s.bullets.map(b => "• " + b),
        "",
      ]),
      "Conclusion:",
      answer.conclusion.text,
    ];
    navigator.clipboard.writeText(lines.join("\n")).catch(() => {});
  };

  const gsTag = parsed ? GS_TAGS.find(g => g.id === parsed.gs) : null;

  // ── Generating overlay ─────────────────────────────────────────────────────

  if (generating) {
    return (
      <div className="page ans-generating-wrap">
        <div className="ans-gen-card">
          <div className="generating-spinner" />
          <div className="ans-gen-topic">{parsed?.topic || "Processing question…"}</div>
          <div className="ans-gen-status">{genStatus}</div>
          <div className="ans-gen-steps">
            {[
              "Parsing question and directive word",
              `Searching ${activeDocs.length} coaching PDFs for section-level content`,
              "Mapping PDF sections to answer dimensions",
              `Formatting ${wordLimit}-word UPSC answer`,
            ].map((s, i) => (
              <div key={s} className="gen-step">
                <div className="gen-step-dot" style={{ animationDelay: `${i * 0.5}s` }} />
                <span>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Answer Builder</p>
          <h1 className="page-title">Generate UPSC Mains Answers</h1>
        </div>
        {indexedDocs.length === 0 && (
          <button className="secondary-btn" onClick={() => onNavigate && onNavigate("library")}>
            + Upload Coaching Material
          </button>
        )}
      </div>

      {/* Input panel */}
      <div className="ans-input-card">
        <div className="ans-section-label">Paste your UPSC question</div>
        <textarea
          className="ans-question-input"
          placeholder={`Paste any UPSC Mains question here, e.g.:\n\n"Discuss the significance of Left Wing Extremism as a security challenge in India and suggest measures to address it." (2023, GS3)\n\n"Critically analyze the role of Self-Help Groups in women empowerment." (2022, GS1)`}
          value={question}
          onChange={e => setQuestion(e.target.value)}
          rows={5}
        />

        {/* Parsed question preview */}
        {parsed && (
          <div className="ans-parsed-preview">
            <div className="ans-parsed-row">
              <span className="ans-parsed-key">Topic detected:</span>
              <span className="ans-parsed-val">{parsed.topic}</span>
            </div>
            <div className="ans-parsed-row">
              <span className="ans-parsed-key">Directive:</span>
              <span className="ans-parsed-directive">{parsed.directive.replace(/_/g, " ")}</span>
            </div>
            {parsed.explicitDims.length > 0 && (
              <div className="ans-parsed-row">
                <span className="ans-parsed-key">Dimensions:</span>
                <div className="ans-dim-chips">
                  {parsed.explicitDims.map(d => (
                    <span key={d} className="ans-dim-chip">{d}</span>
                  ))}
                </div>
              </div>
            )}
            <div className="ans-parsed-row">
              <span className="ans-parsed-key">Answer structure:</span>
              <div className="ans-struct-chips">
                {parsed.sections.map(s => (
                  <span key={s.id} className="ans-struct-chip">{s.icon} {s.label}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="ans-controls-row">
          <div className="ans-control-group">
            <label className="ans-ctrl-label">Word limit</label>
            <div className="ans-word-btns">
              {WORD_LIMITS.map(w => (
                <button
                  key={w.val}
                  className={`ans-word-btn ${wordLimit === w.val ? "active" : ""}`}
                  onClick={() => setWordLimit(w.val)}
                >
                  {w.label}
                  <span className="ans-word-btn-hint">{w.mark}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="ans-control-group">
            <label className="ans-ctrl-label">
              Coaching source
              {gsTag && (
                <span className="gs-pill" style={{ background: gsTag.bg, color: gsTag.color, marginLeft: 8, fontSize: 11 }}>
                  {gsTag.label}
                </span>
              )}
            </label>
            <select
              className="gen-select"
              value={sourcePdf}
              onChange={e => setSourcePdf(e.target.value)}
            >
              <option value="all">All uploaded PDFs ({indexedDocs.length} docs)</option>
              {indexedDocs.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
            {indexedDocs.length === 0 && (
              <div className="gen-no-docs-hint">
                No PDFs indexed —{" "}
                <button className="gen-link" onClick={() => onNavigate && onNavigate("library")}>
                  upload coaching material first
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="ans-footer-row">
          <div className="ans-source-note">
            <span>✦</span>
            Content pulled from coaching PDFs section-by-section · Wikipedia intro fallback · UPSC-template if no match
          </div>
          <button
            className="primary-btn large"
            onClick={handleGenerate}
            disabled={!question.trim() || !parsed || generating}
          >
            ✦ Generate Answer ({wordLimit}w)
          </button>
        </div>
      </div>

      {/* Generated answer */}
      {answer && (
        <div className="ans-output-card" ref={answerRef}>
          <div className="ans-output-header">
            <div className="ans-output-title-wrap">
              <div className="ans-output-eyebrow">Generated Answer</div>
              <div className="ans-output-title">{answer.topic}</div>
            </div>
            <div className="ans-output-actions">
              <span className="ans-word-count">{answer.wordCount} words</span>
              {gsTag && (
                <span className="gs-pill" style={{ background: gsTag.bg, color: gsTag.color }}>
                  {gsTag.label}
                </span>
              )}
              <button className="viewer-action-btn" onClick={copyToClipboard}>📋 Copy</button>
              <button className="viewer-action-btn" onClick={() => window.print()}>🖨 Print</button>
            </div>
          </div>

          {/* Question context */}
          <div className="ans-question-box">
            <span className="ans-question-label">Q.</span>
            <span className="ans-question-text">{question}</span>
          </div>

          {/* Introduction */}
          <div className="ans-section">
            <div className="ans-section-hdr">
              <span className="ans-section-icon">📝</span>
              <span className="ans-section-title">Introduction</span>
              <SourceBadge source={answer.intro.source} />
            </div>
            <div className="ans-section-body ans-intro-text">
              {answer.intro.text}
            </div>
          </div>

          {/* Body sections */}
          {answer.sections.map((sec, i) => (
            <div key={sec.id} className={`ans-section ${sec.source === "pdf" ? "ans-section-pdf" : sec.source === "template" ? "ans-section-template" : ""}`}>
              <div className="ans-section-hdr">
                <span className="ans-section-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="ans-section-icon">{sec.icon}</span>
                <span className="ans-section-title">{sec.label}</span>
                <SourceBadge source={sec.source} />
              </div>
              <ul className="ans-bullets">
                {sec.bullets.map((b, j) => (
                  <li key={j}>{b}</li>
                ))}
              </ul>
            </div>
          ))}

          {/* Conclusion */}
          <div className="ans-section ans-conclusion">
            <div className="ans-section-hdr">
              <span className="ans-section-icon">🎯</span>
              <span className="ans-section-title">Conclusion</span>
              <SourceBadge source={answer.conclusion.source} />
            </div>
            <div className="ans-section-body">
              {answer.conclusion.text}
            </div>
          </div>

          <div className="ans-output-footer">
            <div className="ans-legend">
              <span className="ans-legend-item pdf"><span className="ans-src-dot pdf" />From coaching PDF</span>
              <span className="ans-legend-item wiki"><span className="ans-src-dot wiki" />Wikipedia</span>
              <span className="ans-legend-item template"><span className="ans-src-dot template" />UPSC template</span>
            </div>
            <div className="ans-footer-note">
              Re-upload coaching PDFs and click "Enable Search" in PDF Library for richer content
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SourceBadge({ source }) {
  if (source === "pdf")      return <span className="ans-src-badge pdf">📄 Coaching PDF</span>;
  if (source === "wiki")     return <span className="ans-src-badge wiki">🌐 Wikipedia</span>;
  if (source === "template") return <span className="ans-src-badge tmpl">⚙ Template</span>;
  return null;
}
