import React, { useState, useRef, useCallback } from "react";
import { SAMPLE_PYQS, SAMPLE_NOTES, GS_TAGS } from "../lib/constants";

// ── Markdown renderer (mirrors Chatbot's MdContent) ───────────────────────────

function inlineFmt(text) {
  const parts = []; const re = /(\*\*[^*\n]+?\*\*|\*[^*\n]+?\*|`[^`\n]+?`)/g;
  let last = 0, i = 0, m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const r = m[0];
    if (r.startsWith("**"))     parts.push(<strong key={i++}>{r.slice(2,-2)}</strong>);
    else if (r.startsWith("`")) parts.push(<code key={i++} className="cb-code">{r.slice(1,-1)}</code>);
    else                        parts.push(<em key={i++}>{r.slice(1,-1)}</em>);
    last = re.lastIndex;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts.length === 1 && typeof parts[0] === "string" ? parts[0] : parts;
}

function MdAnswer({ text }) {
  const nodes = []; let key = 0; let list = [];
  const flush = () => {
    if (!list.length) return;
    nodes.push(<ul key={key++} className="pyq-ans-ul">{[...list]}</ul>);
    list = [];
  };
  for (const raw of text.split("\n")) {
    const t = raw.trim();
    if (!t)                        { flush(); continue; }
    if (t.startsWith("## "))       { flush(); nodes.push(<h2 key={key++} className="pyq-ans-h2">{inlineFmt(t.slice(3))}</h2>); }
    else if (t.startsWith("### ")) { flush(); nodes.push(<h3 key={key++} className="pyq-ans-h3">{inlineFmt(t.slice(4))}</h3>); }
    else if (/^[-*•]\s/.test(t))  { list.push(<li key={key++} className="pyq-ans-li">{inlineFmt(t.replace(/^[-*•]\s/,""))}</li>); }
    else                           { flush(); nodes.push(<p key={key++} className="pyq-ans-p">{inlineFmt(t)}</p>); }
  }
  flush();
  return <>{nodes}</>;
}

// ── Static data ───────────────────────────────────────────────────────────────

const BROWSE_PAPERS = [
  { id: "all",  label: "All Papers"   },
  { id: "gs1",  label: "GS I"         },
  { id: "gs2",  label: "GS II"        },
  { id: "gs3",  label: "GS III"       },
  { id: "gs4",  label: "GS IV"        },
  { id: "ess",  label: "Essay"        },
  { id: "ant",  label: "Anthropology" },
];

const UPLOAD_PAPERS = [
  { id: "gs1",   label: "GS I",           hint: "History · Geography · Society",    tagId: "gs1" },
  { id: "gs2",   label: "GS II",          hint: "Polity · Governance · IR",          tagId: "gs2" },
  { id: "gs3",   label: "GS III",         hint: "Economy · Environment · Security",  tagId: "gs3" },
  { id: "gs4",   label: "GS IV",          hint: "Ethics & Integrity",                tagId: "gs4" },
  { id: "ess",   label: "Essay",          hint: "Essay paper",                       tagId: "ess" },
  { id: "anth1", label: "Anthropology 1", hint: "Paper I — Social Anthropology",     tagId: "ant" },
  { id: "anth2", label: "Anthropology 2", hint: "Paper II — Applied Anthropology",   tagId: "ant" },
];

const BROWSE_YEARS = ["All Years", ...Array.from({ length: 16 }, (_, i) => String(2025 - i))];
const UPLOAD_YEARS = Array.from({ length: 16 }, (_, i) => 2025 - i);

// Fewer than this many visible chars per page → treat as scanned PDF
const SCANNED_THRESHOLD = 40;

// ── Theme auto-suggestion ─────────────────────────────────────────────────────

const THEME_RULES = [
  { theme: "Women Empowerment",    kw: ["women", "gender", "shg", "self-help group", "maternity", "girl child", "feminist", "patriarchy", "dowry", "trafficking"] },
  { theme: "Constitutional Law",   kw: ["constitution", "fundamental right", "directive principle", "article", "amendment", "judicial review", "writ", "habeas corpus", "freedom of speech"] },
  { theme: "Governance",           kw: ["governance", "tribunal", "bureaucracy", "civil servant", "decentralization", "panchayat", "e-governance", "transparency", "accountability", "rti", "ombudsman"] },
  { theme: "Parliament & Legislature", kw: ["parliament", "lok sabha", "rajya sabha", "speaker", "legislation", "bill", "ordinance", "question hour", "zero hour", "anti-defection"] },
  { theme: "Judiciary",            kw: ["supreme court", "high court", "judiciary", "judge", "justice", "court", "PIL", "judicial activism", "bail", "contempt"] },
  { theme: "Elections & Polity",   kw: ["election", "eci", "voting", "electoral", "mcc", "party", "coalition", "governor", "president", "vice president", "EVM"] },
  { theme: "Federalism",           kw: ["federalism", "centre-state", "state list", "concurrent list", "finance commission", "inter-state", "governor", "president's rule"] },
  { theme: "Foreign Policy & IR",  kw: ["foreign policy", "bilateral", "diplomacy", "geopolitics", "asean", "brics", "g20", "united nations", "nato", "china", "pakistan", "usa", "russia", "neighbourhood", "saarc"] },
  { theme: "Economy",              kw: ["economy", "gdp", "inflation", "fiscal", "monetary", "rbi", "sebi", "budget", "taxation", "gst", "trade", "wto", "fdi", "investment", "disinvestment", "debt"] },
  { theme: "Agriculture",          kw: ["agriculture", "farmer", "crop", "irrigation", "msp", "food security", "pds", "apmc", "rural", "agrarian", "land reform", "fertilizer", "horticulture"] },
  { theme: "Environment & Climate",kw: ["environment", "climate", "pollution", "carbon", "biodiversity", "forest", "wildlife", "ecosystem", "renewable", "solar", "wind", "cop", "paris agreement", "ndc", "ozone"] },
  { theme: "Disaster Management",  kw: ["disaster", "flood", "earthquake", "cyclone", "drought", "ndma", "resilience", "mitigation", "relief", "disaster management"] },
  { theme: "Internal Security",    kw: ["security", "terrorism", "naxal", "insurgency", "border", "defence", "army", "paramilitary", "cybercrime", "money laundering", "left wing extremism"] },
  { theme: "Science & Technology", kw: ["technology", "artificial intelligence", "space", "isro", "digital", "internet", "blockchain", "biotech", "nuclear", "innovation", "5g", "semiconductor", "ai", "drone"] },
  { theme: "Social Justice",       kw: ["poverty", "inequality", "caste", "reservation", "obc", "scheduled caste", "scheduled tribe", "tribal", "minority", "communal", "marginalised", "dalit"] },
  { theme: "Education",            kw: ["education", "nep", "school", "university", "literacy", "skill", "vocational", "dropout", "teacher", "higher education"] },
  { theme: "Health",               kw: ["health", "healthcare", "hospital", "disease", "pandemic", "mental health", "nutrition", "malnutrition", "vaccine", "ayushman", "nhm"] },
  { theme: "Urban Development",    kw: ["urban", "smart city", "metro", "housing", "slum", "municipality", "amrut", "town planning", "migration", "urbanisation"] },
  { theme: "Ethics & Integrity",   kw: ["ethics", "integrity", "corruption", "probity", "value", "moral", "attitude", "aptitude", "whistle blower", "emotional intelligence"] },
  { theme: "Digital India",        kw: ["digital india", "dpi", "upi", "aadhaar", "cowin", "jan dhan", "public infrastructure", "fintech", "data protection"] },
];

function guessTheme(question) {
  const lower = question.toLowerCase();
  let best = null, bestScore = 0;
  for (const rule of THEME_RULES) {
    const score = rule.kw.filter(k => lower.includes(k)).length;
    if (score > bestScore) { bestScore = score; best = rule.theme; }
  }
  return best || "General Studies";
}

