// UPSC Mains Syllabus data + localStorage helpers + doc-to-syllabus mapping

const LS_SYLLABUS  = "upsc_syllabus_v1";
const LS_DOC_MAPS  = "upsc_doc_topic_maps";

// ── Default UPSC Mains syllabus ───────────────────────────────────────────────

export const DEFAULT_SYLLABUS = {
  papers: [
    {
      id: "gs1", label: "GS Paper I",
      color: "#7C3AED", bg: "#F5F3FF",
      desc: "History, Geography & Society",
      topics: [
        { id: "gs1_01", text: "Indian History and Indian National Movement" },
        { id: "gs1_02", text: "Modern Indian History (1757–1947): significant events, personalities, issues" },
        { id: "gs1_03", text: "Freedom struggle — various stages and important contributors/contributions" },
        { id: "gs1_04", text: "Post-independence consolidation and reorganization within the country" },
        { id: "gs1_05", text: "World History: 18th century onwards — world wars, redrawal of national boundaries, colonization, decolonization, political philosophies (communism, capitalism, socialism)" },
        { id: "gs1_06", text: "Indian and World Geography: Physical, Social, Economic geography of India and the World" },
        { id: "gs1_07", text: "Distribution of natural resources across the world (including South Asia and the Indian subcontinent)" },
        { id: "gs1_08", text: "Factors responsible for the location of primary, secondary, and tertiary sector industries" },
        { id: "gs1_09", text: "Important geophysical phenomena: earthquakes, tsunamis, volcanic activity, cyclone, geographical features and their location" },
        { id: "gs1_10", text: "Indian Society: Salient features of Indian society, diversity of India" },
        { id: "gs1_11", text: "Role of women and women's organisations, population and associated issues, poverty and developmental issues" },
        { id: "gs1_12", text: "Urbanization, their problems and their remedies; migration; tribals" },
        { id: "gs1_13", text: "Social empowerment, communalism, regionalism and secularism" },
        { id: "gs1_14", text: "Art and Culture: Salient aspects of Art forms, Literature and Architecture from ancient to modern times" },
        { id: "gs1_15", text: "Changes in critical geographical features (including water-bodies and ice-caps) and in flora and fauna and the effects of such changes" },
      ],
    },
    {
      id: "gs2", label: "GS Paper II",
      color: "#0369A1", bg: "#F0F9FF",
      desc: "Polity, Governance & International Relations",
      topics: [
        { id: "gs2_01", text: "Indian Constitution — historical underpinnings, evolution, features, amendments, significant provisions and basic structure" },
        { id: "gs2_02", text: "Functions and responsibilities of the Union and the States, issues and challenges pertaining to the federal structure" },
        { id: "gs2_03", text: "Devolution of powers and finances up to local levels and challenges therein" },
        { id: "gs2_04", text: "Separation of powers between various organs, dispute redressal mechanisms and institutions" },
        { id: "gs2_05", text: "Parliament and State Legislatures — structure, functioning, conduct of business, powers and privileges" },
        { id: "gs2_06", text: "Structure, organization and functioning of the Executive and the Judiciary; Ministries and Departments of the Government" },
        { id: "gs2_07", text: "Salient features of Representation of People's Act; constitutional bodies (Election Commission, CAG, UPSC, Finance Commission)" },
        { id: "gs2_08", text: "Statutory, regulatory and various quasi-judicial bodies" },
        { id: "gs2_09", text: "Government policies and interventions for development in various sectors and issues arising out of their design and implementation" },
        { id: "gs2_10", text: "Development processes and the development industry — role of NGOs, SHGs, various groups and associations, donors, charities, institutional and other stakeholders" },
        { id: "gs2_11", text: "Welfare schemes for vulnerable sections of the population by the Centre and States and the performance of these schemes" },
        { id: "gs2_12", text: "Issues relating to development and management of Social Sector/Services: Health, Education, Human Resources" },
        { id: "gs2_13", text: "Issues relating to poverty and hunger" },
        { id: "gs2_14", text: "Governance, transparency and accountability, e-governance — applications, models, successes, limitations and potential" },
        { id: "gs2_15", text: "Citizens charters, transparency and accountability, institutional and other measures" },
        { id: "gs2_16", text: "Role of civil services in a democracy" },
        { id: "gs2_17", text: "India and its neighbourhood — relations" },
        { id: "gs2_18", text: "Bilateral, regional and global groupings and agreements involving India and/or affecting India's interests" },
        { id: "gs2_19", text: "Effect of policies and politics of developed and developing countries on India's interests, Indian diaspora" },
        { id: "gs2_20", text: "Important international institutions, agencies and fora — their structure, mandate and functioning (UN, WTO, IMF, World Bank, BRICS, SCO, QUAD, etc.)" },
      ],
    },
    {
      id: "gs3", label: "GS Paper III",
      color: "#047857", bg: "#ECFDF5",
      desc: "Economy, Environment & Internal Security",
      topics: [
        { id: "gs3_01", text: "Indian Economy and issues relating to planning, mobilization of resources, growth, development and employment" },
        { id: "gs3_02", text: "Inclusive growth and issues arising from it" },
        { id: "gs3_03", text: "Government Budgeting" },
        { id: "gs3_04", text: "Agriculture: issues related to direct and indirect farm subsidies and minimum support prices, supply chain, food processing, e-technology in aid of farmers" },
        { id: "gs3_05", text: "Food processing and related industries in India — scope and significance, location, upstream and downstream requirements" },
        { id: "gs3_06", text: "Land reforms in India" },
        { id: "gs3_07", text: "Effects of liberalization on the economy, changes in industrial policy and their effects on industrial growth" },
        { id: "gs3_08", text: "Infrastructure: Energy, Ports, Roads, Airports, Railways etc." },
        { id: "gs3_09", text: "Investment models in infrastructure" },
        { id: "gs3_10", text: "Science and Technology — developments and their applications and effects in everyday life" },
        { id: "gs3_11", text: "Achievements of Indians in science and technology; indigenization of technology and developing new technology" },
        { id: "gs3_12", text: "Awareness in IT, Space, Computers, Robotics, Nano-technology, Biotechnology and issues relating to intellectual property rights" },
        { id: "gs3_13", text: "Conservation, environmental pollution and degradation, environmental impact assessment" },
        { id: "gs3_14", text: "Disaster and disaster management" },
        { id: "gs3_15", text: "Linkages between development and spread of extremism" },
        { id: "gs3_16", text: "Role of external state and non-state actors in creating challenges to internal security" },
        { id: "gs3_17", text: "Challenges to internal security through communication networks, role of media and social networking sites in internal security challenges" },
        { id: "gs3_18", text: "Security challenges and their management in border areas; linkages of organized crime with terrorism" },
        { id: "gs3_19", text: "Various Security forces and agencies and their mandate" },
        { id: "gs3_20", text: "Cyber security, money laundering" },
        { id: "gs3_21", text: "Left-wing extremism, insurgency" },
      ],
    },
    {
      id: "gs4", label: "GS Paper IV",
      color: "#B45309", bg: "#FFFBEB",
      desc: "Ethics, Integrity & Aptitude",
      topics: [
        { id: "gs4_01", text: "Ethics and Human Interface: Essence, determinants and consequences of Ethics in human actions; dimensions of ethics" },
        { id: "gs4_02", text: "Ethics in private and public relationships; Human Values" },
        { id: "gs4_03", text: "Lessons from the lives and teachings of great leaders, reformers and administrators; role of family, society and educational institutions" },
        { id: "gs4_04", text: "Attitude: Content, Structure, Function; its influence and relation with thought and behaviour; moral and political attitudes; social influence and persuasion" },
        { id: "gs4_05", text: "Aptitude and foundational values for Civil Services, integrity, impartiality and non-partisanship, objectivity, dedication to public service, empathy, tolerance and compassion towards the weaker sections" },
        { id: "gs4_06", text: "Emotional Intelligence — Concepts, and their utilities and application in administration and governance" },
        { id: "gs4_07", text: "Contributions of moral thinkers and philosophers from India and world" },
        { id: "gs4_08", text: "Public/Civil service values and Ethics in Public administration: Status and problems; ethical concerns and dilemmas in government and private institutions" },
        { id: "gs4_09", text: "Probity in Governance: Concept of public service; Philosophical basis of governance and probity; Information sharing and transparency in government, Right to Information" },
        { id: "gs4_10", text: "Codes of Ethics, Codes of Conduct, Citizen's Charters, Work culture, Quality of service delivery, Utilization of public funds, challenges of corruption" },
        { id: "gs4_11", text: "Case Studies on above issues" },
      ],
    },
  ],
};

