import React, { useState, useCallback, useRef } from "react";
import { GS_TAGS, ANSWER_FRAMEWORKS } from "../lib/constants";
import { applyKwHighlights } from "../lib/highlightUtils";

// Converts clipboard HTML to clean structured plain text
function htmlToStructuredText(html) {
  // Strip LaTeX artifacts like $\text{ARC}$
  html = html.replace(/\$\\text\{([^}]+)\}\$/g, "$1");

  const div = document.createElement("div");
  div.innerHTML = html;

  // Remove junk elements
  div.querySelectorAll("script,style,meta,head,img,table,colgroup,col").forEach(el => el.remove());

  // Convert <br> to newline markers before getting text
  div.querySelectorAll("br").forEach(br => br.replaceWith("\n"));

  // Number ordered list items, bullet unordered list items
  div.querySelectorAll("ol").forEach(ol => {
    Array.from(ol.querySelectorAll("li")).forEach((li, i) => {
      li.prepend(`${i + 1}. `);
    });
  });
  div.querySelectorAll("ul > li").forEach(li => li.prepend("• "));

  // Add trailing newline to all block-level elements
  div.querySelectorAll("p,h1,h2,h3,h4,h5,h6,li,div,blockquote,tr").forEach(el => {
    el.append("\n");
  });

  let text = (div.innerText || div.textContent || "")
    .replace(/[ \t]+/g, " ")      // collapse horizontal whitespace
    .replace(/\n{3,}/g, "\n\n")   // max two consecutive blank lines
    .trim();

  return text;
}

const HIST_KEY = "upsc_eval_history";
const WORD_LIMITS = [150, 250, 500, 1000];

const DIM_HINTS = {
  Economic:       "From an economic lens: [e.g., X% GDP impact / ₹Y crore allocation / fiscal implications of the policy].",
  Social:         "Socially, marginalised groups (women, SC/ST, OBCs) face disproportionate impact — inclusive policy design is essential.",
  Environmental:  "Environmental dimension: [e.g., net-zero commitments / forest cover loss / carbon emissions / climate adaptation needs].",
  Constitutional: "Constitutionally, [e.g., Article 21/39/48A / Directive Principles / 73rd–74th Amendment / Schedule VII] anchors this issue.",
  Historical:     "Historically, [e.g., colonial legacy / post-1947 institutional evolution / landmark SC judgment] contextualises the present reality.",
  Political:      "Politically, [e.g., Centre–State dynamics / federal balance / legislative intent] shape implementation outcomes.",
  International:  "Internationally, [e.g., UN SDG 3/4/10 / bilateral cooperation / best practices from country X] offer valuable lessons.",
  Ethical:        "Ethically, [e.g., probity in public life / Gandhian trusteeship / 2nd ARC recommendations] must guide policy-makers.",
};

function generateSampleAnswer(result) {
  const userAnswer = (result.answer || "").trim();
  const missingStr = result.missing.join(" ").toLowerCase();

  const needsIntro  = /introduction/.test(missingStr);
  const needsWF     = /way forward/.test(missingStr);
  const needsConc   = /conclusion/.test(missingStr);
  const needsStats  = /statistics/.test(missingStr);
  const needsScheme = /scheme/.test(missingStr);
  const needsQuote  = /quote/.test(missingStr);

  const dimEntry    = result.missing.find(m => /dimensions/i.test(m));
  const missingDims = dimEntry
    ? dimEntry.replace(/.*dimensions:\s*/i, "").split(",").map(s => s.trim()).filter(Boolean)
    : [];

  const parts = [];

  if (needsIntro) {
    parts.push({
      type: "added", label: "Introduction",
      text: "The issue holds strategic significance in the Indian context, intersecting constitutional provisions, governance imperatives, and socio-economic development goals. A clear understanding of its scope, causes, and multi-dimensional implications is essential before recommending concrete policy interventions.",
    });
  }

  parts.push({ type: "original", text: userAnswer });

  const evidence = [];
  if (needsStats)  evidence.push('📊 Add a statistic: "According to [Source, Year], X% / ₹Y crore / Z million people are affected…"');
  if (needsScheme) evidence.push("🏛️ Cite a scheme/act/committee: e.g., PM-KISAN / MGNREGS / Article 21 / 73rd Amendment / 2nd ARC Report.");
  if (needsQuote)  evidence.push('💬 Add a quote or expert view: "[Relevant constitutional provision or expert statement]" — [Source].');
  if (evidence.length) {
    parts.push({ type: "suggestion", label: "Insert Evidence Here", text: evidence.join("\n") });
  }

  if (missingDims.length) {
    parts.push({
      type: "suggestion", label: `Add Missing Dimensions: ${missingDims.join(", ")}`,
      text: missingDims.map(d => DIM_HINTS[d] || `[Add ${d} dimension perspective here.]`).join("\n\n"),
    });
  }

  if (needsWF) {
    parts.push({
      type: "added", label: "Way Forward",
      text: "Way Forward:\n• Strengthen institutional mechanisms with clear accountability and time-bound legislative reforms.\n• Foster Centre–State and public–private partnerships for effective, ground-level implementation.\n• Harness technology (Direct Benefit Transfer, GIS mapping, AI-driven monitoring) for transparency and efficiency.\n• Ensure periodic review by Parliamentary Standing Committees and independent CAG audits.\n• Adopt a rights-based, inclusive framework ensuring equitable outcomes for vulnerable sections of society.",
    });
  }

  if (needsConc) {
    parts.push({
      type: "added", label: "Conclusion",
      text: "To conclude, a multi-dimensional, constitutionally grounded approach — backed by data-driven policymaking, inter-institutional coordination, and active citizen participation — is indispensable for addressing this issue sustainably. India's strength lies in its ability to convert diverse challenges into catalysts for inclusive and equitable growth.",
    });
  }

  return parts;
}

