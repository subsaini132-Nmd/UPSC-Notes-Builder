import React, { useState, useMemo } from "react";
import { SAMPLE_PYQS, GS_TAGS } from "../lib/constants";

const WORD_LIMITS = [
  { val: 150,  label: "150 words",  hint: "10-mark questions" },
  { val: 250,  label: "250 words",  hint: "15-mark questions" },
  { val: 500,  label: "500 words",  hint: "20-mark / essay section" },
  { val: 1000, label: "1000 words", hint: "Full essay" },
];

const SAMPLE_ANSWERS = {
  150: `Self-Help Groups (SHGs) are voluntary associations of 10–20 women from homogeneous backgrounds who collectively save and provide credit to members. India's SHG-Bank Linkage Programme has created the world's largest microfinance ecosystem with 10 crore women across 90 lakh groups.

Economically, SHGs enable micro-credit access without collateral. Socially, group dynamics build confidence and reduce domestic violence (NFHS-5 data). Politically, SHG networks have become incubators of grassroots leadership, with several members transitioning to Panchayat elections.

Government schemes like DAY-NRLM have strengthened SHGs substantially — disbursing ₹2.2 lakh crore in credit in 2023–24. Challenges like proxy leadership, weak market linkages, and low financial literacy remain. Strengthening SHG federations and integrating them with digital platforms like GEM will maximise their transformative potential.`,

  250: `Self-Help Groups (SHGs) are voluntary associations of 10–20 women from homogeneous backgrounds who pool savings and provide credit to members. India's SHG-Bank Linkage Programme, launched in 1992, has created the world's largest microfinance ecosystem — 10 crore women across 90 lakh groups (NRLM 2024).

Economic Empowerment: SHGs enable women to access micro-credit without collateral, enabling income-generating activities. Kerala's Kudumbashree programme — 4.7 million women — collectively generates over ₹5,000 crore annually. Mudra Yojana reports 68% women borrowers.

Social Empowerment: Group dynamics build confidence, decision-making capacity, and social capital. NFHS-5 data shows SHG members are more likely to make household financial decisions independently and report lower rates of domestic violence.

Political Empowerment: SHG networks serve as incubators for grassroots political participation. Studies (EPW 2021) show higher panchayat voter turnout in SHG-saturation areas; several SHG leaders have transitioned to elected positions.

Government Impact: DAY-NRLM targets universal SHG coverage in rural India. In 2023–24, SHG-Bank linkage disbursed ₹2.2 lakh crore — a record. Schemes like Lakhpati Didi target 3 crore SHG women earning above ₹1 lakh annually by 2025.

While SHGs have transformed women's economic and social landscape, challenges like leader capture, irregular loan repayment, and limited market linkages persist. Strengthening SHG federations, digital financial literacy, and market access via GEM and PM Vishwakarma can make SHGs the backbone of Viksit Bharat's grassroots economy.`,

  500: `Self-Help Groups (SHGs) — voluntary associations of 10–20 women from homogeneous backgrounds — represent one of India's most transformative instruments of women's empowerment. Since the National Bank for Agriculture and Rural Development (NABARD) launched the SHG-Bank Linkage Programme in 1992, India has built the world's largest microfinance ecosystem: over 10 crore women organised in 90 lakh groups, with cumulative credit disbursement of ₹26.34 lakh crore (NRLM 2024).

**Economic Empowerment**
SHGs provide micro-credit without collateral — a revolutionary departure from formal banking which historically excluded rural women. Members pool small savings (typically ₹100–500/month) and lend internally at affordable rates, financing agriculture, animal husbandry, cottage industries, and trade. Kerala's Kudumbashree programme — the world's largest women-led poverty eradication initiative — demonstrates the scale possible: 4.7 million women generating over ₹5,000 crore annually. PM Mudra Yojana reports 68% of beneficiaries are women, with MUDRA loans of ₹7.95 lakh crore disbursed by 2023.

**Social Empowerment**
Beyond finance, SHGs serve as social capital builders. Regular group meetings, peer accountability, and collective decision-making build confidence and communication skills. NFHS-5 data shows SHG members are significantly more likely to make independent household financial decisions and report lower rates of domestic violence — group solidarity creates a protective social network. Literacy and health awareness campaigns run through SHGs have improved maternal health, immunisation coverage, and nutritional outcomes.

**Political Empowerment**
SHG networks function as grassroots political incubators. Studies (EPW, 2021) show higher voter turnout in panchayat elections in areas with SHG saturation. Several SHG leaders have successfully transitioned to elected Gram Panchayat positions, bringing a gender-responsive lens to local governance — prioritising water supply, sanitation, schools, and healthcare over pure infrastructure, as documented in MIT studies on West Bengal panchayats.

**Government Schemes: Impact Assessment**
The Deen Dayal Antyodaya Yojana-National Rural Livelihoods Mission (DAY-NRLM) targets universal SHG coverage in rural India, with SHG-Bank linkage disbursing a record ₹2.2 lakh crore in 2023–24. The Lakhpati Didi initiative targets 3 crore SHG women earning above ₹1 lakh annually by 2025. PM Vishwakarma and GEM portals are being integrated with SHG networks for market access.

**Challenges**
Leader capture and proxy leadership dilute democratic functioning. Irregular loan repayment, especially post-COVID, has weakened some groups. Limited market linkages constrain income scaling beyond subsistence. Digital and financial literacy gaps persist, especially in tribal and remote areas. The urban SHG ecosystem remains underdeveloped relative to rural.

**Way Forward**
Strengthening SHG federations at cluster and block levels, integrating SHGs with digital financial platforms (Jan Dhan, UPI), providing market linkages through GEM, and investing in capacity building through Mahila Shakti Kendras can ensure SHGs deliver on their transformative potential and become the backbone of Viksit Bharat 2047.`,
};