// ── Hindi (Devanagari) filter ─────────────────────────────────────────────────
// UPSC papers print each question in both Hindi (Devanagari) and English.
// We keep only the English version by dropping lines where >15% of non-space
// characters fall in any Devanagari Unicode block.
//
// Blocks covered:
//   U+0900–U+097F  Devanagari (core Hindi, Marathi, Sanskrit)
//   U+1CD0–U+1CFF  Vedic Extensions
//   U+A8E0–U+A8FF  Devanagari Extended

// Use \u escapes — safer than literal Unicode in source across all build pipelines
const DEVANAGARI_RE = /[ऀ-ॿ᳐-᳿꣠-ꣿ]/g;

// Detects a UPSC-style question number at the very start of a line:
// "1."  "2)"  "Q.1"  "Q1."  etc.
const Q_NUM_PREFIX_RE = /^(?:Q\.?\s*)?(\d{1,2})\s*[.)]\s*/i;

// UPSC bilingual papers print each question as:
//   "1. [Hindi text…]"      ← question number sits on the Hindi line
//   "   [English text…]"    ← English text has NO leading number
//
// Naive per-line filtering would drop the Hindi line AND its number, leaving
// orphaned English text that the parser can never match.
//
// Fix: when a Hindi-dominant line starts with a question number, we look ahead
// (up to 10 lines) for the next Latin-dominant line and prepend that number to
// it before dropping the Hindi line.  The rest is unchanged per-line filtering.

function filterHindi(text) {
  const lines = text.split("\n");
  const out   = [];

  for (let i = 0; i < lines.length; i++) {
    const line      = lines[i];
    const devaCount = (line.match(DEVANAGARI_RE) || []).length;
    const charCount = line.replace(/\s/g, "").length;

    // Empty or purely Latin line → keep unchanged
    if (charCount === 0 || devaCount === 0) {
      out.push(line);
      continue;
    }

    if (devaCount / charCount > 0.15) {
      // Hindi-dominant line.
      // If it opens with a question number, transfer that number to the next
      // Latin-dominant line so the parser can still find it.
      const numMatch = line.match(Q_NUM_PREFIX_RE);
      if (numMatch) {
        for (let j = i + 1; j < lines.length && j <= i + 10; j++) {
          const nl      = lines[j].trim();
          const nd      = (nl.match(DEVANAGARI_RE) || []).length;
          const nc      = nl.replace(/\s/g, "").length;
          const isLatin = nc > 0 && (!nd || nd / nc <= 0.15) && nl.length > 8;
          if (isLatin) {
            lines[j] = numMatch[0] + nl; // e.g. "1. Discuss women empowerment…"
            break;
          }
        }
      }
      out.push(""); // discard the Hindi line itself
      continue;
    }

    // Minority Devanagari in an otherwise Latin line → strip those chars only
    out.push(line.replace(DEVANAGARI_RE, "").trim());
  }

  return out.join("\n").replace(/\n{3,}/g, "\n\n");
}

// ── OCR text cleanup ──────────────────────────────────────────────────────────

function cleanOCRText(text) {
  return text
    // Fix common letter/number confusion in question numbers at line start
    .replace(/^l\s*[.)]/gm, "1.")
    .replace(/^I\s*[.)]/gm, "1.")
    .replace(/^O\s*[.)]/gm, "0.")
    // Fix OCR misreads in common marks patterns
    .replace(/\(\s*l0\s*(?:[Mm]arks?)?\s*\)/g, "(10)")
    .replace(/\(\s*l5\s*(?:[Mm]arks?)?\s*\)/g, "(15)")
    .replace(/\(\s*2O\s*(?:[Mm]arks?)?\s*\)/g, "(20)")
    // Normalise curly quotes
    .replace(/[""]/g, '"').replace(/['']/g, "'")
    // Remove stray page-number-only lines
    .replace(/^[ \t]*\d{1,3}[ \t]*$/gm, "")
    // Collapse excessive whitespace
    .replace(/[ \t]{3,}/g, "  ")
    .replace(/\n{4,}/g, "\n\n");
}

// ── Question parsing (shared by text + OCR paths) ────────────────────────────

function guessMarks(qNum, paperId) {
  if (["gs1","gs2","gs3","gs4"].includes(paperId)) return qNum <= 10 ? 10 : 15;
  if (paperId === "ess")                           return 125;
  if (paperId === "anth1" || paperId === "anth2")  return qNum <= 5  ? 10 : 20;
  return 10;
}

// Matches UPSC paper booklet/series codes: (SLPM-G-GSA 4), (AB/C-2), (PM-1) etc.
const BOOKLET_CODE_RE = /\s*\([A-Z]{2,}[-\/][A-Z0-9][-A-Z0-9\/]*(?:\s+\d+)?\)\s*/g;

function stripBookletCodes(text) {
  return text.replace(BOOKLET_CODE_RE, " ").replace(/\s{2,}/g, " ").trim();
}

function pullMarks(text) {
  const pats = [
    /\(\s*(\d{1,3})\s*[Mm]arks?\s*\)\s*$/,
    /\[\s*(\d{1,3})\s*[Mm]arks?\s*\]\s*$/,
    /\(\s*(\d{1,3})\s*[Mm]\s*\)\s*$/,
    /\(\s*(\d{1,3})\s*\)\s*$/,
    /\[\s*(\d{1,3})\s*\]\s*$/,
    /\b(\d{1,3})\s*[Mm]arks?\s*\.?\s*$/,
    /\s+(\d{1,3})\s*$/,  // bare trailing number e.g. "...challenges. 15"
  ];
  for (const pat of pats) {
    const m = text.match(pat);
    if (m) {
      const v = parseInt(m[1]);
      if (v >= 5 && v <= 200) {
        return { marks: v, text: text.replace(pat, "").trim().replace(/[,.;]\s*$/, "") };
      }
    }
  }
  return { marks: null, text };
}

function parseQuestionsFromText(raw, paperId, year) {
  const lines = raw
    .replace(/\r\n?/g, "\n")
    .replace(/\f/g, "\n\n")
    .replace(/[ \t]+/g, " ")
    .split("\n")
    .map(l => l.trim());

  // Matches "1." "1)" "Q1." "Q.1" "Q. 1" at start of line — text ≥10 chars after
  const Q_NUM = /^(?:Q\.?\s*)?(\d{1,2})\s*[.)]\s+(.{10,})/i;
  const SKIP  = /^(instruction|time allow|maximum mark|note\s*:|section\s*[-–—]\s*[AB12]|answer any|attempt all|civil services|general studies|paper[-\s]*[IVX1-9]|commission|time\s*:\s*three|[\s\d]+hour)/i;

  const rawQs = [];
  let cur = null, buf = [];

  for (const rawLine of lines) {
    const line = stripBookletCodes(rawLine);
    if (!line || SKIP.test(line)) continue;

    const m = line.match(Q_NUM);
    if (m) {
      if (cur) {
        const full = [cur.text, ...buf].join(" ").replace(/\s+/g, " ").trim();
        const { marks: em, text: ct } = pullMarks(full);
        rawQs.push({ num: cur.num, text: ct || full, marks: cur.marks || em });
      }
      const num = parseInt(m[1]);
      const { marks, text } = pullMarks(m[2]);
      cur = { num, text, marks };
      buf = [];
    } else if (cur) {
      if (line.length < 6 || /^\d+$/.test(line)) continue;
      if (/^[(\[]\s*[a-z]\s*[)\]]/i.test(line)) continue; // sub-parts (a), (b)
      const { marks: lm, text: lt } = pullMarks(line);
      if (lm && !cur.marks) cur.marks = lm;
      if (lt && lt.length > 4) buf.push(lt);
    }
  }

  if (cur) {
    const full = [cur.text, ...buf].join(" ").replace(/\s+/g, " ").trim();
    const { marks: em, text: ct } = pullMarks(full);
    rawQs.push({ num: cur.num, text: ct || full, marks: cur.marks || em });
  }

  const tagId = UPLOAD_PAPERS.find(p => p.id === paperId)?.tagId || "gs1";
  const ts    = Date.now();

  return rawQs
    .filter(q => q.text && q.text.length > 20)
    .map((q, i) => ({
      id:       `up_${year}_${paperId}_${q.num}_${ts + i}`,
      year:     Number(year),
      paper:    tagId,
      paperSrc: paperId,
      marks:    q.marks || guessMarks(q.num, paperId),
      question: q.text.replace(/\s+/g, " ").trim(),
      approach: "Analyse the question directive carefully. Structure: Introduction (define/contextualise) → Key dimensions with data/examples/schemes → Critical analysis → Conclusion with way forward.",
      source:   "uploaded",
    }));
}

