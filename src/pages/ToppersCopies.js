import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  storePage, loadPage, loadCopiesMeta, saveCopiesMeta, deleteCopyImages, deletePageImage,
  saveBankDiagramImage, loadBankDiagramImage, deleteBankDiagramImage,
  loadDiagramBankMeta, saveDiagramBankMeta,
} from "../lib/topperStorage";

// ── Config ────────────────────────────────────────────────────────────────────
// gemini-3.5-flash: free tier, v1beta endpoint, inline image input
const GEMINI_GENERATE_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent";
const LS_GEMINI_KEY       = "upsc_gemini_key";
const LS_GROQ_KEY         = "upsc_groq_key";
const LS_TOPPER_REF       = "upsc_topper_ref";
const GROQ_URL            = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL          = "llama-3.3-70b-versatile";

// ── PDF → JPEG page images ────────────────────────────────────────────────────

async function pdfToImages(file, onPageDone) {
  const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf");
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;
  const buf = await file.arrayBuffer();
  const doc = await pdfjsLib.getDocument({ data: buf }).promise;
  for (let i = 1; i <= doc.numPages; i++) {
    const page     = await doc.getPage(i);
    const viewport = page.getViewport({ scale: 1.8 });
    const canvas   = document.createElement("canvas");
    canvas.width   = viewport.width;
    canvas.height  = viewport.height;
    await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
    onPageDone?.(i, doc.numPages, canvas.toDataURL("image/jpeg", 0.9));
  }
}

function imageToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = e => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ── Gemini per-page image transcription ──────────────────────────────────────
// Uses inline base64 image → gemini-1.5-flash-latest (v1, free tier, 15 RPM)