export default function AnswerBuilder({ onNavigate }) {
  const [selectedQ, setSelectedQ]   = useState(null);
  const [customQ, setCustomQ]       = useState("");
  const [wordLimit, setWordLimit]   = useState(250);
  const [mode, setMode]             = useState("select"); // select | custom
  const [generated, setGenerated]   = useState(false);
  const [generating, setGenerating] = useState(false);

  const activeQuestion = mode === "custom"
    ? customQ
    : selectedQ
      ? SAMPLE_PYQS.find(q => q.id === selectedQ)?.question
      : null;

  const answerText = SAMPLE_ANSWERS[wordLimit] || SAMPLE_ANSWERS[250];

  const wordCount = useMemo(() =>
    answerText.split(/\s+/).filter(Boolean).length,
    [answerText]
  );

  const handleGenerate = () => {
    if (!activeQuestion && !customQ) return;
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setGenerated(true); }, 1800);
  };

  const pct = Math.min(100, Math.round((wordCount / wordLimit) * 100));
  const barColor = pct < 85 ? "var(--blue)" : pct < 100 ? "var(--green)" : "var(--red)";

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Answer Builder</p>
          <h1 className="page-title">Generate Word-Limited Answers</h1>
        </div>
        <button className="primary-btn" onClick={() => onNavigate && onNavigate("pyq")}>← PYQ Mapper</button>
      </div>

      <div className="ab-layout">
        {/* Left panel — Question + Settings */}
        <div className="ab-config-panel">
          {/* Mode toggle */}
          <div className="ab-mode-toggle">
            <button className={`ab-mode-btn ${mode === "select" ? "active" : ""}`} onClick={() => setMode("select")}>
              Select from PYQs
            </button>
            <button className={`ab-mode-btn ${mode === "custom" ? "active" : ""}`} onClick={() => setMode("custom")}>
              Custom Question
            </button>
          </div>

          {mode === "select" ? (
            <div className="ab-pyq-list">
              {SAMPLE_PYQS.map(q => {
                const tag = GS_TAGS.find(g => g.id === q.paper);
                return (
                  <div
                    key={q.id}
                    className={`ab-pyq-item ${selectedQ === q.id ? "selected" : ""}`}
                    onClick={() => { setSelectedQ(q.id); setGenerated(false); }}
                  >
                    <div className="ab-pyq-meta">
                      {tag && <span className="gs-pill sm" style={{ background: tag.bg, color: tag.color }}>{tag.label}</span>}
                      <span className="ab-pyq-year">{q.year}</span>
                      <span className="ab-pyq-marks">{q.marks}m</span>
                    </div>
                    <div className="ab-pyq-q">{q.question}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="ab-custom-area">
              <label className="gen-field-label">Enter Your Question</label>
              <textarea
                className="ab-custom-input"
                placeholder="Paste a UPSC Mains question or write your own…"
                value={customQ}
                onChange={e => { setCustomQ(e.target.value); setGenerated(false); }}
                rows={5}
              />
            </div>
          )}

          {/* Word limit */}
          <div className="ab-wl-section">
            <div className="gen-field-label">Word Limit</div>
            <div className="ab-wl-grid">
              {WORD_LIMITS.map(wl => (
                <button
                  key={wl.val}
                  className={`ab-wl-btn ${wordLimit === wl.val ? "active" : ""}`}
                  onClick={() => { setWordLimit(wl.val); setGenerated(false); }}
                >
                  <span className="ab-wl-val">{wl.label}</span>
                  <span className="ab-wl-hint">{wl.hint}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            className="primary-btn large ab-gen-btn"
            onClick={handleGenerate}
            disabled={(!activeQuestion && !customQ.trim()) || generating}
          >
            {generating
              ? "✦ Generating…"
              : generated
                ? "✦ Regenerate Answer"
                : "✦ Generate Answer"
            }
          </button>
        </div>

        {/* Right panel — Answer output */}
        <div className="ab-output-panel">
          {generating && (
            <div className="ab-generating">
              <div className="generating-spinner" />
              <div className="ab-gen-label">Structuring your {wordLimit}-word answer…</div>
              <div className="ab-gen-steps">
                {["Analysing question demand", "Pulling relevant note sections", "Structuring Intro-Body-Conclusion", "Applying UPSC language register"].map((s, i) => (
                  <div key={s} className="gen-step">
                    <div className="gen-step-dot active" style={{ animationDelay: `${i * 0.35}s` }} />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!generating && !generated && (
            <div className="ab-placeholder">
              <div className="ab-placeholder-icon">✍️</div>
              <div className="ab-placeholder-title">Your answer will appear here</div>
              <div className="ab-placeholder-sub">
                Select a question from the PYQ list (or enter your own), choose a word limit, then click Generate.
              </div>
            </div>
          )}

          {!generating && generated && (
            <>
              <div className="ab-output-header">
                <div className="ab-output-title">Generated Answer</div>
                <div className="ab-output-meta">
                  <span className="ab-wc-badge" style={{ color: barColor }}>
                    {wordCount} / {wordLimit} words
                  </span>
                  <button className="viewer-action-btn" onClick={() => navigator.clipboard?.writeText(answerText)}>Copy</button>
                  <button className="viewer-action-btn" onClick={() => window.print()}>Print</button>
                </div>
              </div>

              {/* Word count bar */}
              <div className="ab-wc-bar-wrap">
                <div className="ab-wc-bar">
                  <div className="ab-wc-fill" style={{ width: `${pct}%`, background: barColor }} />
                </div>
                <span className="ab-wc-pct" style={{ color: barColor }}>{pct}%</span>
              </div>

              {/* Question echo */}
              {activeQuestion && (
                <div className="ab-q-echo">
                  <span className="ab-q-echo-label">Q.</span>
                  {activeQuestion}
                </div>
              )}

              {/* Answer body */}
              <div className="ab-answer-body">
                {answerText.split("\n\n").map((para, i) => {
                  if (para.startsWith("**") && para.endsWith("**")) {
                    return <h4 key={i} className="ab-para-heading">{para.replace(/\*\*/g, "")}</h4>;
                  }
                  if (para.match(/^\*\*/)) {
                    const [heading, ...rest] = para.split("\n");
                    return (
                      <div key={i}>
                        <h4 className="ab-para-heading">{heading.replace(/\*\*/g, "")}</h4>
                        {rest.map((r, j) => <p key={j} className="ab-para">{r}</p>)}
                      </div>
                    );
                  }
                  return <p key={i} className="ab-para">{para}</p>;
                })}
              </div>

              {/* UPSC format tip */}
              <div className="ab-tip-box">
                <span className="ab-tip-icon">💡</span>
                <span>UPSC Mains Tip: Answers should have a clear Intro → 3–4 substantive points → Conclusion structure. Use data, examples, and schemes to strengthen each point.</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
