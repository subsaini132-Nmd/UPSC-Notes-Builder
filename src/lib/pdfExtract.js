// PDF text extraction (pdfjs-dist) with heading-aware section grouping
// Stored in IndexedDB; supports both note search and UPSC answer generation

const DB_NAME = "upsc_notesai";
const DB_VER  = 1;
const STORE   = "doc_text";

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VER);
    req.onupgradeneeded = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE))
        db.createObjectStore(STORE, { keyPath: "docId" });
    };
    req.onsuccess = e => resolve(e.target.result);
    req.onerror   = e => reject(e.target.error);
  });
}

async function dbGet(docId) {
  const db = await openDB();
  const tx = db.transaction(STORE, "readonly");
  const st = tx.objectStore(STORE);
  return new Promise((res, rej) => {
    const r = st.get(docId); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
  });
}

async function dbPut(record) {
  const db = await openDB();
  const tx = db.transaction(STORE, "readwrite");
  const st = tx.objectStore(STORE);
  return new Promise((res, rej) => {
    const r = st.put(record); r.onsuccess = () => res(); r.onerror = () => rej(r.error);
  });
}

async function dbDel(docId) {
  const db = await openDB();
  const tx = db.transaction(STORE, "readwrite");
  const st = tx.objectStore(STORE);
  return new Promise((res, rej) => {
    const r = st.delete(docId); r.onsuccess = () => res(); r.onerror = () => rej(r.error);
  });
}

// ── Line extraction (preserves PDF line breaks via Y-position) ─────────────────

function extractLines(pageItems) {
  if (!pageItems.length) return [];
  const lines = [];
  let buf = [];
  let lastY = null;

  for (const item of pageItems) {
    const str = item.str || "";
    const y   = Math.round(item.transform?.[5] ?? 0);

    if (lastY !== null && Math.abs(y - lastY) > 2) {
      const line = buf.join("").replace(/\s+/g, " ").trim();
      if (line) lines.push(line);
      buf = [];
    }
    if (str.trim()) buf.push(str);
    lastY = y;
  }
  const last = buf.join("").replace(/\s+/g, " ").trim();
  if (last) lines.push(last);
  return lines;
}

// ── Heading detection (coaching material heuristics) ──────────────────────────

// Known UPSC coaching section labels (matches partial line too)
const HEADING_RE = /^(introduction|background|context|origin|history|causes?|reasons?|significance|importance|need|relevance|features?|characteristics?|types?|dimensions?|aspects?|challenges?|issues?|concerns?|impacts?|effects?|consequences?|advantages?|disadvantages?|merits?|demerits?|way forward|recommendations?|suggestions?|measures?|government initiatives?|government schemes?|schemes?|acts?|laws?|policies|constitutional provisions?|legal framework|judicial|analysis|critical analysis|status|current scenario|conclusion|summary|exam focus|mains focus|data|statistics|facts|examples?|case study|international experience|global|india|rajasthan)(\s*:|-|$)/i;

function isHeading(line) {
  const t = line.trim();
  if (t.length < 3 || t.length > 130) return false;

  // Ends with colon and short → strong heading signal
  if (t.endsWith(":") && t.length < 80) return true;

  // Known coaching section label
  if (HEADING_RE.test(t)) return true;

  // ALL CAPS line (chapter or topic heading in coaching PDFs)
  const letters = t.replace(/[^a-zA-Z]/g, "");
  if (letters.length >= 4 && letters.length <= 80) {
    const upRatio = (t.match(/[A-Z]/g) || []).length / letters.length;
    if (upRatio > 0.75) return true;
  }

  return false;
}

// ── Section grouping ──────────────────────────────────────────────────────────

// Returns [{heading, text, bullets}] where:
//   heading = detected section label (or the topic name for chapter heading)
//   text    = full section content as a single string
//   bullets = individual bullet points / sentences in this section
function groupIntoSections(lines) {
  const sections = [];
  let heading = "";
  let bullets = [];

  const flush = () => {
    if (!bullets.length) return;
    sections.push({
      heading: heading || "Content",
      text: bullets.join(" "),
      bullets: bullets.slice(),
    });
  };

  for (const line of lines) {
    const clean = line.replace(/^[•◦▪▸\-\*]\s*/, "").trim();
    if (!clean) continue;

    if (isHeading(line)) {
      flush();
      heading = clean.replace(/:$/, "").trim();
      bullets = [];
    } else {
      // Split long lines into sub-sentences for better retrieval granularity
      const sents = clean
        .split(/(?<=[.!?])\s+(?=[A-Z])/)
        .map(s => s.trim())
        .filter(s => s.length > 15);
      bullets.push(...(sents.length > 1 ? sents : [clean]));
    }
  }
  flush();

  return sections.filter(s => s.text.length > 20);
}

