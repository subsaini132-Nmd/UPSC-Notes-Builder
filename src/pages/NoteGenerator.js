import React, { useState } from "react";
import { SAMPLE_TOPICS, NOTE_SECTIONS, GS_TAGS } from "../lib/constants";

const TODAY = "2026-06-20";

function detectGs(topic) {
  const t = topic.toLowerCase();
  if (/history|heritage|culture|art|society|social|gender|women|tribe|tribal|geography|river|climate|disaster|flood/.test(t)) return "gs1";
  if (/polity|governance|constitution|parliament|federal|rights|welfare|international|policy|scheme|foreign|bilateral/.test(t)) return "gs2";
  if (/economy|agriculture|food|energy|infrastructure|technology|science|environment|biodiversity|security|cyber|digital/.test(t)) return "gs3";
  if (/ethics|integrity|attitude|aptitude|corruption|probity|emotional|case study/.test(t)) return "gs4";
  return "gs2";
}

const SECTION_TEMPLATES = {
  definition:   (topic) => `${topic} refers to the process, concept, or phenomenon that encompasses [expand with formal definitions]. Key definitional frameworks include those from international bodies (UN, UNDP, World Bank) and Indian statutory definitions. Constitutional and legal interpretations further shape its scope.`,
  background:   (topic) => `The historical evolution of ${topic} in India traces several phases. Pre-independence roots, colonial-era policy interventions, Constituent Assembly deliberations, and post-1991 reforms each shaped the contemporary understanding. Key milestones and turning points are: [list with dates and significance].`,
  context:      (topic) => `The current context of ${topic} is shaped by: (1) domestic policy priorities, (2) global commitments and SDG targets, and (3) socio-economic pressures. Recent data and reports [cite NITI Aayog, Economic Survey, CAG] indicate [key statistics and trends relevant to ${topic}].`,
  constitution: (topic) => `Constitutional provisions governing ${topic}: Fundamental Rights (Part III), Directive Principles of State Policy (Part IV), and Fundamental Duties (Part IVA) together create the normative framework. Relevant Articles include [list Articles]. The 42nd, 44th, 73rd, 74th, and 86th Constitutional Amendments have progressively strengthened this framework.`,
  legal:        (topic) => `The legislative architecture for ${topic} comprises [key Acts, Rules, and Regulations]. Important statutory bodies and their mandates include [list]. Recent amendments and their implications: [describe changes]. Pending legislative gaps that require attention: [identify].`,
  schemes:      (topic) => `Government schemes and programmes addressing ${topic}: Central Sector Schemes (100% central funding) — [list]. Centrally Sponsored Schemes (shared) — [list]. State-specific initiatives — [mention best practices]. Key data on coverage, beneficiaries, and outcomes: [add from Economic Survey, PIB, Ministry reports].`,
  data:         (topic) => `Key statistics and data on ${topic} (cite sources):\n• India's ranking in global indices: [rank, index name, year]\n• Domestic indicators: [metric, value, year, source]\n• State-wise variation: [top/bottom states]\n• Trend over time: [improvement/deterioration with data]\n• Target vs. achievement: [scheme targets vs. actuals]`,
  challenges:   (topic) => `Major challenges in ${topic}:\n1. Structural: [deep-rooted systemic issues]\n2. Institutional: [governance gaps, capacity constraints]\n3. Financial: [resource mobilisation, leakages]\n4. Social/cultural: [behavioural and attitudinal barriers]\n5. Implementation: [last-mile delivery, monitoring gaps]\n6. Coordination: [centre-state, inter-ministry conflicts]\n7. Data: [measurement gaps, underreporting]`,
  causes:       (topic) => `Root causes of issues in ${topic} can be mapped across four dimensions:\n• Historical: [colonial legacy, policy neglect]\n• Economic: [resource constraints, market failures]\n• Social: [inequality, discrimination, exclusion]\n• Institutional: [regulatory gaps, weak enforcement, corruption]`,
  impacts:      (topic) => `Impacts of ${topic} span multiple dimensions:\n• Economic: [GDP, employment, productivity effects]\n• Social: [equity, health, education outcomes]\n• Environmental: [ecological consequences if applicable]\n• Political: [governance, security implications]\n• International: [India's global commitments and standing]`,
  committees:   (topic) => `Key committees and commissions on ${topic}:\n[Committee/Commission name (Year)] — Chairperson — Key recommendations\n[Committee name (Year)] — Chairperson — Key recommendations\nParliamentary Standing Committee reports and CAG audit findings should also be cited here.`,
  judgements:   (topic) => `Landmark Supreme Court and High Court judgements on ${topic}:\n• [Case name v. State/UoI (Year)]: Holding and significance\n• [Case name (Year)]: Key ratio decidendi\nNational Green Tribunal / NCLAT / NCLT orders (where applicable): [cite]`,
  intl:         (topic) => `International perspectives and comparisons on ${topic}:\n• Global best practices: [Country — model — outcomes]\n• International frameworks: [Treaty/Convention — India's obligations]\n• UN SDG linkages: [Goal number and target]\n• India's global commitments: [bilateral/multilateral agreements]\n• Comparative data: [India's position vs. peers]`,
  casestudies:  (topic) => `Case studies illustrating ${topic}:\n1. [State/District/Programme name]: Context → Intervention → Outcome → Lesson\n2. [State/District/Programme name]: Context → Intervention → Outcome → Lesson\n3. International: [Country]: What India can learn\nThese examples should be drawn from official reports, newspaper accounts, and academic sources.`,
  india:        (topic) => `India-specific dimensions of ${topic}:\n• Federal dynamics: Centre-state tensions and cooperative mechanisms\n• Regional variations: North-South, urban-rural, tribal-mainstream divides\n• India's unique context: [size, diversity, democracy, development stage]\n• Constitutional uniqueness: [specific to India's framework]\n• Demographic dividend and its relevance to ${topic}`,
  rajasthan:    (topic) => `Rajasthan-specific context of ${topic}:\n• State-level data and indicators: [cite State Economic Survey, NFHS-5 Rajasthan factsheet]\n• Key challenges specific to Rajasthan: [arid geography, tribal areas, border districts]\n• State government initiatives: [Rajasthan Budget, specific schemes]\n• Best practices from Rajasthan: [district-level success stories]\n• Areas requiring improvement: [gaps with national benchmarks]`,
  ethics:       (topic) => `Ethical dimensions of ${topic}:\n• Values at stake: [dignity, equity, justice, sustainability, accountability]\n• Philosophical frameworks:\n  – Utilitarian: [greatest good analysis]\n  – Deontological (Kantian): [duty and rights-based analysis]\n  – Virtue ethics: [character and integrity angle]\n• Ethical dilemmas in ${topic}: [competing values and how to balance]\n• Role of civil servants: [GS IV relevance — integrity, impartiality, empathy]`,
  anthro:       (topic) => `Anthropological perspective on ${topic}:\n• Cultural dimension: How different communities understand and experience ${topic}\n• Tribal communities: Special vulnerabilities and resistances of Scheduled Tribes\n• Caste and ${topic}: How caste hierarchy intersects with the issue\n• Folk knowledge and indigenous practices: [relevance to ${topic}]\n• Theoretical lens (optional): [Functionalism / Structuralism / Applied Anthropology angle]`,
  conclusion:   (topic) => `Way forward on ${topic}:\n1. Short-term: [Immediate policy/administrative actions, within 1–2 years]\n2. Medium-term: [Legislative reforms, institutional strengthening, within 5 years]\n3. Long-term: [Structural transformation, social change, SDG 2030 alignment]\n\nKey stakeholders: Government (Centre + State) | Civil society | Private sector | International community\n\nConclusion: ${topic} demands an integrated, multi-stakeholder approach that bridges the gap between policy intent and ground-level reality. The time to act is now.`,
};