// Parses AI response: splits on {{additions}} markers into segments
function parseAiResponse(text) {
  const parts = [];
  const re = /\{\{([\s\S]*?)\}\}/g;
  let last = 0, m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push({ type: "original", text: text.slice(last, m.index) });
    parts.push({ type: "added", text: m[1] });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ type: "original", text: text.slice(last) });
  return parts;
}

// Renders a line with keyword highlights (safe — we escape before marking)
function KwLine({ text }) {
  return <span dangerouslySetInnerHTML={{ __html: applyKwHighlights(text) }} />;
}

// Converts raw AI text segment into structured JSX (paragraphs, bullets, headings)
function renderAiSegment(text) {
  const lines = text.split("\n");
  const out = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    if (!line) { out.push(<div key={`sp-${i}`} className="ev-ai-spacer" />); i++; continue; }

    // Section heading: short line ending with ":"
    if (/^[A-Z][^:\n]{2,55}:$/.test(line)) {
      out.push(<div key={i} className="ev-ai-heading"><KwLine text={line} /></div>);
      i++; continue;
    }

    // Bullet / numbered list — collect run of list lines
    if (/^[*•\-]\s+/.test(line) || /^\d+[.)]\s+/.test(line)) {
      const isNum = /^\d+[.)]\s+/.test(line);
      const items = [];
      while (i < lines.length) {
        const bl = lines[i].trim();
        if (/^[*•\-]\s+/.test(bl))       { items.push(bl.replace(/^[*•\-]\s+/, "")); i++; }
        else if (/^\d+[.)]\s+/.test(bl)) { items.push(bl.replace(/^\d+[.)]\s+/, "")); i++; }
        else if (!bl)                     { i++; break; }
        else                              { break; }
      }
      const Tag = isNum ? "ol" : "ul";
      out.push(
        <Tag key={`list-${i}`} className="ev-ai-list">
          {items.map((item, bi) => <li key={bi}><KwLine text={item} /></li>)}
        </Tag>
      );
      continue;
    }

    // Regular paragraph
    out.push(<p key={i} className="ev-ai-para"><KwLine text={line} /></p>);
    i++;
  }
  return out;
}

const AI_KEYS_LS     = "ai_provider_keys";
const AI_PROVIDER_LS = "ai_provider";

const PROVIDERS = [
  { id: "groq",   label: "Groq",   badge: "Free", model: "llama-3.3-70b-versatile", hintText: "console.groq.com/keys",        hintUrl: "https://console.groq.com/keys" },
  { id: "gemini", label: "Gemini", badge: "Free", model: "gemini-1.5-flash",          hintText: "aistudio.google.com/apikey",   hintUrl: "https://aistudio.google.com/apikey" },
  { id: "openai", label: "OpenAI", badge: "Paid", model: "gpt-4o-mini",               hintText: "platform.openai.com/api-keys", hintUrl: "https://platform.openai.com/api-keys" },
];

function loadHistory() {
  try { return JSON.parse(localStorage.getItem(HIST_KEY) || "[]"); } catch { return []; }
}
function saveHistory(h) {
  localStorage.setItem(HIST_KEY, JSON.stringify(h.slice(0, 20)));
}