async function transcribePageImage(apiKey, imageDataUrl) {
  const base64   = imageDataUrl.split(",")[1];
  const mimeType = imageDataUrl.split(";")[0].split(":")[1] || "image/jpeg";

  const res = await fetch(`${GEMINI_GENERATE_URL}?key=${apiKey}`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{
        parts: [
          { inline_data: { mime_type: mimeType, data: base64 } },
          { text:
            "Transcribe this handwritten UPSC exam answer booklet page.\n\n" +
            "Rules:\n" +
            "- Copy every word exactly as handwritten — question text, sub-points, headings, margin notes\n" +
            "- Preserve paragraph breaks and numbering\n" +
            "- Include Hindi/Devanagari text as-is\n" +
            "- Do NOT summarize, rephrase, translate, or add commentary\n" +
            "- Output ONLY the transcribed text (no preamble, no labels)"
          },
        ],
      }],
      generationConfig: { temperature: 0.1, maxOutputTokens: 4096 },
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Gemini error (${res.status})`);
  }
  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
}

// ── Gemini diagram detector ───────────────────────────────────────────────────
// Returns { hasDiagram: bool, label: string }

async function detectDiagramOnPage(apiKey, imageDataUrl) {
  const base64   = imageDataUrl.split(",")[1];
  const mimeType = imageDataUrl.split(";")[0].split(":")[1] || "image/jpeg";

  const res = await fetch(`${GEMINI_GENERATE_URL}?key=${apiKey}`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{
        parts: [
          { inline_data: { mime_type: mimeType, data: base64 } },
          { text:
            "Look at this handwritten exam page. Does it contain any drawn diagram, figure, map, flowchart, graph, table with visual structure, or any hand-drawn illustration (NOT just plain text)?\n" +
            "Reply with EXACTLY one line:\n" +
            "YES: [short label, e.g. 'Flowchart of policy cycle'] OR\n" +
            "NO\n" +
            "Nothing else."
          },
        ],
      }],
      generationConfig: { temperature: 0.1, maxOutputTokens: 60 },
    }),
  });

  if (!res.ok) return { hasDiagram: false, label: "" };
  const data = await res.json();
  const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "NO";
  const isYes = /^yes/i.test(reply);
  const label = isYes ? reply.replace(/^yes\s*:\s*/i, "").trim() : "";
  return { hasDiagram: isYes, label };
}

// ── Page range parser: "1-5, 8, 10-12" → [1,2,3,4,5,8,10,11,12] ─────────────

function parsePageRange(input, maxPage) {
  const nums = new Set();
  for (const part of input.split(",")) {
    const t = part.trim();
    const r = t.match(/^(\d+)\s*[-–]\s*(\d+)$/);
    if (r) {
      const from = parseInt(r[1]), to = parseInt(r[2]);
      for (let i = from; i <= Math.min(to, maxPage); i++) nums.add(i);
    } else {
      const n = parseInt(t);
      if (!isNaN(n) && n >= 1 && n <= maxPage) nums.add(n);
    }
  }
  return [...nums].sort((a, b) => a - b);
}

// ── Key validation ────────────────────────────────────────────────────────────

async function validateGeminiKey(key) {
  const res = await fetch(`${GEMINI_GENERATE_URL}?key=${key}`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: "Reply OK" }] }],
      generationConfig: { maxOutputTokens: 5 },
    }),
  });
  if (res.status === 400 || res.status === 401 || res.status === 403) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || "Invalid API key");
  }
}

// ── Clean HTML on paste (preserve bold/lists, strip images/scripts) ───────────

function cleanHtmlForPaste(html) {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;

  // Remove unwanted elements entirely
  ["img","script","style","svg","figure","picture","video","canvas","table"]
    .forEach(tag => tmp.querySelectorAll(tag).forEach(el => el.remove()));

  // Mark heading tags and bold-only paragraphs BEFORE stripping attributes
  tmp.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach(el => el.setAttribute("data-ph", "1"));
  tmp.querySelectorAll("p,div").forEach(el => {
    const ch = [...el.childNodes].filter(n => n.nodeType !== 3 || n.textContent.trim());
    if (ch.length === 1 && ch[0].nodeType === 1) {
      const t = ch[0].tagName?.toLowerCase();
      if ((t === "strong" || t === "b") && el.textContent.trim()) el.setAttribute("data-ph", "1");
    }
  });

  // Strip all attributes, restore only heading class
  tmp.querySelectorAll("*").forEach(el => {
    const isH = el.getAttribute("data-ph") === "1";
    [...el.attributes].forEach(attr => el.removeAttribute(attr.name));
    if (isH) el.className = "ai-paste-heading";
  });

  return tmp.innerHTML;
}

// ── Markdown renderer for improved answer output ──────────────────────────────

function inlineFmt(str) {
  const parts = str.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith("**") && p.endsWith("**")
      ? <mark key={i} className="ai-kw-hl"><strong>{p.slice(2, -2)}</strong></mark>
      : p
  );
}

function MdImproved({ text }) {
  if (!text) return null;
  const lines   = text.split("\n");
  const result  = [];
  let listBuf   = [];
  let listType  = null; // "ul" | "ol"

  const flushList = (key) => {
    if (!listBuf.length) return;
    const Tag = listType === "ol" ? "ol" : "ul";
    result.push(
      <Tag key={`list-${key}`} className={`ai-md-${listType}`}>{listBuf}</Tag>
    );
    listBuf = []; listType = null;
  };

  lines.forEach((line, i) => {
    const t = line.trim();
    if (!t) { flushList(i); return; }

    // Markdown ## headings
    if (/^#{1,2}\s/.test(t)) {
      flushList(i);
      result.push(<div key={i} className="ai-md-h2">{t.replace(/^#+\s/, "")}</div>);
    } else if (/^#{3}\s/.test(t)) {
      flushList(i);
      result.push(<div key={i} className="ai-md-h3">{t.replace(/^###\s/, "")}</div>);
    // Standalone bold line = section heading (AI writes **Introduction**, **Conclusion** etc.)
    } else if (/^\*\*[^*]+\*\*:?\s*$/.test(t)) {
      flushList(i);
      const heading = t.replace(/^\*\*/, "").replace(/\*\*:?\s*$/, "");
      result.push(<div key={i} className="ai-md-h2">{heading}</div>);
    } else if (/^[-•*]\s/.test(t)) {
      if (listType === "ol") flushList(i);
      listType = "ul";
      listBuf.push(<li key={i} className="ai-md-li">{inlineFmt(t.slice(2).trim())}</li>);
    } else if (/^\d+[.)]\s/.test(t)) {
      if (listType === "ul") flushList(i);
      listType = "ol";
      listBuf.push(<li key={i} className="ai-md-li">{inlineFmt(t.replace(/^\d+[.)]\s/, ""))}</li>);
    } else {
      flushList(i);
      result.push(<p key={i} className="ai-md-p">{inlineFmt(t)}</p>);
    }
  });
  flushList("end");
  return <div className="ai-md-root">{result}</div>;
}

// ── Answer Improver (Groq) ────────────────────────────────────────────────────

const WORD_LIMITS = [
  { label: "Auto (by marks)", value: "auto" },
  { label: "~100 words",  value: "100"  },
  { label: "~150 words",  value: "150"  },
  { label: "~200 words",  value: "200"  },
  { label: "~250 words",  value: "250"  },
  { label: "~350 words",  value: "350"  },
  { label: "~500 words",  value: "500"  },
];

// Walk DOM text nodes and wrap keyword matches in <mark class="ai-editor-kw">
// ── Manual crop tool for diagram selection ────────────────────────────────────
function CropOverlay({ imgUrl, pageNum, onCrop }) {
  const [start,    setStart]    = useState(null);
  const [rect,     setRect]     = useState(null);
  const [dragging, setDragging] = useState(false);
  const wrapRef = useRef(null);

  const toLocal = (e) => {
    const b = wrapRef.current.getBoundingClientRect();
    const cx = (e.touches ? e.touches[0].clientX : e.clientX);
    const cy = (e.touches ? e.touches[0].clientY : e.clientY);
    return {
      x: Math.max(0, Math.min(cx - b.left, b.width)),
      y: Math.max(0, Math.min(cy - b.top,  b.height)),
    };
  };

  const onDown = (e) => {
    // Don't start a new drag if the user is clicking the action buttons
    if (e.target.closest(".tc-crop-btns")) return;
    e.preventDefault();
    const p = toLocal(e);
    setStart(p); setRect({ x: p.x, y: p.y, w: 0, h: 0 }); setDragging(true);
  };
  const onMove = (e) => {
    if (!dragging || !start) return;
    e.preventDefault();
    const p = toLocal(e);
    setRect({ x: Math.min(p.x, start.x), y: Math.min(p.y, start.y),
              w: Math.abs(p.x - start.x),   h: Math.abs(p.y - start.y) });
  };
  const onUp = (e) => {
    if (e?.target?.closest?.(".tc-crop-btns")) return;
    setDragging(false);
  };

  // Capture the rect in a ref so the async img.onload always reads the latest value
  const rectRef = useRef(rect);
  useEffect(() => { rectRef.current = rect; }, [rect]);

  const confirmCrop = () => {
    const r = rectRef.current;
    if (!r || r.w < 10 || r.h < 10 || !imgUrl) return;
    const b   = wrapRef.current.getBoundingClientRect();
    const img = new window.Image();
    img.onload = () => {
      const sx = img.naturalWidth  / b.width;
      const sy = img.naturalHeight / b.height;
      const c  = document.createElement("canvas");
      c.width  = Math.round(r.w * sx);
      c.height = Math.round(r.h * sy);
      c.getContext("2d").drawImage(
        img,
        Math.round(r.x * sx), Math.round(r.y * sy), c.width, c.height,
        0, 0, c.width, c.height
      );
      onCrop({ pageNum, dataUrl: c.toDataURL("image/jpeg", 0.93) });
    };
    img.src = imgUrl;
    setRect(null); setStart(null);
  };

  return (
    <div
      ref={wrapRef}
      className="tc-crop-overlay"
      onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
    >
      <div className="tc-crop-hint">✂ Drag to select a diagram</div>
      {rect && rect.w > 4 && rect.h > 4 && (
        <div className="tc-crop-sel"
          style={{ left: rect.x, top: rect.y, width: rect.w, height: rect.h }}>
          {!dragging && (
            // stopPropagation on mousedown prevents the overlay starting a new drag
            <div className="tc-crop-btns" onMouseDown={e => e.stopPropagation()}>
              <button className="tc-crop-ok"  onClick={confirmCrop}>✓ Add Diagram</button>
              <button className="tc-crop-no"  onClick={() => { setRect(null); setStart(null); }}>✕</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Diagram Bank component ────────────────────────────────────────────────────
function DiagramBank() {
  const [entries, setEntries] = useState(() => loadDiagramBankMeta());
  const [images,  setImages]  = useState({});
  const [editId,  setEditId]  = useState(null);
  const [editName, setEditName] = useState("");

  // Load images from IndexedDB
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const imgs = {};
      for (const e of entries) {
        const url = await loadBankDiagramImage(e.id);
        if (cancelled) return;
        if (url) imgs[e.id] = url;
      }
      setImages(imgs);
    })();
    return () => { cancelled = true; };
  }, [entries.length]); // eslint-disable-line

  const deleteDiagram = async (id) => {
    await deleteBankDiagramImage(id);
    const updated = entries.filter(e => e.id !== id);
    saveDiagramBankMeta(updated);
    setEntries(updated);
    setImages(prev => { const n = { ...prev }; delete n[id]; return n; });
  };

  const startRename = (entry) => {
    setEditId(entry.id);
    setEditName(entry.name);
  };

  const saveRename = (id) => {
    const updated = entries.map(e => e.id === id ? { ...e, name: editName.trim() || e.name } : e);
    saveDiagramBankMeta(updated);
    setEntries(updated);
    setEditId(null);
  };

  if (entries.length === 0) {
    return (
      <div className="dbank-empty">
        <div className="dbank-empty-icon">🗂</div>
        <div className="dbank-empty-title">Diagram Bank is empty</div>
        <div className="dbank-empty-sub">
          Go to Copies → Find Diagrams, crop a diagram, then click "Save to Bank".
        </div>
      </div>
    );
  }

  return (
    <div className="dbank-shell">
      <div className="dbank-header">
        <span className="dbank-title">📐 Diagram Bank</span>
        <span className="dbank-count">{entries.length} diagram{entries.length !== 1 ? "s" : ""}</span>
      </div>
      <div className="dbank-grid">
        {entries.map(entry => (
          <div key={entry.id} className="dbank-card">
            {images[entry.id]
              ? <img src={images[entry.id]} alt={entry.name} className="dbank-card-img" />
              : <div className="dbank-card-loading">Loading…</div>
            }
            <div className="dbank-card-footer">
              {editId === entry.id ? (
                <input
                  className="dbank-name-input"
                  value={editName}
                  autoFocus
                  onChange={e => setEditName(e.target.value)}
                  onBlur={() => saveRename(entry.id)}
                  onKeyDown={e => { if (e.key === "Enter") saveRename(entry.id); if (e.key === "Escape") setEditId(null); }}
                />
              ) : (
                <span className="dbank-card-name" title="Click to rename" onClick={() => startRename(entry)}>
                  {entry.name}
                </span>
              )}
              <div className="dbank-card-actions">
                {images[entry.id] && (
                  <a className="dbank-dl" href={images[entry.id]} download={`${entry.name}.jpg`} title="Download">↓</a>
                )}
                <button className="dbank-del" title="Delete" onClick={() => deleteDiagram(entry.id)}>✕</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function applyKeywordHighlightsDOM(container, keywords) {
  const sorted = [...keywords].filter(k => k && k.length >= 3).sort((a, b) => b.length - a.length);
  if (!sorted.length) return;
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null, false);
  const nodes = [];
  let n;
  while ((n = walker.nextNode())) {
    const p = n.parentElement;
    if (p && (p.tagName === "MARK" || p.tagName === "STRONG" || p.tagName === "B" ||
              p.classList?.contains("ai-paste-heading") || p.classList?.contains("ai-editor-kw"))) continue;
    nodes.push(n);
  }
  const escaped = sorted.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const re = new RegExp(`\\b(${escaped.join("|")})\\b`, "gi");
  nodes.forEach(textNode => {
    const text = textNode.textContent;
    re.lastIndex = 0;
    if (!re.test(text)) return;
    re.lastIndex = 0;
    const frag = document.createDocumentFragment();
    let last = 0, m;
    while ((m = re.exec(text)) !== null) {
      if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
      const mark = document.createElement("mark");
      mark.className = "ai-editor-kw";
      mark.textContent = m[0];
      frag.appendChild(mark);
      last = m.index + m[0].length;
    }
    if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
    textNode.parentNode.replaceChild(frag, textNode);
  });
}

function AnswerImprover() {
  const [output,    setOutput]    = useState("");
  const [question,  setQuestion]  = useState("");
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");
  const [copied,    setCopied]    = useState(false);
  const [wordLimit,     setWordLimit]     = useState("auto");
  const [inputWc,       setInputWc]       = useState(0);
  const [fontSize,      setFontSize]      = useState(13.5); // output font size
  const [inputFontSize, setInputFontSize] = useState(13.5); // input font size
  const [hlLoading,     setHlLoading]     = useState(false);
  const [kwList,        setKwList]        = useState([]);
  const [refSaved,      setRefSaved]      = useState(false);
  const inputRef = useRef(null);
  const groqKey  = localStorage.getItem(LS_GROQ_KEY) || "";

  // Intercept paste: preserve bold/lists from HTML, strip images & scripts
  const handlePaste = (e) => {
    e.preventDefault();
    const html  = e.clipboardData.getData("text/html");
    const plain = e.clipboardData.getData("text/plain");
    if (html) {
      document.execCommand("insertHTML", false, cleanHtmlForPaste(html));
    } else {
      document.execCommand("insertText", false, plain);
    }
    setTimeout(() => setInputWc(countAnswerWords()), 0);
  };

  // Count words only in the answer portion (after "Answer:" line)
  const countAnswerWords = () => {
    const text = inputRef.current?.innerText || "";
    const match = text.match(/^answer\s*[:\-]?\s*\n/im);
    const answerText = match ? text.slice(text.search(/^answer\s*[:\-]?\s*\n/im) + match[0].length) : text;
    return answerText.trim().split(/\s+/).filter(Boolean).length;
  };

  const handleInput = () => setInputWc(countAnswerWords());

  const getInputText = () => inputRef.current?.innerText?.trim() || "";

  const wordLimitLine = wordLimit === "auto"
    ? "Word limit: infer from the marks in the question (10m ≈ 150w, 15m ≈ 250w, 20m ≈ 350w)"
    : `Word limit: approximately **${wordLimit} words** — stay close to this target`;

  const improve = async () => {
    const text = getInputText();
    if (!text || loading) return;
    if (!groqKey) { setError("No ChatGPT (Groq) key found — set it up in the ChatGPT tab first."); return; }
    // Extract question block (everything before "Answer:" line)
    const lines    = text.split("\n");
    const ansIdx   = lines.findIndex(l => /^answer\s*[:\-]?\s*$/i.test(l.trim()));
    const qBlock   = (ansIdx > 0 ? lines.slice(0, ansIdx) : lines.slice(0, 4)).join("\n").trim();
    setQuestion(qBlock);
    setLoading(true); setOutput(""); setError("");
    try {
      const res = await fetch(GROQ_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${groqKey}` },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [
            {
              role: "system",
              content:
                "You are an expert UPSC Mains answer writer and coach.\n\n" +
                "The student provides a UPSC Mains question and their written answer. Produce a significantly IMPROVED version.\n\n" +
                "## STRUCTURE\n" +
                "- **Introduction** (2-3 sentences): context + thesis\n" +
                "- **Body**: First, carefully read the student's answer and extract EVERY subheading they wrote (lines ending with ':' or lines in bold that label a section). Use those EXACT subheadings word-for-word — do not rename, reorder, or remove any. Under each subheading, expand the student's points\n" +
                "- If the student had NO subheadings, create logical ones from their content\n" +
                "- **Conclusion** (2 sentences): forward-looking / constitutional / values-based\n\n" +
                "## CONTENT UPGRADES\n" +
                "- Bold all key terms using **term** syntax\n" +
                "- Add relevant **Constitutional Articles**, SC judgments, or government committees where applicable\n" +
                "- Add 1-2 specific reports/bodies (UNESCO, NITI Aayog, ARC, Nolan Committee, etc.)\n" +
                "- Add one dimension the student missed (international, ethical, gender, environmental, historical)\n" +
                "- Replace vague phrases with precise UPSC exam language\n\n" +
                "## FORMAT\n" +
                "- Use **bold** for all key terms, article numbers, scheme names, proper nouns\n" +
                "- Use numbered lists under each subheading\n" +
                `- ${wordLimitLine}\n` +
                "- Do NOT invent statistics; use qualifiers like 'UNESCO notes', '2nd ARC recommends' if uncertain\n\n" +
                "Output ONLY the improved answer. Start directly — no 'Here is...' opener.",
            },
            { role: "user", content: text },
          ],
          temperature: 0.6,
          max_tokens: wordLimit === "auto" ? 1800 : Math.max(600, parseInt(wordLimit) * 8),
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const msg = err?.error?.message || `API error (${res.status})`;
        if (res.status === 429) {
          const retryMatch = msg.match(/try again in ([\d]+m[\d.]+s|[\d.]+s)/i);
          const retryHint  = retryMatch ? ` Try again in ${retryMatch[1]}.` : " Try again shortly.";
          const isDaily    = /tokens per day|TPD/i.test(msg);
          throw new Error(isDaily
            ? `Daily token limit reached (Groq free tier: 100k tokens/day).${retryHint} Limit resets at midnight UTC.`
            : `Rate limit hit.${retryHint}`);
        }
        throw new Error(msg);
      }
      const data = await res.json();
      setOutput(data.choices?.[0]?.message?.content?.trim() || "No response received.");
      // Extract keywords from the full text in parallel for question highlighting
      fetch(GROQ_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${groqKey}` },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [
            {
              role: "system",
              content:
                "Extract ALL important keywords and key phrases from this UPSC answer text — aim for 25-35 terms. " +
                "Include constitutional terms, proper nouns, government schemes, article numbers, reports/committees, " +
                "AND domain-relevant words (e.g. 'harmony', 'education', 'peace', 'liberation', 'diversity', 'tolerance') that carry conceptual weight. " +
                "Return ONLY a JSON array of strings — no explanation, no markdown code fences.",
            },
            { role: "user", content: text },
          ],
          temperature: 0.2,
          max_tokens: 500,
        }),
      })
        .then(r => r.json())
        .then(d => {
          const raw = d.choices?.[0]?.message?.content?.trim() || "[]";
          const kws = JSON.parse(raw.replace(/```json?\n?|```/g, "").trim());
          if (Array.isArray(kws) && kws.length > 0) setKwList(kws);
        })
        .catch(() => {});
    } catch (err) {
      setError(err.message || "Request failed.");
    } finally {
      setLoading(false);
    }
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const saveAsReference = () => {
    // Prefer the AI Improved output — it has clean headings and structure.
    // Fall back to the raw pasted answer if no improved version exists yet.
    const refText = output?.trim() || inputRef.current?.innerText?.trim();
    if (!refText) return;
    localStorage.setItem(LS_TOPPER_REF, refText);
    setRefSaved(true);
    setTimeout(() => setRefSaved(false), 2500);
  };

  const clearAll = () => {
    if (inputRef.current) inputRef.current.innerHTML = "";
    setOutput(""); setQuestion(""); setError(""); setInputWc(0); setKwList([]);
  };

  const highlightKeywords = async () => {
    const text = inputRef.current?.innerText?.trim();
    if (!text || !groqKey || hlLoading) return;
    setHlLoading(true);
    try {
      const res = await fetch(GROQ_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${groqKey}` },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [
            {
              role: "system",
              content:
                "You are a UPSC answer reviewer. Extract ALL important keywords and key phrases from the answer text — aim for 25-35 terms. " +
                "Be generous: include constitutional terms, proper nouns, government schemes, article numbers, reports/committees, " +
                "AND also domain-relevant common words (e.g. 'harmony', 'education', 'justice', 'peace', 'liberation', 'diversity', 'tolerance', 'empathy', 'existential', etc.) that carry conceptual weight in a UPSC answer. " +
                "The goal is to highlight all meaningful words the way a UPSC examiner would notice them. " +
                "Return ONLY a JSON array of strings — no explanation, no markdown code fences. Example: [\"Article 21\",\"harmony\",\"UNESCO\",\"directive principles\"]",
            },
            { role: "user", content: text },
          ],
          temperature: 0.2,
          max_tokens: 500,
        }),
      });
      const data = await res.json();
      const raw = data.choices?.[0]?.message?.content?.trim() || "[]";
      const jsonStr = raw.replace(/```json?\n?|```/g, "").trim();
      const keywords = JSON.parse(jsonStr);
      if (Array.isArray(keywords) && keywords.length > 0) {
        applyKeywordHighlightsDOM(inputRef.current, keywords);
        setKwList(keywords);
      }
    } catch (err) {
      console.error("Keyword highlight error:", err);
    } finally {
      setHlLoading(false);
    }
  };

  const outputWc = output.split(/\s+/).filter(Boolean).length;

  // Inline highlight for static text using stored kwList
  const highlightText = (text) => {
    if (!kwList.length || !text) return text;
    const sorted = [...kwList].filter(k => k && k.length >= 3).sort((a, b) => b.length - a.length);
    const escaped = sorted.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const re = new RegExp(`\\b(${escaped.join("|")})\\b`, "gi");
    const parts = [];
    let last = 0, m, idx = 0;
    re.lastIndex = 0;
    while ((m = re.exec(text)) !== null) {
      if (m.index > last) parts.push(text.slice(last, m.index));
      parts.push(<mark key={idx++} className="ai-editor-kw">{m[0]}</mark>);
      last = m.index + m[0].length;
    }
    if (last < text.length) parts.push(text.slice(last));
    return parts.length > 0 ? parts : text;
  };

  return (
    <div className="ai-improve-shell">
      {/* LEFT — contenteditable input */}
      <div className="ai-improve-panel">
        <div className="ai-improve-hdr">
          <span className="ai-improve-hdr-title">✏️ Question + Topper's Answer</span>
          <span className="ai-improve-hdr-hint">Headings pink · Paste from Gemini / doc</span>
          <button
            className={`ai-hl-btn${hlLoading ? " ai-hl-btn--loading" : ""}`}
            onClick={highlightKeywords}
            disabled={hlLoading}
            title="Auto-highlight important keywords using AI"
          >
            {hlLoading ? "Highlighting…" : "✦ Highlight"}
          </button>
          <div className="ai-fs-row">
            <button className="ai-fs-btn" onClick={() => setInputFontSize(s => Math.max(11, s - 1))} title="Smaller">A−</button>
            <button className="ai-fs-btn ai-fs-btn-lg" onClick={() => setInputFontSize(s => Math.min(20, s + 1))} title="Larger">A+</button>
          </div>
        </div>
        <div
          ref={inputRef}
          contentEditable
          suppressContentEditableWarning
          className="ai-improve-editor"
          style={{ fontSize: `${inputFontSize}px` }}
          data-placeholder="Paste the question and handwritten answer here…"
          onPaste={handlePaste}
          onInput={handleInput}
          onKeyDown={e => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") improve(); }}
          spellCheck={false}
        />
        <div className="ai-improve-footer">
          <span className="ai-improve-word-count">{inputWc > 0 ? `Answer: ${inputWc} words` : ""}</span>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {output && <button className="viewer-action-btn" onClick={clearAll}>Clear</button>}
            <button
              className={`ai-ref-btn${refSaved ? " ai-ref-btn--saved" : ""}`}
              onClick={saveAsReference}
              title="Save the AI Improved version (or pasted answer) as style reference for the AI Chatbot"
            >
              {refSaved ? "✓ Reference Saved!" : "📌 Set as Chatbot Reference"}
            </button>
            <button
              className={`primary-btn ai-improve-btn ${loading ? "disabled" : ""}`}
              onClick={improve}
              disabled={loading}
            >
              {loading ? "Improving…" : "✦ Improve →"}
            </button>
          </div>
        </div>
        {error && <div className="ai-improve-error">{error}</div>}
      </div>

      {/* Divider */}
      <div className="ai-improve-divider" />

      {/* RIGHT — output */}
      <div className="ai-improve-panel">
        <div className="ai-improve-hdr">
          <span className="ai-improve-hdr-title">✦ AI Improved Version</span>
          <div className="ai-wl-row">
            <span className="ai-wl-label">Length:</span>
            <button className="ai-wl-btn" onClick={() => {
              const idx = WORD_LIMITS.findIndex(w => w.value === wordLimit);
              if (idx > 0) setWordLimit(WORD_LIMITS[idx - 1].value);
            }} disabled={wordLimit === WORD_LIMITS[0].value} title="Shorter">−</button>
            <span className="ai-wl-val">{WORD_LIMITS.find(w => w.value === wordLimit)?.label}</span>
            <button className="ai-wl-btn" onClick={() => {
              const idx = WORD_LIMITS.findIndex(w => w.value === wordLimit);
              if (idx < WORD_LIMITS.length - 1) setWordLimit(WORD_LIMITS[idx + 1].value);
            }} disabled={wordLimit === WORD_LIMITS[WORD_LIMITS.length - 1].value} title="Longer">+</button>
          </div>
          <div className="ai-fs-row">
            <button className="ai-fs-btn" onClick={() => setFontSize(s => Math.max(11, s - 1))} title="Smaller text">A−</button>
            <button className="ai-fs-btn ai-fs-btn-lg" onClick={() => setFontSize(s => Math.min(20, s + 1))} title="Larger text">A+</button>
          </div>
          {output && (
            <>
              <span className="ai-improve-word-count" style={{ marginLeft: "auto" }}>{outputWc} words</span>
              <button className="ai-improve-copy-btn" onClick={copyOutput}>
                {copied ? "✓ Copied" : "Copy"}
              </button>
            </>
          )}
        </div>
        <div className="ai-improve-output">
          {/* Question shown at top once AI responds */}
          {question && (output || loading) && (
            <div className="ai-question-block">
              <span className="ai-question-label">Question</span>
              <div className="ai-question-text">{highlightText(question)}</div>
            </div>
          )}

          {loading && (
            <div className="ai-improve-loading">
              <span className="tc-trans-spinner" />
              Improving with keywords, structure, and reports…
            </div>
          )}
          {!loading && !output && (
            <div className="ai-improve-placeholder">
              <div className="ai-improve-ph-icon">✦</div>
              <div className="ai-improve-ph-title">Improved answer will appear here</div>
              <div className="ai-improve-ph-sub">
                Paste your question + answer on the left → click <strong>Improve →</strong><br />
                Use the <strong>− / +</strong> buttons above to control response length.
              </div>
            </div>
          )}
          {output && <div style={{ fontSize: `${fontSize}px` }}><MdImproved text={output} /></div>}
        </div>
      </div>
    </div>
  );
}

