import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { searchPdfContent } from "../lib/pdfExtract";

// ── Config ────────────────────────────────────────────────────────────────────
const GROQ_URL      = "https://api.groq.com/openai/v1/chat/completions";
const LS_KEY        = "upsc_groq_key";
const LS_QS         = "upsc_chatbot_questions";
const LS_TOPPER_REF = "upsc_topper_ref";

const MODELS = [
  { id: "llama-3.3-70b-versatile", label: "ChatGPT", sub: "Llama 3.3 · 70B",   icon: "✦", color: "#10A37F", bg: "#F0FDF9" },
  { id: "mixtral-8x7b-32768",      label: "Gemini",  sub: "Mixtral 8×7B · MoE", icon: "◉", color: "#4285F4", bg: "#EFF6FF" },
];

const WORD_LIMITS = [
  { words: 150, hint: "10m" },
  { words: 250, hint: "15m" },
  { words: 350, hint: "20m" },
];

const UPSC_SYS = `You are a top-scoring UPSC Mains answer writer. Your answers consistently score 140+/150 because they are comprehensive, well-structured, and rich with specific content.

═══ CRITICAL WORD COUNT RULE ═══
You MUST meet the word count specified in the question. NEVER write fewer words than asked. If asked for 150 words, write 145–165 words. If asked for 250 words, write 245–275 words. If asked for 350 words, write 340–380 words. Count your words — this is non-negotiable.

═══ MANDATORY STRUCTURE ═══

## Introduction  (3 sentences)
• Open with a striking statistic, recent event, or constitutional/policy context
• Define the topic precisely
• State its significance for India's development/governance

## [Thematic Section 1 — e.g., Current Status / Historical Context / Constitutional Provisions]
• 4–5 bullets, each containing ONE of: specific data, scheme name, article/amendment, committee name, court judgment, or real India example
• Every bullet must be substantive — no vague generalities

## [Thematic Section 2 — e.g., Challenges / Social Dimension / Economic Aspect]
• 4–5 bullets with specific facts and examples

## [Thematic Section 3 — e.g., Government Initiatives / International Comparison / Ethical Angle]
• 4–5 bullets — for 150-word answers you may merge this with Section 2 if needed

## Way Forward  (for 150w: 3–4 bullets; for 250w+: 5–6 bullets)
• Specific, actionable policy recommendations
• Mention: committees, missions, global best practices, technology solutions
• Each recommendation must name a concrete action — no vague "improve" or "increase awareness"

## Conclusion  (2–3 sentences)
• Visionary, balanced
• Connect to larger goal: Viksit Bharat, SDGs, Constitutional vision, or demographic dividend

═══ MANDATORY CONTENT RULES ═══
1. **Bold** every key term, scheme name, article number, judgment name, committee name
2. Include AT LEAST: 2 specific statistics/data points, 2 government schemes, 1 committee/commission, 1 constitutional provision or court case
3. Use thematic headings (Social Dimension, Economic Aspect, Governance Failure, etc.) — NEVER generic headings like "Features" or "Measures" alone
4. Write every bullet as a complete thought with evidence, not a fragment
5. For 10-mark (150 words): 2 body sections minimum; for 15-mark (250 words): 3 body sections; for 20-mark (350 words): 4 body sections

Produce the answer now — meet the word count exactly.`;


// ── PDF context ───────────────────────────────────────────────────────────────

async function getPdfContext(question) {
  try {
    const raw = localStorage.getItem("upsc_library_docs");
    if (!raw) return "";
    const docs   = JSON.parse(raw);
    const docIds = docs.filter(d => d.extracted).map(d => d.docId);
    if (!docIds.length) return "";
    const results = await searchPdfContent(docIds, question);
    const text    = Object.values(results).filter(Boolean).join("\n\n");
    return text.slice(0, 1200); // keep context within token budget
  } catch { return ""; }
}

// ── Build prompt ──────────────────────────────────────────────────────────────