// ── PDF extraction: text layer + OCR fallback ────────────────────────────────

async function runPDFExtraction(file, paperId, year, onProgress) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        // ── Step 1: Load PDF ──────────────────────────────────────────
        onProgress({ stage: "loading" });
        const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf");
        pdfjsLib.GlobalWorkerOptions.workerSrc =
          `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

        const pdf      = await pdfjsLib.getDocument({ data: e.target.result }).promise;
        const numPages = pdf.numPages;

        // ── Step 2: Extract text layer ────────────────────────────────
        onProgress({ stage: "text", page: 0, total: numPages });
        let fullText = "";

        for (let i = 1; i <= numPages; i++) {
          onProgress({ stage: "text", page: i, total: numPages });
          const page    = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items
            .map(item => item.str + (item.hasEOL ? "\n" : " "))
            .join("");
          fullText += pageText + "\n\n";
        }

        // ── Step 3: Strip Hindi from text-layer output ────────────────
        // Apply before scanned check so the char-density measure is not
        // distorted by Devanagari characters in bilingual text PDFs.
        fullText = filterHindi(fullText);

        // ── Step 4: Check if scanned ──────────────────────────────────
        const charsPerPage = fullText.replace(/\s/g, "").length / numPages;

        if (charsPerPage < SCANNED_THRESHOLD) {
          // ── OCR path ────────────────────────────────────────────────
          // Use both 'eng' + 'hin' language models so Tesseract recognises
          // Devanagari as clean Unicode rather than garbled ASCII.
          // filterHindi() then strips all Devanagari lines precisely.
          onProgress({ stage: "ocr_init", pct: 0, substage: "loading tesseract core", page: 0, total: numPages });

          const { createWorker } = await import("tesseract.js");

          const worker = await createWorker(["eng", "hin"], 1, {
            logger: (m) => {
              if (
                m.status === "loading tesseract core" ||
                m.status === "loading language traineddata" ||
                m.status === "initializing api"
              ) {
                onProgress({
                  stage:    "ocr_init",
                  pct:      Math.round((m.progress || 0) * 100),
                  substage: m.status,
                  page:     0,
                  total:    numPages,
                });
              }
            },
          });

          fullText = "";

          for (let i = 1; i <= numPages; i++) {
            onProgress({ stage: "ocr_page", page: i, total: numPages });

            const page     = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 2.5 }); // ~180 DPI
            const canvas   = document.createElement("canvas");
            canvas.width   = viewport.width;
            canvas.height  = viewport.height;
            const ctx      = canvas.getContext("2d");
            await page.render({ canvasContext: ctx, viewport }).promise;

            const { data: { text } } = await worker.recognize(canvas);
            fullText += text + "\n\n";

            // Release canvas memory immediately
            canvas.width  = 0;
            canvas.height = 0;
          }

          await worker.terminate();
          // First strip Devanagari, then fix OCR artefacts in the remaining English text
          fullText = filterHindi(cleanOCRText(fullText));
        }

        // ── Step 5: Parse questions ───────────────────────────────────
        onProgress({ stage: "parsing", page: numPages, total: numPages });
        const questions = parseQuestionsFromText(fullText, paperId, year);
        resolve(questions);

      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = () => reject(new Error("File read error"));
    reader.readAsArrayBuffer(file);
  });
}

// ── Progress label helpers ────────────────────────────────────────────────────

function ocrSubLabel(substage) {
  if (!substage) return "Preparing…";
  if (substage.includes("core"))     return "Loading Tesseract.js LSTM core…";
  if (substage.includes("language")) return "Downloading language data (English + Hindi, ~20 MB, cached after first use)…";
  if (substage.includes("init"))     return "Initialising bilingual OCR engine…";
  return "Preparing OCR engine…";
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function PYQMapper({ onNavigate, bankQuestions = [], setBankQuestions = () => {} }) {
  // ── Browse state ──
  const [mainTab,    setMainTab]    = useState("browse");
  const [paper,      setPaper]      = useState("all");
  const [browseYear, setBrowseYear] = useState("All Years");
  const [topic,      setTopic]      = useState("Women Empowerment");
  const [expanded,   setExpanded]   = useState(null);

  // ── Upload state ──
  const [uploadYear,       setUploadYear]       = useState(2024);
  const [uploadPaper,      setUploadPaper]      = useState("gs2");
  const [extracting,       setExtracting]       = useState(false);
  const [extractProgress,  setExtractProgress]  = useState(null);
  const [extractError,     setExtractError]     = useState("");
  const [extracted,        setExtracted]        = useState([]);
  const [selected,         setSelected]         = useState(new Set());
  const [dragOver,         setDragOver]         = useState(false);
  const [fileName,         setFileName]         = useState("");

  // ── Inline-edit state ──
  const [editingId,   setEditingId]   = useState(null);
  const [editText,    setEditText]    = useState("");
  const [editMarks,   setEditMarks]   = useState(10);

  // ── End-of-list manual-add form state ──
  const [showAddForm, setShowAddForm] = useState(false);
  const [newQText,    setNewQText]    = useState("");
  const [newQMarks,   setNewQMarks]   = useState(10);

  // ── Inline "insert below row" state ──
  const [insertAfterId,    setInsertAfterId]    = useState(null);
  const [insertText,       setInsertText]       = useState("");
  const [insertMarks,      setInsertMarks]      = useState(10);

  // ── Theme filter (set when clicking a card in Theme Bank) ──
  const [activeThemeFilter, setActiveThemeFilter] = useState(null); // { paperId, theme }

  // ── Collapsed year groups ──
  const [collapsedYears, setCollapsedYears] = useState(new Set());

  const toggleYear = (yr) => {
    setCollapsedYears(prev => {
      const next = new Set(prev);
      next.has(yr) ? next.delete(yr) : next.add(yr);
      return next;
    });
  };

  // ── Hidden question IDs (built-in questions the user dismissed) ──
  const [hiddenIds, setHiddenIds] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("upsc_pyq_hidden") || "[]")); } catch { return new Set(); }
  });

  const deleteBrowseQuestion = (q, e) => {
    e.stopPropagation();
    if (q.source === "uploaded") {
      setBankQuestions(prev => prev.filter(bq => bq.id !== q.id));
    } else {
      const next = new Set(hiddenIds).add(q.id);
      setHiddenIds(next);
      localStorage.setItem("upsc_pyq_hidden", JSON.stringify([...next]));
    }
    if (expanded === q.id) setExpanded(null);
  };

  // ── Question themes ──
  const [pyqThemes,    setPyqThemes]    = useState(() => {
    try { return JSON.parse(localStorage.getItem("upsc_pyq_themes") || "{}"); } catch { return {}; }
  });
  const [editThemeId,  setEditThemeId]  = useState(null);
  const [themeInput,   setThemeInput]   = useState("");

  const getTheme = (q) => pyqThemes[q.id] ?? guessTheme(q.question);

  const saveTheme = (qId, value) => {
    const trimmed = value.trim();
    const next = { ...pyqThemes, [qId]: trimmed || guessTheme(allPYQs.find(q => q.id === qId)?.question || "") };
    setPyqThemes(next);
    localStorage.setItem("upsc_pyq_themes", JSON.stringify(next));
  };

  const commitTheme = (qId) => {
    saveTheme(qId, themeInput);
    setEditThemeId(null);
  };

  // ── Saved AI answers (from chatbot) ──
  const [pyqAnswers,    setPyqAnswers]    = useState(() => {
    try { return JSON.parse(localStorage.getItem("upsc_pyq_answers") || "{}"); } catch { return {}; }
  });
  const [expandedAns,  setExpandedAns]  = useState({}); // { [qId]: true/false }
  const [editingAns,   setEditingAns]   = useState(null); // qId whose answer is being edited
  const [ansEditDraft, setAnsEditDraft] = useState("");

  const toggleAns = (qId) => setExpandedAns(prev => ({ ...prev, [qId]: !prev[qId] }));

  const startEditAns = (qId, text, e) => {
    e.stopPropagation();
    setEditingAns(qId);
    setAnsEditDraft(text);
  };

  const saveEditAns = (qId, e) => {
    e.stopPropagation();
    const all = { ...pyqAnswers, [qId]: { ...pyqAnswers[qId], text: ansEditDraft.trim(), editedAt: Date.now() } };
    setPyqAnswers(all);
    localStorage.setItem("upsc_pyq_answers", JSON.stringify(all));
    setEditingAns(null);
  };

  const deleteAns = (qId, e) => {
    e.stopPropagation();
    const all = { ...pyqAnswers }; delete all[qId];
    setPyqAnswers(all);
    localStorage.setItem("upsc_pyq_answers", JSON.stringify(all));
    setExpandedAns(prev => { const n = {...prev}; delete n[qId]; return n; });
  };

  // Sync answers on mount (covers SPA navigation back from chatbot) + window focus
  React.useEffect(() => {
    const sync = () => {
      try { setPyqAnswers(JSON.parse(localStorage.getItem("upsc_pyq_answers") || "{}")); } catch {}
    };
    sync(); // run immediately on mount
    window.addEventListener("focus", sync);
    return () => window.removeEventListener("focus", sync);
  }, []);

  const fileRef = useRef();

  // ── Computed ──────────────────────────────────────────────────────────────

  const allPYQs    = [...SAMPLE_PYQS, ...bankQuestions].filter(q => !hiddenIds.has(q.id));
  const filtered   = allPYQs.filter(q => {
    const matchPaper = paper === "all" || q.paper === paper;
    const matchYear  = browseYear === "All Years" || q.year === Number(browseYear);
    const matchTheme = !activeThemeFilter || getTheme(q) === activeThemeFilter.theme;
    return matchPaper && matchYear && matchTheme;
  });
  const grouped    = filtered.reduce((acc, q) => {
    acc[q.year] = acc[q.year] || [];
    acc[q.year].push(q);
    return acc;
  }, {});
  const sortedYears = Object.keys(grouped).sort((a, b) => b - a);
  const getGsTag   = id => GS_TAGS.find(g => g.id === id);

  const isOCR = extractProgress &&
    (extractProgress.stage === "ocr_init" || extractProgress.stage === "ocr_page");

  // ── Upload handlers ───────────────────────────────────────────────────────

  const processFile = useCallback(async (file) => {
    if (!file || file.type !== "application/pdf") {
      setExtractError("Please upload a valid PDF file (.pdf).");
      return;
    }
    setFileName(file.name);
    setExtracting(true);
    setExtractError("");
    setExtracted([]);
    setSelected(new Set());
    setExtractProgress(null);

    // Track OCR usage in a closure variable — React state resets before we
    // read it, so isOCR from component scope is always false by the time the
    // finally block runs.
    let usedOCR = false;

    try {
      const questions = await runPDFExtraction(
        file, uploadPaper, uploadYear,
        prog => {
          setExtractProgress(prog);
          if (prog.stage === "ocr_init" || prog.stage === "ocr_page") usedOCR = true;
        }
      );

      if (questions.length === 0) {
        setExtractError(
          usedOCR
            ? "OCR completed but no questions were detected. The PDF may be a low-resolution scan — try a 300 DPI version, or check that Hindi filtering isn't removing question text."
            : "No text content found — this looks like a scanned PDF. Re-uploading now triggers automatic OCR. If the problem persists, the PDF may be password-protected or image-only with no selectable text."
        );
      } else {
        setExtracted(questions);
        setSelected(new Set(questions.map(q => q.id)));
      }
    } catch (err) {
      setExtractError(
        `Extraction failed: ${err.message}. ` +
        "Ensure the PDF is not password-protected. For very large papers (>30 pages), try splitting the PDF first."
      );
    } finally {
      setExtracting(false);
      setExtractProgress(null);
    }
  }, [uploadPaper, uploadYear]); // eslint-disable-line

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const toggleSelect = (id) => {
    setSelected(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const handleAddToBank = () => {
    const toAdd = extracted.filter(q => selected.has(q.id));
    setBankQuestions(prev => [...prev, ...toAdd]);
    setExtracted([]);
    setSelected(new Set());
    setFileName("");
    setExtractError("");
    setEditingId(null);
    setShowAddForm(false);
    setNewQText("");
    const tagId = UPLOAD_PAPERS.find(p => p.id === uploadPaper)?.tagId || "all";
    setPaper(tagId);
    setBrowseYear(String(uploadYear));
    setMainTab("browse");
  };

  const resetUpload = () => {
    setExtracted([]);
    setSelected(new Set());
    setFileName("");
    setExtractError("");
    setExtractProgress(null);
    setEditingId(null);
    setShowAddForm(false);
    setNewQText("");
  };

  // ── Inline edit handlers ──────────────────────────────────────────────────

  const startEdit = (q, e) => {
    e.stopPropagation();
    setEditingId(q.id);
    setEditText(q.question);
    setEditMarks(q.marks);
  };

  const saveEdit = (id, e) => {
    e.stopPropagation();
    if (!editText.trim()) return;
    setExtracted(prev => prev.map(q =>
      q.id === id ? { ...q, question: editText.trim(), marks: Number(editMarks) || q.marks } : q
    ));
    setEditingId(null);
  };

  const cancelEdit = (e) => { e.stopPropagation(); setEditingId(null); };

  const deleteQuestion = (id, e) => {
    e.stopPropagation();
    setExtracted(prev => prev.filter(q => q.id !== id));
    setSelected(prev => { const n = new Set(prev); n.delete(id); return n; });
    if (editingId === id) setEditingId(null);
  };

  // ── Manual add handler (end of list) ─────────────────────────────────────

  const addManualQuestion = () => {
    if (!newQText.trim()) return;
    const tagId = UPLOAD_PAPERS.find(p => p.id === uploadPaper)?.tagId || "gs1";
    const newQ  = {
      id:       `manual_${uploadYear}_${uploadPaper}_${Date.now()}`,
      year:     Number(uploadYear),
      paper:    tagId,
      paperSrc: uploadPaper,
      marks:    Number(newQMarks) || guessMarks(extracted.length + 1, uploadPaper),
      question: newQText.trim(),
      approach: "Analyse the question directive carefully. Structure: Introduction (define/contextualise) → Key dimensions with data/examples/schemes → Critical analysis → Conclusion with way forward.",
      source:   "uploaded",
      manual:   true,
    };
    setExtracted(prev => [...prev, newQ]);
    setSelected(prev => new Set([...prev, newQ.id]));
    setNewQText("");
    setNewQMarks(10);
    setShowAddForm(false);
  };

  // ── Insert-below-row handler ──────────────────────────────────────────────

  const addAfterRow = (afterId) => {
    if (!insertText.trim()) return;
    const tagId = UPLOAD_PAPERS.find(p => p.id === uploadPaper)?.tagId || "gs1";
    const newQ  = {
      id:       `manual_${Date.now()}`,
      year:     Number(uploadYear),
      paper:    tagId,
      paperSrc: uploadPaper,
      marks:    Number(insertMarks) || 10,
      question: insertText.trim(),
      approach: "Analyse the question directive carefully. Structure: Introduction (define/contextualise) → Key dimensions with data/examples/schemes → Critical analysis → Conclusion with way forward.",
      source:   "uploaded",
      manual:   true,
    };
    setExtracted(prev => {
      const idx  = prev.findIndex(q => q.id === afterId);
      const copy = [...prev];
      copy.splice(idx === -1 ? copy.length : idx + 1, 0, newQ);
      return copy;
    });
    setSelected(prev => new Set([...prev, newQ.id]));
    setInsertAfterId(null);
    setInsertText("");
    setInsertMarks(10);
  };

  // ── Progress rendering ────────────────────────────────────────────────────

  const prog = extractProgress || {};
  const textPct  = prog.total ? Math.round((prog.page / prog.total) * 100) : 0;
  const ocrPct   = prog.stage === "ocr_init"
    ? (prog.pct || 0)
    : prog.total
      ? Math.round((prog.page / prog.total) * 100)
      : 0;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">PYQ Mapper</p>
          <h1 className="page-title">Past Year Questions</h1>
        </div>
        <button className="primary-btn" onClick={() => onNavigate && onNavigate("answers")}>
          Answer Builder →
        </button>
      </div>

      {/* ── Main tabs ── */}
      <div className="pyq-main-tabs">
        <button className={`pyq-main-tab ${mainTab === "browse" ? "active" : ""}`} onClick={() => setMainTab("browse")}>
          Browse Questions
          {bankQuestions.length > 0 && <span className="pyq-tab-badge">{bankQuestions.length} uploaded</span>}
        </button>
        <button className={`pyq-main-tab ${mainTab === "upload" ? "active" : ""}`} onClick={() => setMainTab("upload")}>
          Upload PYQ Paper
        </button>
        <button className={`pyq-main-tab ${mainTab === "themes" ? "active" : ""}`} onClick={() => setMainTab("themes")}>
          🏷 Theme Bank
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════════
          BROWSE TAB
      ═══════════════════════════════════════════════════════ */}
      {mainTab === "browse" && (
        <>
          {/* ── Active theme filter banner ── */}
          {activeThemeFilter && (
            <div className="pyq-theme-filter-banner">
              <span className="pyq-theme-filter-icon">🏷</span>
              <span className="pyq-theme-filter-text">
                Showing only: <strong>{activeThemeFilter.theme}</strong>
              </span>
              <span className="pyq-theme-filter-count">{filtered.length} question{filtered.length !== 1 ? "s" : ""}</span>
              <button
                className="pyq-theme-filter-clear"
                onClick={() => setActiveThemeFilter(null)}
              >✕ Clear filter</button>
            </div>
          )}

          <div className="pyq-topic-bar">
            <div className="pyq-topic-label">Showing PYQs for:</div>
            <div className="pyq-topic-pills">
              {SAMPLE_NOTES.map(n => (
                <button key={n.id} className={`filter-pill ${topic === n.topic ? "active" : ""}`}
                  onClick={() => setTopic(n.topic)}>{n.topic}</button>
              ))}
            </div>
          </div>

          <div className="pyq-filter-bar">
            <div className="pyq-filter-group">
              <label className="pyq-filter-label">GS Paper</label>
              <div className="pyq-filter-pills">
                {BROWSE_PAPERS.map(p => {
                  const tag = GS_TAGS.find(g => g.id === p.id);
                  return (
                    <button key={p.id}
                      className={`filter-pill ${paper === p.id ? "active" : ""}`}
                      style={paper === p.id && tag ? { background: tag.bg, color: tag.color, borderColor: tag.color } : {}}
                      onClick={() => { setPaper(p.id); setActiveThemeFilter(null); }}>
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="pyq-filter-group">
              <label className="pyq-filter-label">Year</label>
              <select className="gen-select pyq-year-select" value={browseYear}
                onChange={e => setBrowseYear(e.target.value)}>
                {BROWSE_YEARS.map(y => <option key={y}>{y}</option>)}
              </select>
            </div>
          </div>

          <div className="pyq-stats-bar">
            <div className="pyq-stat"><span className="pyq-stat-val">{filtered.length}</span><span className="pyq-stat-label">Questions found</span></div>
            <div className="pyq-stat-div" />
            <div className="pyq-stat"><span className="pyq-stat-val">{sortedYears.length}</span><span className="pyq-stat-label">Years covered</span></div>
            <div className="pyq-stat-div" />
            <div className="pyq-stat"><span className="pyq-stat-val">{filtered.reduce((s, q) => s + q.marks, 0)}</span><span className="pyq-stat-label">Total marks</span></div>
            <div className="pyq-stat-div" />
            <div className="pyq-stat"><span className="pyq-stat-val">{allPYQs.length}</span><span className="pyq-stat-label">In bank</span></div>
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎯</div>
              <div className="empty-title">No PYQs match this filter</div>
              <div className="empty-sub">Try changing filters or upload a PYQ paper PDF</div>
              <button className="primary-btn" style={{ marginTop: 14 }} onClick={() => setMainTab("upload")}>
                Upload PYQ Paper
              </button>
            </div>
          ) : (
            sortedYears.map(yr => {
              const isYearCollapsed = collapsedYears.has(yr);
              return (
              <div key={yr} className="pyq-year-group">
                <div className="pyq-year-header pyq-year-header--clickable" onClick={() => toggleYear(yr)}>
                  <div className="pyq-year-badge">{yr}</div>
                  <div className="pyq-year-count">{grouped[yr].length} question{grouped[yr].length !== 1 ? "s" : ""}</div>
                  <div className="pyq-year-line" />
                  <span className="pyq-year-chevron">{isYearCollapsed ? "▶" : "▼"}</span>
                </div>
                {!isYearCollapsed && <div className="pyq-list">
                  {grouped[yr].map(q => {
                    const tag    = getGsTag(q.paper);
                    const isOpen = expanded === q.id;
                    return (
                      <div key={q.id} className={`pyq-item ${isOpen ? "pyq-item-open" : ""}`}>
                        <div className="pyq-item-header" onClick={() => setExpanded(isOpen ? null : q.id)}>
                          <div className="pyq-item-left">
                            {tag && <span className="gs-pill" style={{ background: tag.bg, color: tag.color }}>{tag.label}</span>}
                            {q.source === "uploaded" && <span className="pyq-uploaded-badge">↑ Uploaded</span>}
                            <span className="pyq-marks-badge">{q.marks} marks</span>
                          </div>
                          <div className="pyq-item-question">{q.question}</div>
                          <button
                            className="pyq-browse-del-btn"
                            title="Delete question"
                            onClick={e => deleteBrowseQuestion(q, e)}
                          >✕</button>
                          <div className="pyq-item-toggle">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                              stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                              style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                              <path d="m6 9 6 6 6-6" />
                            </svg>
                          </div>

                          {/* ── Theme chip (inline, right of chevron) ── */}
                          <div className="pyq-theme-inline" onClick={e => e.stopPropagation()}>
                            {editThemeId === q.id ? (
                              <input
                                className="pyq-theme-input"
                                value={themeInput}
                                autoFocus
                                onChange={e => setThemeInput(e.target.value)}
                                onBlur={() => commitTheme(q.id)}
                                onKeyDown={e => {
                                  if (e.key === "Enter") commitTheme(q.id);
                                  if (e.key === "Escape") setEditThemeId(null);
                                }}
                              />
                            ) : (
                              <span
                                className="pyq-theme-chip"
                                title="Click to edit theme"
                                onClick={() => { setEditThemeId(q.id); setThemeInput(getTheme(q)); }}
                              >
                                {getTheme(q)}
                                <span className="pyq-theme-edit-icon">✎</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {isOpen && (
                          <div className="pyq-item-body">
                            <div className="pyq-approach-label">Model Approach</div>
                            <div className="pyq-approach-text">{q.approach}</div>
                            <div className="pyq-item-actions">
                              <button className="viewer-action-btn" onClick={() => onNavigate && onNavigate("notes")}>Open Related Note</button>
                              <button
                                className="pyq-ask-ai-btn"
                                onClick={() => onNavigate && onNavigate("chatbot", {
                                  chatQuestion: { text: q.question, marks: q.marks, year: q.year, paper: q.paper },
                                  chatPyqId: q.id,
                                })}
                              >
                                🤖 Ask AI
                              </button>
                              <button className="viewer-action-btn primary" onClick={() => onNavigate && onNavigate("answers", { questionId: q.id })}>
                                ✦ Build Answer ({q.marks <= 10 ? "150" : "250"} words) →
                              </button>
                            </div>

                            {/* ── Saved AI answer (expand/collapse) ── */}
                            {pyqAnswers[q.id] && (
                              <div className="pyq-saved-ans-wrap" onClick={e => e.stopPropagation()}>
                                <div
                                  className={`pyq-saved-ans-hdr ${expandedAns[q.id] ? "open" : ""}`}
                                  onClick={() => toggleAns(q.id)}
                                >
                                  <span className="pyq-saved-ans-label">
                                    <span className="pyq-saved-ans-dot" />
                                    Saved AI Answer
                                    <span className="pyq-saved-ans-meta">
                                      {pyqAnswers[q.id].model} · {pyqAnswers[q.id].wordLimit}w
                                      {pyqAnswers[q.id].editedAt ? " · edited" : ""}
                                    </span>
                                  </span>
                                  <div className="pyq-saved-ans-btns">
                                    {expandedAns[q.id] && (
                                      <>
                                        {editingAns !== q.id && (
                                          <button className="pyq-ans-edit-btn" onClick={e => startEditAns(q.id, pyqAnswers[q.id].text, e)}>
                                            ✎ Edit
                                          </button>
                                        )}
                                        {editingAns === q.id && (
                                          <button className="pyq-ans-save-btn" onClick={e => saveEditAns(q.id, e)}>
                                            ✓ Save
                                          </button>
                                        )}
                                        <button className="pyq-ans-del-btn" onClick={e => deleteAns(q.id, e)}>✕</button>
                                      </>
                                    )}
                                    <span className="pyq-saved-ans-chevron">{expandedAns[q.id] ? "▲" : "▼"}</span>
                                  </div>
                                </div>
                                {expandedAns[q.id] && (
                                  <div className="pyq-saved-ans-body">
                                    {editingAns === q.id ? (
                                      <textarea
                                        className="pyq-ans-edit-textarea"
                                        value={ansEditDraft}
                                        onChange={e => setAnsEditDraft(e.target.value)}
                                        onClick={e => e.stopPropagation()}
                                        rows={12}
                                      />
                                    ) : (
                                      <div className="pyq-ans-text"><MdAnswer text={pyqAnswers[q.id].text} /></div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>}
              </div>
              );
            })
          )}
        </>
      )}

      {/* ═══════════════════════════════════════════════════════
          UPLOAD TAB
      ═══════════════════════════════════════════════════════ */}
      {mainTab === "upload" && (
        <div className="pyq-upload-panel">

          {/* ── Config: Year + Paper ── */}
          <div className="pyq-upload-config">
            <div className="pyq-upload-config-group">
              <label className="pyq-filter-label">Exam Year</label>
              <select className="gen-select pyq-year-select" value={uploadYear}
                onChange={e => { setUploadYear(Number(e.target.value)); resetUpload(); }}>
                {UPLOAD_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="pyq-upload-config-group pyq-upload-paper-group">
              <label className="pyq-filter-label">Paper</label>
              <div className="pyq-upload-paper-grid">
                {UPLOAD_PAPERS.map(p => {
                  const tag    = GS_TAGS.find(g => g.id === p.tagId);
                  const active = uploadPaper === p.id;
                  return (
                    <button key={p.id}
                      className={`pyq-upload-paper-btn ${active ? "active" : ""}`}
                      style={active && tag ? { background: tag.bg, borderColor: tag.color, color: tag.color } : {}}
                      onClick={() => { setUploadPaper(p.id); resetUpload(); }}>
                      <span className="pyq-up-paper-label">{p.label}</span>
                      <span className="pyq-up-paper-hint">{p.hint}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Drop zone ── */}
          {!extracting && extracted.length === 0 && (
            <>
              <div
                className={`pyq-drop-zone ${dragOver ? "dragging" : ""}`}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current.click()}>
                <div className="pyq-drop-icon">📄</div>
                <div className="pyq-drop-title">
                  Drop your {UPLOAD_PAPERS.find(p => p.id === uploadPaper)?.label} · {uploadYear} PDF here
                </div>
                <div className="pyq-drop-sub">
                  Supports <strong>text-based</strong> and <strong>scanned PDFs</strong>, including bilingual papers.
                  <br />
                  Hindi text is automatically filtered — only the English version of each question is extracted.
                </div>
                <div className="pyq-drop-btn">+ Browse PDF</div>
              </div>

              {extractError && (
                <div className="pyq-extract-error">
                  <span className="pyq-err-icon">⚠</span>
                  <span>{extractError}</span>
                </div>
              )}

              <div className="info-box" style={{ marginTop: 20 }}>
                <div className="info-box-icon">ℹ️</div>
                <div>
                  <div className="info-box-title">Supported PDF types &amp; bilingual filtering</div>
                  <div className="info-box-desc">
                    <strong>Text PDFs</strong> — extracted in seconds. Hindi lines (Devanagari Unicode) are stripped automatically before question parsing.<br />
                    <strong>Scanned PDFs</strong> — auto-detected and OCR'd using Tesseract.js with both English + Hindi models. Recognising Hindi as clean Unicode (not garbled ASCII) lets the filter remove it precisely. Takes 2–4 min for a 20-page paper. Language data (~20 MB total) downloads once and is cached in the browser.
                  </div>
                </div>
              </div>
            </>
          )}

          <input ref={fileRef} type="file" accept=".pdf" style={{ display: "none" }}
            onChange={e => { if (e.target.files[0]) processFile(e.target.files[0]); e.target.value = ""; }} />

          {/* ── Extraction progress ── */}
          {extracting && (
            <div className="pyq-extracting">

              {/* TEXT MODE */}
              {!isOCR && (
                <>
                  <div className="generating-spinner" />
                  <div className="pyq-ext-title">
                    {prog.stage === "loading" ? "Loading PDF…" :
                     prog.stage === "text"    ? `Reading text layer · Page ${prog.page} of ${prog.total}` :
                     prog.stage === "parsing" ? "Parsing questions…" : "Processing…"}
                  </div>
                  {prog.stage === "text" && prog.total > 0 && (
                    <div className="pyq-ocr-progress-wrap">
                      <div className="pyq-ocr-bar-bg">
                        <div className="pyq-ocr-bar" style={{ width: `${textPct}%` }} />
                      </div>
                      <span className="pyq-ocr-pct">{textPct}%</span>
                    </div>
                  )}
                  <div className="pyq-ext-note">
                    {prog.stage === "text" ? "Checking for text layer…" : "Almost done…"}
                  </div>
                </>
              )}

              {/* OCR INIT */}
              {prog.stage === "ocr_init" && (
                <>
                  <div className="pyq-ocr-badge">OCR</div>
                  <div className="pyq-ext-title">Scanned PDF detected — Initialising OCR engine</div>
                  <div className="pyq-ocr-sub">{ocrSubLabel(prog.substage)}</div>
                  <div className="pyq-ocr-progress-wrap">
                    <div className="pyq-ocr-bar-bg">
                      <div className="pyq-ocr-bar" style={{ width: `${prog.pct || 0}%` }} />
                    </div>
                    <span className="pyq-ocr-pct">{prog.pct || 0}%</span>
                  </div>
                  <div className="pyq-ext-note pyq-ocr-note">
                    English language data (~10 MB) is downloaded once and cached in your browser.
                  </div>
                </>
              )}

              {/* OCR PAGE-BY-PAGE */}
              {prog.stage === "ocr_page" && (
                <>
                  <div className="pyq-ocr-badge">OCR</div>
                  <div className="pyq-ext-title">
                    Processing page {prog.page} of {prog.total}
                  </div>
                  <div className="pyq-ocr-progress-wrap">
                    <div className="pyq-ocr-bar-bg">
                      <div className="pyq-ocr-bar pyq-ocr-bar-accent" style={{ width: `${ocrPct}%` }} />
                    </div>
                    <span className="pyq-ocr-pct">{ocrPct}%</span>
                  </div>
                  <div className="pyq-ocr-pages-grid">
                    {Array.from({ length: prog.total }, (_, i) => (
                      <div key={i}
                        className={`pyq-page-dot ${i < prog.page ? "done" : i === prog.page - 1 ? "active" : ""}`}
                      />
                    ))}
                  </div>
                  <div className="pyq-ext-note pyq-ocr-note">
                    Each page takes 3–5 seconds · Keep this tab open
                  </div>
                </>
              )}

            </div>
          )}

          {/* ── Review panel ── */}
          {!extracting && extracted.length > 0 && (
            <div className="pyq-review-panel">

              {/* Header */}
              <div className="pyq-review-header">
                <div className="pyq-review-title">
                  <span className="pyq-review-count">{extracted.length}</span>
                  &nbsp;questions
                  {fileName && <> from <strong>{fileName}</strong></>}
                  <span className="pyq-review-chip">
                    {UPLOAD_PAPERS.find(p => p.id === uploadPaper)?.label} · {uploadYear}
                  </span>
                </div>
                <div className="pyq-review-bulk">
                  <button className="viewer-action-btn" onClick={() => setSelected(new Set(extracted.map(q => q.id)))}>Select All</button>
                  <button className="viewer-action-btn" onClick={() => setSelected(new Set())}>Deselect All</button>
                  <span className="pyq-sel-count">{selected.size} selected</span>
                  <button
                    className="pyq-add-trigger"
                    onClick={() => { setShowAddForm(true); setEditingId(null); }}
                  >
                    + Add Question Manually
                  </button>
                </div>
              </div>

              {/* Question list */}
              <div className="pyq-review-list">
                {extracted.map((q, i) => {
                  const tag     = getGsTag(q.paper);
                  const checked = selected.has(q.id);
                  const editing = editingId === q.id;

                  return (
                    <React.Fragment key={q.id}>
                    <div
                      className={`pyq-review-item ${checked ? "checked" : ""} ${editing ? "editing" : ""}`}
                      onClick={() => !editing && toggleSelect(q.id)}
                    >
                      {/* Checkbox — always visible */}
                      <div className="pyq-review-check">
                        <div className={`pyq-check-box ${checked ? "on" : ""}`}>
                          {checked && (
                            <svg width="10" height="10" viewBox="0 0 10 10">
                              <polyline points="1.5,5 4,7.5 8.5,2" stroke="white" strokeWidth="1.8"
                                fill="none" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                      </div>

                      {editing ? (
                        /* ── EDIT MODE ── */
                        <div className="pyq-edit-fields" onClick={e => e.stopPropagation()}>
                          <div className="pyq-edit-top-row">
                            <label className="pyq-edit-label">Marks</label>
                            <input
                              className="pyq-edit-marks-input"
                              type="number"
                              min={5}
                              max={200}
                              value={editMarks}
                              onChange={e => setEditMarks(e.target.value)}
                            />
                            <div className="pyq-edit-action-row">
                              <button className="viewer-action-btn" onClick={cancelEdit}>Cancel</button>
                              <button
                                className="viewer-action-btn primary"
                                onClick={e => saveEdit(q.id, e)}
                                disabled={!editText.trim()}
                              >
                                ✓ Save
                              </button>
                            </div>
                          </div>
                          <textarea
                            className="pyq-edit-textarea"
                            value={editText}
                            onChange={e => setEditText(e.target.value)}
                            rows={4}
                            autoFocus
                            placeholder="Enter the question text…"
                          />
                        </div>
                      ) : (
                        /* ── VIEW MODE ── */
                        <div className="pyq-review-body">
                          <div className="pyq-review-meta-row">
                            {tag && <span className="gs-pill sm" style={{ background: tag.bg, color: tag.color }}>{tag.label}</span>}
                            {q.manual && <span className="pyq-manual-badge">Manual</span>}
                            <span className="pyq-marks-badge">Q.{i + 1}</span>
                            <span className="pyq-marks-badge">{q.marks}m</span>
                            <span className="pyq-item-btns">
                              <button
                                className="pyq-ask-ai-btn"
                                title="Ask AI to write UPSC answer"
                                onClick={e => {
                                  e.stopPropagation();
                                  onNavigate && onNavigate("chatbot", {
                                    chatQuestion: { text: q.question, marks: q.marks },
                                    chatPyqId: q.id,
                                  });
                                }}
                              >
                                🤖 Ask AI
                              </button>
                              <button
                                className="pyq-insert-btn"
                                title="Add new question below this one"
                                onClick={e => {
                                  e.stopPropagation();
                                  setInsertAfterId(insertAfterId === q.id ? null : q.id);
                                  setInsertText("");
                                  setInsertMarks(10);
                                  setEditingId(null);
                                  setShowAddForm(false);
                                }}
                              >
                                {insertAfterId === q.id ? "✕ Cancel" : "+ Add"}
                              </button>
                              <button
                                className="pyq-edit-btn"
                                title="Edit this question"
                                onClick={e => startEdit(q, e)}
                              >
                                ✎ Edit
                              </button>
                              <button
                                className="pyq-del-btn"
                                title="Remove this question"
                                onClick={e => deleteQuestion(q.id, e)}
                              >
                                ✕
                              </button>
                            </span>
                          </div>
                          <div className="pyq-review-q">{q.question}</div>

                          {/* ── Saved AI answer (expand/collapse) ── */}
                          {pyqAnswers[q.id] && (
                            <div className="pyq-saved-ans-wrap" onClick={e => e.stopPropagation()}>
                              <div
                                className={`pyq-saved-ans-hdr ${expandedAns[q.id] ? "open" : ""}`}
                                onClick={() => toggleAns(q.id)}
                              >
                                <span className="pyq-saved-ans-label">
                                  <span className="pyq-saved-ans-dot" />
                                  Saved AI Answer
                                  <span className="pyq-saved-ans-meta">
                                    {pyqAnswers[q.id].model} · {pyqAnswers[q.id].wordLimit}w
                                    {pyqAnswers[q.id].editedAt ? " · edited" : ""}
                                  </span>
                                </span>
                                <div className="pyq-saved-ans-btns">
                                  {expandedAns[q.id] && (
                                    <>
                                      {editingAns !== q.id && (
                                        <button className="pyq-ans-edit-btn" onClick={e => startEditAns(q.id, pyqAnswers[q.id].text, e)}>
                                          ✎ Edit
                                        </button>
                                      )}
                                      {editingAns === q.id && (
                                        <button className="pyq-ans-save-btn" onClick={e => saveEditAns(q.id, e)}>
                                          ✓ Save
                                        </button>
                                      )}
                                      <button className="pyq-ans-del-btn" onClick={e => deleteAns(q.id, e)}>✕</button>
                                    </>
                                  )}
                                  <span className="pyq-saved-ans-chevron">{expandedAns[q.id] ? "▲" : "▼"}</span>
                                </div>
                              </div>
                              {expandedAns[q.id] && (
                                <div className="pyq-saved-ans-body">
                                  {editingAns === q.id ? (
                                    <textarea
                                      className="pyq-ans-edit-textarea"
                                      value={ansEditDraft}
                                      onChange={e => setAnsEditDraft(e.target.value)}
                                      onClick={e => e.stopPropagation()}
                                      rows={12}
                                    />
                                  ) : (
                                    <div className="pyq-ans-text"><MdAnswer text={pyqAnswers[q.id].text} /></div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}

                          {/* ── Inline insert form (inside the row body) ── */}
                          {insertAfterId === q.id && (
                            <div className="pyq-insert-form" onClick={e => e.stopPropagation()}>
                              <div className="pyq-insert-form-header">
                                <span className="pyq-insert-form-title">↳ New question below Q.{i + 1}</span>
                                <label className="pyq-edit-label">Marks</label>
                                <input
                                  className="pyq-edit-marks-input"
                                  type="number"
                                  min={5}
                                  max={200}
                                  value={insertMarks}
                                  onChange={e => { e.stopPropagation(); setInsertMarks(e.target.value); }}
                                />
                                <button
                                  className="viewer-action-btn primary"
                                  onClick={e => { e.stopPropagation(); addAfterRow(q.id); }}
                                  disabled={!insertText.trim()}
                                >
                                  ✓ Insert
                                </button>
                              </div>
                              <textarea
                                className="pyq-insert-textarea"
                                value={insertText}
                                onChange={e => { e.stopPropagation(); setInsertText(e.target.value); }}
                                rows={3}
                                autoFocus
                                placeholder="Type the new question here…"
                                onClick={e => e.stopPropagation()}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    </React.Fragment>
                  );
                })}

                {/* ── Manual add form (shown at end of list) ── */}
                {showAddForm && (
                  <div className="pyq-add-form">
                    <div className="pyq-add-form-header">
                      <span className="pyq-add-form-title">Add Question Manually</span>
                      <button className="pyq-del-btn" onClick={() => setShowAddForm(false)}>✕</button>
                    </div>
                    <div className="pyq-add-form-body">
                      <div className="pyq-add-marks-row">
                        <label className="pyq-edit-label">Marks</label>
                        <input
                          className="pyq-edit-marks-input"
                          type="number"
                          min={5}
                          max={200}
                          value={newQMarks}
                          onChange={e => setNewQMarks(e.target.value)}
                        />
                      </div>
                      <label className="pyq-edit-label" style={{ marginTop: 8 }}>Question Text</label>
                      <textarea
                        className="pyq-edit-textarea pyq-add-textarea"
                        value={newQText}
                        onChange={e => setNewQText(e.target.value)}
                        rows={4}
                        autoFocus
                        placeholder="Type or paste the question text here…"
                      />
                    </div>
                    <div className="pyq-add-form-footer">
                      <button className="viewer-action-btn" onClick={() => { setShowAddForm(false); setNewQText(""); }}>
                        Cancel
                      </button>
                      <button
                        className="primary-btn"
                        onClick={addManualQuestion}
                        disabled={!newQText.trim()}
                      >
                        + Add to List
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="pyq-review-footer">
                <div className="pyq-review-footer-left">
                  <button className="viewer-action-btn" onClick={resetUpload}>← Try Another PDF</button>
                  {!showAddForm && (
                    <button className="viewer-action-btn" onClick={() => { setShowAddForm(true); setEditingId(null); }}>
                      + Add Question Manually
                    </button>
                  )}
                </div>
                <button className="primary-btn large" onClick={handleAddToBank} disabled={selected.size === 0}>
                  + Add {selected.size} Question{selected.size !== 1 ? "s" : ""} to Question Bank →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          THEME BANK TAB
      ═══════════════════════════════════════════════════════ */}
      {mainTab === "themes" && (() => {
        // Build theme bank: paper → theme → questions[]
        const bank = {};
        for (const q of allPYQs) {
          const theme = getTheme(q);
          if (!bank[q.paper]) bank[q.paper] = {};
          if (!bank[q.paper][theme]) bank[q.paper][theme] = [];
          bank[q.paper][theme].push(q);
        }
        const paperOrder = ["gs1","gs2","gs3","gs4","ess","ant"];
        const totalThemes = Object.values(bank).reduce((s, t) => s + Object.keys(t).length, 0);
        const totalQs     = allPYQs.length;

        return (
          <div className="pyq-themebank">
            {/* Summary bar */}
            <div className="pyq-themebank-summary">
              <div className="pyq-themebank-stat">
                <span className="pyq-themebank-stat-val">{totalThemes}</span>
                <span className="pyq-themebank-stat-label">Unique Themes</span>
              </div>
              <div className="pyq-themebank-stat-div" />
              <div className="pyq-themebank-stat">
                <span className="pyq-themebank-stat-val">{totalQs}</span>
                <span className="pyq-themebank-stat-label">Questions Mapped</span>
              </div>
              <div className="pyq-themebank-stat-div" />
              <div className="pyq-themebank-stat">
                <span className="pyq-themebank-stat-val">{paperOrder.filter(p => bank[p]).length}</span>
                <span className="pyq-themebank-stat-label">Papers Covered</span>
              </div>
            </div>

            {/* Paper sections */}
            <div className="pyq-themebank-sections">
              {paperOrder.map(paperId => {
                const themes = bank[paperId];
                if (!themes) return null;
                const tag = GS_TAGS.find(g => g.id === paperId);
                const entries = Object.entries(themes).sort((a, b) => b[1].length - a[1].length);
                const totalPaperQs = entries.reduce((s, [, qs]) => s + qs.length, 0);

                return (
                  <div key={paperId} className="pyq-themebank-section">
                    <div className="pyq-themebank-paper-hdr" style={{ borderLeftColor: tag?.color }}>
                      <span className="pyq-themebank-paper-pill" style={{ background: tag?.bg, color: tag?.color }}>
                        {tag?.label}
                      </span>
                      <span className="pyq-themebank-paper-desc">{tag?.desc}</span>
                      <span className="pyq-themebank-paper-meta">
                        {entries.length} theme{entries.length !== 1 ? "s" : ""} · {totalPaperQs} question{totalPaperQs !== 1 ? "s" : ""}
                      </span>
                    </div>

                    <div className="pyq-themebank-cards">
                      {entries.map(([theme, qs]) => {
                        const years = [...new Set(qs.map(q => q.year))].sort((a, b) => b - a);
                        const totalMarks = qs.reduce((s, q) => s + q.marks, 0);
                        return (
                          <div
                            key={theme}
                            className="pyq-themebank-card"
                            onClick={() => {
                              setActiveThemeFilter({ paperId, theme });
                              setPaper(paperId);
                              setBrowseYear("All Years");
                              setMainTab("browse");
                            }}
                            title="Click to filter questions by this theme"
                          >
                            <div className="pyq-themebank-card-top">
                              <span className="pyq-themebank-card-name">{theme}</span>
                              <span className="pyq-themebank-card-qcount" style={{ background: tag?.bg, color: tag?.color }}>
                                {qs.length}Q
                              </span>
                            </div>
                            <div className="pyq-themebank-card-marks">{totalMarks} marks total</div>
                            <div className="pyq-themebank-card-years">
                              {years.slice(0, 6).map(yr => (
                                <span key={yr} className="pyq-themebank-yr">{yr}</span>
                              ))}
                              {years.length > 6 && <span className="pyq-themebank-yr-more">+{years.length - 6}</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