/* ── Core evaluation engine ── */
function evaluateAnswer(answer, wordLimit, gs) {
  const words = answer.trim().split(/\s+/).filter(Boolean);
  const wc    = words.length;
  const lower = answer.toLowerCase();

  /* 1. Word Count (20 pts) */
  const ratio = wc / wordLimit;
  const wcScore = ratio >= 0.85 && ratio <= 1.2  ? 20
                : ratio >= 0.70 && ratio <= 1.35  ? 14
                : ratio >= 0.50                   ? 8 : 3;
  const wcTip = ratio < 0.70  ? `Too short (${wc}/${wordLimit}). Aim for ≥85% of the word limit.`
              : ratio > 1.35  ? `Too long (${wc}/${wordLimit}). Practice concision.`
              : "Good length.";

  /* 2. Structure (25 pts) */
  const hasIntro  = /\b(introduction|in this (answer|context)|firstly|to begin|the term|refers to|is defined as|means)\b/.test(lower);
  const hasConc   = /\b(conclusion|to conclude|in conclusion|thus|therefore|way forward|hence|in sum|summing up)\b/.test(lower);
  const hasWF     = /\b(way forward|suggest|recommend|need to|should be|must be|going forward|steps (to|for))\b/.test(lower);
  const paraCount = (answer.match(/\n\n+/g) || []).length;
  const hasBody   = paraCount >= 2 || words.length > 100;
  let stScore = 0;
  if (hasIntro) stScore += 8;
  if (hasBody)  stScore += 5;
  if (hasConc)  stScore += 7;
  if (hasWF)    stScore += 5;
  const stTips = [!hasIntro && "Add a clear introduction with definition/context", !hasWF && "Include 'Way Forward' recommendations", !hasConc && "Add a proper conclusion"].filter(Boolean);

  /* 3. UPSC Keywords (20 pts) */
  const upscKw = ["critically","analyze","analyse","examine","evaluate","discuss","significance",
    "challenges","impact","constitutional","governance","sustainable","inclusive","multidimensional",
    "socio-economic","accountability","transparency","reforms","implementation","mechanism"];
  const found = upscKw.filter(k => lower.includes(k));
  const kwScore = Math.min(20, found.length * 2 + (found.length > 5 ? 4 : 0));
  const kwTip = found.length < 3
    ? `Use more analytical words: ${upscKw.filter(k => !found.includes(k)).slice(0,4).join(", ")}…`
    : `Good vocabulary. Keywords found: ${found.slice(0,5).join(", ")}`;

  /* 4. Data & Evidence (20 pts) */
  const hasStat   = /\d+(\.\d+)?(\s*%|\s*(crore|lakh|million|billion|thousand))/.test(answer);
  const hasYear   = /\b(19|20)\d{2}\b/.test(answer);
  const hasScheme = /\b(PM |Pradhan Mantri|Mission|Scheme|Act|Article|Policy|Committee|Report|Commission)\b/.test(answer);
  const hasQuote  = /[""“”]/.test(answer) || /\s—\s/.test(answer);
  const hasCaseSt = /\b(for example|for instance|case of|such as|viz\.|e\.g\.)\b/i.test(answer);
  let evScore = 0;
  if (hasStat)   evScore += 5;
  if (hasYear)   evScore += 3;
  if (hasScheme) evScore += 6;
  if (hasQuote)  evScore += 3;
  if (hasCaseSt) evScore += 3;
  const evTips = [!hasStat && "Add statistics (%, crore, etc.)", !hasScheme && "Cite a scheme/act/policy/committee", !hasQuote && "Include a quote or expert view"].filter(Boolean);

  /* 5. Multi-dimensional (15 pts) */
  const dims = {
    "Economic":       /\b(economic|gdp|trade|market|fiscal|revenue|growth|poverty|income)\b/.test(lower),
    "Social":         /\b(social|community|society|women|gender|tribal|marginali[sz]ed|caste)\b/.test(lower),
    "Political":      /\b(political|parliament|government|policy|democracy|election|federali[sz]m)\b/.test(lower),
    "Environmental":  /\b(environment|climate|carbon|ecology|forest|pollution|sustainab)\b/.test(lower),
    "Constitutional": /\b(constitution|article|fundamental|directive|right|judiciary|supreme court)\b/.test(lower),
    "Historical":     /\b(histor|colonial|independence|partition|ancient|medieval|modern)\b/.test(lower),
    "Ethical":        /\b(ethic|moral|integrity|probity|value|character|virtue|accountability)\b/.test(lower),
    "International":  /\b(international|global|world|un |sdg|foreign|bilateral|multilateral)\b/.test(lower),
  };
  const coveredDims = Object.entries(dims).filter(([, v]) => v).map(([k]) => k);
  const dimScore = Math.min(15, coveredDims.length * 2 + (coveredDims.length >= 4 ? 3 : 0));
  const missingDims = Object.entries(dims).filter(([, v]) => !v).map(([k]) => k).slice(0, 3);

  const totalScore = wcScore + stScore + kwScore + evScore + dimScore;
  const grade = totalScore >= 85 ? "A+" : totalScore >= 70 ? "A" : totalScore >= 55 ? "B+" : totalScore >= 40 ? "B" : "C";

  const missing = [
    ...stTips,
    ...(evTips.length ? evTips : []),
    coveredDims.length < 3 && `Cover more dimensions: ${missingDims.join(", ")}`,
    wc < 20 && "Write a complete answer — this appears to be too short",
  ].filter(Boolean);

  return {
    totalScore,
    grade,
    wordCount: wc,
    wordLimit,
    breakdown: [
      { label: "Word Count",       score: wcScore, max: 20, tip: wcTip,        color: "#0369A1" },
      { label: "Structure",        score: stScore, max: 25, tip: stTips[0] || "Good structure", color: "#7C3AED" },
      { label: "UPSC Keywords",    score: kwScore, max: 20, tip: kwTip,        color: "#047857" },
      { label: "Data & Evidence",  score: evScore, max: 20, tip: evTips[0] || "Good use of evidence", color: "#B45309" },
      { label: "Multi-dimensional",score: dimScore,max: 15, tip: coveredDims.length < 3 ? `Missing: ${missingDims.join(", ")}` : `Covers: ${coveredDims.join(", ")}`, color: "#9D174D" },
    ],
    coveredDims,
    missing,
  };
}