function buildUserMsg(question, wordLimit, pdfCtx, hasRef, topperRef) {
  let structureHint;
  if (hasRef && topperRef) {
    const headings = extractHeadings(topperRef);
    const headingReminder = headings.length
      ? `Use ONLY these headings in this order: ${headings.map((h, i) => `${i + 1}) ${h}`).join(" → ")}. No other headings.`
      : `Follow the exact structure from the reference answer.`;
    structureHint = `${headingReminder} TARGET WORD COUNT: ${wordLimit} words.`;
  } else {
    structureHint = `TARGET WORD COUNT: ${wordLimit} words — you MUST reach this count, do not stop early. Use the full structure (Introduction, themed body sections, Way Forward, Conclusion).`;
  }

  const base = `Write a UPSC Mains answer for this question. ${structureHint}\n\nQuestion: "${question}"`;

  if (!pdfCtx) return base;

  return (
    base +
    `\n\n━━━ RELEVANT CONTENT FROM MY UPLOADED STUDY MATERIAL ━━━\n` +
    `(Weave these specific facts, data points, and examples into your answer wherever relevant — ` +
    `cite them naturally as supporting evidence)\n\n${pdfCtx}\n` +
    `━━━ END OF STUDY MATERIAL ━━━`
  );
}

// ── API ───────────────────────────────────────────────────────────────────────