// ── Gemini setup screen ───────────────────────────────────────────────────────

function GeminiSetup({ onSave }) {
  const [draft,   setDraft]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const handleSave = async () => {
    const key = draft.trim();
    if (!key) return;
    setLoading(true); setError("");
    try {
      await validateGeminiKey(key);
      localStorage.setItem(LS_GEMINI_KEY, key);
      onSave(key);
    } catch (err) {
      setError(err.message || "Connection failed — check your internet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tc-gemini-setup">
      <div className="tc-gemini-setup-card">
        <div className="tc-gemini-logo">◈</div>
        <div className="tc-gemini-setup-title">Connect Google Gemini</div>
        <div className="tc-gemini-setup-sub">
          Gemini 3.5 Flash transcribes handwritten pages from images.
          <strong> Free — 15 pages/min, no credit card needed.</strong>
        </div>
        <div className="tc-gemini-steps">
          <div className="tc-gemini-step">
            <span className="tc-gemini-step-num">1</span>
            <span>Open <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="cb-setup-link">aistudio.google.com/apikey</a></span>
          </div>
          <div className="tc-gemini-step">
            <span className="tc-gemini-step-num">2</span>
            <span>Sign in with Google → <strong>Create API Key</strong> → Copy it</span>
          </div>
          <div className="tc-gemini-step">
            <span className="tc-gemini-step-num">3</span>
            <span>Paste below — saved in your browser only</span>
          </div>
        </div>
        <div className="tc-gemini-input-row">
          <input
            type="password"
            className="tc-gemini-input"
            placeholder="AIzaSy…"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSave()}
            autoFocus
          />
          <button
            className={`primary-btn tc-gemini-save-btn ${loading || !draft.trim() ? "disabled" : ""}`}
            onClick={handleSave}
            disabled={loading || !draft.trim()}
          >
            {loading ? "Checking…" : "Connect →"}
          </button>
        </div>
        {error && <div className="tc-gemini-error">{error}</div>}
        <div className="tc-gemini-note">
          🔒 Key stored only in your browser · Gemini 3.5 Flash · Free tier: 15 pages/min
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ToppersCopies({ onNavigate }) {
  const [mode,        setMode]        = useState("copies"); // "copies" | "improve"
  const [geminiKey,   setGeminiKey]   = useState(() => localStorage.getItem(LS_GEMINI_KEY) || "");
  const [copies,      setCopies]      = useState(loadCopiesMeta);
  const [activeId,    setActiveId]    = useState(null);
  const [pageImages,  setPageImages]  = useState({});
  const [customRange, setCustomRange] = useState("");
  const [showCustom,  setShowCustom]  = useState(false);
  const [customError, setCustomError] = useState("");
  const [diagrams,     setDiagrams]     = useState([]); // [{pageNum, imgUrl}]
  const [showDiagrams, setShowDiagrams] = useState(false);

  const fileRef    = useRef();
  const geminiRef  = useRef(geminiKey);
  const pageImgRef = useRef(pageImages);
  useEffect(() => { geminiRef.current  = geminiKey;  }, [geminiKey]);
  useEffect(() => { pageImgRef.current = pageImages; }, [pageImages]);

  const activeCopy = copies.find(c => c.id === activeId) || null;

  useEffect(() => { saveCopiesMeta(copies); }, [copies]);

  // Load page images from IndexedDB when active copy changes
  useEffect(() => {
    if (!activeCopy) return;
    let cancelled = false;
    (async () => {
      const imgs = {};
      for (const p of activeCopy.pages) {
        const url = await loadPage(activeCopy.id, p.pageNum);
        if (cancelled) return;
        if (url) imgs[p.id] = url;
      }
      setPageImages(imgs);
    })();
    return () => { cancelled = true; };
  }, [activeId]); // eslint-disable-line

  // ── Page state helpers ────────────────────────────────────────────────────

  const setPageText = useCallback((copyId, pageNum, text, status = "done") => {
    setCopies(prev => prev.map(c => {
      if (c.id !== copyId) return c;
      return { ...c, pages: c.pages.map(p =>
        p.pageNum === pageNum ? { ...p, text, status, error: "" } : p
      )};
    }));
  }, []);

  const setPageStatus = useCallback((copyId, pageNums, status, error = "") => {
    setCopies(prev => prev.map(c => {
      if (c.id !== copyId) return c;
      return { ...c, pages: c.pages.map(p =>
        pageNums.includes(p.pageNum) ? { ...p, status, error } : p
      )};
    }));
  }, []);

  const deletePage = useCallback(async (copyId, pageId, pageNum) => {
    // Remove from IndexedDB
    await deletePageImage(copyId, pageNum);
    // Remove from state
    setCopies(prev => prev.map(c => {
      if (c.id !== copyId) return c;
      const pages = c.pages.filter(p => p.id !== pageId);
      return { ...c, pages, pageCount: pages.length };
    }));
    // Remove cached image
    setPageImages(prev => { const n = { ...prev }; delete n[pageId]; return n; });
  }, []);

  // ── File upload → extract page images ────────────────────────────────────

  const processFile = useCallback(async (file) => {
    const isPdf   = file.type === "application/pdf";
    const isImage = file.type.startsWith("image/");
    if (!isPdf && !isImage) return;

    const id         = `tc-${Date.now()}`;
    const localPages = [];

    if (isPdf) {
      setCopies(prev => [{
        id, name: file.name.replace(/\.pdf$/i, ""),
        date: new Date().toISOString().slice(0, 10),
        pageCount: "…", pages: [], questions: [],
      }, ...prev]);
      setActiveId(id);
      setPageImages({});

      await pdfToImages(file, async (pageNum, total, dataUrl) => {
        const pageId = `${id}_p${pageNum}`;
        localPages.push({ id: pageId, pageNum, text: "", status: "idle" });
        await storePage(id, pageNum, dataUrl);
        const statePages = localPages.map(p => ({ ...p }));
        setCopies(prev => prev.map(c => c.id === id
          ? { ...c, pageCount: total, pages: statePages } : c));
        setPageImages(prev => ({ ...prev, [pageId]: dataUrl }));
      });
    } else {
      const dataUrl = await imageToDataUrl(file);
      const pageId  = `${id}_p1`;
      localPages.push({ id: pageId, pageNum: 1, text: "", status: "idle" });
      await storePage(id, 1, dataUrl);
      setCopies(prev => [{
        id, name: file.name.replace(/\.(jpg|jpeg|png|webp)$/i, ""),
        date: new Date().toISOString().slice(0, 10),
        pageCount: 1, pages: localPages, questions: [],
      }, ...prev]);
      setActiveId(id);
      setPageImages({ [pageId]: dataUrl });
    }
  }, []);

  const handleFiles = useCallback((files) => {
    Array.from(files).forEach(f => processFile(f));
  }, [processFile]);

  // ── Core: transcribe selected pages one by one ────────────────────────────
  // gemini-1.5-flash free tier = 15 RPM → 4 s gap between pages is safe

  const runGeminiOnPages = useCallback(async (copyId, pageNums) => {
    const key  = geminiRef.current;
    if (!key) return;

    const copy        = copies.find(c => c.id === copyId);
    if (!copy) return;
    const targetPages = pageNums
      ? copy.pages.filter(p => pageNums.includes(p.pageNum))
      : copy.pages;

    setPageStatus(copyId, targetPages.map(p => p.pageNum), "processing");

    for (let i = 0; i < targetPages.length; i++) {
      const page = targetPages[i];

      // Get image — try live state first, then IndexedDB
      let imgUrl = pageImgRef.current[page.id];
      if (!imgUrl) imgUrl = await loadPage(copyId, page.pageNum);

      if (!imgUrl) {
        setPageStatus(copyId, [page.pageNum], "error", "Image not found — re-upload the file.");
        continue;
      }

      try {
        const text = await transcribePageImage(key, imgUrl);
        setPageText(copyId, page.pageNum, text, "done");
      } catch (err) {
        setPageStatus(copyId, [page.pageNum], "error", err.message);
      }

      // Rate limit gap between pages (skip after last page)
      if (i < targetPages.length - 1) {
        await new Promise(r => setTimeout(r, 4200));
      }
    }
  }, [copies, setPageStatus, setPageText]);

  // ── Delete copy ───────────────────────────────────────────────────────────

  const deleteCopy = useCallback(async (copyId) => {
    await deleteCopyImages(copyId);
    setCopies(prev => prev.filter(c => c.id !== copyId));
    if (activeId === copyId) { setActiveId(null); setPageImages({}); }
  }, [activeId]);

  // ── Diagram finder ────────────────────────────────────────────────────────

  const addDiagram = useCallback(({ pageNum, dataUrl }) => {
    setDiagrams(prev => [...prev, {
      pageNum,
      imgUrl: dataUrl,
      copyName: copies.find(c => c.id === activeId)?.name || "Copy",
    }]);
  }, [copies, activeId]);

  const saveOneDiagram = useCallback(async (diag) => {
    const id   = `db_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const name = `${diag.copyName} - Page ${diag.pageNum}`;
    await saveBankDiagramImage(id, diag.imgUrl);
    const meta = loadDiagramBankMeta();
    saveDiagramBankMeta([{ id, name, copyName: diag.copyName, pageNum: diag.pageNum, savedAt: Date.now() }, ...meta]);
  }, []);

  const [bankSaving, setBankSaving] = useState(false);
  const [bankSaved,  setBankSaved]  = useState(null); // index of last saved, or "all"

  const saveDiagramToBank = useCallback(async (diag, idx) => {
    await saveOneDiagram(diag);
    setBankSaved(idx);
    setTimeout(() => setBankSaved(null), 2000);
  }, [saveOneDiagram]);

  const saveAllToBank = useCallback(async () => {
    if (!diagrams.length || bankSaving) return;
    setBankSaving(true);
    for (const diag of diagrams) await saveOneDiagram(diag);
    setBankSaving(false);
    setBankSaved("all");
    setTimeout(() => setBankSaved(null), 2000);
  }, [diagrams, bankSaving, saveOneDiagram]);

  // ── Derived state ─────────────────────────────────────────────────────────

  const totalPages   = activeCopy?.pages.length ?? 0;
  const donePages    = activeCopy?.pages.filter(p => p.status === "done").length ?? 0;
  const isProcessing = activeCopy?.pages.some(p => p.status === "processing");

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="tc-shell">

      {/* ── Sidebar ── */}
      <aside className="tc-sidebar">
        <div className="tc-sidebar-hdr">
          <button className="viewer-back-btn tc-back-btn" onClick={() => onNavigate?.("dashboard")}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
          <div className="tc-sidebar-title">Topper Copies</div>
          <button className="primary-btn tc-upload-btn" onClick={() => fileRef.current.click()}>
            + Upload
          </button>
          <input
            ref={fileRef} type="file" accept=".pdf,image/*" multiple
            style={{ display: "none" }}
            onChange={e => handleFiles(e.target.files)}
          />
        </div>

        {/* Mode tabs */}
        <div className="tc-mode-tabs">
          <button className={`tc-mode-tab ${mode === "copies" ? "active" : ""}`} onClick={() => setMode("copies")}>📝 Copies</button>
          <button className={`tc-mode-tab ${mode === "improve" ? "active" : ""}`} onClick={() => setMode("improve")}>✦ Improve</button>
          <button className={`tc-mode-tab ${mode === "bank" ? "active" : ""}`} onClick={() => setMode("bank")}>📐 Bank</button>
        </div>

        {geminiKey && (
          <div className="tc-gemini-status-row">
            <span className="tc-gemini-status-badge">◈ Gemini connected</span>
            <button
              className="tc-gemini-reset-btn" title="Change API key"
              onClick={() => { localStorage.removeItem(LS_GEMINI_KEY); setGeminiKey(""); }}
            >🔑</button>
          </div>
        )}

        {copies.length === 0 && (
          <div className="tc-sidebar-empty">
            <div className="tc-empty-icon">📒</div>
            <div>Upload handwritten copies (PDF or images)</div>
          </div>
        )}

        <div className="tc-copy-list">
          {copies.map(c => {
            const done  = c.pages.filter(p => p.status === "done").length;
            const total = c.pages.length || 1;
            const pct   = Math.round((done / total) * 100);
            return (
              <div
                key={c.id}
                className={`tc-copy-item ${activeId === c.id ? "tc-copy-active" : ""}`}
                onClick={() => setActiveId(c.id)}
              >
                <div className="tc-copy-icon">📝</div>
                <div className="tc-copy-info">
                  <div className="tc-copy-name">{c.name}</div>
                  <div className="tc-copy-meta">{c.date} · {c.pageCount} pages</div>
                  {done > 0 && done < total && (
                    <div className="tc-copy-ocr-bar">
                      <div className="tc-copy-ocr-fill" style={{ width: `${pct}%` }} />
                      <span className="tc-copy-ocr-pct">{done}/{total} transcribed</span>
                    </div>
                  )}
                  {done === total && total > 0 && (
                    <div className="tc-copy-done-badge">✓ All {total} pages transcribed</div>
                  )}
                </div>
                <button
                  className="tc-copy-del"
                  onClick={e => { e.stopPropagation(); deleteCopy(c.id); }}
                  title="Delete"
                >✕</button>
              </div>
            );
          })}
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="tc-main">
        {mode === "improve" ? (
          <AnswerImprover />
        ) : mode === "bank" ? (
          <DiagramBank />
        ) : !geminiKey ? (
          <GeminiSetup onSave={key => setGeminiKey(key)} />

        ) : !activeCopy ? (
          <div
            className="tc-dropzone"
            onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add("tc-dragging"); }}
            onDragLeave={e => e.currentTarget.classList.remove("tc-dragging")}
            onDrop={e => {
              e.preventDefault();
              e.currentTarget.classList.remove("tc-dragging");
              handleFiles(e.dataTransfer.files);
            }}
            onClick={() => fileRef.current.click()}
          >
            <div className="tc-drop-icon">📒</div>
            <div className="tc-drop-title">Upload Topper Handwritten Copies</div>
            <div className="tc-drop-sub">
              Drag &amp; drop PDFs or images, or click to browse.<br />
              Gemini will transcribe pages when you ask it to.
            </div>
            <div className="tc-drop-formats">Supports PDF · JPG · PNG · WEBP</div>
          </div>

        ) : (
          <div className="tc-viewer">
            {/* ── Top bar ── */}
            <div className="tc-topbar">
              <div className="tc-topbar-left">
                <div className="tc-topbar-name">{activeCopy.name}</div>
                <div className="tc-topbar-meta">
                  {totalPages} pages
                  {donePages > 0 && ` · ${donePages}/${totalPages} transcribed`}
                  {isProcessing && <span className="tc-topbar-ocr"> · Gemini reading…</span>}
                </div>
              </div>
              <div className="tc-topbar-right">

                {/* Custom page range button */}
                <div className="tc-custom-pages-wrap">
                  <button
                    className="tc-reprocess-btn tc-custom-btn"
                    onClick={() => { setShowCustom(v => !v); setCustomError(""); }}
                    disabled={isProcessing}
                  >
                    ◈ Custom pages
                  </button>
                  {showCustom && (
                    <div className="tc-custom-popover">
                      <div className="tc-custom-popover-title">Transcribe specific pages</div>
                      <div className="tc-custom-popover-hint">
                        Enter page numbers or ranges, e.g. <code>3-8, 12, 15</code>
                      </div>
                      <input
                        className="tc-custom-input"
                        placeholder={`1–${totalPages}`}
                        value={customRange}
                        onChange={e => { setCustomRange(e.target.value); setCustomError(""); }}
                        onKeyDown={e => e.key === "Escape" && setShowCustom(false)}
                        autoFocus
                      />
                      {customError && <div className="tc-custom-error">{customError}</div>}
                      <div className="tc-custom-popover-footer">
                        <button className="viewer-action-btn" onClick={() => setShowCustom(false)}>Cancel</button>
                        <button
                          className="primary-btn"
                          onClick={() => {
                            const nums = parsePageRange(customRange || `1-${totalPages}`, totalPages);
                            if (!nums.length) { setCustomError("No valid pages in that range."); return; }
                            setShowCustom(false);
                            runGeminiOnPages(activeCopy.id, nums);
                          }}
                        >
                          {(() => {
                            const n = parsePageRange(customRange || `1-${totalPages}`, totalPages).length;
                            return `◈ Run on ${n} page${n !== 1 ? "s" : ""}`;
                          })()}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Run on all pages */}
                <button
                  className="tc-reprocess-btn"
                  onClick={() => runGeminiOnPages(activeCopy.id, null)}
                  disabled={isProcessing}
                >
                  ◈ Run on all pages
                </button>

                {/* Find Diagrams — manual crop mode */}
                <button
                  className={`tc-reprocess-btn tc-diag-btn${showDiagrams ? " active" : ""}`}
                  onClick={() => { setShowDiagrams(v => !v); if (showDiagrams) setDiagrams([]); }}
                  title={showDiagrams ? "Exit crop mode" : "Manually crop diagrams from pages"}
                >
                  {showDiagrams ? "✕ Exit Crop Mode" : "✦ Find Diagrams"}
                </button>

                <span className="tc-gemini-badge-sm">◈ Gemini 3.5 Flash</span>
              </div>
            </div>

            {/* ── Column headers ── */}
            <div className="tc-col-headers">
              <div className="tc-col-hdr tc-col-hdr-left">📝 Handwritten Copy</div>
              <div className="tc-col-hdr tc-col-hdr-right">
                {showDiagrams
                  ? <>✦ Cropped Diagrams <span className="tc-col-hdr-hint">{diagrams.length} saved — drag to select on any page →</span></>
                  : <>◈ Gemini Transcription <span className="tc-col-hdr-hint">Page-by-page · scroll synced</span></>
                }
              </div>
            </div>

            {/* ── Diagram gallery panel ── */}
            {showDiagrams && (
              <div className="tc-diag-overlay">
                {diagrams.length === 0 ? (
                  <div className="tc-diag-empty">
                    <div className="tc-diag-empty-icon">✂</div>
                    <div className="tc-diag-empty-title">Crop mode active</div>
                    <div className="tc-diag-empty-sub">Drag over any page on the left to select a diagram. Click "Add Diagram" to save it here.</div>
                  </div>
                ) : (
                  <>
                    <div className="tc-diag-panel-hdr">
                      <span className="tc-diag-panel-count">{diagrams.length} diagram{diagrams.length !== 1 ? "s" : ""}</span>
                      <button
                        className={`tc-diag-saveall-btn ${bankSaved === "all" ? "saved" : ""}`}
                        onClick={saveAllToBank}
                        disabled={bankSaving || bankSaved === "all"}
                      >
                        {bankSaving ? "Saving…" : bankSaved === "all" ? "✓ All Saved" : "💾 Save All to Bank"}
                      </button>
                    </div>
                    <div className="tc-diag-grid">
                      {diagrams.map((d, i) => (
                        <div key={i} className="tc-diag-card">
                          <div className="tc-diag-card-hdr">
                            <span className="tc-diag-card-page">Page {d.pageNum}</span>
                            <button
                              className="tc-diag-card-del"
                              title="Remove"
                              onClick={() => setDiagrams(prev => prev.filter((_, j) => j !== i))}
                            >✕</button>
                          </div>
                          <img src={d.imgUrl} alt={`Diagram p${d.pageNum}`} className="tc-diag-card-img" />
                          <div className="tc-diag-card-actions">
                            <a className="tc-diag-download" href={d.imgUrl} download={`diagram-page${d.pageNum}-${i+1}.jpg`} title="Download">↓</a>
                            <button
                              className={`tc-diag-save-bank ${bankSaved === i ? "saved" : ""}`}
                              onClick={() => saveDiagramToBank(d, i)}
                              disabled={bankSaved === i}
                            >
                              {bankSaved === i ? "✓ Saved" : "💾 Save to Bank"}
                            </button>
                          </div>
                        </div>
                      ))}
                      <div className="tc-diag-add-hint">← Drag on a page to add more</div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ── Page rows (single scroll = automatic sync) ── */}
            <div className="tc-page-rows">
              {activeCopy.pages.map((page, i) => {
                const imgUrl = pageImages[page.id];
                return (
                  <div key={page.id} className="tc-page-row">

                    {/* LEFT: handwritten image */}
                    <div className="tc-page-col-left">
                      <div className="tc-page-num-row">
                        <div className="tc-page-num-badge">Page {i + 1}</div>
                        <button
                          className="tc-page-del-btn"
                          title="Delete this page"
                          onClick={() => deletePage(activeCopy.id, page.id, page.pageNum)}
                        >✕ Delete page</button>
                      </div>
                      {imgUrl ? (
                        <div className={showDiagrams ? "tc-crop-img-wrap" : ""}>
                          <img src={imgUrl} alt={`Page ${i + 1}`} className="tc-page-img" draggable={false} />
                          {showDiagrams && (
                            <CropOverlay imgUrl={imgUrl} pageNum={page.pageNum} onCrop={addDiagram} />
                          )}
                        </div>
                      ) : (
                        <div className="tc-page-img-missing">
                          <div>🔄</div>
                          <div className="tc-missing-text">Loading image…</div>
                        </div>
                      )}
                    </div>

                    {/* RIGHT: Gemini transcription */}
                    <div className="tc-page-col-right">
                      <div className="tc-trans-page-hdr">
                        Page {i + 1}
                        {page.status === "done" && (
                          <span className="tc-trans-done-chip">✓ Transcribed</span>
                        )}
                      </div>

                      {(page.status === "idle" || !page.status) && (
                        <div className="tc-trans-idle">
                          <span className="tc-trans-idle-dot" />
                          Use ◈ Custom pages or Run on all pages above to transcribe.
                        </div>
                      )}

                      {page.status === "processing" && (
                        <div className="tc-trans-loading">
                          <span className="tc-trans-spinner" />
                          Gemini is reading this page…
                        </div>
                      )}

                      {page.status === "error" && (
                        <div className="tc-trans-error">
                          <span className="tc-trans-error-icon">⚠</span>
                          <span className="tc-trans-error-msg">{page.error || "Failed to transcribe"}</span>
                          <button
                            className="tc-trans-retry-btn"
                            onClick={() => runGeminiOnPages(activeCopy.id, [page.pageNum])}
                          >
                            ↺ Retry this page
                          </button>
                        </div>
                      )}

                      {page.status === "done" && (
                        page.text
                          ? <div className="tc-trans-text">{page.text}</div>
                          : <div className="tc-trans-empty">No text detected on this page</div>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