// ── localStorage helpers ──────────────────────────────────────────────────────

export function loadSyllabus() {
  try {
    const saved = localStorage.getItem(LS_SYLLABUS);
    if (saved) return JSON.parse(saved);
  } catch {}
  return DEFAULT_SYLLABUS;
}

export function saveSyllabus(syllabus) {
  try { localStorage.setItem(LS_SYLLABUS, JSON.stringify(syllabus)); } catch {}
}

export function loadDocTopicMaps() {
  try {
    const saved = localStorage.getItem(LS_DOC_MAPS);
    if (saved) return JSON.parse(saved);
  } catch {}
  return {};
}

export function saveDocTopicMaps(maps) {
  try { localStorage.setItem(LS_DOC_MAPS, JSON.stringify(maps)); } catch {}
}

// ── Keyword tokeniser ─────────────────────────────────────────────────────────

const STOPWORDS = new Set([
  "the","and","of","in","for","to","a","an","is","are","was","were","with",
  "has","have","been","on","at","by","from","or","that","this","which","but",
  "not","as","its","their","it","be","we","will","can","all","into","more",
  "about","also","than","such","other","after","before","various","relating",
  "issues","important","role","their","these","those","both","some","any",
]);

function tokenise(text) {
  return text.toLowerCase().split(/\W+/).filter(w => w.length > 3 && !STOPWORDS.has(w));
}