// ── Word-based chunking (for broad keyword search) ────────────────────────────

function splitChunks(text, size = 200, overlap = 60) {
  const words = text.split(/\s+/).filter(Boolean);
  const chunks = [];
  let i = 0;
  while (i < words.length) {
    chunks.push(words.slice(i, i + size).join(" "));
    if (i + size >= words.length) break;
    i += size - overlap;
  }
  return chunks;
}

// ── Public: extract and store ─────────────────────────────────────────────────

export async function extractAndStore(docId, file, onProgress) {
  const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf");
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

  const buf = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
  const total = pdf.numPages;

  const allLines    = [];   // all lines across pages (for section grouping)
  const flatParts   = [];   // flat text for chunk-based search

  for (let p = 1; p <= total; p++) {
    const page  = await pdf.getPage(p);
    const tc    = await page.getTextContent();
    const lines = extractLines(tc.items);

    allLines.push(...lines);

    // Fix hyphenated line-breaks for flat text
    const pageText = lines.join(" ").replace(/-\s+/g, "").replace(/\s+/g, " ").trim();
    if (pageText) flatParts.push(pageText);

    onProgress?.(p, total);
  }

  const fullText = flatParts.join(" ");
  const chunks   = splitChunks(fullText);
  const sections = groupIntoSections(allLines);

  await dbPut({ docId, chunks, sections, pages: total, extractedAt: Date.now() });
  return { pages: total, chunks: chunks.length, sections: sections.length };
}

export async function isDocExtracted(docId) {
  try { const e = await dbGet(docId); return !!(e?.chunks?.length); } catch { return false; }
}

export async function deleteDocContent(docId) {
  try { await dbDel(docId); } catch {}
}

// ── Stopwords & tokeniser ─────────────────────────────────────────────────────

const STOPWORDS = new Set([
  "the","and","for","are","was","were","this","that","with","have","from","they","their",
  "which","what","when","where","how","why","been","will","also","more","some","into",
  "its","but","can","not","all","our","about","than","such","other","after","before",
  "over","under","between","through","during","each","very","just","then","these","those",
  "here","there","has","had","him","her","his","she","per","may","said","only","even",
  "both","made","make","like","any","would","could","should","shall","upon","across",
]);

function tokenise(text) {
  return text.toLowerCase().split(/\W+/).filter(w => w.length > 2 && !STOPWORDS.has(w));
}

function topicScore(text, topicTokens) {
  const lower = text.toLowerCase();
  return topicTokens.reduce((s, w) => {
    const re = new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "g");
    return s + (lower.match(re) || []).length;
  }, 0);
}

// ── Section phrase config for note generation (unchanged API) ─────────────────

const SEC = {
  definition:   { phrases: ["is defined as","refers to","means ","definition of","can be defined","classified as","types of"], words: ["definition","defined","meaning","concept","refers","types","classification"] },
  background:   { phrases: ["history of","historical background","origin of","was established","dates back","since independence","evolution of"], words: ["history","historical","founded","evolution","origin","colonial","independence","century"] },
  context:      { phrases: ["current scenario","present situation","in recent years","recent developments","as per the","at present"], words: ["current","present","today","recent","contemporary","2020","2021","2022","2023","2024"] },
  constitution: { phrases: ["article ","constitution of india","fundamental right","directive principle","constitutional provision","under the constitution"], words: ["article","constitution","constitutional","amendment","fundamental","schedule","right"] },
  legal:        { phrases: ["act of ","under the act","section ","uapa","pota","tada","afspa","national security act"], words: ["act","law","legal","legislation","section","rule","regulation","statute","provision","penalty"] },
  schemes:      { phrases: ["government launched","the scheme","ministry of","national mission","launched in","yojana","welfare scheme"], words: ["scheme","programme","mission","policy","initiative","launched","ministry","yojana","project","budget"] },
  data:         { phrases: ["according to","as per","data shows","statistics reveal","survey found","report states","per cent","% of"], words: ["percent","%","crore","lakh","million","rank","index","statistics","data","growth","rate"] },
  challenges:   { phrases: ["major challenge","key challenge","challenges include","problems of","issues of","concerns about","threats include"], words: ["challenge","problem","issue","threat","concern","barrier","obstacle","failure","gap","weakness"] },
  causes:       { phrases: ["causes of","reasons for","factors behind","root cause","due to","because of","leads to","resulted in"], words: ["cause","reason","factor","root","origin","trigger","due","because","leads","result"] },
  impacts:      { phrases: ["impact of","effects of","consequences of","has led to","results in","impact on","effect on"], words: ["impact","effect","consequence","outcome","result","affect","influence","benefit","harm","damage"] },
  committees:   { phrases: ["committee on","commission on","task force on","recommendations of","report of","chaired by"], words: ["committee","commission","panel","task force","recommendation","report","appointed"] },
  judgements:   { phrases: ["supreme court","high court","court held","court ruled","court observed","landmark judgment"], words: ["court","supreme","judgment","judgement","ruling","verdict","case","bench","ngt","held"] },
  intl:         { phrases: ["international experience","global best practice","unlike india","united nations","sdg goal","global convention"], words: ["international","global","world","foreign","bilateral","un ","sdg","treaty","agreement","compare"] },
  casestudies:  { phrases: ["for example","for instance","case of","example of","experience of","success story","case study"], words: ["example","case","instance","model","success","experience","district","illustration"] },
  india:        { phrases: ["in india","indian context","government of india","at the national level"], words: ["india","indian","domestic","national","centre","union","states","federal","parliament"] },
  rajasthan:    { phrases: ["in rajasthan","rajasthan government","rajasthan state","rajasthan model"], words: ["rajasthan","desert","border","tribal","aravalli","jaipur"] },
  ethics:       { phrases: ["ethical dimension","moral dimension","values of","ethical concern","civil servant","ethical dilemma"], words: ["ethics","ethical","value","moral","integrity","probity","duty","dilemma","virtue"] },
  wayforward:   { phrases: ["way forward","need to","should be","must ensure","recommendation","suggested measures","steps to be taken"], words: ["solution","suggest","recommend","reform","improve","future","action","strategy","measure","step"] },
  conclusion:   { phrases: ["in conclusion","to conclude","in summary","thus it","therefore it","significance of","importance of"], words: ["conclusion","summary","significance","importance","essential","imperative","require","thus","therefore"] },
};