// Extract section headings from a reference answer text (handles multiple formats)
function extractHeadings(text) {
  const seen = new Set();
  const result = [];
  const SKIP = /^(answer|question|introduction|conclusion)\s*:?\s*$/i;

  for (const raw of text.split("\n")) {
    const l = raw.trim();
    if (!l) continue;

    let heading = null;

    // Format 1: **Heading** or **Heading:**
    const m1 = l.match(/^\*\*([^*]{3,70}?)\*\*:?\s*$/);
    if (m1) heading = m1[1].trim();

    // Format 2: ## Heading  /  ### Heading
    if (!heading) {
      const m2 = l.match(/^#{1,3}\s+(.+)$/);
      if (m2) heading = m2[1].replace(/\*\*/g, "").trim();
    }

    // Format 3: Standalone "Heading:" line (no content after colon)
    if (!heading) {
      const m3 = l.match(/^([A-Z][A-Za-z0-9 &()'\-/]{2,60}):?\s*$/);
      if (m3) heading = m3[1].trim();
    }

    // Format 4: Inline "Heading: content starts here" — heading before colon, content follows
    if (!heading) {
      const m4 = l.match(/^([A-Z][A-Za-z0-9 &()'\-/]{2,50}):\s+[A-Z\d"(]/);
      if (m4) heading = m4[1].trim();
    }

    if (heading && !SKIP.test(heading) && !seen.has(heading.toLowerCase())) {
      seen.add(heading.toLowerCase());
      result.push(heading);
    }
  }
  return result;
}

function buildSysPrompt(topperRef) {
  if (!topperRef) return UPSC_SYS;

  const refWords = topperRef.trim().split(/\s+/).filter(Boolean).length;
  const headings = extractHeadings(topperRef);

  const headingBlock = headings.length
    ? `USE EXACTLY THESE HEADINGS IN THIS ORDER — no additions, no renames, no reordering:\n${headings.map((h, i) => `  ${i + 1}. ${h}`).join("\n")}\n\nDO NOT add "Way Forward", "Challenges", or any other heading not in this list.`
    : `Mirror the exact section structure of a top-scoring UPSC answer.`;

  // No full reference body — just headings + word count to keep token usage minimal
  return `You are an expert UPSC Mains answer writer trained on a top-scoring student's style.

═══ STRUCTURE — NON-NEGOTIABLE ═══
${headingBlock}

═══ LENGTH & STYLE ═══
• Target: approximately ${refWords} words total
• Bold all key terms, article numbers, scheme names using **term** syntax
• Use numbered lists under each heading (match reference density: 2–4 points per section)
• Introduction: 2–3 sentences; Conclusion: 2 sentences

═══ CONTENT RULES ═══
• Add specific constitutional articles, SC judgments, government schemes, or committees
• Cite 1–2 bodies (UNESCO, NITI Aayog, ARC, etc.) where relevant
• Use qualifiers: "UNESCO notes", "NITI Aayog recommends" — never invent statistics

Write the answer now. Strictly follow the heading structure above.`;
}

async function queryGroq(apiKey, modelId, question, wordLimit, pdfCtx, sysPrompt, topperRef, onChunk) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 60000);

  try {
    const res = await fetch(GROQ_URL, {
      method:  "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model:       modelId,
        temperature: 0.75,
        max_tokens:  2048,
        stream:      true,
        messages: [
          { role: "system", content: sysPrompt },
          { role: "user",   content: buildUserMsg(question, wordLimit, pdfCtx, sysPrompt !== UPSC_SYS, sysPrompt !== UPSC_SYS ? topperRef : "") },
        ],
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const msg = err?.error?.message || `Groq error ${res.status}`;
      if (res.status === 401) throw new Error("Invalid API key — please re-enter your Groq key.");
      if (res.status === 429) {
        // Parse retry time from Groq's message e.g. "Please try again in 1m16.032s."
        const retryMatch = msg.match(/try again in ([\d]+m[\d.]+s|[\d.]+s)/i);
        const retryHint  = retryMatch ? ` Try again in ${retryMatch[1]}.` : " Try again in a few minutes.";
        const isDaily    = /tokens per day|TPD/i.test(msg);
        throw new Error(
          isDaily
            ? `Daily token limit reached (Groq free tier: 100k tokens/day).${retryHint} Limit resets at midnight UTC.`
            : `Rate limit hit.${retryHint}`
        );
      }
      throw new Error(msg);
    }

    const reader  = res.body.getReader();
    const decoder = new TextDecoder();
    let full = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      for (const line of chunk.split("\n")) {
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6).trim();
        if (data === "[DONE]") continue;
        try {
          const delta = JSON.parse(data)?.choices?.[0]?.delta?.content || "";
          if (delta) { full += delta; onChunk?.(delta, full); }
        } catch {}
      }
    }

    if (!full) throw new Error("Empty response — please retry.");
    return full;
  } finally {
    clearTimeout(timer);
  }
}

// ── Markdown renderer ─────────────────────────────────────────────────────────

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

function MdContent({ text }) {
  const nodes = []; let key = 0; let list = [];
  const flush = () => {
    if (!list.length) return;
    nodes.push(<ul key={key++} className="cb-ul">{[...list]}</ul>);
    list = [];
  };
  for (const raw of text.split("\n")) {
    const t = raw.trim();
    if (!t)                        { flush(); continue; }
    if (t.startsWith("## "))       { flush(); nodes.push(<h2 key={key++} className="cb-h2">{inlineFmt(t.slice(3))}</h2>); }
    else if (t.startsWith("### ")) { flush(); nodes.push(<h3 key={key++} className="cb-h3">{inlineFmt(t.slice(4))}</h3>); }
    else if (/^[-*•]\s/.test(t))  { list.push(<li key={key++} className="cb-li">{inlineFmt(t.replace(/^[-*•]\s/,""))}</li>); }
    else                           { flush(); nodes.push(<p key={key++} className="cb-p">{inlineFmt(t)}</p>); }
  }
  flush();
  return <>{nodes}</>;
}

// ── Storage ───────────────────────────────────────────────────────────────────

function loadQ()   { try { return JSON.parse(localStorage.getItem(LS_QS) || "[]"); } catch { return []; } }
function saveQ(qs) { try { localStorage.setItem(LS_QS, JSON.stringify(qs.map(({responses:_,...r})=>r).slice(-30))); } catch {} }

const LS_PYQ_ANSWERS = "upsc_pyq_answers";
function loadPyqAnswers() { try { return JSON.parse(localStorage.getItem(LS_PYQ_ANSWERS) || "{}"); } catch { return {}; } }
function storePyqAnswer(id, entry) {
  const all = loadPyqAnswers();
  all[id] = entry;
  localStorage.setItem(LS_PYQ_ANSWERS, JSON.stringify(all));
}

const SAMPLES = [
  "Examine the role of civil society in strengthening Indian democracy. (15 marks)",
  "Critically analyze India's climate commitments and their impact on economic growth. (15 marks)",
  "Discuss the ethical dimensions of AI in public administration. (10 marks)",
];

// ── Setup screen ──────────────────────────────────────────────────────────────

function SetupScreen({ onSave }) {
  const [draft,    setDraft]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handleSave = async () => {
    const key = draft.trim();
    if (!key) return;
    setLoading(true); setError("");
    try {
      // Quick validity check
      const res = await fetch(GROQ_URL, {
        method:  "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${key}` },
        body: JSON.stringify({ model: "llama-3.3-70b-versatile", max_tokens: 5, stream: false, messages: [{ role: "user", content: "Hi" }] }),
      });
      if (res.status === 401) { setError("Invalid key — please check and try again."); return; }
      localStorage.setItem(LS_KEY, key);
      onSave(key);
    } catch {
      setError("Connection failed — check your internet and retry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cb-setup">
      <div className="cb-setup-card">
        {/* Models preview */}
        <div className="cb-setup-models">
          {MODELS.map(m => (
            <div key={m.id} className="cb-setup-model-chip"
              style={{ color: m.color, background: m.bg, border: `1.5px solid ${m.color}` }}>
              <span>{m.icon}</span>
              <div>
                <div className="cb-setup-model-label">{m.label}</div>
                <div className="cb-setup-model-sub">{m.sub}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="cb-setup-title">One-time free setup</div>
        <div className="cb-setup-sub">
          Get a free Groq API key in 30 seconds — no credit card, no payment, ever.
        </div>

        {/* Steps */}
        <div className="cb-setup-steps">
          <div className="cb-setup-step">
            <span className="cb-setup-step-num">1</span>
            <span>Open <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer" className="cb-setup-link">console.groq.com/keys</a></span>
          </div>
          <div className="cb-setup-step">
            <span className="cb-setup-step-num">2</span>
            <span>Sign up free → Create API Key → Copy it</span>
          </div>
          <div className="cb-setup-step">
            <span className="cb-setup-step-num">3</span>
            <span>Paste below — saved forever in your browser</span>
          </div>
        </div>

        <div className="cb-setup-input-row">
          <input
            type="password"
            className="cb-setup-input"
            placeholder="gsk_…"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSave()}
            autoFocus
          />
          <button
            className={`primary-btn cb-setup-save-btn ${loading ? "disabled" : ""} ${!draft.trim() ? "disabled" : ""}`}
            onClick={handleSave}
            disabled={loading || !draft.trim()}
          >
            {loading ? "Checking…" : "Save & Start →"}
          </button>
        </div>

        {error && <div className="cb-setup-error">{error}</div>}

        <div className="cb-setup-note">
          🔒 Key is stored only in your browser. Groq free tier: 14,400 requests/day.
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

// Parse "21m10.944s" or "45.2s" → total seconds
function parseRetrySeconds(errMsg) {
  const m = errMsg?.match(/try again in (?:(\d+)m)?([\d.]+)s/i);
  if (!m) return 0;
  return (parseInt(m[1] || 0) * 60) + parseFloat(m[2] || 0);
}

function RetryCountdown({ errorMsg, onRetry }) {
  const totalSecs = useMemo(() => Math.ceil(parseRetrySeconds(errorMsg)), [errorMsg]);
  const [secs, setSecs] = useState(totalSecs);

  useEffect(() => {
    if (totalSecs <= 0) return;
    setSecs(totalSecs);
    const id = setInterval(() => setSecs(s => {
      if (s <= 1) { clearInterval(id); onRetry(); return 0; }
      return s - 1;
    }), 1000);
    return () => clearInterval(id);
  }, [totalSecs, onRetry]);

  const mins = Math.floor(secs / 60);
  const sec  = secs % 60;
  const timeStr = mins > 0 ? `${mins}m ${sec}s` : `${secs}s`;

  return (
    <div className="cb-rate-limit">
      <div className="cb-rate-icon">⏳</div>
      <div className="cb-rate-title">Daily token limit reached</div>
      <div className="cb-rate-sub">Groq free tier: 100k tokens/day</div>
      {secs > 0 ? (
        <>
          <div className="cb-rate-countdown">{timeStr}</div>
          <div className="cb-rate-note">Auto-retrying when ready…</div>
        </>
      ) : (
        <button className="primary-btn cb-retry-btn" onClick={onRetry}>↺ Retry now</button>
      )}
      <div className="cb-rate-reset">Limit resets at midnight UTC</div>
    </div>
  );
}

export default function Chatbot({ onNavigate, initialQuestion, onQuestionUsed, pyqId }) {
  const [apiKey,      setApiKey]      = useState(() => localStorage.getItem(LS_KEY) || "");
  const [questions,   setQuestions]   = useState(loadQ);
  const [activeId,    setActiveId]    = useState(null);
  const [activeModel, setActiveModel] = useState(MODELS[0].id);
  const [responses,   setResponses]   = useState({});
  const [input,       setInput]       = useState("");
  const [wordLimit,   setWordLimit]   = useState(150);
  const [copied,      setCopied]      = useState(false);
  // save panel: null | { draft: string }
  const [savePanel,   setSavePanel]   = useState(null);
  const [savedId,     setSavedId]     = useState(null); // id of last saved entry
  const [topperRef,   setTopperRef]   = useState(() => localStorage.getItem(LS_TOPPER_REF) || "");

  const responseRef  = useRef();
  const autoSentRef  = useRef(false);
  const pyqIdRef     = useRef(pyqId); // capture initial pyqId — prop goes null after onQuestionUsed()
  const responsesRef = useRef(responses); // always-current mirror — avoids stale closure
  useEffect(() => { responsesRef.current = responses; }, [responses]);

  const activeQ    = questions.find(q => q.id === activeId) || null;
  const activeResp = activeId ? (responses[activeId]?.[activeModel] || null) : null;
  const activeM    = MODELS.find(m => m.id === activeModel);

  useEffect(() => { saveQ(questions); }, [questions]);
  useEffect(() => { responseRef.current?.scrollTo({ top: 0 }); }, [activeId, activeModel]);

  useEffect(() => {
    if (apiKey && initialQuestion && !autoSentRef.current) {
      autoSentRef.current = true;
      onQuestionUsed?.();
      const wl = initialQuestion.marks >= 20 ? 350 : initialQuestion.marks >= 15 ? 250 : 150;
      setWordLimit(wl);
      setTimeout(() => addAndFetch(initialQuestion.text, wl), 100);
    }
  }, [apiKey]); // eslint-disable-line

  // ── Core fetch (force=true skips cache check, used on word-limit change) ────

  const fetchResponse = useCallback(async (qId, modelId, question, wl, force = false) => {
    const existing = responsesRef.current[qId]?.[modelId];
    if (!force && (existing?.status === "loading" || existing?.status === "done")) return;

    const key = localStorage.getItem(LS_KEY) || apiKey;
    if (!key) return;

    setResponses(prev => ({
      ...prev,
      [qId]: { ...(prev[qId]||{}), [modelId]: { status: "loading", text: "", stream: "" } },
    }));

    try {
      const pdfCtx    = await getPdfContext(question);
      const topperRef = localStorage.getItem(LS_TOPPER_REF) || "";
      const sysPrompt = buildSysPrompt(topperRef);
      const text   = await queryGroq(key, modelId, question, wl, pdfCtx, sysPrompt, topperRef, (_chunk, full) => {
        setResponses(prev => ({
          ...prev,
          [qId]: { ...(prev[qId]||{}), [modelId]: { status: "loading", text: "", stream: full } },
        }));
      });
      setResponses(prev => ({
        ...prev,
        [qId]: { ...(prev[qId]||{}), [modelId]: { status: "done", text, stream: "", hasPdf: !!pdfCtx } },
      }));
    } catch (err) {
      const msg = err.name === "AbortError" ? "Request timed out — please retry." : err.message;
      if (msg.includes("Invalid API key")) {
        localStorage.removeItem(LS_KEY); setApiKey("");
      }
      setResponses(prev => ({
        ...prev,
        [qId]: { ...(prev[qId]||{}), [modelId]: { status: "error", text: "", stream: "", error: msg } },
      }));
    }
  }, [apiKey]); // responsesRef instead of responses — no stale closure

  // ── Add question ────────────────────────────────────────────────────────────

  const addAndFetch = useCallback((text, wl) => {
    const q = (text || input).trim();
    if (!q) return;
    setInput("");
    const id   = `q-${Date.now()}`;
    const qObj = { id, text: q, wordLimit: wl || wordLimit, ts: Date.now() };
    setQuestions(prev => [qObj, ...prev]);
    setActiveId(id);
    setActiveModel(MODELS[0].id);
    setTimeout(() => {
      fetchResponse(id, MODELS[0].id, q, wl || wordLimit);
      fetchResponse(id, MODELS[1].id, q, wl || wordLimit);
    }, 60);
  }, [input, wordLimit, fetchResponse]);

  const switchModel = (modelId) => {
    setActiveModel(modelId);
    if (activeQ) fetchResponse(activeId, modelId, activeQ.text, activeQ.wordLimit);
  };

  // Change word limit: if question is active, update it and refetch everything
  const changeWordLimit = (wl) => {
    setWordLimit(wl);
    if (!activeId || !activeQ) return;
    // Update the question's stored word limit
    setQuestions(prev => prev.map(q => q.id === activeId ? { ...q, wordLimit: wl } : q));
    // Clear responses for this question so we can refetch
    setResponses(prev => {
      const n = { ...prev, [activeId]: {} };
      responsesRef.current = n;
      return n;
    });
    // Refetch both models with force=true
    const qText = activeQ.text;
    setTimeout(() => {
      MODELS.forEach(m => fetchResponse(activeId, m.id, qText, wl, true));
    }, 50);
  };

  const retry = () => {
    if (!activeQ) return;
    setResponses(prev => {
      const n = { ...prev, [activeId]: { ...(prev[activeId]||{}) } };
      delete n[activeId][activeModel];
      responsesRef.current = n;
      return n;
    });
    setTimeout(() => fetchResponse(activeId, activeModel, activeQ.text, activeQ.wordLimit, true), 50);
  };

  const deleteQ = (id) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
    if (activeId === id) setActiveId(null);
  };

  const copyResponse = () => {
    const text = activeResp?.text || "";
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    });
  };

  const openSavePanel = () => {
    const text = activeResp?.text || "";
    if (!text) return;
    setSavePanel({ draft: text });
  };

  const handleSaveAnswer = () => {
    if (!savePanel?.draft?.trim() || !activeQ) return;
    const entry = {
      text:      savePanel.draft.trim(),
      model:     activeM?.label || "AI",
      wordLimit: activeQ.wordLimit,
      savedAt:   Date.now(),
      question:  activeQ.text,
    };
    // Store keyed by pyqId if this came from PYQ, else by chatbot question id
    const storeId = pyqIdRef.current || activeId;
    storePyqAnswer(storeId, entry);
    setSavedId(storeId);
    setSavePanel(null);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); addAndFetch(); }
  };

  const displayText = activeResp?.status === "done"
    ? activeResp.text
    : (activeResp?.stream || "");

  const wordCount = displayText
    ? displayText.trim().split(/\s+/).filter(Boolean).length
    : 0;

  // Show setup screen if no API key saved
  if (!apiKey) {
    return (
      <div className="cb-shell" style={{ position: "relative" }}>
        <button
          className="viewer-back-btn"
          style={{ position: "absolute", top: 14, left: 14, zIndex: 10 }}
          onClick={() => onNavigate?.("dashboard")}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>
        <SetupScreen onSave={key => setApiKey(key)} />
      </div>
    );
  }

  // ── Main UI ─────────────────────────────────────────────────────────────────

  return (
    <div className="cb-shell">

      {/* ── LEFT SIDEBAR ──────────────────────────────────────────────── */}
      <aside className="cb-sidebar">
        <div className="cb-sidebar-hdr">
          <button className="viewer-back-btn" onClick={() => onNavigate?.("dashboard")}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
          <div className="cb-sidebar-title">AI Chatbot</div>
          <button
            className="cb-nav-pyq-btn"
            title="Go to PYQ Mapper"
            onClick={() => onNavigate?.("pyq")}
          >
            PYQ →
          </button>
          <button
            className="cb-reset-key-btn"
            title="Change API key"
            onClick={() => { localStorage.removeItem(LS_KEY); setApiKey(""); }}
          >
            🔑
          </button>
        </div>

        {/* Word limit */}
        <div className="cb-wl-row">
          {WORD_LIMITS.map(w => (
            <button
              key={w.words}
              className={`cb-wl-btn ${(activeQ ? activeQ.wordLimit : wordLimit) === w.words ? "active" : ""}`}
              onClick={() => changeWordLimit(w.words)}
            >
              {w.words}w <span className="cb-wl-hint">{w.hint}</span>
            </button>
          ))}
        </div>

        {/* Topper reference badge */}
        {topperRef && (
          <div className="cb-ref-badge">
            <span className="cb-ref-dot" />
            <span className="cb-ref-label">Topper style reference active</span>
            <button
              className="cb-ref-clear"
              title="Remove reference"
              onClick={() => { localStorage.removeItem(LS_TOPPER_REF); setTopperRef(""); }}
            >✕</button>
          </div>
        )}

        {/* Input */}
        <div className="cb-input-wrap">
          <textarea
            className="cb-textarea"
            placeholder="Paste UPSC question…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            rows={4}
          />
          <button
            className={`cb-send-btn ${!input.trim() ? "disabled" : ""}`}
            onClick={() => addAndFetch()}
            disabled={!input.trim()}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 20-7z"/>
            </svg>
          </button>
        </div>

        {/* Question list */}
        <div className="cb-q-list">
          {questions.length === 0 && (
            <div className="cb-q-empty">
              <div className="cb-q-empty-icon">💬</div>
              <div>Try a sample:</div>
              {SAMPLES.map((s, i) => (
                <button key={i} className="cb-sample-btn" onClick={() => addAndFetch(s, 150)}>
                  {s.slice(0, 60)}…
                </button>
              ))}
            </div>
          )}
          {questions.map(q => {
            const statuses  = MODELS.map(m => responses[q.id]?.[m.id]?.status);
            const doneCount = statuses.filter(s => s === "done").length;
            const isLoading = statuses.includes("loading");
            return (
              <div
                key={q.id}
                className={`cb-q-item ${activeId === q.id ? "active" : ""}`}
                onClick={() => {
                  setActiveId(q.id);
                  MODELS.forEach(m => fetchResponse(q.id, m.id, q.text, q.wordLimit));
                }}
              >
                <div className="cb-q-item-text">{q.text}</div>
                <div className="cb-q-item-meta">
                  <span className="cb-q-wl-tag">{q.wordLimit}w</span>
                  {isLoading  && <span className="cb-q-loading-dot" />}
                  {!isLoading && doneCount > 0 && (
                    <span className="cb-q-done-tag">{doneCount}/{MODELS.length}</span>
                  )}
                </div>
                <button className="cb-q-del" onClick={e => { e.stopPropagation(); deleteQ(q.id); }}>✕</button>
              </div>
            );
          })}
        </div>
      </aside>

      {/* ── RIGHT PANEL ────────────────────────────────────────────────── */}
      <div className="cb-main">
        {!activeQ ? (
          <div className="cb-empty">
            <div className="cb-empty-icon">🤖</div>
            <div className="cb-empty-title">UPSC AI Answer Writer</div>
            <div className="cb-empty-sub">
              Get structured UPSC Mains answers from two AI models — powered by Groq's
              free tier, streamed in real-time.
            </div>
            <div className="cb-empty-models">
              {MODELS.map(m => (
                <span key={m.id} className="cb-empty-model-pill"
                  style={{ color: m.color, background: m.bg, border: `1.5px solid ${m.color}` }}>
                  {m.icon} {m.label}
                  <span style={{ fontSize: 10, opacity: 0.65, marginLeft: 5 }}>{m.sub}</span>
                </span>
              ))}
            </div>
            <div className="cb-empty-free-note">Free Groq tier · 14,400 req/day · Real-time streaming</div>
          </div>
        ) : (
          <>
            {/* ── TOP BAR: model tabs + actions in ONE row ───────────── */}
            <div className="cb-top-bar">
              {/* Model tabs */}
              <div className="cb-model-tabs">
                {MODELS.map(m => {
                  const resp      = responses[activeId]?.[m.id];
                  const status    = resp?.status;
                  const streaming = status === "loading" && resp?.stream;
                  return (
                    <button
                      key={m.id}
                      className={`cb-model-tab ${activeModel === m.id ? "active" : ""}`}
                      style={activeModel === m.id ? { "--tab-color": m.color, "--tab-bg": m.bg } : {}}
                      onClick={() => switchModel(m.id)}
                    >
                      <span className="cb-model-tab-icon" style={{ color: m.color }}>{m.icon}</span>
                      <div className="cb-model-tab-labels">
                        <span className="cb-model-tab-label">{m.label}</span>
                        <span className="cb-model-tab-sub">{m.sub}</span>
                      </div>
                      {(status === "loading" || streaming) && <span className="cb-tab-spinner" />}
                      {status === "done"  && <span className="cb-tab-done">✓</span>}
                      {status === "error" && <span className="cb-tab-err">✕</span>}
                    </button>
                  );
                })}
              </div>

              {/* Action buttons */}
              <div className="cb-top-actions">
                {wordCount > 0 && (
                  <span className="cb-resp-wc">{wordCount} words</span>
                )}
                {activeResp?.hasPdf && (
                  <span className="cb-resp-pdf-badge" title="Answer used your uploaded notes">📄 Notes</span>
                )}
                {activeResp?.status === "loading" && activeResp.stream && (
                  <span className="cb-streaming-badge">
                    <span className="cb-stream-dot" style={{ background: activeM?.color }} /> Writing…
                  </span>
                )}
                {(activeResp?.status === "done" || (activeResp?.status === "loading" && activeResp?.stream)) && (
                  <>
                    <button className="cb-top-btn" onClick={retry} title="Regenerate">↺ Regen</button>
                    <button className={`cb-top-btn ${copied ? "copied" : ""}`} onClick={copyResponse} title="Copy">
                      {copied ? "✓ Copied" : "📋 Copy"}
                    </button>
                  </>
                )}
                {activeResp?.status === "done" && (
                  <>
                    <button
                      className={`cb-top-btn save ${savePanel ? "active" : ""} ${savedId === (pyqIdRef.current || activeId) ? "saved" : ""}`}
                      onClick={savedId === (pyqIdRef.current || activeId) ? undefined : openSavePanel}
                      title="Save answer"
                    >
                      {savedId === (pyqIdRef.current || activeId) ? "✓ Saved" : "💾 Save"}
                    </button>
                    {savedId === (pyqIdRef.current || activeId) && (
                      <button
                        className="cb-top-btn goto-pyq"
                        onClick={() => onNavigate?.("pyq")}
                        title="View saved answer in PYQ Mapper"
                      >
                        View in PYQ →
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* ── Save / edit panel ──────────────────────────────────── */}
            {savePanel && (
              <div className="cb-save-panel">
                <div className="cb-save-hdr">
                  <span className="cb-save-hdr-title">Edit answer before saving</span>
                  <span className="cb-save-wc">{savePanel.draft.trim().split(/\s+/).filter(Boolean).length} words</span>
                  <button className="cb-save-close" onClick={() => setSavePanel(null)}>✕</button>
                </div>
                <textarea
                  className="cb-save-textarea"
                  value={savePanel.draft}
                  onChange={e => setSavePanel(p => ({ ...p, draft: e.target.value }))}
                  spellCheck={false}
                />
                <div className="cb-save-footer">
                  <button className="cb-resp-btn" onClick={() => setSavePanel(null)}>Cancel</button>
                  <button className="primary-btn" onClick={handleSaveAnswer}>💾 Save Answer</button>
                </div>
              </div>
            )}

            {/* ── Response area ──────────────────────────────────────── */}
            <div className="cb-response-area" ref={responseRef}>

              {/* Question shown above the answer */}
              <div className="cb-resp-question">{activeQ.text}</div>

              {!activeResp && (
                <div className="cb-resp-idle">
                  <div className="cb-resp-idle-icon" style={{ color: activeM?.color }}>{activeM?.icon}</div>
                  <div>Fetching {activeM?.label} response…</div>
                </div>
              )}

              {activeResp?.status === "loading" && !activeResp.stream && (
                <div className="cb-resp-loading">
                  <div className="cb-loading-dots">
                    <span style={{ background: activeM?.color }} />
                    <span style={{ background: activeM?.color }} />
                    <span style={{ background: activeM?.color }} />
                  </div>
                  <div className="cb-loading-label">{activeM?.label} is thinking…</div>
                </div>
              )}

              {activeResp?.status === "loading" && activeResp.stream && (
                <div className="cb-resp-body">
                  <MdContent text={activeResp.stream} />
                  <span className="cb-cursor" style={{ background: activeM?.color }} />
                </div>
              )}

              {activeResp?.status === "error" && (
                /daily token limit|rate limit hit/i.test(activeResp.error)
                  ? <RetryCountdown errorMsg={activeResp.error} onRetry={retry} />
                  : <div className="cb-resp-error">
                      <div className="cb-resp-error-icon">⚠</div>
                      <div className="cb-resp-error-msg">{activeResp.error}</div>
                      <button className="primary-btn cb-retry-btn" onClick={retry}>↺ Retry</button>
                    </div>
              )}

              {activeResp?.status === "done" && (
                <div className="cb-resp-body">
                  <MdContent text={activeResp.text} />
                </div>
              )}

            </div>
          </>
        )}
      </div>
    </div>
  );
}
