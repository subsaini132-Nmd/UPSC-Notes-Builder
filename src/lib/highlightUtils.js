// Shared keyword-highlight utility
// Three visual categories:
//   ev-yw       → yellow : numbers, stats, reports, schemes, articles, keywords
//   ev-yw-name  → orange : personality names, institution names
//   ev-yw-quote → blue   : text inside quotation marks

export function applyKwHighlights(rawText) {
  const e = rawText
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const matches = [];
  const scan = (re, cls = "ev-yw") => {
    let m;
    const r = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
    while ((m = r.exec(e)) !== null)
      matches.push({ start: m.index, end: m.index + m[0].length, cls });
  };

  // ── QUOTES (highest priority — wrap entire phrase) ────────────────────────
  scan(/["“‘][^"“”‘’\n]{8,300}["”’]/g, "ev-yw-quote");

  // ── PERSONALITY NAMES ─────────────────────────────────────────────────────
  scan(/\b(Mahatma\s+Gandhi|M\.?\s*K\.?\s*Gandhi|Jawaharlal\s+Nehru|Pandit\s+Nehru|B\.?\s*R\.?\s*Ambedkar|Babasaheb\s+Ambedkar|Dr\.?\s+Ambedkar|Subhas\s+Chandra\s+Bose|Netaji|Bal\s+Gangadhar\s+Tilak|Lokmanya\s+Tilak|Gopal\s+Krishna\s+Gokhale|Bhagat\s+Singh|Chandrashekhar\s+Azad|Sardar\s+(?:Vallabhbhai\s+)?Patel|Vallabhbhai\s+Patel|Rajendra\s+Prasad|A\.?\s*P\.?\s*J\.?\s*Abdul\s+Kalam|Dr\.?\s+Kalam|Abdul\s+Kalam|Vikram\s+Sarabhai|C\.?\s*V\.?\s*Raman|Homi\s+(?:J\.?\s*)?Bhabha|Jagadish\s+Chandra\s+Bose|Swami\s+Vivekananda|Rabindranath\s+Tagore|Gurudev\s+Tagore|Sri\s+Aurobindo|Raja\s+Ram\s+Mohan\s+Roy|Dayananda\s+Saraswati|Lal\s+Bahadur\s+Shastri|Indira\s+Gandhi|Rajiv\s+Gandhi|Manmohan\s+Singh|Atal\s+Bihari\s+Vajpayee|Abraham\s+Lincoln|Nelson\s+Mandela|Martin\s+Luther\s+King(?:\s+Jr\.?)?|Albert\s+Einstein|Isaac\s+Newton|Winston\s+Churchill|Franklin\s+D\.?\s*Roosevelt|John\s+F\.?\s*Kennedy|Machiavelli|Plato|Aristotle|Socrates|Jean-?Jacques\s+Rousseau|Karl\s+Marx|Friedrich\s+Engels|John\s+Locke|Thomas\s+Hobbes|Voltaire|Montesquieu|Charles\s+Darwin|Amartya\s+Sen|Jean\s+Dr[eè]ze|Raghuram\s+Rajan|Malala\s+Yousafzai|Kalpana\s+Chawla|Mother\s+Teresa)\b/gi, "ev-yw-name");

  // ── INSTITUTION NAMES ─────────────────────────────────────────────────────
  scan(/\b(Supreme\s+Court(?:\s+of\s+India)?|High\s+Court|Parliament(?:\s+of\s+India)?|Lok\s+Sabha|Rajya\s+Sabha|Reserve\s+Bank\s+of\s+India|RBI|SEBI|Securities\s+and\s+Exchange\s+Board|Comptroller\s+and\s+Auditor\s+General|Central\s+Vigilance\s+Commission|CVC|Central\s+Bureau\s+of\s+Investigation|CBI|National\s+Human\s+Rights\s+Commission|NHRC|Election\s+Commission(?:\s+of\s+India)?|UPSC|Union\s+Public\s+Service\s+Commission|ISRO|Indian\s+Space\s+Research\s+Organisation|DRDO|BARC|IITs?|IIMs?|AIIMS|NITs?|United\s+Nations|UNESCO|WHO|WTO|IMF|World\s+Bank|Asian\s+Development\s+Bank|ADB|UNDP|UNICEF|FAO|UNEP|International\s+Monetary\s+Fund|World\s+Health\s+Organization|World\s+Trade\s+Organization|G20|G7|BRICS|SCO|SAARC|ASEAN|NAM|Non-?Aligned\s+Movement|Interpol|ICC|ICJ|FICCI|CII|NASSCOM|ASSOCHAM|National\s+Commission\s+for\s+Women|NCW|Forest\s+Survey\s+of\s+India|Wildlife\s+Institute\s+of\s+India|WII|National\s+Tiger\s+Conservation\s+Authority|NTCA|Central\s+Pollution\s+Control\s+Board|CPCB|National\s+Green\s+Tribunal|NGT|Planning\s+Commission|NITI\s+Aayog|Ministry\s+of\s+(?:Finance|Home\s+Affairs|External\s+Affairs|Education|Environment|Agriculture|Health))\b/gi, "ev-yw-name");

  // ── NUMBERS & STATISTICS ──────────────────────────────────────────────────
  scan(/(₹\s*[\d,]+(?:\.\d+)?\s*(?:crore|lakh|billion|million|thousand)?|\b[\d,]+(?:\.\d+)?\s*(?:%|crore|lakh|billion|million|thousand|per\s*cent))/gi);

  // ── YEARS ─────────────────────────────────────────────────────────────────
  scan(/\b(?:19|20)\d{2}(?:-\d{2,4})?\b/g);

  // ── REPORTS & INDICES ─────────────────────────────────────────────────────
  scan(/\b(?:Economic\s+Survey\s+[\d-]+|NITI\s+Aayog(?:\s+(?:Report|data|figure|index))?\s*\d{0,4}|2nd\s+ARC(?:\s+\d{4})?|(?:1st|2nd|3rd)\s+ARC|CAG\s+(?:Report|Audit)?(?:\s+\d{4})?|World\s+Bank\s+Report|Global\s+Hunger\s+Index|Human\s+Development\s+Index|HDI|FSI\s+\d{4}|India\s+State\s+of\s+Forest\s+Report|Ease\s+of\s+Doing\s+Business)\b/gi);

  // ── COMMITTEES & COMMISSIONS ──────────────────────────────────────────────
  scan(/\b(?:Naresh\s+Chandra\s+Committee|NOLAN\s+Committee|Sarkaria\s+Commission|Punchhi\s+Commission|Kothari\s+Commission|Balwantrai\s+Mehta\s+Committee|Vishakha\s+(?:Guidelines|Committee|case)|Law\s+Commission(?:\s+of\s+India)?|Pay\s+Commission|Finance\s+Commission|Forest\s+Advisory\s+Committee|National\s+Board\s+for\s+Wildlife)\b/gi);

  // ── LANDMARK JUDGMENTS ────────────────────────────────────────────────────
  scan(/\b(?:Vishakha\s+v\.?\s+State\s+of\s+Rajasthan|Kesavananda\s+Bharati|Maneka\s+Gandhi\s+case|S\.?\s*R\.?\s*Bommai|Minerva\s+Mills|T\.?M\.?\s*A\.?\s*Pai|Indra\s+Sawhney)\b/gi);

  // ── SCHEMES, ACTS & POLICIES ──────────────────────────────────────────────
  scan(/\b(?:MGNREGS|PM-KISAN|PM\s+KISAN|Swachh\s+Bharat\s+Mission|Smart\s+Cities\s+Mission|PMGSY|Ayushman\s+Bharat|PMJDY|Jan\s+Dhan\s+Yojana|PMAY|PM\s+Awas\s+Yojana|Jal\s+Jeevan\s+Mission|Digital\s+India|Skill\s+India|Make\s+in\s+India|NEP\s+2020|RTI\s+Act|IPC|CrPC|POCSO|Forest\s+Conservation\s+Act|Wildlife\s+Protection\s+Act|Biological\s+Diversity\s+Act|CAMPA|Project\s+Tiger|Tiger\s+Reserves?|Forest\s+Rights\s+Act|National\s+Forest\s+Policy|NAPCC)\b/gi);

  // ── CONSTITUTIONAL REFERENCES ─────────────────────────────────────────────
  scan(/\b(?:Article\s+\d+[A-Za-z]?(?:\([a-z0-9]\))?|Schedule\s+[IVX]+|Directive\s+Principles|Fundamental\s+(?:Rights|Duties)|Part\s+(?:III|IV|IVA|XIV)|Preamble\s+to\s+the\s+Constitution)\b/gi);

  // ── UPSC ANALYTICAL KEYWORDS ──────────────────────────────────────────────
  scan(/\b(?:good\s+governance|accountability|transparency|rule\s+of\s+law|sustainable\s+development|inclusive\s+growth|constitutional\s+morality|judicial\s+review|social\s+justice|gender\s+equality|grassroots\s+democracy|cooperative\s+federalism|probity\s+in\s+public\s+life|ecological\s+security|carbon\s+neutrality|net[- ]zero|biodiversity|climate\s+change|global\s+warming|deforestation|afforestation|reforestation|green\s+economy|demographic\s+dividend)\b/gi);

  // Sort by start; prefer longer match at same start; de-overlap
  matches.sort((a, b) => a.start - b.start || b.end - a.end);
  const kept = [];
  let tail = 0;
  for (const m of matches) {
    if (m.start >= tail) { kept.push(m); tail = m.end; }
  }

  let out = "", pos = 0;
  for (const m of kept) {
    out += e.slice(pos, m.start);
    out += `<mark class="${m.cls}">${e.slice(m.start, m.end)}</mark>`;
    pos = m.end;
  }
  return out + e.slice(pos);
}

// Converts a multi-line essay paragraph to highlighted HTML
export function highlightEssayPara(text) {
  return text
    .split("\n")
    .map(line => applyKwHighlights(line))
    .join("<br>");
}