function generateContent(topic, gs, selectedSections) {
  const sections = {};
  selectedSections.forEach(sectionId => {
    const template = SECTION_TEMPLATES[sectionId];
    sections[sectionId] = template ? template(topic) : `[Add your notes on ${topic} — ${sectionId} — here]`;
  });
  const noteSection = NOTE_SECTIONS.find(s => s.id === selectedSections[0]);
  return {
    topic,
    gs,
    date: TODAY,
    wordCount: selectedSections.length * 80,
    sections,
  };
}

export default function NoteGenerator({ onNavigate, onCreateNote }) {
  const [topic, setTopic]       = useState("");
  const [gsPaper, setGsPaper]   = useState("auto");
  const [step, setStep]         = useState("input");
  const [selected, setSelected] = useState(NOTE_SECTIONS.map(s => s.id));

  const toggleSection = (id) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const handleGenerate = () => {
    if (!topic.trim()) return;
    setStep("generating");

    setTimeout(() => {
      const resolvedGs = gsPaper === "auto" ? detectGs(topic) : gsPaper;
      const noteId     = `note-${Date.now()}`;
      const meta = {
        id:        noteId,
        topic:     topic.trim(),
        gs:        resolvedGs,
        wordCount: selected.length * 80,
        date:      TODAY,
        sections:  selected.length,
        status:    "draft",
      };
      const content = generateContent(topic.trim(), resolvedGs, selected);

      if (onCreateNote) {
        onCreateNote(meta, content);
      } else {
        onNavigate("notes");
      }
    }, 2200);
  };

  if (step === "generating") {
    return (
      <div className="page generating-page">
        <div className="generating-card">
          <div className="generating-spinner" />
          <div className="generating-topic">{topic}</div>
          <div className="generating-label">Searching your PDFs for relevant content…</div>
          <div className="generating-steps">
            {["Embedding topic query", "Retrieving top 20 chunks", "Sending context to Claude", "Structuring 22 sections"].map((s, i) => (
              <div key={s} className="gen-step">
                <div className="gen-step-dot active" style={{ animationDelay: `${i * 0.4}s` }} />
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
          <p className="page-eyebrow">Note Generator</p>
          <h1 className="page-title">Generate a UPSC Mains Note</h1>
        </div>
      </div>

      {/* Topic input */}
      <div className="gen-input-card">
        <label className="gen-field-label">Topic</label>
        <input
          className="gen-input"
          placeholder="e.g. Women Empowerment, Urban Flooding, Climate Change…"
          value={topic}
          onChange={e => setTopic(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleGenerate()}
        />
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
            <label className="gen-field-label">Source PDFs</label>
            <select className="gen-select">
              <option>All indexed PDFs (6 sources)</option>
              <option>Economic Survey only</option>
              <option>Current Affairs only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section selector */}
      <div className="gen-section-card">
        <div className="gen-section-header">
          <div className="gen-section-title">Sections to Include</div>
          <div className="gen-section-actions">
            <button className="gen-link" onClick={() => setSelected(NOTE_SECTIONS.map(s => s.id))}>Select all</button>
            <span>·</span>
            <button className="gen-link" onClick={() => setSelected([])}>Clear</button>
            <span className="gen-section-count">{selected.length}/{NOTE_SECTIONS.length} selected</span>
          </div>
        </div>
        <div className="section-picker-grid">
          {NOTE_SECTIONS.map(s => (
            <label key={s.id} className={`section-picker-item ${selected.includes(s.id) ? "picked" : ""}`}>
              <input type="checkbox" checked={selected.includes(s.id)} onChange={() => toggleSection(s.id)} />
              <span className="sp-icon">{s.icon}</span>
              <span className="sp-label">{s.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Generate */}
      <div className="gen-footer">
        <div className="gen-footer-info">
          <span className="gen-footer-icon">🔍</span>
          Will search <strong>6,168 chunks</strong> across 4 indexed PDFs
        </div>
        <button
          className="primary-btn large"
          onClick={handleGenerate}
          disabled={!topic.trim() || selected.length === 0}
        >
          ✦ Generate Note ({selected.length} sections)
        </button>
      </div>
    </div>
  );
}