// ── Mapping engine ────────────────────────────────────────────────────────────

// Returns array of { docTopic, syllabusId, syllabusText, paperId, paperLabel, score }
// sorted best-first.  Only returns matches with score >= MIN_SCORE.
export function mapTopicsToSyllabus(docTopics, syllabus) {
  const MIN_SCORE = 2;

  // Pre-tokenise all syllabus topics once
  const syllabusFlat = syllabus.papers.flatMap(paper =>
    paper.topics.map(t => ({
      ...t,
      paperId:    paper.id,
      paperLabel: paper.label,
      paperColor: paper.color,
      paperBg:    paper.bg,
      keywords:   tokenise(t.text),
    }))
  );

  const results = [];

  for (const docTopic of docTopics) {
    const topicWords = tokenise(docTopic);
    if (topicWords.length === 0) continue;

    let best = { score: 0, match: null };

    for (const syl of syllabusFlat) {
      let score = 0;

      // Direct phrase match — high confidence
      if (syl.text.toLowerCase().includes(docTopic.toLowerCase())) {
        score += 12;
      }

      // Word-level overlap
      for (const w of topicWords) {
        if (syl.keywords.includes(w))                                           score += 2;
        else if (syl.keywords.some(k => k.startsWith(w) || w.startsWith(k)))   score += 1;
      }

      if (score > best.score) best = { score, match: syl };
    }

    if (best.match && best.score >= MIN_SCORE) {
      results.push({
        docTopic,
        syllabusId:   best.match.id,
        syllabusText: best.match.text,
        paperId:      best.match.paperId,
        paperLabel:   best.match.paperLabel,
        paperColor:   best.match.paperColor,
        paperBg:      best.match.paperBg,
        score:        best.score,
      });
    }
  }

  // De-duplicate: keep highest-score mapping per docTopic
  const seen = new Map();
  for (const r of results.sort((a, b) => b.score - a.score)) {
    if (!seen.has(r.docTopic)) seen.set(r.docTopic, r);
  }

  return [...seen.values()].sort((a, b) => b.score - a.score);
}