function ScoreRing({ score, max = 100, size = 110, color = "#1E3A5F" }) {
  const r    = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const off  = circ * (1 - score / max);
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border)" strokeWidth="10"/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="10"
        strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.8s ease" }}/>
    </svg>
  );
}

export default function AnswerEvaluator({ onNavigate }) {
  const [question,  setQuestion]  = useState("");
  const [answer,    setAnswer]    = useState("");
  const [wordLimit, setWordLimit] = useState(250);
  const [gs,        setGs]        = useState("gs2");
  const [result,    setResult]    = useState(null);
  const [history,   setHistory]   = useState(loadHistory);
  const [activeTab, setTab]       = useState("write");   // write | result | history
  const [framework, setFramework] = useState(null);
  const [showSample,   setShowSample]   = useState(false);
  const [aiSample,     setAiSample]     = useState(null);
  const [aiLoading,    setAiLoading]    = useState(false);
  const [aiError,      setAiError]      = useState("");
  const [aiProvider,   setAiProvider]   = useState(() => localStorage.getItem(AI_PROVIDER_LS) || "groq");
  const [aiKeys,       setAiKeys]       = useState(() => { try { return JSON.parse(localStorage.getItem(AI_KEYS_LS) || "{}"); } catch { return {}; } });
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [keyDraft,     setKeyDraft]     = useState("");

  const answerRef = useRef(null);

  // Strip preamble lines (Question N, question text) before "Answer:" marker
  const extractAnswerOnly = (text) => {
    const match = text.match(/\bans(?:wer)?\s*:[ \t]*/i);
    if (match) return text.slice(text.indexOf(match[0]) + match[0].length).trim();
    // No marker found — strip leading question-number lines (up to 3 lines)
    const lines = text.split("\n");
    let start = 0;
    for (let i = 0; i < Math.min(lines.length, 4); i++) {
      const l = lines[i].trim();
      if (/^(question|q\.?\s*\d|\d+[a-z]?\s*[\.\)])/i.test(l) || l.length === 0) {
        start = i + 1;
      } else break;
    }
    return lines.slice(start).join("\n").trim();
  };

  const answerOnly = extractAnswerOnly(answer);
  const wc = answerOnly.trim() ? answerOnly.trim().split(/\s+/).filter(Boolean).length : 0;
  const hasQuestionPrefix = answerOnly.length < answer.trim().length;

  const handleAnswerPaste = useCallback((e) => {
    const html = e.clipboardData.getData("text/html");
    if (!html) return; // let browser handle plain-text paste normally
    e.preventDefault();

    const structured = htmlToStructuredText(html);

    // Insert at cursor within the contenteditable div
    const sel = window.getSelection();
    if (sel && sel.rangeCount) {
      sel.deleteFromDocument();
      const range = sel.getRangeAt(0);
      // Insert as plain text nodes with preserved line breaks
      const lines = structured.split("\n");
      const frag = document.createDocumentFragment();
      lines.forEach((line, i) => {
        if (i > 0) frag.appendChild(document.createElement("br"));
        if (line) frag.appendChild(document.createTextNode(line));
      });
      range.insertNode(frag);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    }
    // Sync state
    setAnswer(answerRef.current?.innerText || "");
  }, []);

  const evaluate = useCallback(() => {
    if (!answerOnly || wc < 20) return;
    const res = evaluateAnswer(answerOnly, wordLimit, gs);
    setResult({ ...res, question, answer: answerOnly, gs, wordLimit, ts: Date.now() });
    const updated = [{ ...res, question: question.slice(0,80), ts: Date.now(), grade: res.grade }, ...history];
    setHistory(updated);
    saveHistory(updated);
    setTab("result");
  }, [answer, wordLimit, gs, question, history]);

  const reset = () => {
    setQuestion(""); setAnswer(""); setResult(null); setTab("write"); setFramework(null);
    setAiSample(null); setAiError("");
    if (answerRef.current) answerRef.current.innerHTML = "";
  };

  const switchProvider = (pid) => {
    setAiProvider(pid);
    localStorage.setItem(AI_PROVIDER_LS, pid);
    setAiError("");
  };

  const saveApiKey = (key) => {
    const trimmed = key.trim();
    const next = { ...aiKeys, [aiProvider]: trimmed };
    setAiKeys(next);
    localStorage.setItem(AI_KEYS_LS, JSON.stringify(next));
    setShowKeyInput(false);
    if (trimmed) generateAISample(trimmed, aiProvider);
  };

  const generateAISample = async (keyOverride, providerOverride) => {
    const provider = providerOverride || aiProvider;
    const key = keyOverride || aiKeys[provider] || "";
    if (!key) { setKeyDraft(""); setShowKeyInput(true); return; }
    if (!result) return;
    setAiLoading(true); setAiError(""); setAiSample(null); setShowSample(true);

    const missingList = result.missing.map(m => `- ${m}`).join("\n");
    const dimEntry = result.missing.find(m => /dimensions/i.test(m));
    const missingDims = dimEntry ? dimEntry.replace(/.*dimensions:\s*/i, "") : "";
    const prov = PROVIDERS.find(p => p.id === provider);

    const prompt = `You are a UPSC Mains answer coach and India expert. A student has written an answer scoring ${result.totalScore}/100.

GS Paper: ${(result.gs || "gs2").toUpperCase()} | Word Limit: ${result.wordLimit} words
Question: ${result.question || "(infer topic from the answer)"}

STUDENT'S ORIGINAL ANSWER:
${result.answer}

WHAT'S MISSING (from evaluation):
${missingList}${missingDims ? `\nMissing dimensions: ${missingDims}` : ""}

TASK — Improve the answer with these rules:
1. Wrap EVERY addition you make in {{double curly braces}} so it can be highlighted green.
2. Use REAL data — exact % figures, ₹ crore amounts, article numbers (e.g. Article 311, 356), SC judgments (Vishakha v State of Rajasthan 1997), committee names + year (2nd ARC 2008, Naresh Chandra Committee 2012), Economic Survey 2023-24 stats, NITI Aayog reports.
3. Cite real schemes with launch year: MGNREGS 2005, PM-KISAN 2019, Swachh Bharat Mission 2014, PMGSY 2000.
4. If introduction missing: add {{one crisp opening sentence defining the concept + its constitutional/policy significance}}.
5. If Way Forward missing: add {{5 concrete bullet points — each citing a specific reform, institution, or mechanism}}.
6. If conclusion missing: add {{2-line conclusion with forward-looking statement}}.
7. For each missing dimension (${missingDims || "none"}): add {{one factual sentence with a real data point}}.
8. NEVER write "[Source]", "[year]", "[statistic]" — only use actual known facts.
9. Leave the student's existing good sentences as-is (no braces).
10. Output ONLY the improved answer text. No preamble, no "Improved Answer:" heading.`;

    try {
      let text = "";
      if (provider === "gemini") {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { maxOutputTokens: 1500, temperature: 0.7 },
            }),
          }
        );
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error?.message || `Gemini error ${res.status}`);
        }
        const data = await res.json();
        text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
      } else {
        // Groq (OpenAI-compatible) or OpenAI
        const url = provider === "groq"
          ? "https://api.groq.com/openai/v1/chat/completions"
          : "https://api.openai.com/v1/chat/completions";
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${key}` },
          body: JSON.stringify({
            model: prov?.model || "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 1500,
            temperature: 0.7,
          }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error?.message || `${prov?.label} error ${res.status}`);
        }
        const data = await res.json();
        text = data.choices?.[0]?.message?.content?.trim() || "";
      }
      setAiSample(text);
    } catch (err) {
      setAiError(err.message);
    } finally {
      setAiLoading(false);
    }
  };

  const gradeColor = g => g === "A+" ? "#059669" : g === "A" ? "#0369A1" : g === "B+" ? "#7C3AED" : g === "B" ? "#B45309" : "#DC2626";

  const wcPct = Math.min(100, (wc / wordLimit) * 100);
  const wcColor = wc > wordLimit * 1.2 ? "#DC2626" : wc >= wordLimit * 0.85 ? "#059669" : "#B45309";

  return (
    <div className="page ev-page">

      {/* ── Header ── */}
      <div className="ev-header">
        <div>
          <h1 className="page-title">Answer Grader</h1>
          <p className="page-sub">Paste any UPSC answer for instant heuristic scoring across 5 dimensions</p>
        </div>
        <div className="ev-tabs">
          {[["write","Write & Evaluate"],["result","Results"],["history","History"]].map(([id,label]) => (
            <button key={id} className={`ev-tab ${activeTab === id ? "active" : ""}`}
              onClick={() => setTab(id)}>
              {label}
              {id === "history" && history.length > 0 && <span className="ev-tab-badge">{history.length}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* ── WRITE TAB ── */}
      {activeTab === "write" && (
        <div className="ev-write-layout">

          {/* Left: controls */}
          <div className="ev-left">
            <div className="ev-controls">
              <div className="ev-control-row">
                <label className="ev-label">GS Paper</label>
                <div className="ev-pills">
                  {GS_TAGS.slice(0,5).map(g => (
                    <button key={g.id}
                      className={`ev-pill ${gs === g.id ? "active" : ""}`}
                      style={gs === g.id ? { background: g.color, borderColor: g.color, color: "#fff" } : {}}
                      onClick={() => setGs(g.id)}>
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="ev-control-row">
                <label className="ev-label">Word Limit</label>
                <div className="ev-pills">
                  {WORD_LIMITS.map(w => (
                    <button key={w}
                      className={`ev-pill ${wordLimit === w ? "active" : ""}`}
                      onClick={() => setWordLimit(w)}>
                      {w}
                    </button>
                  ))}
                </div>
              </div>
              <div className="ev-control-row">
                <label className="ev-label">Framework <span className="ev-optional">(optional)</span></label>
                <select className="ev-select" value={framework || ""} onChange={e => setFramework(e.target.value || null)}>
                  <option value="">None — free write</option>
                  {ANSWER_FRAMEWORKS.map(f => (
                    <option key={f.id} value={f.id}>{f.type}</option>
                  ))}
                </select>
              </div>
              {framework && (() => {
                const f = ANSWER_FRAMEWORKS.find(x => x.id === framework);
                return f ? (
                  <div className="ev-fhint">
                    {f.structure.map((s,i) => (
                      <div key={i} className="ev-fhint-part">
                        <span className="ev-fhint-icon">{s.icon}</span>
                        <span className="ev-fhint-text">{s.part} <em className="ev-fhint-pct">({s.pct}%)</em></span>
                      </div>
                    ))}
                  </div>
                ) : null;
              })()}
              <div className="ev-control-row">
                <label className="ev-label">Question <span className="ev-optional">(optional)</span></label>
                <textarea
                  className="ev-question-input"
                  placeholder="Paste the question here for context…"
                  rows={3}
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Right: answer area */}
          <div className="ev-right">
            <div className="ev-answer-top">
              <label className="ev-label">Your Answer</label>
              <div className="ev-wc-right">
                {hasQuestionPrefix && <span className="ev-qprefix-note">answer only</span>}
                <span className={`ev-wc-badge ${wc > wordLimit * 1.2 ? "over" : wc >= wordLimit * 0.85 ? "good" : ""}`}>
                  {wc} / {wordLimit} words
                </span>
              </div>
            </div>
            <div
              ref={answerRef}
              className="ev-textarea ev-textarea--editable"
              contentEditable
              suppressContentEditableWarning
              data-placeholder="Write or paste your UPSC answer here…&#10;&#10;Tip: Include an intro, 2-3 body paragraphs, way forward, and conclusion."
              onPaste={handleAnswerPaste}
              onInput={e => setAnswer(e.currentTarget.innerText || "")}
            />
            <div className="ev-answer-bar">
              <div className="ev-wc-track">
                <div className="ev-wc-fill" style={{ width: `${wcPct}%`, background: wcColor }} />
              </div>
              <button className="ev-evaluate-btn" onClick={evaluate} disabled={wc < 20}>
                {wc < 20 ? "Write your answer first" : "Evaluate Answer →"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── RESULTS TAB ── */}
      {activeTab === "result" && result && (
        <div className="ev-result-layout">
          {/* Score overview */}
          <div className="ev-score-card">
            <div className="ev-score-ring-wrap">
              <ScoreRing score={result.totalScore} color={gradeColor(result.grade)} />
              <div className="ev-score-center">
                <div className="ev-score-num" style={{ color: gradeColor(result.grade) }}>{result.totalScore}</div>
                <div className="ev-score-denom">/100</div>
              </div>
            </div>
            <div className="ev-score-meta">
              <div className="ev-grade-badge" style={{ background: gradeColor(result.grade) + "18", color: gradeColor(result.grade) }}>
                Grade {result.grade}
              </div>
              <div className="ev-score-words">{result.wordCount} words · Target: {result.wordLimit}</div>
              {result.question && <div className="ev-score-q">"{result.question.slice(0,80)}{result.question.length > 80 ? "…" : ""}"</div>}
            </div>
            <button className="ev-retry-btn" onClick={() => setTab("write")}>Edit & Re-evaluate</button>
            <button className="ev-new-btn" onClick={reset}>New Answer</button>
          </div>

          {/* Breakdown bars */}
          <div className="ev-breakdown">
            <div className="ev-breakdown-title">Score Breakdown</div>
            {result.breakdown.map(b => {
              const pct = Math.round((b.score / b.max) * 100);
              return (
                <div key={b.label} className="ev-breakdown-row">
                  <div className="ev-bd-header">
                    <span className="ev-bd-label">{b.label}</span>
                    <span className="ev-bd-score" style={{ color: b.color }}>{b.score}/{b.max}</span>
                  </div>
                  <div className="ev-bd-track">
                    <div className="ev-bd-fill" style={{ width: `${pct}%`, background: b.color }} />
                  </div>
                  <div className="ev-bd-tip">{b.tip}</div>
                </div>
              );
            })}
          </div>

          {/* Dimensions & Missing */}
          <div className="ev-feedback-grid">
            <div className="ev-feedback-col">
              <div className="ev-fb-title">✅ Dimensions Covered</div>
              {result.coveredDims.length > 0
                ? result.coveredDims.map(d => <div key={d} className="ev-dim-chip ev-dim-ok">{d}</div>)
                : <div className="ev-fb-empty">No dimensions detected</div>}
            </div>
            <div className="ev-feedback-col">
              <div className="ev-fb-title">⚠️ What's Missing</div>
              {result.missing.length > 0
                ? result.missing.map((m,i) => <div key={i} className="ev-missing-item">• {m}</div>)
                : <div className="ev-fb-empty ev-all-good">All key elements present!</div>}
            </div>
          </div>

          {/* Sample Answer with Improvements */}
          <div className="ev-sample-section">
            <div className="ev-sample-hdr">
              <div>
                <div className="ev-sample-title">📝 Sample Answer with Improvements</div>
                <div className="ev-sample-sub">
                  {aiSample
                    ? <><span className="ev-chip-ai">AI</span> Real data points added · <span className="ev-chip-green">green</span> = AI additions</>
                    : <>Template preview · <span className="ev-chip-green">green</span> = added · <span className="ev-chip-yellow">yellow</span> = suggested</>
                  }
                </div>
              </div>
              <div className="ev-sample-actions">
                <button className="ev-ai-btn" onClick={() => generateAISample(null, aiProvider)} disabled={aiLoading}>
                  {aiLoading ? "Generating…" : aiSample ? "✨ Regenerate with AI" : "✨ Improve with AI"}
                </button>
                <button className="ev-sample-toggle-btn" onClick={() => setShowSample(s => !s)}>
                  {showSample ? "▲ Hide" : "▼ Show"}
                </button>
              </div>
            </div>

            {/* Provider selector + API key input */}
            {showKeyInput && (
              <div className="ev-apikey-row">
                <div className="ev-provider-pills">
                  {PROVIDERS.map(p => (
                    <button key={p.id}
                      className={`ev-provider-pill ${aiProvider === p.id ? "active" : ""}`}
                      onClick={() => switchProvider(p.id)}>
                      {p.label}
                      <span className={`ev-provider-badge ${p.id === "openai" ? "paid" : "free"}`}>{p.badge}</span>
                    </button>
                  ))}
                </div>
                <div className="ev-apikey-input-row">
                  <input
                    className="ev-apikey-input"
                    type="password"
                    placeholder={`${PROVIDERS.find(p => p.id === aiProvider)?.label} API key…`}
                    value={keyDraft}
                    onChange={e => setKeyDraft(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") saveApiKey(keyDraft); }}
                    autoFocus
                  />
                  <button className="ev-apikey-save" onClick={() => saveApiKey(keyDraft)}>Save & Generate</button>
                  <button className="ev-apikey-cancel" onClick={() => setShowKeyInput(false)}>Cancel</button>
                </div>
                <div className="ev-apikey-hint">
                  Get free key →&nbsp;
                  <a href={PROVIDERS.find(p => p.id === aiProvider)?.hintUrl} target="_blank" rel="noreferrer">
                    {PROVIDERS.find(p => p.id === aiProvider)?.hintText}
                  </a>
                </div>
              </div>
            )}

            {/* Provider tabs + key change when key saved */}
            {!showKeyInput && (
              <div className="ev-apikey-set-row">
                <div className="ev-provider-tabs">
                  {PROVIDERS.map(p => (
                    <button key={p.id}
                      className={`ev-provider-tab ${aiProvider === p.id ? "active" : ""}`}
                      onClick={() => switchProvider(p.id)}>
                      {p.label}
                      <span className={`ev-provider-badge ${p.id === "openai" ? "paid" : "free"}`}>{p.badge}</span>
                    </button>
                  ))}
                </div>
                <button className="ev-apikey-change"
                  onClick={() => { setKeyDraft(aiKeys[aiProvider] || ""); setShowKeyInput(true); }}>
                  {aiKeys[aiProvider] ? "Change Key" : "+ Add Key"}
                </button>
              </div>
            )}

            {/* Error */}
            {aiError && (
              <div className="ev-ai-error">
                ⚠️ {aiError}
                <button onClick={() => { setKeyDraft(apiKey); setShowKeyInput(true); }}>Change API Key</button>
              </div>
            )}

            {/* Loading */}
            {aiLoading && (
              <div className="ev-ai-loading">
                <div className="ev-ai-spinner" />
                Generating real improvements with ChatGPT…
              </div>
            )}

            {/* Content */}
            {showSample && !aiLoading && (
              <div className="ev-sample-body">
                {aiSample ? (
                  <div className="ev-ai-answer">
                    {parseAiResponse(aiSample).map((part, i) => (
                      <div key={i} className={part.type === "added" ? "ev-ai-added-block" : "ev-ai-orig-block"}>
                        {renderAiSegment(part.text)}
                      </div>
                    ))}
                  </div>
                ) : (
                  generateSampleAnswer(result).map((part, i) => {
                    if (part.type === "original") return (
                      <div key={i} className="ev-sample-part ev-sample-original">
                        <span className="ev-sample-part-label">Your Answer</span>
                        <pre className="ev-sample-text">{part.text}</pre>
                      </div>
                    );
                    if (part.type === "added") return (
                      <div key={i} className="ev-sample-part ev-sample-added">
                        <span className="ev-sample-part-label ev-sample-part-label--green">✦ {part.label}</span>
                        <pre className="ev-sample-text">{part.text}</pre>
                      </div>
                    );
                    if (part.type === "suggestion") return (
                      <div key={i} className="ev-sample-part ev-sample-suggestion">
                        <span className="ev-sample-part-label ev-sample-part-label--yellow">💡 {part.label}</span>
                        <pre className="ev-sample-text">{part.text}</pre>
                      </div>
                    );
                    return null;
                  })
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "result" && !result && (
        <div className="ev-empty">
          <div className="ev-empty-icon">📋</div>
          <div>No evaluation yet. Write and evaluate an answer first.</div>
          <button className="ev-evaluate-btn" style={{marginTop:14}} onClick={() => setTab("write")}>Go to Write tab</button>
        </div>
      )}

      {/* ── HISTORY TAB ── */}
      {activeTab === "history" && (
        <div className="ev-history">
          {history.length === 0 ? (
            <div className="ev-empty">
              <div className="ev-empty-icon">📂</div>
              <div>No evaluation history yet.</div>
            </div>
          ) : (
            <>
              <div className="ev-history-header">
                <span>{history.length} evaluations</span>
                <button className="viewer-action-btn" onClick={() => { setHistory([]); saveHistory([]); }}>Clear History</button>
              </div>
              <div className="ev-history-list">
                {history.map((h,i) => (
                  <div key={i} className="ev-history-row">
                    <div className="ev-hist-grade" style={{ background: gradeColor(h.grade) + "18", color: gradeColor(h.grade) }}>
                      {h.grade}
                    </div>
                    <div className="ev-hist-body">
                      <div className="ev-hist-q">{h.question || "Untitled answer"}</div>
                      <div className="ev-hist-meta">{h.totalScore}/100 · {new Date(h.ts).toLocaleDateString("en-IN")}</div>
                    </div>
                    <div className="ev-hist-score">{h.totalScore}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