function scoreText(lower, phrases, words) {
  let score = 0;
  for (const p of phrases) if (lower.includes(p)) score += 5;
  for (const w of words)   if (lower.includes(w)) score += 1;
  return score;
}

function extractSentences(chunks, cfg, topicWords, maxWords = 80) {
  const { phrases, words } = cfg;
  const scored = chunks.map(chunk => {
    const lower    = chunk.toLowerCase();
    const topicHit = topicWords.reduce((s, w) =>
      s + (lower.match(new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "g")) || []).length, 0);
    return { chunk, score: scoreText(lower, phrases, words) * 3 + topicHit };
  });
  scored.sort((a, b) => b.score - a.score);

  const topText   = scored.slice(0, 3).map(c => c.chunk).join(" ");
  const sentences = topText
    .replace(/\.\s+([A-Z])/g, ".\n$1")
    .split(/\n/)
    .map(s => s.trim())
    .filter(s => s.length > 25);

  const sentScored = sentences.map(s => {
    const lower    = s.toLowerCase();
    const topicHit = topicWords.reduce((sc, w) =>
      sc + (lower.match(new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "g")) || []).length, 0);
    return { s, score: scoreText(lower, phrases, words) * 4 + topicHit * 2 };
  }).filter(x => x.score > 0);

  sentScored.sort((a, b) => b.score - a.score);
  let wc = 0;
  const kept = [];
  for (const { s } of sentScored) {
    if (kept.includes(s)) continue;
    const w = s.split(/\s+/).length;
    if (wc + w > maxWords + 15) continue;
    kept.push(s); wc += w;
    if (wc >= maxWords) break;
  }
  return kept.join(" ");
}

// ── Note generation search (existing API, unchanged) ─────────────────────────

export async function searchPdfContent(docIds, topic, customSections = null) {
  if (!docIds || !docIds.length) return {};
  const topicWords = tokenise(topic);
  if (!topicWords.length) return {};

  const candidates = [];
  for (const docId of docIds) {
    try {
      const entry = await dbGet(docId);
      if (!entry?.chunks) continue;
      for (const chunk of entry.chunks) {
        const ts = topicScore(chunk, topicWords);
        if (ts >= 2) candidates.push({ chunk, topicScore: ts });
      }
    } catch {}
  }

  if (!candidates.length) return {};
  candidates.sort((a, b) => b.topicScore - a.topicScore);
  const pool = candidates.slice(0, 120).map(c => c.chunk);

  const result = {};
  if (customSections) {
    for (const s of customSections) {
      const cfg  = { phrases: s.pdfKeyPhrases || [], words: s.pdfWords || [] };
      const text = extractSentences(pool, cfg, topicWords, 80);
      if (text.trim().length >= 50) result[s.id] = text;
    }
  } else {
    for (const [sid, cfg] of Object.entries(SEC)) {
      const text = extractSentences(pool, cfg, topicWords, 80);
      if (text.trim().length >= 50) result[sid] = text;
    }
  }
  return result;
}

// ── Answer generation search (new: section-aware) ────────────────────────────

// answerDimensions: [{id, label, hints}]  — the sections of the answer being built
// Returns: {[dimId]: { bullets: string[], source: "pdf"|"none" }}
export async function searchPdfForAnswer(docIds, topic, answerDimensions) {
  if (!docIds || !docIds.length) return {};

  const topicTokens = tokenise(topic);
  if (!topicTokens.length) return {};

  // ── Pass 1: collect topic-relevant sections from all docs ──────────────────
  const pool = [];   // [{heading, text, bullets, topicScore}]

  for (const docId of docIds) {
    try {
      const entry = await dbGet(docId);
      if (!entry) continue;

      if (entry.sections && entry.sections.length) {
        // New format: heading-grouped sections
        for (const sec of entry.sections) {
          const ts = topicScore(sec.text, topicTokens) * 2
                   + topicScore(sec.heading, topicTokens) * 3;
          if (ts >= 1) pool.push({ ...sec, ts });
        }
      } else if (entry.chunks) {
        // Legacy format: flat chunks — convert to pseudo-sections
        for (const chunk of entry.chunks) {
          const ts = topicScore(chunk, topicTokens);
          if (ts >= 2) pool.push({ heading: "Content", text: chunk, bullets: [chunk], ts });
        }
      }
    } catch {}
  }

  if (!pool.length) return {};
  pool.sort((a, b) => b.ts - a.ts);
  const topSections = pool.slice(0, 60);

  // ── Pass 2: for each answer dimension, find best-matching section ──────────
  const result = {};

  for (const dim of answerDimensions) {
    const dimTokens = tokenise(dim.label + " " + (dim.hints || ""));

    let best = { score: -1, sec: null };

    for (const sec of topSections) {
      // Heading match scores very high (coaching material stores dimension under exact heading)
      const headTokens = tokenise(sec.heading);
      const headOverlap = dimTokens.filter(t => headTokens.some(h => h.startsWith(t) || t.startsWith(h))).length;
      const textOverlap = dimTokens.reduce((s, t) => s + (sec.text.toLowerCase().includes(t) ? 1 : 0), 0);

      const score = headOverlap * 8 + textOverlap + sec.ts;
      if (score > best.score) best = { score, sec };
    }

    if (best.sec && best.score >= 2) {
      // Pull best 4-6 bullets from this section (respecting word limit per dimension)
      const bullets = best.sec.bullets || [best.sec.text];
      const scoredBullets = bullets.map(b => ({
        b,
        s: tokenise(b).filter(t => dimTokens.includes(t) || topicTokens.some(tt => b.toLowerCase().includes(tt))).length,
      })).sort((a, b2) => b2.s - a.s);

      const selected = [];
      let wc = 0;
      for (const { b } of scoredBullets) {
        const w = b.split(/\s+/).length;
        if (wc + w > 80) continue;
        selected.push(b); wc += w;
        if (selected.length >= 5) break;
      }

      if (selected.length) {
        result[dim.id] = { bullets: selected, source: "pdf" };
      }
    }
  }

  return result;
}

// ── Topic suggestions (for PDF Library mapping) ───────────────────────────────

export async function getTopicSuggestions(docIds) {
  if (!docIds || !docIds.length) return [];
  const freq = new Map();

  for (const docId of docIds) {
    try {
      const entry = await dbGet(docId);
      if (!entry) continue;

      // Prefer heading-based suggestions (much cleaner than regex on raw chunks)
      if (entry.sections && entry.sections.length) {
        for (const sec of entry.sections) {
          const h = sec.heading.trim();
          if (h.length >= 6 && h.length <= 70 && !/^(content|introduction|conclusion|summary)$/i.test(h)) {
            freq.set(h, (freq.get(h) || 0) + 2);
          }
        }
      }

      // Also scan first 50 chunks for recurring title-case phrases
      const sample = (entry.chunks || []).slice(0, 50);
      for (const chunk of sample) {
        const matches = chunk.match(/\b[A-Z][a-z]{1,20}(?:\s+[A-Z][a-z]{1,20}){1,5}\b/g) || [];
        for (const m of matches) {
          const t = m.trim();
          if (t.length < 8 || t.length > 70 || t.split(/\s+/).length < 2) continue;
          if (STOPWORDS.has(t.split(/\s+/)[0].toLowerCase())) continue;
          freq.set(t, (freq.get(t) || 0) + 1);
        }
      }
    } catch {}
  }

  return [...freq.entries()]
    .filter(([, c]) => c >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .map(([phrase]) => phrase);
}
