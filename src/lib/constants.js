export const NAV_ITEMS = [
  // Workspace
  { id: "dashboard",  label: "Dashboard",        icon: "grid",       desc: "Overview & quick access" },
  { id: "library",    label: "PDF Library",      icon: "library",    desc: "Upload & manage sources" },
  { id: "syllabusmap", label: "Syllabus Manager", icon: "map-pin",   desc: "Manage UPSC syllabus & map PDF topics" },
  { id: "toppers",     label: "Topper Copies",   icon: "book-open",  desc: "Upload & read handwritten topper copies with OCR" },
  { id: "generator",  label: "Note Generator",   icon: "sparkles",   desc: "Create notes from topics" },
  { id: "notes",      label: "My Notes",         icon: "book-open",  desc: "Browse & edit notes" },
  { id: "planner",    label: "Mains Planner",    icon: "clock",      desc: "Exam countdown & daily tasks" },
  // Tools
  { id: "affairs",    label: "Current Affairs",  icon: "newspaper",  desc: "Daily CA linked to topics" },
  { id: "pyq",        label: "PYQ Mapper",       icon: "target",     desc: "Map to past questions" },
  { id: "chatbot",    label: "AI Chatbot",       icon: "bot",        desc: "Ask UPSC questions, get structured answers" },
  { id: "answers",    label: "Answer Builder",   icon: "pen-line",   desc: "Generate word-limited answers" },
  { id: "search",     label: "Search",           icon: "search",     desc: "Cross-note search & filter" },
  { id: "essay",      label: "Essay Builder",    icon: "feather",    desc: "Structure & write essays" },
  { id: "quotes",     label: "Quote Bank",       icon: "quote",      desc: "Curated quotes for answers & essays" },
  { id: "frameworks", label: "Frameworks",       icon: "template",   desc: "Answer structure templates" },
  { id: "evaluator",  label: "Answer Grader",    icon: "grade",      desc: "Evaluate & score your written answers" },
  // Study
  { id: "flashcards", label: "Flashcards",       icon: "layers",     desc: "Active recall study mode" },
  { id: "quiz",       label: "Quiz Mode",        icon: "zap",        desc: "Self-test from your notes" },
  { id: "revision",   label: "Revision Tracker", icon: "calendar",   desc: "Spaced repetition planner" },
  { id: "progress",   label: "GS Progress",      icon: "bar-chart",  desc: "Paper-wise tracking" },
  { id: "optional",   label: "Optional (Anthro)", icon: "award",     desc: "Anthropology syllabus tracker" },
  { id: "syllabus",   label: "Syllabus Tracker", icon: "map-pin",   desc: "UPSC Mains full syllabus coverage" },
  { id: "rcards",     label: "Revision Cards",   icon: "stack",      desc: "Quick-review note cards" },
  { id: "smartplan",  label: "Smart Planner",    icon: "compass",    desc: "AI-driven daily study schedule" },
  // Practice
  { id: "practice",   label: "Answer Practice",  icon: "edit-3",     desc: "Timed answer writing sessions" },
  { id: "mocks",      label: "Mock Tracker",     icon: "clipboard",  desc: "Track test series scores" },
  { id: "data",       label: "Data Sheet",       icon: "database",   desc: "Key facts & figures reference" },
  { id: "timer",      label: "Study Timer",      icon: "timer",      desc: "Pomodoro focus sessions" },
  { id: "streaks",    label: "Study Streaks",    icon: "flame",      desc: "Daily streak, XP & achievements" },
];

export const GS_TAGS = [
  { id: "gs1", label: "GS I",   color: "#7C3AED", bg: "#F5F3FF", desc: "History, Geography, Society" },
  { id: "gs2", label: "GS II",  color: "#0369A1", bg: "#F0F9FF", desc: "Polity, Governance, IR" },
  { id: "gs3", label: "GS III", color: "#047857", bg: "#ECFDF5", desc: "Economy, Environment, Security" },
  { id: "gs4", label: "GS IV",  color: "#B45309", bg: "#FFFBEB", desc: "Ethics & Integrity" },
  { id: "ess", label: "Essay",  color: "#9D174D", bg: "#FFF1F2", desc: "Essay papers" },
  { id: "ant", label: "Anthro", color: "#1E3A5F", bg: "#EFF6FF", desc: "Anthropology optional" },
  { id: "raj", label: "Rajasthan", color: "#92400E", bg: "#FFFBEB", desc: "State-specific" },
];

export const NOTE_SECTIONS = [
  { id: "definition",   label: "Definition",                  icon: "📖", gs: ["gs1","gs2","gs3","gs4"] },
  { id: "background",   label: "Background",                  icon: "🕰",  gs: ["gs1","gs2","gs3"] },
  { id: "context",      label: "Current Context",             icon: "📰", gs: ["gs1","gs2","gs3","gs4"] },
  { id: "constitution", label: "Constitutional Provisions",   icon: "⚖️", gs: ["gs2"] },
  { id: "legal",        label: "Legal Framework",             icon: "📋", gs: ["gs2","gs3"] },
  { id: "schemes",      label: "Government Schemes",          icon: "🏛", gs: ["gs2","gs3"] },
  { id: "data",         label: "Data & Statistics",           icon: "📊", gs: ["gs1","gs2","gs3"] },
  { id: "challenges",   label: "Challenges",                  icon: "⚠️", gs: ["gs1","gs2","gs3","gs4"] },
  { id: "causes",       label: "Causes",                      icon: "🔍", gs: ["gs1","gs2","gs3"] },
  { id: "impacts",      label: "Impacts",                     icon: "💥", gs: ["gs1","gs2","gs3"] },
  { id: "committees",   label: "Committee Recommendations",   icon: "👥", gs: ["gs2","gs3"] },
  { id: "judgements",   label: "SC / HC Judgements",          icon: "🏛", gs: ["gs2"] },
  { id: "intl",         label: "International Best Practices",icon: "🌐", gs: ["gs2","gs3"] },
  { id: "casestudies",  label: "Case Studies",                icon: "📌", gs: ["gs1","gs2","gs3","gs4"] },
  { id: "india",        label: "Examples from India",         icon: "🇮🇳", gs: ["gs1","gs2","gs3"] },
  { id: "rajasthan",    label: "Examples from Rajasthan",     icon: "🏜",  gs: ["raj"] },
  { id: "ethics",       label: "Ethics Dimension",            icon: "🧭", gs: ["gs4"] },
  { id: "anthro",       label: "Anthropology Dimension",      icon: "🧬", gs: ["ant"] },
  { id: "governance",   label: "Governance Dimension",        icon: "🏢", gs: ["gs2"] },
  { id: "diagram",      label: "Diagram / Flowchart",         icon: "🗺",  gs: [] },
  { id: "wayforward",   label: "Way Forward",                 icon: "✅", gs: ["gs1","gs2","gs3","gs4"] },
  { id: "conclusion",   label: "Conclusion",                  icon: "🎯", gs: ["gs1","gs2","gs3","gs4"] },
];

export const SAMPLE_TOPICS = [
  "Women Empowerment",
  "Urban Flooding",
  "India-China Relations",
  "Climate Change",
  "Ethics in Administration",
  "Tribal Issues",
  "Digital India",
  "Food Security",
  "Gig Economy",
  "Water Management",
  "Nari Shakti Vandan Act",
  "One Nation One Election",
];

export const SAMPLE_NOTES = [
  { id: "1", topic: "Women Empowerment",     gs: "gs2", wordCount: 2840, date: "2024-11-12", sections: 22, status: "complete" },
  { id: "2", topic: "Urban Flooding",         gs: "gs3", wordCount: 2210, date: "2024-11-10", sections: 20, status: "complete" },
  { id: "3", topic: "Climate Change",         gs: "gs3", wordCount: 3100, date: "2024-11-08", sections: 22, status: "complete" },
  { id: "4", topic: "Ethics in Governance",   gs: "gs4", wordCount: 1980, date: "2024-11-05", sections: 18, status: "draft"    },
  { id: "5", topic: "Digital India Mission",  gs: "gs2", wordCount: 2560, date: "2024-11-01", sections: 21, status: "complete" },
];

export const SAMPLE_PYQS = [
  {
    id: "p1", year: 2023, paper: "gs2", marks: 15,
    question: "Discuss the role of Self-Help Groups (SHGs) in women empowerment in India. Evaluate the impact of government schemes in strengthening SHGs.",
    approach: "Define SHGs → Economic impact (Mudra, NRLM, ₹2.2L cr credit) → Social (decision-making, DV reduction) → Political (Panchayat transition) → Schemes: DAY-NRLM, SHG-Bank Linkage → Challenges (leader capture, markets) → Way forward."
  },
  {
    id: "p2", year: 2022, paper: "gs1", marks: 15,
    question: "The women's issues in India need to be viewed in an integrated manner covering social, economic and political dimensions. Discuss.",
    approach: "Social: education gap, health, patriarchy, violence (NCRB). Economic: FLFPR 37%, wage gap 27%, informal sector. Political: 14.4% Lok Sabha, Nari Shakti Vandan Act. Interconnection between dimensions — integrated approach essential."
  },
  {
    id: "p3", year: 2021, paper: "gs2", marks: 15,
    question: "Despite constitutional provisions and legislation, gender-based crimes against women continue to rise in India. Suggest measures to address this menace.",
    approach: "Data: NCRB 4.45L cases 2023. Gap: law vs enforcement. Root causes: patriarchy, impunity. Measures: fast-track courts, CCTV/Nirbhaya Fund, gender-sensitive police, education reform, POCSO enforcement."
  },
  {
    id: "p4", year: 2020, paper: "gs1", marks: 10,
    question: "Critically examine the role of the 73rd Constitutional Amendment in ensuring political empowerment of women at the grassroots level.",
    approach: "33% reservation in PRIs → Higher representation (50%+ states) → Sarpanch-pati (proxy) problem → Lack of training → Positive: women PRI leaders prioritise water, health, education (MIT study) → Reforms needed."
  },
  {
    id: "p5", year: 2019, paper: "gs2", marks: 15,
    question: "Women empowerment in India needs the help of multiple dimensions — political, social, economic and legal. Examine.",
    approach: "Political: reservation, voting participation. Social: BBBP, education, health. Economic: SHGs, Mudra (68% women), MGNREGA. Legal: POSH, DV Act, Maternity Benefit 26 weeks. Each dimension reinforces the others."
  },
  {
    id: "p6", year: 2018, paper: "gs1", marks: 10,
    question: "Discuss how the Beti Bachao Beti Padhao scheme has addressed the skewed sex ratio at birth in India.",
    approach: "SRB: 918 (2014–15) → 934 (2022–23). Components: PCPNDT Act enforcement, awareness camps, girl education. Best practices: Haryana turnaround. Remaining gaps: rural areas, Rajasthan SRB still low."
  },
  {
    id: "p7", year: 2017, paper: "gs1", marks: 15,
    question: "Examine the role of women in the Indian independence movement and their contributions to post-independence nation-building.",
    approach: "Independence: Sarojini Naidu, Aruna Asaf Ali, Kamala Nehru, Rani Lakshmibai (1857). Post-independence: Vijayalakshmi Pandit (UN), Indira Gandhi, scientists (ISRO 30%), President Droupadi Murmu."
  },
  {
    id: "p8", year: 2016, paper: "gs2", marks: 15,
    question: "What are the barriers to women's participation in the formal workforce? Suggest measures to increase Female Labour Force Participation Rate (FLFPR).",
    approach: "FLFPR: 37% (PLFS 2023) vs global 47%. Barriers: childcare burden, safety, glass ceiling, skill gap. Measures: subsidised childcare, POSH enforcement, PMKVY skilling, Work from Home policy, transport safety."
  },
  {
    id: "p9", year: 2015, paper: "gs4", marks: 10,
    question: "What do you understand by the 'capability approach' in the context of women empowerment? Explain with examples from India.",
    approach: "Amartya Sen + Nussbaum: 10 central capabilities. Women denied: bodily integrity, education, political participation. India examples: SEWA (2M workers), Kudumbashree (4.7M). Policy: capability-expanding schemes vs mere income transfers."
  },
  {
    id: "p10", year: 2014, paper: "gs1", marks: 10,
    question: "In the context of growing challenges faced by women in India, discuss the role of the National Commission for Women.",
    approach: "NCW: composition (chairperson + 5 members), statutory body (NCW Act 1990). Functions: quasi-judicial, advisory, research, monitoring. Recent actions: DV, trafficking, POSH. Challenges: non-binding orders, under-staffing. Reforms: teeth and funding."
  },
  {
    id: "p11", year: 2023, paper: "gs3", marks: 15,
    question: "Urban flooding has become a recurrent annual disaster in Indian cities. Examine the causes and suggest measures for better urban flood management.",
    approach: "Causes: encroachment on wetlands (Bengaluru 79% lakes lost), imperviousness 60-80%, undersized drains, jurisdictional fragmentation. Climate: IPCC AR6 +20-30% rainfall intensity. Measures: Blue-Green infrastructure, single drainage authority, 100-year design standard, IoT early warning (Pune model)."
  },
  {
    id: "p12", year: 2023, paper: "gs3", marks: 15,
    question: "Discuss India's commitments under the Paris Agreement and analyse the challenges in achieving its Nationally Determined Contributions (NDCs).",
    approach: "NDC targets: 45% emission intensity reduction, 50% non-fossil power by 2030, net zero 2070. Progress: 196 GW renewables. Challenges: climate finance gap ($100B unmet), coal transition (2 cr workers), technology barriers. Way forward: Green Hydrogen, carbon markets, sovereign green bonds."
  },
  {
    id: "p13", year: 2022, paper: "gs4", marks: 10,
    question: "What do you understand by the 'code of ethics' for civil servants? Discuss the challenges in enforcing ethical behaviour in public administration.",
    approach: "Nolan's 7 principles. India: 2nd ARC 4th Report (2007), Mission Karmayogi (2020). Challenges: politicisation (transfer-posting), regulatory capture, revolving door, weak whistleblower protection. Measures: Public Services Code, stronger Lokpal, 360° appraisal, ethics audit."
  },
  {
    id: "p14", year: 2024, paper: "gs3", marks: 15,
    question: "India's Digital Public Infrastructure (DPI) model has emerged as a global template. Analyse its key components, achievements, and challenges.",
    approach: "Components: JAM Trinity, UPI (16.6B txns/month), ONDC, DigiLocker. Achievements: DBT ₹6.3L cr leakage saved, 1.12L startups, G20 endorsement. Challenges: digital divide, data privacy (DPDPA rules pending), cybersecurity, platform concentration. Way forward: AI governance, CBDC scale-up, digital sovereignty."
  },
  {
    id: "p15", year: 2022, paper: "gs2", marks: 15,
    question: "Critically examine the role of Civil Society Organisations (CSOs) in strengthening democracy and governance in India.",
    approach: "CSOs as watchdogs (RTI advocacy), service delivery (SEWA, Pratham), policy advocacy (MKSS → NREGA). Challenges: FCRA restrictions, elite capture, accountability deficit. Recent: FCRA crackdown 2020-23 — 6,600 NGO licences cancelled. Balance: regulation vs enabling environment."
  },
];

export const SAMPLE_NOTE_CONTENT = {
  "1": {
    topic: "Women Empowerment",
    gs: "gs2",
    date: "2024-11-12",
    wordCount: 2840,
    sections: {
      definition: "Women Empowerment refers to the process of granting women the power, agency, and autonomy to make meaningful choices in their personal, social, economic, and political lives. It entails removing barriers — legal, cultural, institutional, and economic — that restrict women from participating fully in society. The UNDP defines it as increasing women's access to resources, opportunities, and capabilities. The Beijing Platform for Action (1995) identifies 12 critical areas of concern including education, health, violence, and political participation.",
      background: "The roots of gender inequality in India trace to patriarchal norms embedded in the Manusmriti and medieval social codes. Colonial-era reformers — Raja Ram Mohan Roy (Sati abolition, 1829), Ishwar Chandra Vidyasagar (Widow Remarriage Act, 1856), and Jyotiba Phule — initiated the first wave of women's rights discourse. Post-independence, B.R. Ambedkar ensured constitutional equality while leaders like Sarojini Naidu and Vijayalakshmi Pandit symbolised women's political potential. The second wave of empowerment came with SHG movements in the 1980s–90s.",
      context: "India ranks 127th in the Global Gender Gap Index 2024 (WEF). Women constitute only 14.4% of Lok Sabha (2024) and 24% of state legislators. The Female Labour Force Participation Rate (FLFPR) stands at 37% (PLFS 2023), well below the global average of 47%. However, positive trends include: SHG membership crossing 10 crore women, Mudra loans with 68% women borrowers, rising girls' GER, and India having 15% women pilots — the highest globally.",
      constitution: "Article 14: Equality before law. Article 15(3): State may make special provisions for women and children. Article 16: Equal opportunity in public employment. Article 39(a)(d): Equal pay for equal work. Article 42: Maternity relief. Article 51-A(e): Renounce practices derogatory to women's dignity. The 73rd and 74th Amendments mandate 33% reservation for women in PRIs and urban bodies. The Nari Shakti Vandan Act, 2023 provides 33% reservation in Parliament and state assemblies (post-delimitation).",
      legal: "Key legislations: Protection of Women from Domestic Violence Act, 2005 | Sexual Harassment of Women at Workplace (POSH) Act, 2013 | Maternity Benefit (Amendment) Act, 2017 — 26 weeks paid leave | Prohibition of Child Marriage Act, 2006 | Dowry Prohibition Act, 1961 (amended 1986) | The Criminal Law (Amendment) Act, 2013 — post-Nirbhaya: expanded definition of rape, stalking, acid attacks as offences | Trafficking of Persons (Prevention, Protection and Rehabilitation) Act, 2018.",
      schemes: "Beti Bachao Beti Padhao (BBBP): Improved SRB from 918 (2014–15) to 934 (2022–23). PM Mahila Shakti Kendra: one-stop support for rural women. POSHAN Abhiyan: addresses malnutrition among women and children. Sukanya Samriddhi Yojana: financial security for girl child. PM Awas Yojana: house registered in woman's name. Ujjwala Yojana: 10 crore LPG connections to rural women. Deen Dayal Antyodaya Yojana-NRLM: ₹2.2 lakh crore credit disbursed to SHGs in 2023–24.",
      data: "Gender Gap Index 2024: India 127/146 (Economic Participation: 142/146). NCRB 2023: 4.45 lakh cases of crimes against women. Maternal Mortality Rate: 97/1,00,000 (2018–20), down from 254 (2004–06). Girls' GER in higher education: 28.5% (AISHE 2022). Women in STEM undergrads: 43% (among highest globally). SHG members: 10.19 crore across 90 lakh groups. Women pilots in India: 15% of total (global average 5%).",
      challenges: "1. Gender wage gap: Women earn 27% less than men for similar work (ILO 2023). 2. Unpaid care burden: Women do 5.9× more unpaid care work than men (India Time Use Survey 2019). 3. Violence: One in three Indian women has experienced physical or sexual violence (NFHS-5). 4. Digital divide: Only 33% women use internet vs. 57% men. 5. Patriarchal norms: Son preference, restriction of mobility, early marriage in rural areas. 6. Token representation: Women in leadership are often placed in less powerful portfolios (glass ceiling, glass cliff). 7. Low conviction rates: Under 30% conviction in rape cases (NCRB 2023).",
      causes: "Structural: Patriarchal socialisation beginning from birth. Cultural: Son preference; purdah system; concept of honour (izzat). Economic: Low FLFPR; economic dependence on male family members. Legal: Wide gap between law and enforcement; low conviction rates. Institutional: Male-dominated administration; lack of gender-responsive budgeting at local level. Educational: School dropout due to early marriage, lack of girls' toilets, and distance to schools in rural areas.",
      impacts: "Economic: McKinsey (2015) estimates gender parity could add $700 billion to India's GDP by 2025. Social: Empowered women invest 90% of income in family vs 35% for men (UNDP). Demographic: Educated mothers drive lower IMR, MMR, and better child nutrition outcomes. Political: Women PRI leaders prioritise water, education, and health over infrastructure (MIT study, West Bengal data). National Security: Reduced trafficking, child marriages, and radicalisation of marginalised youth when women are empowered.",
      committees: "Justice Srikrishna Committee (2006): Legal reforms for domestic violence. Justice Verma Committee (2013): Post-Nirbhaya — stricter rape laws, acid attacks, stalking as offences. National Commission for Women (NCW): Statutory body for rights redressal and review of laws. Parliamentary Standing Committee on Women and Children: Reviews schemes and legislation. Shantha Kumar Committee recommendations on ICDS restructuring benefited women and child nutrition.",
      judgements: "Vishaka v. State of Rajasthan (1997): SC guidelines on sexual harassment at workplace — precursor to POSH Act 2013. Joseph Shine v. Union of India (2018): Adultery decriminalised — women are not property of husbands. Navtej Singh Johar v. UoI (2018): Section 377 partially read down — dignity and autonomy of all persons. Indian Young Lawyers Association v. State of Kerala (Sabarimala, 2018): Women of all ages allowed entry — equality over tradition, though review petition pending.",
      intl: "Nordic Model: Shared parental leave + subsidised childcare → FLFPR >75% in Sweden and Norway. Rwanda: 61% women in Parliament (highest globally) — achieved through post-genocide quota system. UN SDG Goal 5: Gender Equality and Empowering all women and girls by 2030. CEDAW (1979): Convention on Elimination of All Forms of Discrimination Against Women — India signatory, obligates periodic reporting. HeForShe: UN campaign engaging men as agents of change.",
      casestudies: "Kudumbashree (Kerala): 4.7 million women in SHGs, ₹5,000 crore annual turnover — world's largest women-led poverty eradication programme. SEWA (Gujarat): 2 million informal women workers with integrated healthcare, childcare, and insurance through cooperative model. Gulabi Gang (UP): Sampat Pal Devi's pink-sari vigilante network fighting domestic violence in Bundelkhand. Mahila e-Haat: Ministry of WCD online marketing platform for women entrepreneurs.",
      india: "India has the world's largest SHG network — 10+ crore women in 90 lakh groups. The first female President (Pratibha Patil, 2007) and current President Droupadi Murmu (first tribal woman, 2022). Indian Space Programme: 30% ISRO scientists are women; women led critical roles in Chandrayaan-3 (2023) mission. India's women's cricket team reached T20 World Cup finals. 15% of Indian pilots are women — highest proportion globally.",
      rajasthan: "Rajasthan has among the lowest SRB (Sex Ratio at Birth) and FLFPR in India. Key challenges: child marriage (4th highest nationally, NFHS-5), female literacy 52.1% vs national 65.5%, low political participation despite PRI reservations. Positive initiatives: Rajasthan Sampark Portal for grievances, Annapurna Food Packet Scheme, Mahila Shakti Kendras in all districts. Rajasthan's Panchayati Raj provides 50% reservation for women — several women sarpanches becoming active administrators.",
      ethics: "Women empowerment is rooted in the values of dignity, autonomy, and equality. Philosopher Amartya Sen's Capability Approach argues women must have freedom to live lives they value — not merely subsistence. Martha Nussbaum's 10 Central Capabilities include bodily integrity, emotion, affiliation, and political participation — all curtailed by gender discrimination. Deontological framework: women possess inherent dignity (Kant's categorical imperative). Consequentialist: empowered women → better development outcomes for entire society.",
      anthro: "From an anthropological lens, gender roles are culturally constructed, not biologically determined (Margaret Mead's work in Samoa and New Guinea). Kinship systems determine women's status: patrilineal (most of India) vs matrilineal (Khasi of Meghalaya, Nair of Kerala) — the latter confers higher property rights and decision-making agency on women. Tribal women in Central India (Santhals, Gonds, Bhils) historically had relatively more autonomy before colonial contact re-shaped gender norms through Victorian moral codes.",
      governance: "Gender-responsive governance: Gender Budgeting Statement (Union Budget since 2005–06) allocates ₹3.27 lakh crore to women-centric schemes (2023–24). Gender audit of all government schemes mandated by MoWCD. Mahila Police Volunteers deployed in 8 states to bridge communities and police. Women-dedicated desks in police stations (One Stop Centres). Nirbhaya Fund (₹1,000 crore) specifically for women's safety infrastructure including CCTVs and emergency response.",
      wayforward: "1. Full operationalisation of Nari Shakti Vandan Act post-delimitation. 2. Universal childcare infrastructure (Anganwadi expansion) to enable FLFPR increase by 10pp. 3. Equal pay legislation with robust enforcement mechanism and workplace audits. 4. Digital literacy programmes targeting rural women via BharatNet last-mile. 5. Gender-responsive curriculum in schools to change patriarchal attitudes from an early age. 6. Fast-track courts for gender-based violence with dedicated public prosecutors. 7. Male engagement programmes — India-adapted HeForShe. 8. Gender impact assessment mandated for all major development projects.",
      conclusion: "Women empowerment is not merely a social objective but a strategic economic and governance imperative for India's Amrit Kaal. The aspiration of Viksit Bharat 2047 cannot be realised while half the population remains constrained by structural and cultural barriers. The synergy of constitutional guarantees, progressive legislation, targeted schemes, and a transformed social mindset — rooted in Ambedkar's vision of equality and dignity — can make India a global exemplar of inclusive growth. As Dr. APJ Abdul Kalam said: 'Empowering women is a prerequisite for creating a good nation.'"
    }
  },
  "2": {
    topic: "Urban Flooding",
    gs: "gs3",
    date: "2024-11-10",
    wordCount: 2210,
    sections: {
      definition: "Urban flooding is the inundation of land and properties in built-up areas caused by rainfall that exceeds the capacity of drainage systems or by overflow from water bodies. It differs from riverine flooding in that it is primarily triggered by intense short-duration precipitation concentrated in urban environments. The NDMA defines it as flooding in towns and cities resulting from inadequate stormwater drainage, encroachment on natural water bodies, and rapid imperviousness due to concretisation. Pluvial flooding (direct rainfall), fluvial flooding (river overflow), and groundwater flooding are its three principal types.",
      background: "India's urbanisation accelerated post-liberalisation (1991), with urban population growing from 26% (1991) to 36% (2021). Early colonial cities — Bombay, Calcutta, Madras — had planned drainage but inadequate for modern densities. Post-independence haphazard urban sprawl on floodplains and wetlands compounded risk. The 2005 Mumbai floods (944 mm in 24 hours, 1,094 deaths, ₹550 crore loss) was a watershed moment, prompting NDMA to issue Urban Flood Management Guidelines (2010). Chennai 2015 (₹20,000 crore loss), Bengaluru 2022, and Delhi 2023 further exposed systemic failures.",
      context: "Urban flooding has become an annual crisis across Indian cities. In 2023 alone: Delhi recorded highest July rainfall (153.7 mm on July 9) since 1982 causing 6 deaths and submerged Pragati Maidan tunnel; Himachal Pradesh saw flash floods with 250+ deaths; Chennai and coastal cities faced compound flooding. IPCC AR6 projects that extreme precipitation events will intensify by 20-30% under 2°C warming. India's urban areas cover only 3% of land but produce 60% of GDP — making urban flood resilience a macroeconomic imperative.",
      causes: "Proximate: Intense short-duration rainfall (cloudburst events). Structural: (1) Encroachment on natural drainage channels and wetlands — Delhi's Yamuna floodplain built upon; Bengaluru lost 79% of its lakes. (2) Rapid imperviousness — urban surfaces now 60-80% impervious, reducing infiltration. (3) Undersized stormwater drains designed for 5-year return storms, not 50-year events. (4) Lack of integration between stormwater and sewage systems (combined sewer overflows). (5) Unplanned urbanisation in low-lying areas. (6) Poor solid waste management — drains choked by plastic. (7) Climate change intensifying rainfall events.",
      impacts: "Economic: NDMA estimates annual urban flood losses at ₹5,000–8,000 crore. Mumbai 2005: ₹550 crore direct loss; Bengaluru 2022: ₹225 crore. Social: Displacement of slum-dwellers (most vulnerable); disruption to education and healthcare. Public health: Waterborne diseases — leptospirosis, cholera, typhoid — spike post-floods. Infrastructure: Damage to roads, bridges, underground utilities, vehicles. Agriculture in urban periphery. Long-term: Investor confidence erosion in flood-prone cities; declining land values in vulnerable zones.",
      schemes: "AMRUT 2.0 (2021–26): ₹2.99 lakh crore for urban water supply and sewerage, includes stormwater drainage. Smart Cities Mission: Integrated Command and Control Centres for early warning. National Disaster Management Plan (NDMP) 2019: Urban flood-specific guidelines. Atal Mission for Rejuvenation and Urban Transformation (AMRUT) 1.0: Addressed drainage in 500 cities. Jal Shakti Abhiyan: Includes urban water body rejuvenation. State-level: Mumbai's Brihanmumbai Storm Water Drainage (BRIMSTOWAD) project — ₹7,180 crore for underground drains. Chennai's Integrated Storm Water Drain project.",
      data: "India has 4,041 towns and 53 urban agglomerations with population >1 lakh (Census 2011). Urban population: 50 crore (2024); projected 60 crore by 2031. India's wetlands lost: 38% between 1970-2014 (MoEF). NDMA: 10 cities with population >4 million are highly vulnerable to urban flooding. World Bank (2019): Climate change could cost India $0.5–3% of GDP annually by 2050 without adaptation. Bengaluru: 79% of wetlands lost in 50 years; from 260 lakes (1960) to 79 (2016). Delhi: 97 drains mapped, only 18 fully functional (CAG 2022).",
      challenges: "1. Jurisdictional fragmentation: Stormwater drainage (municipal), rivers (state irrigation), national highways (NHAI), railways — no single authority. 2. Outdated masterplans: Most city masterplans do not integrate flood risk zoning. 3. Political economy of encroachment: Removal of floodplain encroachments faces resistance from vote-bank politics. 4. Financing gap: Estimated ₹10 lakh crore needed for adequate urban drainage infrastructure. 5. Data deficit: Real-time rainfall and drainage flow monitoring absent in most cities. 6. Climate uncertainty: Historical rainfall data insufficient for future extreme event design. 7. O&M neglect: Drains desilted only annually despite year-round need.",
      intl: "Netherlands 'Room for the River' programme: Relocating dykes, creating water squares and retention basins — reduced flood losses by 40%. Singapore's ABC Waters programme: Active-Beautiful-Clean — integrating drainage into urban parks and landscapes; 100 ABC Waters projects. Tokyo's Metropolitan Area Outer Underground Discharge Channel (G-Cans): Underground tunnel system with 59m diameter tanks — handles storms up to 5-year return period. Copenhagen post-2011 cloudburst: Superblocks redesigned with green roofs, permeable pavements, and underground cisterns. Rotterdam Water Square: Public plaza transforms into water retention pool during storms.",
      india: "Surat, Gujarat: After 2006 floods, invested ₹1,500 crore in drainage; now ranked among India's best-managed flood-resilient cities. Pune Municipal Corporation: Real-time flood Early Warning System (EWS) with SMS alerts; reduced casualties by 60%. NMMC (Navi Mumbai): Maintained natural drainage network alongside planned urban growth — significantly lower flood incidence. Thiruvananthapuram: Blue-Green Network initiative linking 7 river basins with urban parks. Indore: Integrated SWD master plan 2041 approved, serving as national model.",
      wayforward: "1. Urban Flood Resilience Law: Statutory mandate for floodplain zoning and drainage masterplans in all cities >1 lakh population. 2. Blue-Green Infrastructure: Nature-based solutions — urban wetland restoration, permeable pavements, green roofs — alongside grey infrastructure. 3. 100-year storm design standard for critical infrastructure (hospitals, power stations). 4. Real-time early warning: IoT sensors in drains + integration with IMD's Doppler radar network. 5. Single drainage authority per metropolitan area — ending jurisdictional fragmentation. 6. Flood insurance: Mandatory flood risk disclosure in property transactions; parametric insurance products for urban local bodies. 7. Citizen science: Community-based flood monitoring apps (like Mumbai's 'Brihanmumbai Drain-Map').",
      conclusion: "Urban flooding is fundamentally a governance crisis as much as a climate crisis. India's cities cannot aspire to be engines of a $5-trillion economy while annually losing crores to preventable inundation. The convergence of AMRUT 2.0, Smart Cities Mission, and Disaster Management frameworks offers an unprecedented opportunity to build truly water-resilient cities. Drawing lessons from Singapore, Rotterdam, and Surat, India must pivot from post-disaster response to pre-disaster resilience — integrating nature, infrastructure, and governance into a unified urban water management paradigm."
    }
  },
  "3": {
    topic: "Climate Change",
    gs: "gs3",
    date: "2024-11-08",
    wordCount: 3100,
    sections: {
      definition: "Climate change refers to long-term, large-scale shifts in global temperatures and weather patterns, primarily driven since the mid-20th century by human activities that release greenhouse gases (GHGs) into the atmosphere. The UNFCCC defines it as 'change of climate which is attributed directly or indirectly to human activity that alters the composition of the global atmosphere.' The IPCC AR6 (2021–22) unequivocally states that human-induced climate change is already causing widespread and rapid changes in the atmosphere, ocean, cryosphere, and biosphere — with 'each of the last four decades successively warmer than any decade since 1850.'",
      background: "The scientific understanding of climate change began with Svante Arrhenius (1896) who first calculated that doubling CO₂ would raise global temperature by 5–6°C. The International Geophysical Year (1957–58) established systematic CO₂ monitoring (Keeling Curve). The First World Climate Conference (1979) acknowledged anthropogenic influence. The IPCC was established in 1988 by WMO and UNEP. The UNFCCC was adopted at Rio Earth Summit (1992), Kyoto Protocol (1997) set binding targets for Annex-I countries. The Copenhagen Accord (2009) introduced INDCs; Paris Agreement (2015) is the current framework with NDC system and 1.5°C target.",
      context: "Global mean temperature in 2023 reached 1.45°C above pre-industrial baseline — the warmest year on record. The UN Environment Programme's 'Emissions Gap Report 2023' warns current NDCs put world on track for 2.5–2.9°C warming by 2100. COP28 (Dubai, 2023): Historic 'global stocktake' concluded countries must transition away from fossil fuels; Loss and Damage Fund operationalised with initial $700 million. India's context: Temperature anomaly of +0.63°C since 1901 (IMD); extreme weather events increased 3× in frequency since 1970s; monsoon pattern shifts threatening agricultural systems.",
      causes: "Greenhouse gas emissions by sector (global): Energy (34%), Industry (24%), Agriculture, Forestry & Land Use (22%), Transport (15%), Buildings (6%). CO₂ (main GHG, 76%), CH₄ (methane, 16%), N₂O (6%). India's emission profile: Coal-based power (46% of electricity), agriculture (methane from rice paddies and livestock), transport, cement/steel. India emits ~3.37 Gt CO₂-eq (2022) — 3rd largest emitter (after China at 14.4 Gt and USA at 5.1 Gt), but per capita emissions are 2.4 tCO₂-eq vs global average 6.3 tCO₂-eq and USA's 15 tCO₂-eq. CBDR-RC principle: historical cumulative responsibility of developed nations.",
      impacts: "Physical: Global average sea level rising 3.3 mm/year; Arctic sea ice declining 13%/decade; glacial retreat (Himalayan glaciers retreating 40 cm/year). India-specific: (1) Agriculture: Rice and wheat yields could fall 4–10% per 1°C rise; IRRI warns South Asian yield declines. (2) Water: Himalayan glaciers (Gangotri retreating 22m/year) threaten dry-season flows in Ganga, Yamuna, Brahmaputra — affecting 600 million. (3) Coastal: 7,516 km coastline; 8 crore people in low-elevation zones at risk from 0.5m sea-level rise by 2100; Sundarbans losing 1,200 ha/year. (4) Health: Malaria/dengue range expansion; heat stress — 2022 heatwaves caused productivity loss equivalent to 167 million full-time work hours.",
      schemes: "National Action Plan on Climate Change (NAPCC, 2008): 8 national missions — (1) Solar (JNNSM), (2) Enhanced Energy Efficiency, (3) Sustainable Habitat, (4) Water, (5) Himalayan Ecosystem, (6) Green India, (7) Sustainable Agriculture, (8) Strategic Knowledge for Climate Change. India's NDC (Updated 2022): (a) Reduce emission intensity of GDP by 45% from 2005 levels by 2030. (b) 50% cumulative electric power from non-fossil sources by 2030. (c) Create carbon sink of 2.5–3 Gt CO₂ through forest cover. Net Zero by 2070 announced at COP26. International Solar Alliance (ISA) — India-France initiative. Coalition for Disaster Resilient Infrastructure (CDRI).",
      data: "India's renewables: 196 GW installed (Nov 2024) out of 450 GW target by 2030; solar at 90 GW, wind at 46 GW. Global CO₂ concentration: 421 ppm (Mauna Loa, 2023) vs pre-industrial 280 ppm. 2023 global average temperature: 1.45°C above 1850–1900 baseline. India's forest cover: 21.71% of geographic area (FSI 2021), target 33%. Loss and Damage Fund (COP28): $700 million initial pledge. Green Hydrogen Mission: 5 MMT production target by 2030; ₹19,744 crore outlay. India solar parks: 57 parks across 22 states; Bhadla Solar Park (Rajasthan) — 2,245 MW, world's largest.",
      challenges: "1. Finance: $100 billion/year Copenhagen commitment still unmet; developed countries delivered only $83 billion in 2022. 2. Technology transfer: IP barriers prevent developing nations from accessing clean technologies. 3. Just transition: 2 crore coal workers in India face livelihood displacement without alternatives. 4. Adaptation vs. Mitigation balance: India needs large adaptation investment yet global climate finance is skewed 90:10 towards mitigation. 5. Loss and Damage: Vulnerable nations (small islands, LDCs) need compensation for irreversible climate impacts. 6. Food-Energy-Water nexus: Climate solutions (e.g., biofuels) may compete with food security. 7. Greenwashing: Corporate net-zero pledges often lack credible interim targets.",
      intl: "Paris Agreement (2015): 196 signatories; 1.5°C limit; NDC system with 5-year ratchet mechanism. Kyoto Protocol (1997): CDM (Clean Development Mechanism) enabled $88 billion in project finance. Glasgow Climate Pact (COP26, 2021): 'Phase down' of unabated coal; methane pledge (30% reduction by 2030). COP28 (Dubai, 2023): Global Stocktake; Loss and Damage Fund; tripling renewables by 2030; transition away from fossil fuels. Kigali Amendment to Montreal Protocol: Phase-down of HFCs (super-GHGs). EU Carbon Border Adjustment Mechanism (CBAM): Tariff on carbon-intensive imports from 2026 — significant for India's steel, cement, aluminium exports.",
      casestudies: "Odisha Disaster Risk Reduction: OTIS cyclone tracking, Odisha Disaster Rapid Action Force — mortality from cyclones reduced from 10,000+ (1999 Odisha cyclone) to near-zero (2019 Fani: 64 deaths vs. >10,000 with same intensity in 1999). Himachal Pradesh 2023 Floods: ₹12,000 crore damage — 70% from roads built on fragile slopes without EIA compliance; underscores climate-development trade-off. Cochin Airport: World's first fully solar-powered airport (50 MW); offset 1.8 lakh tonne CO₂ in 5 years. Sikkim Organic State: 100% organic farming — reduces N₂O emissions and builds soil carbon sink.",
      wayforward: "1. Fast-track $1 trillion New Collective Quantified Goal (NCQG) post-COP29 to replace failed $100 billion pledge. 2. Carbon market integrity: Article 6 of Paris Agreement — robust accounting rules for international carbon trading. 3. Climate Justice: Compensation and capacity-building for climate-vulnerable nations under Loss and Damage Fund. 4. Green Hydrogen as export opportunity for India — position as global hub under ISA and G20 presidency legacy. 5. Urban heat island mitigation: Cool roofs, urban forests (30% tree cover in cities). 6. Mangrove restoration: India's 4,992 sq km mangroves — expand to buffer coastal communities. 7. Circular economy: Reduce embodied carbon in construction (50% of material GHGs).",
      conclusion: "Climate change is the defining challenge of the 21st century — a 'threat multiplier' that intensifies every other developmental challenge India faces, from food security to water scarcity to public health. India, though a minor historical emitter, stands as the most exposed large economy. Its dual imperative — development and decarbonisation — can be reconciled through the philosophy of 'LiFE' (Lifestyle for Environment) and climate-positive growth. India's leadership at ISA, CDRI, and COP presidency moments positions it as a bridge between the Global North and South. The path to Viksit Bharat 2047 must be a green path."
    }
  },
  "4": {
    topic: "Ethics in Governance",
    gs: "gs4",
    date: "2024-11-05",
    wordCount: 1980,
    sections: {
      definition: "Ethics in governance refers to the application of moral principles — honesty, integrity, transparency, accountability, fairness, and impartiality — in the exercise of public power and public trust. The Nolan Committee on Standards in Public Life (UK, 1995) enunciated 7 principles: Selflessness, Integrity, Objectivity, Accountability, Openness, Honesty, and Leadership. For civil servants, ethics is not a choice but a duty enshrined in service conduct rules. Mahatma Gandhi's Talisman — 'Will it help the weakest person?' — remains the most powerful ethical test in public administration.",
      background: "The need for ethics in governance gained formal recognition post-independence through Articles 309–312 (civil services), AIS Conduct Rules (1968), and CVC Act (2003). Scandals such as the Bofors case (1980s), Hawala scam (1991), telecom spectrum allocation (2008), and coal block allocation (2012) underlined the crisis of ethical governance. The Second Administrative Reforms Commission (2nd ARC, 2007) — 4th Report on 'Ethics in Governance' — recommended a Citizen's Charter, Code of Ethics for civil servants, a Public Services Law, and strengthening of Lokayuktas. The Lokpal and Lokayuktas Act, 2013 was a landmark legislative response.",
      context: "India ranks 93rd in Transparency International's Corruption Perception Index 2023 (score 40/100), indicating significant governance deficit. However, positive trends: RTI Act (2005) has filed 60 lakh+ applications annually; PFMS (Public Financial Management System) digitising ₹60 lakh crore in government transactions; DBT (Direct Benefit Transfer) of ₹6.3 lakh crore since 2013 reduced leakage. Mission Karmayogi (2020) — National Programme for Civil Services Capacity Building — aims to shift from rule-based to role-based governance grounded in values.",
      challenges: "1. Conflicts of interest: Bureaucrats regulating sectors where they have private stakes; revolving door between govt and industry. 2. Regulatory capture: Regulators becoming advocates for the industries they oversee (SEBI, TRAI, CERC). 3. Political pressure: Transfer-posting mechanism as tool of political control over civil servants. 4. Whistleblower vulnerability: Whistleblowers Protection Act (2014) weakly implemented; several whistleblowers killed or harassed. 5. Ethical relativism: 'Jugaad' culture normalising rule-bending. 6. Gift and hospitality culture: Blurring boundary between gratitude and corruption. 7. Social media and reputation risks: Viral narratives pressuring officials into unethical populist decisions.",
      committees: "Second ARC 4th Report (2007): Code of Ethics for civil servants; Citizen's Charter; Public Services Law. Hota Committee (2004): Performance management and lateral entry. Vohra Committee (1993): Criminalization of politics — political-criminal nexus. Nolan Committee (UK, 1995): Seven principles of public life — widely adopted in Indian training. Justice B.N. Srikrishna Committee (2017): Data privacy — ethical dimension of digital governance. 14th Finance Commission: Recommended ethics-linked performance grants to states.",
      ethics: "Ethical frameworks in governance: (1) Deontological (Kant): Civil servants have a duty to follow rules regardless of outcome — rule of law, procedural fairness. (2) Consequentialist (Mill): Governance decisions should maximise public welfare — cost-benefit analysis, outcomes. (3) Virtue Ethics (Aristotle): Character-based integrity; civil servants as 'persons of good character.' (4) Gandhian Trusteeship: Public servant as trustee of public resources, not owner. (5) Rawlsian Justice: Policies must maximise the position of the least-advantaged (Difference Principle). (6) Amartya Sen's Capability Approach: Governance should expand the capabilities/freedoms of citizens, especially the marginalised.",
      casestudies: "E. Sreedharan (Delhi Metro): Delivered projects on time and within budget in a sector notorious for delays — through transparent tendering, zero tolerance for corruption, and personal integrity. Armstrong Pame (IAS, Manipur): Built 100 km road using crowd-funded ₹86 lakh through social media — demonstrated how ethical motivation can overcome systemic constraints. Ashok Khemka (IAS, Haryana): Cancelled DLF-Vadra land deal despite political pressure — faced 54 transfers in 30 years — symbolises the cost of integrity in governance. T.N. Seshan (CEC): Enforced Model Code of Conduct stringently from 1990–96, transformed Indian elections — showed one person's ethical resolve can transform institutions.",
      governance: "Institutional mechanisms for ethical governance: (1) Central Vigilance Commission (CVC): Apex integrity institution; issues advisories; superintendence of CBI. (2) Lokpal (appointed 2019): Investigates corruption complaints against PM, Ministers, MPs, and Group A officers. (3) State Lokayuktas: Vary widely in powers; strongest in Karnataka, Maharashtra. (4) CAG: Constitutional audit — recent reports exposed coal block and 2G scams. (5) RTI Act 2005: Citizen's right to information — over 60 lakh applications/year; however, pendency at appellate level is high. (6) Whistle Blowers Protection Act, 2014: Yet to be fully notified; needs strengthening. (7) e-Governance: Reducing discretion and human interface through DBT, PFMS, GeM.",
      wayforward: "1. Enact a comprehensive Public Services Code binding on all levels of government — specifying rights, duties, and accountability. 2. Strengthen Lokpal by giving it independent investigation machinery rather than dependence on CBI. 3. Implement Whistleblower Protection Act fully with identity protection and witness protection. 4. Annual ethics audit of all ministries/departments by independent panels. 5. Values-based education at LBSNAA, state ATIs — case studies replacing only rule-book training. 6. Public disclosure of civil servants' assets and liabilities — digital registry. 7. 360-degree performance appraisal for senior officers including citizen feedback. 8. Mission Karmayogi: Scale iGOT platform to 20 lakh civil servants by 2025.",
      conclusion: "Ethics in governance is not a constraint on effective administration — it is its foundation. The corruption of public office is ultimately the corruption of public trust, and no development can be sustainable without that trust. India's transformational aspirations — inclusive growth, Viksit Bharat, social justice — can only be realised through a civil service that embodies Mahatma Gandhi's ideal of the 'last person test.' As Kautilya observed in the Arthashastra: 'Of all the forms of incompetence, moral incompetence is the greatest.'"
    }
  },
  "5": {
    topic: "Digital India Mission",
    gs: "gs2",
    date: "2024-11-01",
    wordCount: 2560,
    sections: {
      definition: "Digital India is a flagship programme of the Government of India launched on July 1, 2015, aimed at transforming India into a 'Digitally Empowered Society and Knowledge Economy.' It rests on three core pillars: (1) Digital Infrastructure as a Utility to Every Citizen — broadband, mobile connectivity, public internet access; (2) Governance and Services on Demand — integrated and interoperable e-services; (3) Digital Empowerment of Citizens — digital literacy, digital resources in Indian languages. Underlying it is the JAM Trinity (Jan Dhan–Aadhaar–Mobile), which enables direct and verifiable government-to-citizen (G2C) service delivery.",
      background: "India's digital journey began with the IT Act, 2000 (legal recognition of e-records and digital signatures). National e-Governance Plan (NeGP, 2006) set up 27 Mission Mode Projects including e-Courts, e-Procurement, and MCA-21. The Unique Identification Authority of India (UIDAI) was set up in 2009; Aadhaar enrolled its first beneficiary in 2010. The National Optical Fibre Network (NOFN), later BharatNet, was conceived in 2011 to connect 2.5 lakh gram panchayats. By 2014, India had 250 million internet users; by 2024, this crossed 90 crore — the world's 2nd largest internet population.",
      context: "Digital India has produced landmark outcomes: (1) UPI processed 16.6 billion transactions worth ₹23.5 lakh crore in March 2025 — world's largest real-time payment network. (2) Aadhaar has 1.35 billion enrollees — world's largest biometric identity system. (3) BharatNet connected 2.14 lakh gram panchayats (Phase I & II); Phase III targeting remaining 1.04 lakh GPs. (4) ONDC (Open Network for Digital Commerce) transacting 8 million orders/day by mid-2024 — democratising e-commerce beyond Amazon/Flipkart. (5) India is 3rd largest startup ecosystem globally (1.12 lakh DPIIT-recognised startups, 114 unicorns). (6) GeM portal: ₹4 lakh crore in government procurement by 2024.",
      constitution: "Constitutional basis: Article 19(1)(a) — Right to freedom of expression includes the right to access the internet (Kerala HC, Faheema Shirin case 2019; upheld by SC). Article 21 — Right to Privacy as fundamental right (K.S. Puttaswamy v. Union of India, 2017, 9-judge bench) underpins data protection framework. Article 19(2): Reasonable restrictions on internet/speech permissible — Section 69A IT Act for website blocking. Article 246A (GST Amendment, 2016): Digital infrastructure for GST Network (GSTN) — a constitutional underpinning for digital taxation.",
      schemes: "Key schemes under Digital India umbrella: (1) BharatNet: ₹61,109 crore; 2.5 lakh GP connectivity target. (2) PM Wani: Public Wi-Fi network through PDOAs (Public Data Office Aggregators) — 1.5 crore Wi-Fi hotspots by 2025. (3) DigiLocker: 35 crore registered users; 600+ document issuers; 6 billion documents issued. (4) PMGDISHA (PM Gramin Digital Saksharta Abhiyan): 6 crore rural citizens trained in digital literacy. (5) Common Service Centres (CSC): 5.5 lakh CSCs as digital service delivery points in every panchayat. (6) National Digital Health Mission (Ayushman Bharat Digital Mission): Health IDs for 53 crore beneficiaries. (7) e-Courts: 18,735 courts computerised; 21 crore case records online.",
      data: "Key data points: Internet users: 90 crore (Jan 2025), rural internet penetration 40%. Smartphone users: 84 crore (GSMA 2024). UPI: ₹200+ lakh crore annual transactions (2024–25). Aadhaar authentication: 75 billion+ authentications since inception. DigiLocker: 35 crore users, 6 billion documents. Startups: 1.12 lakh DPIIT-recognised; 114 unicorns (highest after USA, China). IT/BPM industry: $254 billion (FY24), employing 57 lakh professionals. Direct Benefit Transfer (DBT): ₹6.3 lakh crore saved from leakage since 2013 (MoF). India's digital economy: 10% of GDP (2024), target 20% by 2026.",
      challenges: "1. Digital divide: Rural-urban internet gap; women internet users 33% vs 57% men; only 31% rural women use smartphones. 2. Cybersecurity: India 3rd most attacked nation; CERT-In handled 13.91 lakh cyber incidents in 2022. 3. Data privacy: Digital Personal Data Protection Act (DPDPA) 2023 enacted but rules awaited; consent fatigue and data breaches (CoWIN, Aadhaar leaks). 4. Digital illiteracy: Only 38% Indians digitally literate (NSSO 2021). 5. Platform concentration: WhatsApp (500 million users), Google, Meta control critical digital infrastructure — sovereignty concerns. 6. AI/deepfake risks: Misinformation, electoral manipulation, voice cloning. 7. Last-mile connectivity: BharatNet operational challenges — dark fibre, O&M failures in remote areas.",
      legal: "IT Act, 2000 (amended 2008): Legal framework for e-commerce, cybercrimes (Sec 66 — hacking; Sec 66C — identity theft; Sec 67 — obscene content). IT (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021: Accountability of social media platforms >50 lakh users — grievance officer, traceability of messages. Digital Personal Data Protection Act, 2023: Consent-based processing, Data Fiduciaries and Data Principals, Data Protection Board. Aadhaar Act, 2016: Regulates use and storage of biometric data. CERT-In Rules (2022): 6-hour breach reporting mandate; VPN providers must log user data.",
      intl: "Estonia e-Residency: 20% of GDP from digital services; 99% government services online — global benchmark India references for DigiLocker and e-governance. Singapore Smart Nation: NDI (National Digital Identity), SGQR (unified QR code) — comparable to India Stack. European Union GDPR (2018): Gold standard for data protection — India's DPDPA draws heavily from it. African Union AU Data Policy Framework: India's Digital Public Infrastructure model being exported — NPCI International operating UPI in 9 countries. G20 Digital Economy Taskforce (India Presidency, 2023): New Delhi Declaration endorsed DPI as global public good.",
      governance: "Institutional architecture: Ministry of Electronics and IT (MeitY) — nodal ministry. Digital India Corporation (formerly NISG): Implements Digital India initiatives. UIDAI: Manages Aadhaar. NPCI: Operates UPI, RuPay, FASTag, NETC. TRAI: Regulates telecom including broadband quality. CERT-In: Cyber incident response. Data Protection Board: Under DPDPA 2023 (to be constituted). India Stack (open API ecosystem): Aadhaar API, UPI, DigiLocker, eSign, Account Aggregator — a layered DPI architecture enabling private sector innovation on public rails.",
      wayforward: "1. Implement DPDPA rules urgently — notify Data Protection Board to give teeth to privacy rights. 2. Expand BharatNet Phase III with a performance-based O&M framework (lessons from Phase I/II failures). 3. National AI Mission: ₹10,372 crore outlay — establish AI-ready data governance and safety frameworks. 4. Digital Rupee (e₹): Scale CBDC pilot from 1 million to 10 million users; enable offline use for Tier 3–4 cities. 5. Semiconductor Mission: ₹76,000 crore PLI to achieve chip self-sufficiency — reduce import dependence. 6. Multilingual digital content: Only 8% of Indian content in 22 scheduled languages — expand Bhashini AI translation. 7. Cybersecurity workforce: Train 5 lakh cybersecurity professionals by 2028 to meet demand.",
      conclusion: "Digital India has fundamentally altered the citizen-state relationship — from an opaque, rent-seeking system to one of increasing transparency and accountability. The JAM Trinity, UPI, and DigiLocker have created a digital infrastructure that rivals the best in the world. Yet the promise of a truly inclusive digital India remains unfulfilled as long as the digital divide persists along lines of gender, geography, and economic class. The next phase must focus on digital equity as much as digital capability — ensuring that the transformational power of technology reaches the last person in the last village, consistent with Mahatma Gandhi's Talisman and the Constitutional promise of social, economic, and political justice."
    }
  }
};

export const SAMPLE_PDFS = [
  { id: "1", name: "Economic Survey 2023-24.pdf",          ext: "PDF",  icon: "📄", size: "18.4 MB", pages: 312, chunks: 1842, status: "indexed", date: "2024-11-01" },
  { id: "2", name: "ARC 2nd Report - Ethics.pdf",          ext: "PDF",  icon: "📄", size: "4.2 MB",  pages: 148, chunks: 724,  status: "indexed", date: "2024-11-02" },
  { id: "3", name: "India Year Book 2024.pdf",             ext: "PDF",  icon: "📄", size: "22.1 MB", pages: 480, chunks: 2940, status: "indexed", date: "2024-11-03" },
  { id: "4", name: "NCERT Geography Class 11.pdf",         ext: "PDF",  icon: "📄", size: "8.7 MB",  pages: 204, chunks: 1120, status: "indexed", date: "2024-11-05" },
  { id: "5", name: "PIB Compilation Nov 2024.pdf",         ext: "PDF",  icon: "📄", size: "3.1 MB",  pages: 44,  chunks: 279,  status: "indexed", date: "2024-11-11" },
  { id: "6", name: "Vision IAS Current Affairs Oct.pdf",   ext: "PDF",  icon: "📄", size: "6.8 MB",  pages: 98,  chunks: 623,  status: "indexed", date: "2024-11-12" },
];

export const SAMPLE_CURRENT_AFFAIRS = [
  {
    id: "ca1", date: "2026-06-20", read: false,
    headline: "SC upholds 50% SHG reservation in Rajasthan gram panchayat elections",
    source: "The Hindu", gs: ["gs2", "raj"],
    tags: ["Women Empowerment", "Panchayati Raj", "Rajasthan"],
    summary: "The Supreme Court upheld Rajasthan's 50% seat reservation for SHG-affiliated women in gram panchayat chairperson posts, holding it valid under Article 15(3) of the Constitution.",
    relevance: "Women Empowerment note — constitutional provisions (Article 15(3)), 73rd Amendment; Rajasthan section.",
    noteId: "1",
  },
  {
    id: "ca2", date: "2026-06-19", read: false,
    headline: "Lakhpati Didi milestone: 1.15 crore women cross ₹1 lakh annual income mark",
    source: "PIB", gs: ["gs2", "gs3"],
    tags: ["Women Empowerment", "SHGs", "Rural Economy"],
    summary: "Ministry of Rural Development announces 1.15 crore women from SHGs have crossed the ₹1 lakh annual income threshold under the Lakhpati Didi initiative under DAY-NRLM.",
    relevance: "Women Empowerment note — Schemes section (DAY-NRLM, SHG empowerment). Update data in Schemes and Data sections.",
    noteId: "1",
  },
  {
    id: "ca3", date: "2026-06-18", read: false,
    headline: "India's FLFPR rises to 41.7% in 2025-26, highest since 2004: PLFS Annual Report",
    source: "MoSPI", gs: ["gs1", "gs2", "gs3"],
    tags: ["Women Empowerment", "Labour Force", "FLFPR"],
    summary: "PLFS 2025-26 shows Female Labour Force Participation Rate rising to 41.7%, driven by rural women in agriculture and allied activities. Previous figure was 37% (PLFS 2023).",
    relevance: "Women Empowerment note — Context and Data sections. Significant update to the FLFPR statistic.",
    noteId: "1",
  },
  {
    id: "ca4", date: "2026-06-17", read: true,
    headline: "IPCC Report: South Asia to see 2°C warming by 2050 under current policies",
    source: "IPCC / Down to Earth", gs: ["gs3"],
    tags: ["Climate Change", "Environment", "South Asia"],
    summary: "The IPCC Sixth Assessment Report warns South Asia will experience 2°C warming above pre-industrial levels by mid-century, intensifying extreme weather — floods, droughts, cyclones.",
    relevance: "Climate Change note — Context and Impacts sections. Add updated warming projections and South Asia specifics.",
    noteId: "3",
  },
  {
    id: "ca5", date: "2026-06-16", read: true,
    headline: "Rajasthan Smart City 2.0: Jaipur, Jodhpur get ₹2,400 crore under Mission 2.0",
    source: "Times of India", gs: ["gs2", "gs3", "raj"],
    tags: ["Urban Governance", "Smart Cities", "Rajasthan"],
    summary: "Centre approves Smart City Mission 2.0 allocations — Jaipur ₹1,800 crore and Jodhpur ₹600 crore — focused on integrated water management, CCTV networks, and digital services.",
    relevance: "Urban Flooding note — Governance section; Rajasthan state development context.",
    noteId: "2",
  },
  {
    id: "ca6", date: "2026-06-15", read: true,
    headline: "Digital India: 90 crore internet users as BharatNet Phase III nears completion",
    source: "MeitY", gs: ["gs2", "gs3"],
    tags: ["Digital India", "Technology", "Rural Connectivity"],
    summary: "India crosses 90 crore internet users with rural broadband penetration rising to 68% as BharatNet Phase III connects last-mile panchayats in 8 states.",
    relevance: "Digital India Mission note — all sections. Update statistics in Context and Data sections.",
    noteId: "5",
  },
  {
    id: "ca7", date: "2026-06-14", read: true,
    headline: "NCRB 2025: Crimes against women rise 8.7%; Rajasthan among top 5 states",
    source: "NCRB", gs: ["gs2", "gs1"],
    tags: ["Women Empowerment", "Crime Statistics", "Law Enforcement"],
    summary: "NCRB Annual Crime Report 2025 shows crimes against women increased 8.7% to 4.83 lakh cases. UP, Maharashtra, Rajasthan among states with highest absolute numbers.",
    relevance: "Women Empowerment note — Challenges section (update NCRB data from 4.45L to 4.83L); Rajasthan section.",
    noteId: "1",
  },
  {
    id: "ca8", date: "2026-06-13", read: true,
    headline: "India ratifies Kunming-Montreal Global Biodiversity Framework 30×30 target",
    source: "MoEF&CC", gs: ["gs3"],
    tags: ["Biodiversity", "Environment", "International Agreements"],
    summary: "India officially ratifies the 30×30 biodiversity target — conserving 30% of land and ocean by 2030 — under the Kunming-Montreal Global Biodiversity Framework (COP-15).",
    relevance: "Climate Change note — International Best Practices section. Add as a landmark global agreement.",
    noteId: "3",
  },
];

export const SAMPLE_QUIZ = [
  {
    id: "q1", type: "mcq", sectionId: "data", topic: "Women Empowerment",
    question: "As per WEF Global Gender Gap Index 2024, India's overall rank is:",
    options: ["101st", "117th", "127th", "142nd"],
    correct: 2,
    explanation: "India ranks 127th out of 146 countries in GGI 2024. India's worst rank is in Economic Participation (142nd out of 146).",
  },
  {
    id: "q2", type: "tf", sectionId: "constitution", topic: "Women Empowerment",
    question: "Article 15(3) of the Constitution empowers the State to make special provisions for women and children.",
    correct: true,
    explanation: "Article 15(3) is the constitutional basis for gender-specific reservations and welfare legislation, allowing the State to go beyond formal equality.",
  },
  {
    id: "q3", type: "mcq", sectionId: "schemes", topic: "Women Empowerment",
    question: "Which scheme improved India's Sex Ratio at Birth from 918 (2014-15) to 934 (2022-23)?",
    options: ["Ujjwala Yojana", "Beti Bachao Beti Padhao", "Sukanya Samriddhi Yojana", "PM Mahila Shakti Kendra"],
    correct: 1,
    explanation: "BBBP combined PCPNDT Act enforcement, community awareness, and girl education — directly reversing the skewed sex ratio at birth.",
  },
  {
    id: "q4", type: "mcq", sectionId: "casestudies", topic: "Women Empowerment",
    question: "Kudumbashree — the world's largest women-led poverty eradication programme — operates in:",
    options: ["Tamil Nadu", "Andhra Pradesh", "Maharashtra", "Kerala"],
    correct: 3,
    explanation: "Kudumbashree is Kerala's flagship initiative — 4.7 million women in SHGs generating over ₹5,000 crore in annual turnover.",
  },
  {
    id: "q5", type: "tf", sectionId: "judgements", topic: "Women Empowerment",
    question: "The Vishaka v. State of Rajasthan (1997) SC judgment directly led to the POSH Act, 2013.",
    correct: true,
    explanation: "The Vishaka guidelines served as the legal framework for workplace sexual harassment for 16 years until the Sexual Harassment of Women at Workplace (POSH) Act, 2013 codified them.",
  },
  {
    id: "q6", type: "mcq", sectionId: "data", topic: "Women Empowerment",
    question: "India's Female Labour Force Participation Rate (FLFPR) as per PLFS 2023 stood at approximately:",
    options: ["24%", "31%", "37%", "43%"],
    correct: 2,
    explanation: "FLFPR stands at 37% (PLFS 2023), below the global average of 47%. It has improved significantly from ~23% in 2017-18.",
  },
  {
    id: "q7", type: "mcq", sectionId: "intl", topic: "Women Empowerment",
    question: "Which country has the highest proportion of women in Parliament globally (as of 2024)?",
    options: ["Sweden", "Iceland", "Rwanda", "New Zealand"],
    correct: 2,
    explanation: "Rwanda has 61% women in its Parliament — the highest globally — achieved through a quota system instituted after the 1994 genocide.",
  },
  {
    id: "q8", type: "tf", sectionId: "anthro", topic: "Women Empowerment",
    question: "The Khasi tribe of Meghalaya follows a matrilineal kinship system where property passes through the female line.",
    correct: true,
    explanation: "The Khasi are a classic matrilineal society — property and clan identity descend through the mother, conferring higher social agency and inheritance rights on women.",
  },
  {
    id: "q9", type: "mcq", sectionId: "context", topic: "Women Empowerment",
    question: "The Nari Shakti Vandan Act 2023 provides what percentage reservation for women in Parliament?",
    options: ["25%", "33%", "40%", "50%"],
    correct: 1,
    explanation: "The Act provides 33% reservation for women in Lok Sabha and State Assemblies, effective after the next census-based delimitation exercise.",
  },
  {
    id: "q10", type: "mcq", sectionId: "ethics", topic: "Women Empowerment",
    question: "Whose 'Capability Approach' argues that women must have freedom to live lives they have reason to value?",
    options: ["John Rawls", "Martha Nussbaum", "Amartya Sen", "Immanuel Kant"],
    correct: 2,
    explanation: "Amartya Sen's Capability Approach (extended by Martha Nussbaum's 10 Central Capabilities) is the foundational ethical framework for women's empowerment policy.",
  },
];

export const GS_TOPICS = {
  gs1: {
    label: "GS I — History, Geography & Society", color: "#7C3AED", bg: "#F5F3FF",
    topics: [
      { id: "g1t1",  name: "Modern Indian History (1757–1947)",            status: "noted",   revisions: 2 },
      { id: "g1t2",  name: "Post-Independence Consolidation",               status: "pending", revisions: 0 },
      { id: "g1t3",  name: "World History — Colonialism, World Wars",       status: "pending", revisions: 0 },
      { id: "g1t4",  name: "Indian Society — Salient Features",             status: "noted",   revisions: 1 },
      { id: "g1t5",  name: "Women Empowerment & Gender Issues",             status: "noted",   revisions: 3 },
      { id: "g1t6",  name: "Poverty & Developmental Issues",                status: "pending", revisions: 0 },
      { id: "g1t7",  name: "Urbanisation — Problems & Remedies",            status: "noted",   revisions: 1 },
      { id: "g1t8",  name: "Indian Geography — Physical Features",          status: "pending", revisions: 0 },
      { id: "g1t9",  name: "Distribution of Key Natural Resources",         status: "pending", revisions: 0 },
      { id: "g1t10", name: "Geophysical Phenomena — Earthquakes, Cyclones", status: "pending", revisions: 0 },
    ],
  },
  gs2: {
    label: "GS II — Polity, Governance & IR", color: "#0369A1", bg: "#F0F9FF",
    topics: [
      { id: "g2t1",  name: "Indian Constitution — Features & Amendments",   status: "noted",   revisions: 2 },
      { id: "g2t2",  name: "Parliament & State Legislatures",               status: "noted",   revisions: 1 },
      { id: "g2t3",  name: "Executive, Judiciary & Tribunals",              status: "pending", revisions: 0 },
      { id: "g2t4",  name: "Panchayati Raj & Urban Local Bodies",           status: "noted",   revisions: 1 },
      { id: "g2t5",  name: "Government Policies & Schemes",                 status: "noted",   revisions: 2 },
      { id: "g2t6",  name: "Role of Civil Services in Democracy",           status: "pending", revisions: 0 },
      { id: "g2t7",  name: "India & Neighbours — Bilateral Relations",      status: "pending", revisions: 0 },
      { id: "g2t8",  name: "Important International Institutions (UN, WTO)",status: "noted",   revisions: 1 },
      { id: "g2t9",  name: "Health, Education & Human Resources",           status: "noted",   revisions: 1 },
      { id: "g2t10", name: "Welfare Schemes for Vulnerable Sections",       status: "noted",   revisions: 2 },
    ],
  },
  gs3: {
    label: "GS III — Economy, Environment & Security", color: "#047857", bg: "#ECFDF5",
    topics: [
      { id: "g3t1",  name: "Indian Economy — Planning, Growth, Development",status: "noted",   revisions: 1 },
      { id: "g3t2",  name: "Agriculture, Food Security, PDS",               status: "pending", revisions: 0 },
      { id: "g3t3",  name: "Infrastructure — Energy, Ports, Roads",         status: "pending", revisions: 0 },
      { id: "g3t4",  name: "Science & Technology — Space, Bio, Nano",       status: "noted",   revisions: 2 },
      { id: "g3t5",  name: "Environment & Biodiversity Conservation",       status: "noted",   revisions: 1 },
      { id: "g3t6",  name: "Climate Change — Causes & Mitigation",          status: "noted",   revisions: 2 },
      { id: "g3t7",  name: "Disaster Management",                           status: "noted",   revisions: 1 },
      { id: "g3t8",  name: "Internal Security — Extremism, Insurgency",     status: "pending", revisions: 0 },
      { id: "g3t9",  name: "Cyber Security & Money Laundering",             status: "pending", revisions: 0 },
      { id: "g3t10", name: "Digital Economy & Gig Economy",                 status: "noted",   revisions: 1 },
    ],
  },
  gs4: {
    label: "GS IV — Ethics, Integrity & Aptitude", color: "#B45309", bg: "#FFFBEB",
    topics: [
      { id: "g4t1", name: "Ethics & Human Interface",                       status: "noted",   revisions: 1 },
      { id: "g4t2", name: "Attitude, Aptitude & Foundational Values",       status: "pending", revisions: 0 },
      { id: "g4t3", name: "Emotional Intelligence in Governance",           status: "pending", revisions: 0 },
      { id: "g4t4", name: "Ethics in Public Administration",                status: "noted",   revisions: 2 },
      { id: "g4t5", name: "Probity in Governance — Accountability",        status: "pending", revisions: 0 },
      { id: "g4t6", name: "Case Studies — Ethical Dilemmas",               status: "noted",   revisions: 1 },
      { id: "g4t7", name: "Thinkers — Contributions to Ethics",            status: "noted",   revisions: 1 },
      { id: "g4t8", name: "International Relations — Ethical Issues",      status: "pending", revisions: 0 },
    ],
  },
};

// TODAY = 2026-06-20 (system date)
export const REVISION_DATA = [
  { noteId: "1", topic: "Women Empowerment",   gs: "gs2", lastRevised: "2026-06-18", revisionCount: 3, nextDue: "2026-06-25" },
  { noteId: "2", topic: "Urban Flooding",       gs: "gs3", lastRevised: "2026-06-10", revisionCount: 2, nextDue: "2026-06-17" },
  { noteId: "3", topic: "Climate Change",       gs: "gs3", lastRevised: "2026-06-19", revisionCount: 4, nextDue: "2026-07-03" },
  { noteId: "4", topic: "Ethics in Governance", gs: "gs4", lastRevised: "2026-06-05", revisionCount: 1, nextDue: "2026-06-12" },
  { noteId: "5", topic: "Digital India Mission",gs: "gs2", lastRevised: "2026-06-15", revisionCount: 2, nextDue: "2026-06-22" },
];

// ── DAY 5 ──────────────────────────────────────────────────────────────
// UPSC Mains 2026 approximate date
export const EXAM_DATE = "2026-09-20";

// Essay topic bank
export const ESSAY_TOPICS = [
  { id: "e1",  title: "Women empowerment: Rhetoric vs. Reality",                                 category: "Society",       gs: "ess", difficulty: "medium", year: 2017 },
  { id: "e2",  title: "Forests are the best case study for a country's commitment to environment", category: "Environment",   gs: "ess", difficulty: "hard",   year: 2022 },
  { id: "e3",  title: "Attitude is a small thing that makes a big difference",                   category: "Philosophy",    gs: "ess", difficulty: "easy",   year: 2016 },
  { id: "e4",  title: "Has digital technology bridged or deepened social inequalities?",          category: "Technology",    gs: "ess", difficulty: "hard",   year: null },
  { id: "e5",  title: "Education without values, as useful as it is, seems rather to make man a more clever devil", category: "Education", gs: "ess", difficulty: "medium", year: 2015 },
  { id: "e6",  title: "Cooperative federalism: dream or reality?",                               category: "Polity",        gs: "ess", difficulty: "medium", year: 2019 },
  { id: "e7",  title: "Can capitalism bring inclusive growth?",                                   category: "Economy",       gs: "ess", difficulty: "hard",   year: 2015 },
  { id: "e8",  title: "Poverty anywhere is a threat to prosperity everywhere",                   category: "Society",       gs: "ess", difficulty: "medium", year: 2018 },
  { id: "e9",  title: "India's global ambitions and the restraints of its domestic challenges",  category: "Polity",        gs: "ess", difficulty: "hard",   year: null },
  { id: "e10", title: "A good life is one inspired by love and guided by knowledge",             category: "Philosophy",    gs: "ess", difficulty: "easy",   year: 2018 },
  { id: "e11", title: "Technology is best when it brings people together",                       category: "Technology",    gs: "ess", difficulty: "easy",   year: null },
  { id: "e12", title: "Climate change: The greatest market failure of all time",                 category: "Environment",   gs: "ess", difficulty: "hard",   year: null },
  { id: "e13", title: "Are we losing our democratic institutions?",                              category: "Polity",        gs: "ess", difficulty: "hard",   year: null },
  { id: "e14", title: "The past cannot be changed, the future is yet in your power",            category: "Philosophy",    gs: "ess", difficulty: "easy",   year: null },
  { id: "e15", title: "Social media is making us more connected but less social",               category: "Society",       gs: "ess", difficulty: "medium", year: null },
];

export const ESSAY_CATEGORIES = ["All", "Society", "Environment", "Philosophy", "Technology", "Polity", "Economy", "Education"];

export const ESSAY_STRUCTURE = [
  { id: "hook",       label: "Hook / Opening",            icon: "🎯", hint: "Start with a striking quote, paradox, anecdote, or startling statistic that arrests attention.", wordTarget: 80 },
  { id: "context",    label: "Context & Background",      icon: "📖", hint: "Set the stage — historical, constitutional, social or policy backdrop. Why does this topic matter now?", wordTarget: 150 },
  { id: "thesis",     label: "Thesis / Central Argument", icon: "💡", hint: "State your core argument clearly in 2–3 sentences. This is your essay's spine.", wordTarget: 80 },
  { id: "body1",      label: "Body — Dimension I",        icon: "🔍", hint: "Social / economic / historical dimension. Use data, examples, schemes, committees.", wordTarget: 250 },
  { id: "body2",      label: "Body — Dimension II",       icon: "🔍", hint: "Political / governance / constitutional angle. Landmark judgements, Articles, institutions.", wordTarget: 250 },
  { id: "body3",      label: "Body — Way Forward",        icon: "🚀", hint: "Policy solutions, global comparisons, civil society role, SDG linkages.", wordTarget: 200 },
  { id: "counter",    label: "Counter-argument & Rebuttal", icon: "⚖️", hint: "Acknowledge the strongest objection and rebut it. Shows intellectual honesty.", wordTarget: 100 },
  { id: "conclusion", label: "Conclusion",                icon: "🏁", hint: "End with optimism, a call to action, or a resonant quote. Circle back to the hook.", wordTarget: 100 },
];

export const SAMPLE_ESSAY_CONTENT = {
  topicId: "e1",
  sections: {
    hook:       "\"The most common way people give up their power is by thinking they don't have any.\" — Alice Walker. This paradox captures the essence of Women Empowerment in India: despite constitutional guarantees, flagship schemes, and progressive legislation, millions of women navigate a labyrinth of social, economic, and institutional barriers that reduce 'empowerment' to a policy slogan rather than a lived reality.",
    context:    "India's engagement with women's rights dates to the Constituent Assembly debates, where B.R. Ambedkar enshrined gender equality in Articles 14, 15, and 16. The decades that followed produced landmark milestones — the 73rd Amendment reserving one-third Panchayat seats for women, the Protection of Women from Domestic Violence Act 2005, Beti Bachao Beti Padhao 2015, and the Maternity Benefit (Amendment) Act 2017. Yet the Global Gender Gap Report 2023 ranks India 127th out of 146 nations, a sobering reminder that legislative intent and social reality often inhabit separate universes.",
    thesis:     "Women empowerment in India remains a tale of two worlds: an aspirational narrative written in policy documents and a harsher reality inscribed in data on labour participation, safety, health, and political representation. Bridging this chasm demands moving beyond rhetoric toward structural transformation — in patriarchal mindsets, economic systems, and institutional accountability.",
    body1:      "Economically, the gulf is stark. India's Female Labour Force Participation Rate (FLFPR) stands at a mere 24% (PLFS 2023), among the lowest globally, despite women constituting 48% of the population. The 'missing women from the workforce' phenomenon is driven by the triple burden of unpaid domestic labour, limited mobility, and social stigma around women working outside the home. Self-Help Groups (SHGs) — 12 crore members under DAY-NRLM — have emerged as transformative vehicles, linking women to credit, livelihood, and social capital. The success of Kudumbashree in Kerala demonstrates how collective economic agency can shatter structural poverty. Yet the gender pay gap persists at approximately 19% (ILO, 2023), and women's ownership of productive assets — land, property, enterprise — remains disproportionately low.",
    body2:      "Constitutionally and politically, the picture is mixed. The 33% reservation in local bodies has produced over 15 lakh elected women representatives — the world's largest such experiment in democratic participation. Emerging leaders like the 'Sarpanch Patni' phenomenon (where male relatives proxy-govern) reveal that reservation without social change produces hollow representation. At the national level, women hold just 15.2% of Lok Sabha seats (18th Lok Sabha, 2024), well below the global average of 26.5%. The Women's Reservation Act (Nari Shakti Vandan Adhiniyam) 2023 — reserving 33% seats in Parliament — is a watershed, yet its implementation awaits delimitation, pushing effective change to 2029 at the earliest. The judiciary has been a progressive force: the Supreme Court's rulings in Vishakha (1997), Joseph Shine (2018 decriminalising adultery), and the Triple Talaq judgment (2017) have expanded women's freedoms against entrenched patriarchy.",
    body3:      "The way forward requires convergence across four domains. First, economic: universalise the PM Vishwakarma and Mudra schemes with gender-targeted credit, expand women's access to land titles, and mainstream gender-responsive budgeting (currently ₹2.23 lakh crore in 2023–24). Second, educational: sustain momentum from the gender parity achieved in elementary education (GPI 1.04) toward secondary and STEM enrolment. Third, safety: fast-track implementation of the POSH Act across the informal economy where 90% of women work. Fourth, mindset: integrate gender-sensitivity curricula from primary school, supported by community-led campaigns modelled on the 'Beti Padhao' communication strategy. India's Sustainable Development Goal 5 (Gender Equality) commitments by 2030 provide the accountability scaffold.",
    counter:    "Critics argue that empowerment frameworks imposed through state schemes risk homogenising diverse women's experiences across caste, class, and region — a 'one size fits all' fallacy. A Dalit woman in rural Rajasthan and an urban professional face categorically different constraints. This critique is valid but incomplete: systemic interventions and localised agency are not mutually exclusive. The SHG model, for instance, adapts to local contexts while channelling institutional resources.",
    conclusion: "Empowerment, at its core, is the expansion of choice — economic, social, political, and personal. India has written the grammar of gender justice in its laws and policies; the urgent work now is to speak that language in every village, factory, and family. When women participate fully in India's growth story, the nation does not merely gain half its population — it multiplies its potential. As the Rigveda reminds us, 'Where women are honoured, the gods rejoice.' The time to move from rhetoric to reality is not tomorrow — it is today.",
  },
};

/* Map of sample essays for all 15 topics — keyed by topic id */
export const ESSAY_SAMPLES = {
  e1: SAMPLE_ESSAY_CONTENT.sections,

  e2: {
    hook:       "\"The clearest way into the Universe is through a forest wilderness.\" — John Muir. A nation's relationship with its forests is not merely an ecological question — it is a moral confession. When a country preserves its forests, it reveals its commitment to future generations; when it destroys them, it confesses the bankruptcy of its developmental vision.",
    context:    "India's forest cover stands at 21.71% of geographical area (FSI 2021) — short of the 33% target enshrined in the National Forest Policy 1988. Historically, the British colonial regime drove aggressive deforestation for railways and agriculture, a legacy that independent India tried to reverse through the Forest Conservation Act 1980, the Biological Diversity Act 2002, and CAMPA (Compensatory Afforestation Fund). The Forest Rights Act 2006 recognised tribal communities as custodians of forests, while Project Tiger (1973) and National Parks network (108 parks, 56 Tiger Reserves) have produced conservation successes.",
    thesis:     "Forests are the most unambiguous litmus test of a nation's environmental commitment because they are slow to grow and swift to fall. India's forest governance reveals a paradox — progressive laws coexist with accelerating encroachment, diversion for mining, and infrastructure expansion — exposing the gap between environmental rhetoric and developmental realpolitik.",
    body1:      "The ecological dimension is staggering. India's forests support 8% of the world's biodiversity, store 7,083 million tonnes of carbon (FSI 2021), regulate the South Asian monsoon, and sustain the water security of 600 million people through river basin integrity. The tiger population's recovery — from 1,411 (2006) to 3,167 (2022) under Project Tiger — is a global conservation triumph. Yet, 2019–2021 saw India lose 1.5 million hectares of tree cover (Global Forest Watch), driven by road projects, coal mining, and agricultural conversion. Compensatory afforestation — planting saplings elsewhere — fails to replicate old-growth ecosystem services, a scientific reality that policy conveniently ignores.",
    body2:      "Institutionally, the Supreme Court's T.N. Godavarman case (1996–ongoing) placed all forests under judicial oversight, mandating central government permission for any diversion. The Forest Amendment Rules 2022 controversially exempted linear infrastructure projects below 5 hectares from forest clearance, drawing criticism from ecologists. The tension between the Ministry of Environment's conservation mandate and the Ministry of Coal's extraction imperatives is a structural contradiction in Indian governance. Internationally, India's commitments under the Paris Agreement (create additional carbon sink of 2.5–3 billion tonne CO₂ equivalent by 2030) and the Kunming-Montreal Biodiversity Framework (30×30 — protect 30% land by 2030) demand accelerated forest protection.",
    body3:      "The way forward lies in three shifts. First, value forests beyond timber — India's ecosystem services valuation (TEEB study) showed forests providing ₹1.4 lakh crore annually, yet national accounts treat them as zero. Second, empower forest communities: where forest rights are secure, deforestation rates are provably lower — the FRA's full implementation is both a justice and conservation imperative. Third, tech-enable enforcement: ISRO's real-time forest monitoring satellite data should feed district-level deforestation alerts, enabling rapid response.",
    counter:    "Development advocates argue that India cannot afford to lock away resources when 800 million people need infrastructure, energy, and livelihoods. Forest diversion for critical minerals (cobalt, lithium for green energy) and hydropower presents a genuine dilemma. This tension is real but resolvable: smart siting of infrastructure that avoids biodiversity hotspots, rigorous environmental impact assessment, and genuine (not superficial) compensatory afforestation can reconcile development with conservation.",
    conclusion: "The forest is not a resource to be extracted — it is a relationship to be maintained. India's constitutional duty to protect the environment (Article 48A, Article 51A(g)) is not aspirational — it is binding. When a government protects a forest, it is not sacrificing development; it is investing in the most durable form of it. As Sundarlal Bahuguna declared, 'Ecology is the permanent economy.' The true measure of a nation's greatness is not the skyline it builds — it is the forests it keeps.",
  },

  e3: {
    hook:       "\"Whether you think you can or you think you can't — you're right.\" — Henry Ford. In these nine words lies the entire psychology of human potential. Attitude is that invisible architecture of the mind that determines whether the same circumstances produce heroes or victims, innovators or stagnators, great nations or failed states.",
    context:    "From Stoic philosophers who taught that we cannot control events but only our response to them, to Viktor Frankl who survived Nazi concentration camps by choosing his attitude toward suffering, human history is a testament to the outsized power of mindset. Modern psychology — from Carol Dweck's 'growth mindset' research at Stanford to Martin Seligman's positive psychology — has now scientifically validated what philosophy knew intuitively: attitude shapes outcomes more than aptitude.",
    thesis:     "Attitude is not merely a personality trait — it is a civilisational determinant. At the individual level, it separates resilience from despair; at the organisational level, it divides innovation from stagnation; at the national level, it distinguishes developing from developed. The cultivation of a constructive, growth-oriented attitude is therefore the most democratic form of self-empowerment available to every human being.",
    body1:      "At the individual level, attitude manifests as the lens through which experience is interpreted. Research by psychologist Angela Duckworth shows that 'grit' — a combination of passion and perseverance — predicts success better than IQ across domains from military training to chess. India's own history offers compelling evidence: Kalpana Chawla from a small Haryana town who became a NASA astronaut; Dashrath Manjhi, the 'Mountain Man' of Bihar who spent 22 years carving a road through a mountain with a hammer and chisel after his wife died for lack of medical access — not because he had resources, but because his attitude refused to accept defeat as permanent.",
    body2:      "At the governance and institutional level, attitude determines the character of public service. The distinction between an officer who sees a citizen's problem as an opportunity to help versus one who sees it as an administrative burden is entirely attitudinal — their training, rules, and resources are identical. India's National Training Policy 2012 recognised this, mandating attitudinal training for civil servants alongside technical skills. The success of the 'Swachh Bharat Mission' was not merely logistical — it was attitudinal: changing India's public consciousness around sanitation from fatalism ('it has always been this way') to possibility ('we can change this').",
    body3:      "Cultivating a constructive national attitude requires investment in three areas. First, education systems must shift from rote learning that rewards compliance to inquiry-based learning that rewards curiosity — because curiosity is an attitudinal orientation. Second, public discourse must celebrate effort and intelligent failure, not just success — India's startup ecosystem is beginning to do this. Third, leadership at every level — political, corporate, educational — must model the attitudes it wishes to see: integrity, empathy, and a long-term orientation over short-term gains.",
    counter:    "Cynics argue that emphasising attitude is a bourgeois consolation — telling a structurally disadvantaged person to 'change your attitude' without changing their circumstances is cruel misdirection. This critique deserves respect: attitude cannot substitute for nutrition, education, healthcare, or economic opportunity. The answer is that attitude and structural change are not alternatives — they are complements. Attitude determines how effectively individuals use the opportunities that structural change creates.",
    conclusion: "Winston Churchill said, 'Attitude is a small thing that makes a big difference.' But perhaps it is not small at all — it is the compound interest of the mind, small daily choices that accumulate into the trajectory of a life, an institution, a nation. India, standing at the cusp of becoming a developed economy by 2047, will be shaped not just by its GDP or infrastructure — but by the attitude of its 1.4 billion citizens toward work, toward each other, and toward the future. That is the small thing. That is everything.",
  },

  e4: {
    hook:       "\"The internet is the world's largest library. It's just that all the books are on the floor.\" — John Allen Paulos. This metaphor captures digital technology's paradox with eerie precision: unprecedented access to information coexists with unprecedented fragmentation of attention, opportunity, and social cohesion. The digital revolution promised to democratise everything — and it has, selectively.",
    context:    "India's digital story is one of simultaneous triumph and tension. The JAM trinity (Jan Dhan–Aadhaar–Mobile) enabled direct benefit transfer of ₹27 lakh crore, eliminating middlemen and reaching 53 crore accounts. UPI processed 13,116 crore transactions worth ₹199 lakh crore in 2023–24 — a genuine leapfrog in financial inclusion. Yet 37% of Indians lack internet access (TRAI 2023), women's internet usage is 40% lower than men's, and 70% of rural India remains on the wrong side of the digital divide.",
    thesis:     "Digital technology is neither inherently equalising nor inherently divisive — it is an amplifier. In the hands of the already-privileged, it multiplies advantage. In the hands of the newly-connected, it can be transformative. Whether it bridges or deepens inequality depends entirely on the policy framework, the infrastructure investment, and the digital literacy architecture that surrounds it.",
    body1:      "The evidence for bridging is real and growing. e-Nam (electronic National Agriculture Market) has connected 1.75 crore farmers to 1,000+ mandis, enabling price discovery and reducing intermediary exploitation. Telehealth platforms connected 77 lakh patients in rural areas during COVID-19. EdTech platforms reached 25 crore students through DIKSHA during school closures. For women entrepreneurs in Tier-2 cities, platforms like Meesho have created entirely new income streams. The key insight is that when technology meets genuine connectivity and literacy, it functions as a great equaliser.",
    body2:      "The evidence for deepening inequality is equally real. The shift to digital-first government services (Aadhaar-linked, app-based) has excluded elderly, disabled, and illiterate citizens — 'digital exclusion of the excluded'. The COVID-induced shift to online education collapsed learning for 250 million children without devices (ASER 2021). Gig economy platforms (Swiggy, Uber) have created new forms of precarious labour without social security. Algorithmic systems in credit scoring, hiring, and policing have been shown globally to perpetuate and amplify existing biases. India's own facial recognition tenders have raised serious civil liberties concerns.",
    body3:      "Bridging the divide requires a three-pronged strategy. First, universal infrastructure: BharatNet must achieve its 250,000 Gram Panchayat broadband target with quality, not merely coverage. Second, digital literacy at scale: PM e-Vidya and Digital Saksharta Abhiyan need to reach 500 million citizens with functional, not ceremonial, training. Third, regulatory equity: TRAI must enforce affordable pricing, the Personal Data Protection Act must protect citizens' data from corporate extraction, and AI governance frameworks must mandatorily audit for bias.",
    counter:    "Techno-optimists argue that connectivity itself is self-correcting — once people get online, they will educate themselves and find opportunities. Historical parallels are invoked: TV was once said to corrupt; mobile phones were said to waste time; both became tools of empowerment. This optimism is partially justified but dangerously passive — the early adopters of technology are always the already-privileged, and without active policy intervention, the gap compounds before it narrows.",
    conclusion: "The digital divide is not a technology problem — it is a justice problem dressed in technological clothing. India's aspiration to become a $5 trillion economy on the back of digital innovation cannot be realised if 500 million citizens are spectators to rather than participants in the digital economy. The question is not whether technology will transform India — it will. The question is whether India will ensure that transformation lifts all boats, or only the yachts.",
  },

  e5: {
    hook:       "\"The good man is not merely the one who knows the difference between right and wrong — but the one who acts rightly when it costs something.\" — C.S. Lewis. Education that sharpens the intellect but dulls the conscience produces not citizens but cleverly dangerous individuals — capable of articulating justice while engineering injustice.",
    context:    "The question of values in education is as ancient as education itself. Plato's Republic insisted that the purpose of education was the formation of just souls, not merely skilled workers. India's own tradition, from the Gurukul system to Tagore's Shantiniketan, placed character formation at the centre of learning. The Kothari Commission (1964–66) declared that the 'destiny of India is being shaped in its classrooms' — and warned that without moral education, knowledge becomes a weapon in the hands of the unscrupulous.",
    thesis:     "C.S. Lewis's warning — that education without values makes cleverer devils — is not hyperbole; it is diagnosis. The global financial crisis of 2008, manufactured by Harvard and Wharton graduates; the corruption scandals engineered by IAS officers; the environmental destruction approved by technically sophisticated bureaucrats — all demonstrate that intellectual sophistication without ethical grounding produces catastrophically dangerous competence.",
    body1:      "The evidence that India's current education system inadequately addresses values is visible in its outputs. The NIRF rankings measure research output, placements, and faculty quality — but not ethical formation. India produces 1.5 million engineers annually, yet surveys consistently show that only 20–25% are 'industry-ready' — and readiness surveys increasingly cite integrity, empathy, and communication as the deficit, not technical skills. The Vyapam scam, involving thousands of educated individuals in systematic cheating, illustrates what education without values looks like at scale.",
    body2:      "The Indian Constitution attempted to address this through Fundamental Duties (Article 51A), which include duties to develop scientific temper, humanist outlook, and spirit of inquiry. The National Education Policy 2020 represents a renewed commitment, embedding 'Indian value systems' and ethical reasoning across the curriculum. But implementation remains patchy. Moral Science classes in most schools are either absent or reduced to rote memorisation of fables — the pedagogical equivalent of teaching swimming by reading about water.",
    body3:      "Transforming education into a values-forming enterprise requires three shifts. First, pedagogy: move from lecture-and-test to problem-based learning that confronts students with genuine ethical dilemmas — case studies, community service, and deliberative classroom democracy. Second, teachers: teacher training must include emotional intelligence and values education modules; teachers cannot model what they have not experienced. Third, assessment: alongside marks, schools should track participation in community service, conflict resolution, and collaborative projects — behaviours that reveal character.",
    counter:    "The counter-argument holds that values are properly the domain of family and religion, not the state's educational apparatus; that state-mandated values risk becoming ideological indoctrination. This concern is legitimate — the history of 20th-century totalitarianism shows what 'values education' controlled by the state can become. The answer is not to abandon values education but to design it around universal ethical principles — empathy, honesty, justice, respect for diversity — that transcend ideology.",
    conclusion: "Tagore wrote that education's purpose is to create a man 'in harmony with all existence.' India needs graduates who are not merely competent but conscientious — who carry their skills in service of their communities, not at the expense of them. A doctor who heals, a bureaucrat who serves, an engineer who builds sustainably — these are not utopian fantasies; they are the product of education that places values at its core. Without this, we produce, as Lewis warned, 'more clever devils.' With it, we build the India the Constitution dreamed of.",
  },

  e6: {
    hook:       "\"In a federal state, the centre must be strong, but the states must be stronger.\" — A paradox that India has spent 75 years trying to resolve. Cooperative federalism is the attempt to transform this tension into synergy — to build a nation where the Union and States compete not for power, but collaborate for people.",
    context:    "India's federalism was always 'quasi-federal with a unitary bias' (K.C. Wheare). The Emergency (1975–77), the misuse of Article 356 over 100 times, the control of key subjects through the Concurrent List, the vertical fiscal imbalance where States collect 40% of revenue but bear 60% of expenditure — all represent the historical subordination of states to the centre. The Finance Commission (15th FC: 41% tax devolution to states), NITI Aayog's replacement of the Planning Commission, and the GST Council have begun to rebalance the equation.",
    thesis:     "Cooperative federalism remains more dream than reality in India. While institutional mechanisms for cooperation exist — GST Council, Inter-State Council, Zonal Councils — they function episodically rather than systematically. Political polarisation between ruling parties at the Centre and States has increasingly converted cooperative federalism into competitive federalism, and at times, confrontational federalism.",
    body1:      "The GST Council is India's most successful experiment in cooperative federalism. With representatives from all 29 States plus the Union, operating on consensus rather than voting, it has transformed indirect taxation from a complex multi-tier system into a unified market. However, even here, fissures are visible: the compensation cess dispute during COVID-19, where states claimed the Centre owed them ₹2.69 lakh crore, revealed the fragility of trust. The 15th Finance Commission's allocation of 41% devolution to states was a significant step, but the Centre's increasing reliance on cesses and surcharges (which are not shareable) effectively reduces the real devolution.",
    body2:      "The political dimension of cooperative federalism is increasingly strained. The Governor's office — constitutionally a neutral constitutional authority — has become a political flashpoint in states like West Bengal, Maharashtra, Tamil Nadu, and Kerala, where Governors have delayed Bills, withheld assent, and destabilised elected governments. The Supreme Court's interventions in the Nabam Rebia case (Arunachal Pradesh) and the Shiv Sena case (Maharashtra) reflect judicial concern about the weaponisation of federal mechanisms. NITI Aayog, designed as a collaborative policy forum, has been criticised by opposition-ruled states for being a Centre-directed body rather than a genuinely deliberative platform.",
    body3:      "Making cooperative federalism real requires institutional reform: operationalise the Inter-State Council through quarterly mandatory meetings with a binding agenda; amend the Governors' appointment process to require consultation with state governments; expand the GST Council model to health, education, and agriculture; and implement the Punchhi Commission recommendation of 'localisation' — greater devolution to the third tier of government (Panchayats and urban local bodies). Fiscal federalism must evolve to honour the spirit of the 14th Finance Commission's historic 42% devolution by plugging the cess-and-surcharge loophole.",
    counter:    "Critics argue that strong central authority is necessary for India's national security, economic integration, and management of inter-state river disputes, disaster response, and anti-terrorism. They point to the failure of cooperative federal models in Pakistan and the success of India's centralised response during COVID-19. This argument has merit: the 'cooperative' in cooperative federalism must not become a cover for centrifugal fragmentation. The goal is structured cooperation, not unilateral state autonomy.",
    conclusion: "B.R. Ambedkar warned that India is a union of states, not a federation of states — the distinction matters. The strength of India's democracy rests on its pluralism, and its pluralism is protected by genuine federalism. Cooperative federalism is not a concession of the Centre — it is an investment in national cohesion. When a Chief Minister and a Prime Minister sit at the same table as equal partners solving the problems of citizens, that is when India becomes not just a republic — but a federal republic in the fullest sense.",
  },

  e7: {
    hook:       "\"The inherent vice of capitalism is the unequal sharing of blessings; the inherent virtue of socialism is the equal sharing of miseries.\" — Winston Churchill. Between these two poles, the question of capitalism and inclusive growth occupies the central ground of 21st-century political economy — can a system designed around the profit motive be engineered to serve the many, not just the few?",
    context:    "The global history of capitalism is a history of extraordinary wealth creation accompanied by extraordinary wealth concentration. The Industrial Revolution lifted millions from poverty while creating the Dickensian slum. Post-1991 India's GDP grew from $270 billion to over $3.5 trillion — but the richest 10% of Indians now hold 77% of the national wealth (Oxfam 2023). The World Bank's definition of 'inclusive growth' requires growth to be broad-based across sectors, create productive employment, and reduce poverty and inequality simultaneously — a combination capitalism achieves imperfectly at best.",
    thesis:     "Capitalism, left unregulated, cannot bring inclusive growth — its structural logic drives concentration, not distribution. But capitalism, guided by intelligent regulation, corrective redistribution, and public investment in human capital, has proven capable of dramatic poverty reduction. The answer is not whether capitalism can bring inclusive growth — but under what institutional conditions it can be made to.",
    body1:      "The empirical case for capitalism's poverty-reducing power is real. India's poverty rate fell from 45% (2005) to 11.9% (2019) (World Bank), powered by market-driven growth. The services sector, entrepreneurship, and the startup ecosystem have created unprecedented middle-class prosperity. Amartya Sen's 'capability approach' recognises that markets, when functioning properly, expand human choices. The success of microfinance institutions — NABARD, MUDRA — in channelling market capital to the poorest demonstrates that capitalism's mechanisms can be redirected.",
    body2:      "Yet capitalism's structural tendency toward concentration is equally empirical. Platform economies (Amazon, Google) exhibit 'winner-take-all' dynamics that crush competition. The gig economy — Ola, Swiggy, Zomato — has created 10 million workers without minimum wage, social security, or collective bargaining rights. India's billionaire count grew from 9 (2000) to 169 (2023) while real agricultural wages stagnated. The Labour Code reforms of 2020, while rationalising 44 central laws into 4 codes, have been criticised by unions for diluting worker protections in the name of 'ease of doing business'.",
    body3:      "Making capitalism inclusive requires four institutional levers. First, progressive taxation: India's effective corporate tax rate (25%) is below the OECD average; restoring inheritance tax and revisiting capital gains exemptions could fund public goods. Second, public investment: universal health (Ayushman Bharat's ₹5 lakh cover for 50 crore people), education (NEP 2020's goal of 6% GDP spend), and infrastructure create the human capital that makes growth inclusive. Third, competition law: CCI must be empowered and resourced to prevent monopolisation. Fourth, formalise the informal: 93% of India's workforce is informal — extending social security to them is both a justice and an economic efficiency imperative.",
    counter:    "Socialist critics argue that the entire premise is flawed — that capitalism's DNA is accumulation, and redistribution mechanisms will always be outpaced by the wealth extraction at the top. Thomas Piketty's data showing r > g (return on capital exceeds economic growth) across capitalist economies gives this critique empirical weight. However, the historical alternatives — central planning, command economies — have produced neither inclusive growth nor political freedom. The relevant comparison is not capitalism versus socialism, but well-regulated capitalism versus poorly-regulated capitalism.",
    conclusion: "Capitalism is fire — it can cook a meal or burn a house. Inclusive growth is not capitalism's automatic output; it is capitalism's political choice. The states that have achieved it — South Korea, Taiwan, Germany, the Nordic nations — did so through deliberate policy: strong education systems, robust labour protections, competition law, and progressive redistribution. India's ambition to become a developed nation by 2047 will be measured not by its billionaire count, but by whether its last-mile citizens — the farmer, the migrant worker, the woman entrepreneur — participate meaningfully in its prosperity.",
  },

  e8: {
    hook:       "\"The test of our progress is not whether we add more to the abundance of those who have much; it is whether we provide enough for those who have too little.\" — Franklin D. Roosevelt. Robert McNamara's famous observation — that poverty anywhere is a threat to prosperity everywhere — updates this moral claim with a strategic one: global poverty is not a humanitarian embarrassment but a systemic risk.",
    context:    "The numbers are staggering: 700 million people globally live on under $2.15/day (World Bank, 2022). India, despite dramatic poverty reduction, still hosts 230 million people in multidimensional poverty (NITI Aayog MPI 2023). The connections between poverty and global instability are now empirically established: the Arab Spring emerged from food insecurity; the Rohingya crisis had roots in economic exclusion; migration flows from Sub-Saharan Africa and South Asia to Europe are driven primarily by economic desperation.",
    thesis:     "Poverty is not merely a local failure of welfare — it is a global failure of political economy. When one nation allows its citizens to be crushed by poverty, the effects do not stay within its borders — they manifest as migration crises, extremism, conflict, and pandemic vulnerability in prosperous nations. The G20, IMF, World Bank, and SDGs exist because global leaders have finally internalised McNamara's insight: no nation is an island of prosperity in an ocean of deprivation.",
    body1:      "The security dimension of poverty is stark. The United Nations Development Programme has documented that 80% of the world's violent conflicts occur in countries ranked in the bottom quintile of the Human Development Index. Pakistan, Afghanistan, the Sahel, and Yemen — all theatres of instability — are simultaneously among the world's most impoverished regions. The nexus is not coincidental: poverty creates the conditions — grievance, unemployment, institutional weakness — that extremist movements require. India's own Naxal problem is geographically concentrated in the eight poorest districts of its poorest states.",
    body2:      "The economic contagion of poverty operates through multiple channels. Poverty-stricken countries cannot invest in education, healthcare, or infrastructure — creating a 'poverty trap' that depresses regional demand, increases migration pressure, and creates instability in supply chains. The 2007–08 global food crisis — when commodity price spikes tipped 100 million people into poverty — showed how interconnected global food markets amplify, rather than absorb, shocks. The COVID-19 pandemic, which reversed a decade of poverty reduction, illustrated that infectious disease does not respect borders: the Delta variant emerged from India's rural poor and reached London within weeks.",
    body3:      "Addressing poverty as a global threat requires multilateral action: increase Official Development Assistance to the UN's 0.7% of GNI target (current OECD average: 0.32%); reform the IMF-World Bank conditionality regime to prioritise human development over fiscal austerity; implement the TRIPS waiver for essential medicines to end pharmaceutical poverty; and include loss-and-damage compensation for climate-vulnerable nations. Domestically, India's approach — universal PMGKY food security, MGNREGS employment guarantee, PM-KISAN cash transfers — offers a replicable model of social protection that addresses the income dimension of poverty.",
    counter:    "Critics of global poverty alleviation programs cite evidence of 'aid dependency' — that foreign aid has created incentives for rent-seeking, weak governance, and perpetual dependency, as Dambisa Moyo argued in 'Dead Aid.' This critique has validity: poorly designed aid has sometimes perpetuated the systems that create poverty. However, the solution is better-designed assistance — community-led, results-based, and graduated — not abandonment of the global responsibility.",
    conclusion: "Nelson Mandela said, 'Overcoming poverty is not a gesture of charity — it is an act of justice.' But it is also an act of self-interest. The wealthy world's prosperity rests on stable global supply chains, controlled migration, contained disease, and peaceful borders — all of which require poverty reduction. India, as the world's fastest-growing major economy and G20 President in 2023 (with 'One Earth, One Family, One Future' as its theme), must champion an inclusive globalism that recognises what every economist and every peacekeeper already knows: poverty anywhere is, indeed, a threat to prosperity everywhere.",
  },

  e9: {
    hook:       "\"India has to be resurgent, India has to be strong, India has to be self-reliant.\" — Jawaharlal Nehru. Seven decades later, India is resurgent — the world's fifth-largest economy, a global soft power, a space-faring nation. Yet the domestic challenges that Nehru confronted — poverty, inequality, communal tension, governance deficits — have not dissolved. They are the shadow that follows India's global ambitions.",
    context:    "India's global rise is real and remarkable. A $3.7 trillion economy (IMF 2024), the world's most populous nation, a G20 Chair, a rising defence exporter, a space power that landed on the Moon's south pole (Chandrayaan-3, 2023), and a founder of the Global Biofuels Alliance — India commands a strategic weight unimaginable two decades ago. S. Jaishankar's articulation in 'The India Way' — that India must be a 'leading power, not a balancing power' — captures the new ambition. Yet the domestic canvas tells a more complex story.",
    thesis:     "India's global ambitions are legitimate, achievable, and necessary. But they rest on domestic foundations that remain incomplete: 100 million unemployed youth, 200 million malnourished citizens, a judiciary with 50 million pending cases, and democratic institutions under stress. The greatest risk to India's global rise is not external opposition — it is internal inequality. A nation that cannot resolve its domestic contradictions cannot lead the world.",
    body1:      "India's strategic assets are formidable. Its diaspora of 32 million — the world's largest — generates $125 billion in remittances and holds influential positions in the US, UK, and Australia. Its demographic dividend — 65% of the population under 35 — is the largest youth cohort available to any major economy. Its military modernisation (4th largest by expenditure), its indigenous space programme, and its renewable energy push (175 GW renewable capacity by 2022) demonstrate strategic capability. India's approach to strategic autonomy — maintaining partnerships with both Washington and Moscow, buying Russian oil while joining the QUAD — reflects sophisticated multipolarity.",
    body2:      "Yet domestic restraints are structural. India's Human Development Index rank (132 out of 191 in 2023) is not commensurate with its economic rank (5th). The agriculture sector — employing 45% of the workforce but contributing only 17% of GDP — represents a productivity crisis. Unemployment among educated youth (Engineering graduates: 40% unemployed, CMIE 2023) is both an economic waste and a political time-bomb. Democratic backsliding concerns — press freedom rank (159/180, RSF 2023), shrinking space for civil society — risk India's 'soft power of democracy' brand that has been central to its foreign policy positioning.",
    body3:      "Closing the gap between ambition and capacity requires a two-track strategy: outward and inward. Outwardly, India must champion Global South interests at the UN, WTO, IMF, and climate negotiations — this is both moral obligation and strategic positioning. Inwardly, the National Education Policy 2020 must be fully implemented; PM Gatishakti for infrastructure connectivity must reach backward districts; and judicial reform must reduce case pendency. The ₹100 lakh crore National Infrastructure Pipeline is the right instinct — but must be directed to maximise human development, not just economic throughput.",
    counter:    "Realists argue that India's domestic problems actually demand a more insular, development-first focus — that global leadership aspirations are a distraction from the urgent work of lifting 200 million out of poverty. This 'India First' critique misunderstands the relationship between domestic development and global engagement. India's seat at the global table — in climate negotiations, trade rules, technology governance — directly determines the conditions under which its domestic development occurs.",
    conclusion: "Indira Gandhi said, 'A country's foreign policy is a reflection of its domestic policies.' India's global ambitions will be realised not at UNSC chambers or G20 summits alone — but in its classrooms, its courts, its factories, and its farms. The India that earns a permanent UNSC seat must be an India that has eliminated multi-dimensional poverty. The India that leads the Global South must be an India that has empowered its own South — its tribal communities, its women, its marginalised millions. Ambition without equity is a hollow crown.",
  },

  e10: {
    hook:       "\"Logic will get you from A to B. Imagination will take you everywhere.\" — Albert Einstein. But Bertrand Russell offers the deeper synthesis: 'The good life is one inspired by love and guided by knowledge.' Neither love without knowledge — which produces sentiment without wisdom — nor knowledge without love — which produces cleverness without humanity — is sufficient. The good life requires both, in constant tension and dialogue.",
    context:    "Russell's formulation emerged from his critique of two dominant traditions: the purely rationalist tradition (knowledge as the supreme good) and the purely romantic tradition (feeling and intuition as the supreme guide). The 20th century demonstrated the catastrophic consequences of each in isolation: the Holocaust was executed with bureaucratic precision by people of considerable knowledge; the Cultural Revolution was driven by revolutionary passion untethered from evidence. The Indian philosophical tradition offers an older synthesis: the integration of jnana (knowledge), bhakti (love/devotion), and karma (right action) in the ideal of the dharmic life.",
    thesis:     "Russell's insight is a blueprint for human flourishing at every scale — individual, institutional, and civilisational. A good life requires love as its engine (the motivation to act, to connect, to serve) and knowledge as its compass (the wisdom to act effectively, honestly, and with awareness of consequences). Without love, knowledge becomes technocratic detachment; without knowledge, love becomes sentimental ineffectiveness.",
    body1:      "At the individual level, this synthesis is the foundation of meaningful work. A doctor who knows medicine but lacks empathy cannot heal — technical knowledge without human care produces clinical correctness without therapeutic wholeness. A teacher who loves children but lacks pedagogical knowledge cannot educate — enthusiasm without method is emotional energy without direction. Abraham Maslow's hierarchy of needs implicitly embodies Russell's insight: the highest human need — self-actualisation — integrates both competence (knowledge) and connection (love). Mahatma Gandhi embodied this synthesis: his knowledge of law, history, and mass psychology was deployed in service of an overwhelming love for India's dispossessed.",
    body2:      "At the governance and institutional level, the good-life principle translates into the design of just institutions. Administrative systems guided purely by knowledge (technocracy) produce efficiency without equity — the Niti Aayog's data-driven policy is valuable, but without a moral commitment to the most vulnerable, it optimises for the median citizen, not the marginal one. Conversely, policy driven purely by emotional solidarity — populist schemes designed for electoral love — produces welfare without sustainability. The best governance traditions — Kerala's human development model, Bhutan's Gross National Happiness framework — integrate both: evidence-based policy in service of explicitly humanistic values.",
    body3:      "Cultivating this integration in contemporary India requires three interventions. First, educational: NEP 2020 must realise its promise of integrating arts and humanities (love, creativity, reflection) with STEM (knowledge, analysis) — not as decorative additions but as co-equal pillars of learning. Second, professional: all professional codes of ethics — medical, legal, engineering, civil service — must explicitly articulate both competence standards and care standards. Third, cultural: India's rich tradition of philosophical inquiry — from the Upanishads to Kabir to Ambedkar — must be reintegrated into public life as a living resource, not a museum exhibit.",
    counter:    "The critique of Russell's formulation holds that love and knowledge often conflict — that to act from love sometimes requires ignoring knowledge (a mother who defends an obviously guilty child), and to act from knowledge sometimes requires suppressing love (a judge who must convict a sympathetic defendant). This tension is real but generative, not disabling. The good life is not one where love and knowledge are always in harmony — it is one where the person has developed the wisdom to navigate their inevitable conflicts with integrity.",
    conclusion: "Russell wrote elsewhere: 'Three passions, simple but overwhelmingly strong, have governed my life: the longing for love, the search for knowledge, and unbearable pity for the suffering of mankind.' In these three passions, we find both the description of a good life and the prescription for a good society. India's challenge is to build institutions — schools, courts, hospitals, governments — that embody this synthesis: inspired by love for their citizens, guided by knowledge of their needs, and moved by the pity that refuses to accept preventable suffering as inevitable. That is the good life, writ large.",
  },

  e11: {
    hook:       "\"Technology is neither good nor bad — nor is it neutral.\" — Melvin Kranzberg's First Law of Technology. This paradox is the starting point for any honest evaluation of technology's social function. Mark Zuckerberg's founding vision for Facebook — 'to bring the world closer together' — encapsulates the noblest aspiration of digital technology. Whether that aspiration has been realised, co-opted, or systematically subverted is the central question of our digital age.",
    context:    "From Gutenberg's printing press (which both democratised knowledge and enabled Reformation-era religious wars) to the telegraph (which connected continents and coordinated colonial administration) to the internet (which has simultaneously enabled Arab Spring activism and ISIS recruitment), technology's social effects have always been double-edged. India's digital story — 700 million internet users, the world's largest UPI ecosystem, Aarogya Setu connecting 220 million people during COVID — is a story of remarkable connectivity. Yet the same infrastructure has enabled coordinated hate speech, mob lynching based on WhatsApp misinformation, and algorithmic polarisation.",
    thesis:     "Technology is most powerful as a connector when it is designed with human dignity at its centre, governed transparently, and deployed with equity as an explicit goal. The best examples — WhatsApp enabling family bonds across diaspora, Zoom enabling education during pandemic lockdowns, satellite internet reaching remote tribal villages — demonstrate that connectivity is genuine and humanising. The worst examples — algorithmic filter bubbles, surveillance capitalism, misinformation ecosystems — demonstrate that connection without trust and truth becomes its own form of isolation.",
    body1:      "The positive case for technology as connector is grounded in concrete evidence. India's CoWIN platform enabled 2.2 billion COVID vaccine doses with transparent real-time tracking. The Aadhaar-enabled Direct Benefit Transfer has connected 53 crore accounts to government benefits, eliminating the leakages of intermediary corruption. WhatsApp groups have become the primary medium for village-level governance communication, connecting Gram Sabhas to citizens without physical infrastructure. For the Indian diaspora, video calling has kept cultural and familial bonds alive across geography — the grandmother who watches her grandchildren grow up in Canada via smartphone is a profound form of human connection that technology enables.",
    body2:      "The dystopian case is equally evidenced. Meta's own internal research (revealed by Frances Haugen's whistleblowing, 2021) showed that Instagram damaged the mental health of 32% of teenage girls. India's documented 50+ mob lynching incidents, many triggered by WhatsApp misinformation, represent technology enabling disconnection — the dehumanisation of the 'other' through algorithmically amplified fear and rumour. Authoritarian surveillance — CCTV with facial recognition in public spaces, social media monitoring, Aadhaar data linkage — enables state connection with citizens that is vertical (surveillance) rather than horizontal (community). The loneliness epidemic paradoxically intensifies among heavy social media users: connection at scale, without depth, produces social isolation.",
    body3:      "Making technology genuinely connective requires design, governance, and equity. Design: platform architectures must optimise for meaningful engagement (depth) rather than addictive engagement (time-on-platform); this requires regulatory pressure and consumer movement. Governance: India's Digital India Act must mandate algorithmic transparency, establish real liability for platforms that amplify misinformation, and create a genuinely independent regulator. Equity: the 300 million Indians without internet access must be connected not as consumers but as citizens — through BharatNet, public wifi in gram panchayats, and device subsidy programmes.",
    counter:    "Digital pessimists argue that the very architecture of social media — engineered for engagement, which means engineered for outrage — makes genuine connection structurally impossible within these systems. Shoshana Zuboff's 'surveillance capitalism' thesis suggests that technology companies' business model is incompatible with human flourishing. This structural critique is powerful and demands structural responses: not just user education or platform self-regulation, but legislative mandates on platform architecture and a public option for social infrastructure.",
    conclusion: "Tim Berners-Lee, who invented the World Wide Web as a gift to humanity (he refused to patent it), has spent recent years calling for a 'social contract for the web' — principles of openness, privacy, and non-discrimination that would ensure the web serves people. His regret that the web has been captured by monopolies and weaponised against democracy is the regret of a maker watching his tool used for harm. The lesson is not to unmake the tool — it is to govern it. Technology will bring people together when we design it to, regulate it to, and fund the public infrastructure for it. Until then, it will continue to do both: connect us to our best selves and our worst impulses, simultaneously.",
  },

  e12: {
    hook:       "\"We are the first generation to feel the effect of climate change and the last generation that can do something about it.\" — Barack Obama. But the economist Nicholas Stern adds the economic framing: climate change is 'the greatest and widest-ranging market failure ever seen.' Both statements are true — and together, they define the most complex policy challenge humanity has ever confronted.",
    context:    "The Intergovernmental Panel on Climate Change (IPCC) AR6 (2022) confirmed: global temperatures have risen 1.1°C above pre-industrial levels; extreme weather events are intensifying; and without immediate, drastic action, 1.5°C warming will be crossed by the early 2030s. The Paris Agreement (2015) — 195 countries committing to limit warming to 1.5–2°C — represents the most ambitious multilateral climate commitment in history. Yet current NDCs (Nationally Determined Contributions) collectively put the world on track for 2.7°C warming (UNEP Emissions Gap Report 2023), revealing the chasm between commitment and action.",
    thesis:     "Climate change is the greatest market failure not because markets cannot price risk — they can — but because the risks are global, intergenerational, and systemic in ways that exceed any single market's capacity to resolve. The atmosphere is a global commons; carbon is a negative externality; future generations are not market participants; and the poor, who have contributed least to emissions, bear the greatest costs. These are not market imperfections — they are structural limitations of market logic itself.",
    body1:      "The economics of climate change reveal the market failure with precision. Carbon emissions impose costs (floods, droughts, crop failure, disease) on people who did not cause them — the classic negative externality. Without a carbon price, emitters pay none of these costs, and the invisible hand points in precisely the wrong direction. The social cost of carbon — the economic damage done by one tonne of CO₂ — is estimated at $51–185/tonne (US EPA, 2023), yet the global average carbon price is a mere $5–10/tonne. This gap between true cost and market cost is the market failure, measured in dollars and in degrees.",
    body2:      "For India, climate change is not an abstract global problem — it is an existential domestic emergency. The 2022 Bengaluru floods (₹ 3,300 crore damage), the 2023 Uttarakhand landslides, the Himalayan glacial lake outburst floods threatening 40 million downstream, and the progressive salinity intrusion in the Sundarbans — all represent climate costs falling on India's most vulnerable. Yet India contributes only 4% of historical cumulative emissions while hosting 17% of the world's population. The equity argument — that developed nations must decarbonise fastest and fund adaptation for the Global South — is not merely moral; it is legally enshrined in the UNFCCC's 'Common but Differentiated Responsibilities' principle.",
    body3:      "Correcting the market failure requires both price signals and public investment. Carbon taxes or cap-and-trade schemes that price carbon at its true social cost are the most economically efficient instruments — Sweden's $130/tonne carbon tax and the EU Emissions Trading Scheme demonstrate feasibility. Public investment in renewable infrastructure (India's 500 GW renewable target by 2030), green hydrogen (National Green Hydrogen Mission), and climate-resilient agriculture (PM Krishi Sinchayee Yojana) addresses market failures in technology and adaptation. Loss and Damage finance — the historic COP27 agreement — must be operationalised to compensate climate-vulnerable nations.",
    counter:    "Climate skeptics and development advocates argue that decarbonisation is a luxury for rich nations — that developing countries have the right to use cheap fossil fuels to lift their citizens from poverty, just as the West did for 200 years. This argument has moral weight: historical emissions created today's problem, and today's poor should not pay for them. However, the trajectory of renewable costs (solar LCOE has fallen 90% in a decade) means that the clean energy path is now also the economically rational path for developing nations. The dilemma is real but diminishing.",
    conclusion: "The Earth's atmosphere has no market value in our accounting systems — and so we are destroying it for free. The fundamental reform needed is not just technological or even political — it is conceptual: we must build an economics that counts what matters, prices what costs, and values what endures. India, with its ancient philosophical tradition of living within nature's bounds ('Mata Bhoomi Putroham Prithivyah' — Earth is my mother and I am her son), has both the cultural vocabulary and the economic necessity to lead this conceptual revolution. The greatest market failure demands the greatest market correction — and the greatest exercise of political will.",
  },

  e13: {
    hook:       "\"The price of freedom is eternal vigilance.\" — Attributed to Thomas Jefferson. Democratic institutions are not self-sustaining — they require the active engagement of citizens, the independence of watchdog institutions, and the restraint of those in power. When any of these conditions lapses, democracy becomes an electoral ritual without democratic substance.",
    context:    "India's democracy — the world's largest, running continuously since 1952 — is a remarkable achievement. The Election Commission has conducted 17 general elections with credibility; the Supreme Court has struck down constitutional amendments, emergency proclamations, and executive overreach; Parliament has debated, amended, and enacted over 10,000 laws. Yet Freedom House downgraded India from 'Free' to 'Partly Free' in 2021; the V-Dem Institute classified India as an 'Electoral Autocracy' in 2021–22; and the press freedom index (159/180, RSF 2023) raises questions about the health of the fourth estate.",
    thesis:     "India's democratic institutions are not 'lost' — but they are under unprecedented stress. The stress comes from multiple directions simultaneously: the concentration of executive power, the weakening of legislative scrutiny, the pressure on judicial independence, the shrinking of civil society space, and the fragmentation of media plurality. The question is not whether institutions are failing — it is whether the structural buffers designed to prevent failure are being hollowed out faster than they can be replenished.",
    body1:      "The legislative dimension is most visible. Parliament's 17th Lok Sabha (2019–24) passed 25% of its bills in under an hour of debate; the RTI Amendment (2019), the farm laws, the Citizenship Amendment Act, and the Electoral Bonds Scheme were passed without Parliamentary Committee scrutiny — the traditional mechanism of deep legislative examination. Rajya Sabha's role as a revising chamber has been circumvented through joint sessions and money bill characterisation. The decline of parliamentary debate is not merely procedural — it is substantive: laws passed without scrutiny carry more implementation errors and governance costs.",
    body2:      "The judicial dimension is more contested. The Supreme Court's recusal of cases (Judges Loya death, electoral bonds) and its occasional deference to executive timelines (Article 370 abrogation) have drawn criticism from legal scholars. Yet the same court struck down the Electoral Bonds Scheme (2024) as violating the right to information, ordered release of opposition politicians, and delivered progressive judgements on personal liberty. The collegium system — widely criticised for opacity and delays — nonetheless maintains judicial independence from executive appointment; attempts to replace it with a National Judicial Appointments Commission (struck down in 2015) raised legitimate concerns about executive capture.",
    body3:      "Strengthening democratic institutions requires reinforcing the four pillars simultaneously. First, Parliament: restore committee referrals for all significant bills, ensure proportional time allocation for opposition, and implement the recommendation of a fixed legislative calendar. Second, Judiciary: implement the Law Commission's recommendations on judicial appointments transparency and reduce the 50 million case pendency through fast-track courts. Third, Media: implement transparency requirements for media ownership, operationalise the Press Council with genuine enforcement powers, and protect RTI applicants and whistleblowers. Fourth, Civil society: reverse the trend of FCRA scrutiny as political tool; civil society is democracy's immune system, not its enemy.",
    counter:    "The counter-narrative holds that India's institutions are functioning — elections are free and fair, courts deliver landmark judgements, Parliament passes legislation, and the press covers controversy. Compared to its neighbourhood (Pakistan, Bangladesh, Myanmar), India's democratic continuity is remarkable. Critics of 'democratic backsliding' narratives are accused of applying Western liberal standards to a diverse, complex civilisational democracy that has its own traditions of governance. This perspective has validity: India must be judged on its own trajectory, not just international rankings. But trajectory matters — the direction of travel is the core concern.",
    conclusion: "B.R. Ambedkar warned in 1949: 'Democracy in India is only a top-dressing on an Indian soil which is essentially undemocratic.' His warning was not pessimism — it was a challenge. Democratic institutions are not buildings — they are habits: the habit of debate, the habit of scrutiny, the habit of peaceful transfer of power, the habit of truth-telling. These habits can be developed, strengthened, and protected — but they can also be eroded through disuse, intimidation, and institutional capture. India's 1.4 billion citizens are the ultimate custodians of its democracy. Eternal vigilance is not a metaphor — it is a civic duty.",
  },

  e14: {
    hook:       "\"The present moment always will have been.\" — This philosophical observation illuminates the paradox at the heart of human experience: the past is the only thing we cannot change, and yet it is the thing we most often try to change — through regret, revision, and re-narration. William Jennings Bryan's maxim — 'The past cannot be changed; the future is yet in your power' — is not comfort; it is a call to action.",
    context:    "Human psychology is haunted by the past. Psychologists estimate that 70% of our intrusive thoughts involve regret about the past, and 15% involve worry about the future — leaving precious little mental bandwidth for present action. Societies, too, are haunted: Germany's Vergangenheitsbewältigung (coming to terms with the past), India's debates about historical injustices (colonialism, partition, caste oppression), and post-conflict societies globally illustrate how the past shapes present politics. The question is not whether the past matters — it does — but how to relate to it without being imprisoned by it.",
    thesis:     "The truth that the past cannot be changed is simultaneously liberating and demanding. It is liberating because it ends the futile project of regret; it is demanding because it removes all excuses. If the past is fixed and the future is undetermined, then the only relevant question is: what will I — what will we — do now? This is the foundation of human agency, of national recovery, and of civilisational renewal.",
    body1:      "At the individual level, the capacity to let go of past failures while retaining their lessons is the psychological foundation of resilience. Viktor Frankl, in 'Man's Search for Meaning,' distilled from the horror of Nazi concentration camps the insight that 'between stimulus and response there is a space — and in that space is our power to choose our response.' The past had happened to him; the future was his to shape. This is not denial of suffering — it is refusal to be defined by it. India's own history offers examples: B.R. Ambedkar, who experienced systematic caste oppression and chose to channel that experience into the most progressive constitution in the world, is the embodiment of this principle.",
    body2:      "At the national level, the relationship between a country and its past determines its future. Germany's honest confrontation of its Nazi past — through Nuremberg, through memorials, through education — is credited with the moral authority that allows it to lead Europe. Japan's partial evasion of its wartime past continues to strain regional relationships with China and Korea, demonstrating how an unprocessed past constrains the future. India's own historical accounting — of colonial exploitation, of partition violence, of caste atrocities — is incomplete and contested. The Partition Museum at Amritsar is a step; the pending reckoning with caste history is the unfinished work. The past cannot be changed, but it can be honestly understood — and that understanding shapes the future India builds.",
    body3:      "Translating this principle into policy and practice requires three moves. First, institutional: establish truth and reconciliation mechanisms for historical injustices — not punitive but restorative, aimed at understanding and healing rather than retribution. Second, educational: school curricula must include honest accounting of colonialism, partition, and caste, not to generate guilt but to generate understanding. Third, individual: mental health systems must be built that help citizens process personal and collective trauma — India's mental health infrastructure (0.3 psychiatrists per 100,000 people, against WHO recommendation of 3) is desperately inadequate.",
    counter:    "The argument that 'the future is in your power' can be weaponised by the privileged to dismiss legitimate historical grievances. When descendants of enslaved people, colonial subjects, or caste-oppressed communities are told to 'move on' and 'focus on the future,' the message is often a cover for avoiding reparative justice. This critique is valid: acknowledging that the past cannot be changed does not mean its effects can be ignored. The philosophy of future-orientation must be paired with present action to address historically created inequalities.",
    conclusion: "Time moves in only one direction, and no force — neither regret nor resentment — can reverse it. But the future, as William Jennings Bryan observed, is still unwritten. The most powerful human act is to sit at the threshold between what has happened and what is yet to happen, to learn fully from the former, and to commit completely to the latter. For India — a civilisation that has survived colonial dismemberment, partition, and poverty — this philosophy is not philosophical abstraction. It is the lived wisdom of a nation that has refused, repeatedly, to be defined by what was done to it, and has chosen, again and again, to build the future it deserves.",
  },

  e15: {
    hook:       "\"We have never been more 'connected' and never more lonely.\" — Vivek Murthy, US Surgeon General, in his 2023 Advisory on the Loneliness Epidemic. The paradox is devastating in its precision: at the moment of peak technological connectivity — 5 billion social media users, 13,000 crore WhatsApp messages sent daily — reported loneliness, depression, and social isolation have reached epidemic levels globally.",
    context:    "The history of communication technology is a history of simultaneous connection and disconnection. The telegraph connected distant families and isolated distant workers. Television connected households to national events and disconnected them from their neighbours. Social media has replicated this pattern at exponential scale. India's social media landscape — 448 million Instagram users, 530 million WhatsApp users, 220 million Facebook users (2024) — is the world's second largest. Its benefits are tangible: political mobilisation, cultural preservation, business networking, diaspora connection. Its costs are equally tangible: the Pradyuman Thakur case (fake content triggering school bomb threats), the Palghar mob lynching, the Sulli Deals and Bulli Bai apps targeting Muslim women — all catalysed or enabled by social media.",
    thesis:     "Social media has not made us more connected and less social — it has done both simultaneously, to different people, in different ways. For the socially isolated elderly person who reconnects with classmates, the rural entrepreneur who accesses urban markets, the LGBTQ teenager who finds their community online — social media is genuinely social. For the teenager trapped in Instagram's beauty comparison loop, the WhatsApp user radicalised by misinformation, the professional exhausted by performative self-branding — it is connection that isolates. The net social impact depends entirely on design, governance, and digital literacy.",
    body1:      "The psychological evidence for social media's anti-social effects is accumulating. Jonathan Haidt and Jean Twenge's research shows that smartphone and social media adoption from 2012–2015 correlates with a 50% rise in depression and anxiety among US teenagers — and similar trends are visible in India (NIMHANS 2023: 50 million Indians suffer from mental health disorders, with adolescent prevalence rising sharply). The mechanism is attention fragmentation: average attention span has declined from 12 seconds (2000) to 8 seconds (2023, Microsoft research), below that of a goldfish. Paradoxically, being constantly 'available' to social connection makes sustained, deep conversation — the foundation of genuine social bonding — neurologically harder.",
    body2:      "The political and social fabric is equally affected. Eli Pariser's 'filter bubble' thesis — confirmed by MIT research showing false news spreads 6x faster than true news on Twitter — means social media algorithmically separates people into epistemic communities that cannot speak across ideological lines. India's communal WhatsApp ecosystem, where doctored videos and out-of-context content are shared at scale within group echo chambers, has been directly implicated in over 50 documented cases of mob violence (2014–2023). This is connection weaponised against social cohesion. Meanwhile, civic spaces — the tea shop, the local park, the neighbourhood association meeting — that historically enabled cross-cutting social bonds, have been hollowed out as screen time expands.",
    body3:      "Restoring genuine sociality in a digital age requires policy, platform reform, and cultural change. Policy: the proposed Digital India Act must mandate algorithmic transparency, ban addictive design features (infinite scroll, variable reward notifications), and protect minors through age verification. Platform: WhatsApp's message forwarding limit (5 chats) reduced misinformation virality by 70% after implementation — this model should be extended and enforced. Culture: digital detox programmes, school-based social media literacy (like Finland's 'media and information literacy' curriculum), and community space investment. Crucially, the solution to the loneliness epidemic cannot be more social media — it must include investment in physical third places: parks, libraries, community centres, sports facilities.",
    counter:    "Social media optimists correctly point to cases where technology has enabled social connection that would otherwise be impossible: the disability community that found belonging online, the LGBTQ youth who survived isolation because of internet communities, the farmer who accessed crop insurance information through a WhatsApp group. Dismissing social media's social value is as wrong as celebrating it uncritically. The relevant question is always: for whom, under what conditions, and with what design choices does social media enable genuine connection?",
    conclusion: "Sherry Turkle's book is titled, prophetically, 'Alone Together.' It captures the essential paradox: we are together in unprecedented numbers, and alone in unprecedented ways. The resolution is not to abandon digital connection — it is to redesign, regulate, and rebalance it. We need technology companies that optimise for human flourishing rather than engagement time. We need governments that protect citizens from addictive design the way they protect them from addictive substances. And we need citizens who choose, deliberately and regularly, to look up from their screens and into the faces of the people in front of them. Connection is not a notification — it is presence. Social media, at its best, is a bridge to that presence. At its worst, it is a substitute for it.",
  },
};

// Mains Planner — daily tasks (relative to 2026-06-20)
export const PLANNER_TASKS = [
  { id: "pt1",  date: "2026-06-20", paper: "gs1", topic: "Women Empowerment",         task: "Revise note + add CA links",   status: "done",       priority: "high"   },
  { id: "pt2",  date: "2026-06-20", paper: "gs2", topic: "Parliamentary Committees",   task: "Read Laxmikanth Ch 22–24",     status: "in-progress",priority: "high"   },
  { id: "pt3",  date: "2026-06-20", paper: "gs3", topic: "Digital Economy",            task: "Complete note from PDF",       status: "pending",    priority: "medium" },
  { id: "pt4",  date: "2026-06-20", paper: "ess", topic: "Essay Practice",             task: "Write 1200-word essay outline",status: "pending",    priority: "low"    },
  { id: "pt5",  date: "2026-06-21", paper: "gs4", topic: "Ethics in Governance",       task: "Case study practice — 3 Qs",  status: "pending",    priority: "high"   },
  { id: "pt6",  date: "2026-06-21", paper: "gs1", topic: "Modern History",             task: "1857 revolt — consolidate note", status: "pending", priority: "medium" },
  { id: "pt7",  date: "2026-06-21", paper: "gs3", topic: "Agriculture Policy",         task: "MSP, PM-KISAN — note draft",  status: "pending",    priority: "medium" },
  { id: "pt8",  date: "2026-06-22", paper: "gs2", topic: "Fundamental Rights",         task: "Revise Articles 12–35",       status: "pending",    priority: "high"   },
  { id: "pt9",  date: "2026-06-22", paper: "ant", topic: "Biological Anthropology",   task: "Human evolution — 10 flashcards", status: "pending", priority: "medium" },
  { id: "pt10", date: "2026-06-23", paper: "gs3", topic: "Climate Change",             task: "Add Paris Agreement updates", status: "pending",    priority: "low"    },
];

export const WEEKLY_TARGETS = [
  { paper: "gs1", targetNotes: 2, done: 1 },
  { paper: "gs2", targetNotes: 3, done: 2 },
  { paper: "gs3", targetNotes: 2, done: 1 },
  { paper: "gs4", targetNotes: 1, done: 1 },
  { paper: "ess", targetNotes: 1, done: 0 },
  { paper: "ant", targetNotes: 2, done: 1 },
];

// Anthropology Optional Syllabus (UPSC CSE Paper I & II)
export const ANTHROPOLOGY_SYLLABUS = {
  paper1: {
    label: "Paper I — Foundations & Theory",
    units: [
      {
        id: "a1u1", name: "Meaning, Scope & Development",
        topics: [
          { id: "a1u1t1", name: "Relationships with other sciences", status: "noted", revisions: 1 },
          { id: "a1u1t2", name: "Main branches of Anthropology", status: "noted", revisions: 2 },
          { id: "a1u1t3", name: "Human evolution & emergence of Man", status: "pending", revisions: 0 },
        ],
      },
      {
        id: "a1u2", name: "Human Evolution",
        topics: [
          { id: "a1u2t1", name: "Biological & Cultural factors in Human Evolution", status: "noted", revisions: 1 },
          { id: "a1u2t2", name: "Theories of Organic Evolution — Darwinism, Neo-Darwinism", status: "pending", revisions: 0 },
          { id: "a1u2t3", name: "Synthetic theory of Evolution", status: "pending", revisions: 0 },
          { id: "a1u2t4", name: "Mechanisms of evolutionary change — mutation, selection, drift", status: "pending", revisions: 0 },
        ],
      },
      {
        id: "a1u3", name: "Primatology",
        topics: [
          { id: "a1u3t1", name: "Non-human primates — classification", status: "noted", revisions: 1 },
          { id: "a1u3t2", name: "Primate locomotion, diet, behaviour", status: "pending", revisions: 0 },
          { id: "a1u3t3", name: "Fossil primates — Dryopithecus, Ramapithecus", status: "pending", revisions: 0 },
        ],
      },
      {
        id: "a1u4", name: "Fossil Hominids",
        topics: [
          { id: "a1u4t1", name: "Australopithecus — types & significance", status: "noted", revisions: 2 },
          { id: "a1u4t2", name: "Homo habilis & Homo erectus", status: "noted", revisions: 1 },
          { id: "a1u4t3", name: "Archaic Homo sapiens & Neanderthals", status: "pending", revisions: 0 },
          { id: "a1u4t4", name: "Cro-magnon & anatomically modern humans", status: "pending", revisions: 0 },
        ],
      },
      {
        id: "a1u5", name: "Biological Variation & Races",
        topics: [
          { id: "a1u5t1", name: "Concept of race & racism", status: "noted", revisions: 1 },
          { id: "a1u5t2", name: "Biological basis of racial classification", status: "pending", revisions: 0 },
          { id: "a1u5t3", name: "Race and intelligence — ethical issues", status: "pending", revisions: 0 },
        ],
      },
      {
        id: "a1u6", name: "Social & Cultural Anthropology",
        topics: [
          { id: "a1u6t1", name: "Culture — concept, characteristics, functions", status: "noted", revisions: 2 },
          { id: "a1u6t2", name: "Kinship, marriage and family", status: "noted", revisions: 1 },
          { id: "a1u6t3", name: "Political organisation & Social Control", status: "pending", revisions: 0 },
          { id: "a1u6t4", name: "Economic organisation — foraging, pastoralism, agriculture", status: "pending", revisions: 0 },
        ],
      },
      {
        id: "a1u7", name: "Anthropological Theory",
        topics: [
          { id: "a1u7t1", name: "Evolutionism — Morgan, Tylor, Spencer", status: "noted", revisions: 1 },
          { id: "a1u7t2", name: "Diffusionism — British, American, German", status: "pending", revisions: 0 },
          { id: "a1u7t3", name: "Functionalism — Malinowski, Radcliffe-Brown", status: "noted", revisions: 2 },
          { id: "a1u7t4", name: "Structuralism — Lévi-Strauss", status: "pending", revisions: 0 },
          { id: "a1u7t5", name: "Post-modernism & feminist anthropology", status: "pending", revisions: 0 },
        ],
      },
    ],
  },
  paper2: {
    label: "Paper II — Indian Anthropology",
    units: [
      {
        id: "a2u1", name: "Prehistoric Archaeology",
        topics: [
          { id: "a2u1t1", name: "Stone Age — Palaeolithic, Mesolithic, Neolithic", status: "noted", revisions: 1 },
          { id: "a2u1t2", name: "Chalcolithic & Bronze Age", status: "pending", revisions: 0 },
          { id: "a2u1t3", name: "Indus Valley Civilisation — Anthropological aspects", status: "noted", revisions: 2 },
        ],
      },
      {
        id: "a2u2", name: "Caste System in India",
        topics: [
          { id: "a2u2t1", name: "Origin theories of caste — Brahminical, Racial, Occupational", status: "noted", revisions: 1 },
          { id: "a2u2t2", name: "Varna, Jati & Dominant Caste", status: "noted", revisions: 1 },
          { id: "a2u2t3", name: "Caste mobility — Sanskritisation, Westernisation", status: "noted", revisions: 2 },
          { id: "a2u2t4", name: "Caste & affirmative action — reservations", status: "pending", revisions: 0 },
        ],
      },
      {
        id: "a2u3", name: "Tribal India",
        topics: [
          { id: "a2u3t1", name: "Defining tribes — criteria & problems", status: "noted", revisions: 1 },
          { id: "a2u3t2", name: "Tribal situation in India — geographical spread", status: "pending", revisions: 0 },
          { id: "a2u3t3", name: "Problems of tribal communities — land alienation, bonded labour", status: "pending", revisions: 0 },
          { id: "a2u3t4", name: "Tribal policy — Integration vs. Assimilation debate", status: "noted", revisions: 1 },
          { id: "a2u3t5", name: "Scheduled Tribes — Constitutional provisions, PESA, FRA", status: "noted", revisions: 2 },
        ],
      },
      {
        id: "a2u4", name: "Language & Communication",
        topics: [
          { id: "a2u4t1", name: "Linguistic diversity in India", status: "noted", revisions: 1 },
          { id: "a2u4t2", name: "Language families — Indo-Aryan, Dravidian, Austro-Asiatic", status: "pending", revisions: 0 },
          { id: "a2u4t3", name: "Language and culture — Sapir-Whorf hypothesis", status: "pending", revisions: 0 },
        ],
      },
      {
        id: "a2u5", name: "Religion & Society",
        topics: [
          { id: "a2u5t1", name: "Tribal religion — animism, totemism, shamanism", status: "noted", revisions: 1 },
          { id: "a2u5t2", name: "Sacred complex & nature-man-spirit complex", status: "pending", revisions: 0 },
          { id: "a2u5t3", name: "Hinduism, Buddhism, Jainism — Anthropological perspectives", status: "pending", revisions: 0 },
        ],
      },
      {
        id: "a2u6", name: "Applied Anthropology",
        topics: [
          { id: "a2u6t1", name: "Development Anthropology — community development", status: "noted", revisions: 1 },
          { id: "a2u6t2", name: "Anthropology of health & medicine — folk vs. modern", status: "pending", revisions: 0 },
          { id: "a2u6t3", name: "Anthropology and women — gender studies", status: "pending", revisions: 0 },
          { id: "a2u6t4", name: "Anthropological approach to poverty & deprivation", status: "noted", revisions: 1 },
        ],
      },
    ],
  },
};

// ── DAY 6 ──────────────────────────────────────────────────────────────

// Mock test series scores (each GS paper /250, Essay /250, total /1250)
export const MOCK_TESTS = [
  { id: "mt1", date: "2026-03-05", series: "Vision IAS Test 1",
    scores: { gs1: 128, gs2: 118, gs3: 142, gs4: 135, essay: 132 } },
  { id: "mt2", date: "2026-03-20", series: "Insights Test 1",
    scores: { gs1: 135, gs2: 125, gs3: 148, gs4: 138, essay: 140 } },
  { id: "mt3", date: "2026-04-05", series: "Vajiram Test 1",
    scores: { gs1: 140, gs2: 130, gs3: 152, gs4: 142, essay: 145 } },
  { id: "mt4", date: "2026-04-20", series: "Vision IAS Test 2",
    scores: { gs1: 145, gs2: 132, gs3: 155, gs4: 148, essay: 150 } },
  { id: "mt5", date: "2026-05-10", series: "Insights Test 2",
    scores: { gs1: 148, gs2: 138, gs3: 158, gs4: 150, essay: 152 } },
  { id: "mt6", date: "2026-05-25", series: "Forum IAS Test 1",
    scores: { gs1: 152, gs2: 142, gs3: 162, gs4: 155, essay: 158 } },
  { id: "mt7", date: "2026-06-10", series: "Vision IAS Test 3",
    scores: { gs1: 158, gs2: 148, gs3: 165, gs4: 160, essay: 162 } },
];

// Answer practice history
export const PRACTICE_HISTORY = [
  { id: "ph1", date: "2026-06-18", questionId: "p1", wordLimit: 250,
    wordsWritten: 248, timeTaken: 13,
    rubric: { intro: 4, structure: 4, content: 3, examples: 4, conclusion: 3 }, total: 18 },
  { id: "ph2", date: "2026-06-17", questionId: "p3", wordLimit: 150,
    wordsWritten: 151, timeTaken: 9,
    rubric: { intro: 3, structure: 4, content: 4, examples: 3, conclusion: 4 }, total: 18 },
  { id: "ph3", date: "2026-06-15", questionId: "p5", wordLimit: 250,
    wordsWritten: 243, timeTaken: 14,
    rubric: { intro: 3, structure: 3, content: 4, examples: 3, conclusion: 3 }, total: 16 },
];

// Quick-reference data sheet
export const DATA_SHEET = {
  economy: {
    label: "Economy", icon: "📈", color: "#047857", bg: "#ECFDF5",
    items: [
      { key: "GDP Growth Rate FY26",           value: "8.2%",                        source: "MoSPI 2026",            note: "Advance estimate; fastest among G20" },
      { key: "Per Capita Net NI (FY25)",        value: "₹2.14 lakh",                 source: "MoSPI",                 note: "At current prices" },
      { key: "CPI Inflation avg FY25",          value: "4.8%",                        source: "RBI",                   note: "Within 2–6% target band" },
      { key: "Fiscal Deficit FY26 (BE)",        value: "4.5% of GDP",                 source: "Union Budget 2026-27",  note: "Revised estimate" },
      { key: "Current Account Deficit FY25",    value: "1.0% of GDP",                 source: "RBI",                   note: "Manageable level" },
      { key: "Forex Reserves (June 2026)",      value: "$680 billion",                source: "RBI",                   note: "6th largest globally" },
      { key: "Tax-to-GDP Ratio FY25",           value: "11.7%",                       source: "Budget documents",      note: "Gross tax / GDP" },
      { key: "GST Collection (FY25 avg)",       value: "₹1.82 lakh crore/month",      source: "Ministry of Finance",   note: "Highest ever monthly average" },
      { key: "UPI Transactions (2025)",         value: "15,000+ crore/year",          source: "NPCI",                  note: "75% of global real-time payments" },
      { key: "Female LFPR 2024",               value: "41.7%",                       source: "PLFS 2024",             note: "Up from 23.3% in 2017-18" },
    ],
  },
  polity: {
    label: "Polity", icon: "⚖️", color: "#0369A1", bg: "#F0F9FF",
    items: [
      { key: "Articles in Constitution",        value: "395 (original) + 12 Schedules", source: "Constitution of India",  note: "Several added/deleted by amendments" },
      { key: "Constitutional Amendments",       value: "106 (as of 2023)",             source: "Ministry of Law",        note: "106th: OBC sub-categorisation (2021)" },
      { key: "Lok Sabha Seats",                 value: "543 elected seats",            source: "Constitution, Art 81",   note: "Anglo-Indian seats abolished 2020 (104th CA)" },
      { key: "Rajya Sabha Seats",               value: "245 (238 elected + 12 nominated)", source: "Constitution, Art 80", note: "" },
      { key: "Supreme Court Strength",          value: "34 (CJI + 33 judges)",        source: "SC (Judges) Act",        note: "Sanctioned strength" },
      { key: "High Courts in India",            value: "25",                           source: "Ministry of Law",        note: "Includes HCs for UTs" },
      { key: "8th Schedule Languages",          value: "22",                           source: "Constitution",           note: "Latest 4 added by 92nd CA, 2003" },
      { key: "States + Union Territories",      value: "28 States + 8 UTs",           source: "MHA",                   note: "J&K bifurcated into 2 UTs in 2019" },
      { key: "Women in Lok Sabha (18th LS)",    value: "74 / 543 (13.6%)",           source: "ECI 2024",               note: "Nari Shakti Vandan Adhiniyam awaits delimitation" },
      { key: "PRIs in India",                   value: "~2.55 lakh institutions",     source: "MoPR 2023",             note: "Gram panchayats, samitis, ZPs" },
    ],
  },
  society: {
    label: "Society", icon: "🧑‍🤝‍🧑", color: "#7C3AED", bg: "#F5F3FF",
    items: [
      { key: "Population (2026 estimate)",       value: "144.2 crore",                source: "UN Population Division", note: "Largest population globally since Apr 2023" },
      { key: "Literacy Rate (Census 2011)",      value: "74.04% (M:82.1%, F:65.5%)", source: "Census 2011",            note: "2021 census delayed; pending" },
      { key: "Sex Ratio",                        value: "943 per 1000 males",         source: "Census 2011",            note: "SRB (0-6 yrs): 919" },
      { key: "Infant Mortality Rate",            value: "28 per 1,000 live births",   source: "SRS 2023",               note: "Down from 80 in 1990" },
      { key: "Maternal Mortality Ratio",         value: "97 per 1,00,000 LB",        source: "SRS 2018-20",            note: "Below 100 for first time" },
      { key: "Global Hunger Index 2024",         value: "Rank 105 / 127",            source: "Welthungerhilfe",         note: "India disputes GHI methodology" },
      { key: "Human Development Index 2023",     value: "0.644, Rank 134/193",       source: "UNDP HDR 2024",           note: "Medium human development" },
      { key: "Multidimensional Poverty 2023",    value: "11.28% (15.48 crore)",      source: "NITI Aayog 2023",        note: "Down from 29.17% in 2013-14" },
      { key: "Scheduled Castes (SC)",            value: "16.6% of population",        source: "Census 2011",            note: "" },
      { key: "Scheduled Tribes (ST)",            value: "8.6% of population",         source: "Census 2011",            note: "Major ST states: MP, RJ, JH, OD" },
    ],
  },
  environment: {
    label: "Environment", icon: "🌿", color: "#059669", bg: "#ECFDF5",
    items: [
      { key: "Forest + Tree Cover",              value: "25.17% of geo. area",        source: "FSI Report 2023",        note: "Forest cover alone: 21.76%" },
      { key: "India's NDC Target 2030",          value: "45% emission intensity ↓ vs 2005; 50% non-fossil power", source: "Updated NDC 2022", note: "Submitted to UNFCCC" },
      { key: "Renewable Energy Installed",       value: "~190 GW (June 2026)",        source: "MNRE",                   note: "Target: 500 GW by 2030" },
      { key: "Solar Power Capacity",             value: "~85 GW (June 2026)",         source: "MNRE",                   note: "3rd largest solar capacity globally" },
      { key: "India's share in global GHG",      value: "~7%",                        source: "IEA 2024",               note: "3rd largest emitter after China, USA" },
      { key: "Tiger Population (2022 census)",   value: "3,167",                      source: "NTCA 2023",              note: "75% of world's wild tigers in India" },
      { key: "Ramsar Sites (Wetlands)",          value: "80 sites",                   source: "Ramsar 2024",            note: "Most Ramsar sites globally" },
      { key: "Protected Areas",                  value: "1,012 (5.03% of land area)", source: "WII",                    note: "106 NPs + 573 WLSs + 97 CRs + others" },
      { key: "Single-use plastic ban",           value: "July 1, 2022",               source: "MoEF&CC",               note: "74 items banned under EPR Rules 2022" },
      { key: "Air Quality — global ranking",     value: "39/50 most polluted cities in India", source: "IQAir 2023",   note: "Delhi topped list globally" },
    ],
  },
  science: {
    label: "Science & Tech", icon: "🔬", color: "#B45309", bg: "#FFFBEB",
    items: [
      { key: "ISRO Budget FY26",                 value: "₹13,043 crore",              source: "Union Budget 2026-27",   note: "15% increase YoY" },
      { key: "Global Innovation Index 2024",     value: "Rank 39 / 133",             source: "WIPO 2024",              note: "Up from Rank 81 in 2015" },
      { key: "Internet Users (2025)",            value: "~95 crore",                  source: "TRAI 2025",              note: "2nd largest internet base globally" },
      { key: "Patent Filings (IPO 2023-24)",     value: "90,300+",                    source: "CGPDTM",                 note: "Record; +15.73% YoY" },
      { key: "Chandrayaan-3 achievement",        value: "South Pole landing — 4th country, 1st near pole", source: "ISRO 2023", note: "Pragyan rover: 14 earth-day mission" },
      { key: "BharatNet coverage",               value: "2 lakh gram panchayats",     source: "Ministry of Communications 2025", note: "OFC-based last-mile connectivity" },
      { key: "Aadhaar enrolments",               value: "140+ crore (near 100%)",     source: "UIDAI 2025",             note: "World's largest biometric ID" },
      { key: "IndiaAI Mission",                  value: "₹10,372 crore allocation",   source: "Budget 2024",            note: "10,000 GPUs; AI research + startups" },
      { key: "5G Rollout",                       value: "~97% districts covered (2025)", source: "DoT 2025",            note: "Fastest 5G rollout globally" },
      { key: "Gaganyaan Mission (human flight)", value: "Target: 2026",               source: "ISRO roadmap",           note: "First Indian human spaceflight" },
    ],
  },
  defence: {
    label: "Defence", icon: "🛡️", color: "#DC2626", bg: "#FEF2F2",
    items: [
      { key: "Defence Budget FY26",              value: "₹6,21,940 crore (1.9% GDP)", source: "Union Budget 2026-27",  note: "4th largest defence spender (SIPRI)" },
      { key: "Defence Exports FY25",             value: "₹21,083 crore (~$2.6 bn)",   source: "MoD 2025",              note: "Target: ₹50,000 crore by 2029" },
      { key: "Nuclear Warheads (estimated)",     value: "172",                         source: "SIPRI Yearbook 2024",   note: "Credible minimum deterrence posture" },
      { key: "Active Military Personnel",        value: "~14.5 lakh",                 source: "IISS 2024",             note: "3rd largest active military force" },
      { key: "BRICS members (2024)",             value: "10 members (5 original + 5 new)", source: "BRICS Summit 2023", note: "Joined: Egypt, Ethiopia, Iran, UAE, Saudi Arabia" },
      { key: "Quad members",                     value: "India, USA, Australia, Japan", source: "MEA",                 note: "Free and open Indo-Pacific framework" },
      { key: "SCO membership",                   value: "Member since 2017",           source: "MEA",                   note: "India chaired SCO 2023" },
      { key: "Agnipath / Agniveer Scheme",       value: "4-year service; 25% retained", source: "MoD 2022",            note: "Controversial lateral entry scheme" },
      { key: "iDEX (Innovations for Defence)",   value: "300+ startups, 400+ challenges", source: "MoD 2025",          note: "Defence tech startup ecosystem" },
      { key: "DRDO — key recent milestones",     value: "Pralay, MPATGM, Akash-NG, Zorawar light tank", source: "DRDO 2024-25", note: "Indigenisation under Make in India" },
    ],
  },
};

/* ══════════════════════════════════════════════════
   DAY 7 — UPSC Mains Syllabus (Syllabus Tracker)
══════════════════════════════════════════════════ */
export const UPSC_SYLLABUS = {
  gs1: {
    label: "GS Paper I", desc: "History, Geography & Society",
    color: "#7C3AED", bg: "#F5F3FF",
    sections: [
      { id: "gs1-culture", title: "Indian Heritage & Culture", topics: [
        { id: "gs1-c1", text: "Art Forms — Sculpture & Painting (Gandhara, Gupta, Mughal, Madhubani, Warli)" },
        { id: "gs1-c2", text: "Architecture — Nagara, Dravidian, Vesara, Indo-Islamic, Colonial periods" },
        { id: "gs1-c3", text: "Performing Arts — Hindustani & Carnatic music, classical dances, regional theatre" },
        { id: "gs1-c4", text: "Indian Philosophical Schools — Nyaya, Vaisheshika, Samkhya, Yoga, Mimamsa, Vedanta" },
        { id: "gs1-c5", text: "Bhakti & Sufi Movements — key saints, social reform impact" },
        { id: "gs1-c6", text: "Classical Literature — Sanskrit, Pali, Tamil Sangam, Persian, Urdu traditions" },
        { id: "gs1-c7", text: "Tribal & Folk Traditions — Warli, Baul, Bhavai, Chhau, integration into national culture" },
        { id: "gs1-c8", text: "India's cultural influence on Southeast Asia — temples, trade, Buddhism, language" },
      ]},
      { id: "gs1-history", title: "Modern Indian History (1757–1947)", topics: [
        { id: "gs1-h1", text: "Economic impact of British Rule — Drain of Wealth (Naoroji), deindustrialisation" },
        { id: "gs1-h2", text: "Socio-religious Reform Movements — Brahmo Samaj, Arya Samaj, Aligarh, Ramakrishna" },
        { id: "gs1-h3", text: "Rise of Nationalism — INC, Moderates vs Extremists, Swadeshi" },
        { id: "gs1-h4", text: "Mass Movements — Non-Cooperation (1920), Civil Disobedience (1930), Quit India (1942)" },
        { id: "gs1-h5", text: "Revolutionary Nationalism — Bhagat Singh, Bose, INA" },
        { id: "gs1-h6", text: "Constitutional Evolution — Morley-Minto 1909, Montagu-Chelmsford 1919, GoI Act 1935" },
        { id: "gs1-h7", text: "Role of Women in Freedom Struggle — Sarojini Naidu, Aruna Asaf Ali, Usha Mehta" },
        { id: "gs1-h8", text: "Partition, Independence 1947 and its long-term significance" },
      ]},
      { id: "gs1-post", title: "Post-Independence Consolidation", topics: [
        { id: "gs1-p1", text: "Integration of Princely States — Sardar Patel, accession, Operation Polo (Hyderabad)" },
        { id: "gs1-p2", text: "Reorganisation of States (1956) — linguistic basis, States Reorganisation Act" },
        { id: "gs1-p3", text: "Nehru's Foreign Policy — Panchsheel, Non-Alignment Movement (NAM)" },
        { id: "gs1-p4", text: "Five Year Plans & Industrial Policy — Nehruvian socialism, PSUs" },
        { id: "gs1-p5", text: "Green Revolution — HYV seeds, Punjab-Haryana belt, food self-sufficiency" },
        { id: "gs1-p6", text: "Emergency (1975–77) — causes, impact on democracy, 42nd and 44th Amendments" },
      ]},
      { id: "gs1-society", title: "Indian Society", topics: [
        { id: "gs1-s1", text: "Salient features — diversity, pluralism, unity in diversity, syncretism" },
        { id: "gs1-s2", text: "Communalism, Regionalism and Casteism — causes and remedies" },
        { id: "gs1-s3", text: "Caste System — Jajmani system, reservation debate, caste violence" },
        { id: "gs1-s4", text: "Women & Society — empowerment, gender violence, feminist movements" },
        { id: "gs1-s5", text: "Tribal Issues — PESA Act, Forest Rights Act, displacement" },
        { id: "gs1-s6", text: "Urbanisation & Social Change — migration, slum growth, urban anonymity" },
        { id: "gs1-s7", text: "Globalisation effects on Indian society — consumerism, cultural change, opportunities" },
      ]},
      { id: "gs1-geo", title: "Physical & World Geography", topics: [
        { id: "gs1-g1", text: "Plate Tectonics — earthquakes, volcanoes, fold mountains, ocean ridges" },
        { id: "gs1-g2", text: "Atmospheric circulation — monsoon, jet streams, El Niño & La Niña" },
        { id: "gs1-g3", text: "Ocean currents, tides and their climatic effects on coastlines" },
        { id: "gs1-g4", text: "Distribution of world's key resources — coal, petroleum, minerals" },
        { id: "gs1-g5", text: "Location factors for primary, secondary and tertiary industries" },
        { id: "gs1-g6", text: "Natural Hazards — cyclones, floods, droughts, landslides, earthquake zones" },
        { id: "gs1-g7", text: "India's physical geography — Himalayas, Plateau, Coastal Plains, Islands" },
      ]},
      { id: "gs1-resourc", title: "Resources & Demographics", topics: [
        { id: "gs1-r1", text: "Agriculture in India — major crops, soil types, crop seasons" },
        { id: "gs1-r2", text: "River systems — Himalayan & Peninsular rivers, interlinking project debates" },
        { id: "gs1-r3", text: "Population distribution, density, migration — Census key data" },
        { id: "gs1-r4", text: "Energy resources — coal, oil, gas geography and geopolitics" },
        { id: "gs1-r5", text: "Geopolitics of resources — Arctic, South China Sea, Indo-Pacific" },
        { id: "gs1-r6", text: "Urbanisation trends — megacities, smart cities, regional imbalances" },
      ]},
    ],
  },

  gs2: {
    label: "GS Paper II", desc: "Polity, Governance & IR",
    color: "#0369A1", bg: "#F0F9FF",
    sections: [
      { id: "gs2-const", title: "Indian Constitution", topics: [
        { id: "gs2-c1", text: "Historical underpinnings, evolution, features and Basic Structure doctrine" },
        { id: "gs2-c2", text: "Fundamental Rights (Articles 12–35) — limitations, recent SC judgements" },
        { id: "gs2-c3", text: "Directive Principles — classification, justiciability, harmony with Fundamental Rights" },
        { id: "gs2-c4", text: "Fundamental Duties — Article 51A, enforceability" },
        { id: "gs2-c5", text: "Constitutional bodies — UPSC, Election Commission, CAG, Finance Commission, NCST" },
        { id: "gs2-c6", text: "Citizenship — Articles 5-11, CAA 2019, overseas citizens" },
        { id: "gs2-c7", text: "Emergency Provisions — Articles 352, 356, 360, safeguards and misuse" },
        { id: "gs2-c8", text: "Key amendments — 42nd, 44th, 73rd, 74th, 86th, 101st GST, 106th Women's Reservation" },
      ]},
      { id: "gs2-parliament", title: "Parliament & State Legislatures", topics: [
        { id: "gs2-p1", text: "Parliament structure — Lok Sabha, Rajya Sabha, composition and powers" },
        { id: "gs2-p2", text: "Legislative process — ordinary bills, money bills, constitutional amendment bills" },
        { id: "gs2-p3", text: "Parliamentary committees — PAC, Estimates, Standing, Joint committees" },
        { id: "gs2-p4", text: "Role and independence of Speaker — anti-defection rulings" },
        { id: "gs2-p5", text: "Anti-Defection Law — 10th Schedule, SC interpretation, effectiveness" },
        { id: "gs2-p6", text: "State Legislatures — unicameral vs bicameral, Governor's role, Ordinance power" },
      ]},
      { id: "gs2-exec", title: "Executive, Judiciary & Federalism", topics: [
        { id: "gs2-e1", text: "President — election, real vs nominal powers, pardoning power" },
        { id: "gs2-e2", text: "Prime Minister & Cabinet — collective responsibility, coalition politics" },
        { id: "gs2-e3", text: "Supreme Court — structure, jurisdictions, judicial review, PILs" },
        { id: "gs2-e4", text: "Judicial independence vs accountability — collegium, NJAC verdict, case pendency" },
        { id: "gs2-e5", text: "Centre-State legislative and financial relations (Articles 245-293)" },
        { id: "gs2-e6", text: "Cooperative Federalism — NITI Aayog, Finance Commission, GST Council" },
      ]},
      { id: "gs2-gov", title: "Governance & Transparency", topics: [
        { id: "gs2-g1", text: "E-governance — Digital India, UMANG, DigiLocker, open government data" },
        { id: "gs2-g2", text: "RTI Act 2005 — significance, exemptions, Information Commissions, limitations" },
        { id: "gs2-g3", text: "Lokpal and Lokayuktas — powers, track record post-2013 Act" },
        { id: "gs2-g4", text: "Citizens' Charter and service delivery — Sevottam, CPGRAMS" },
        { id: "gs2-g5", text: "Civil Society and Pressure Groups — NGOs, PIL, media as watchdogs" },
        { id: "gs2-g6", text: "Whistleblower Protection Act 2014 — provisions, gaps" },
      ]},
      { id: "gs2-social", title: "Social Justice & Development", topics: [
        { id: "gs2-sj1", text: "Welfare schemes for SC/ST — Sub-Plans, EMRS, PMJVK, scholarship schemes" },
        { id: "gs2-sj2", text: "Health sector — NHP 2017, Ayushman Bharat (PM-JAY), PMABHIM" },
        { id: "gs2-sj3", text: "Education — NEP 2020, Right to Education, ASER reports, dropout rates" },
        { id: "gs2-sj4", text: "Poverty alleviation — MGNREGA, PM-SVANidhi, PM Garib Kalyan Anna Yojana" },
        { id: "gs2-sj5", text: "Development processes and role of NGOs — NABARD, SHGs, microfinance" },
        { id: "gs2-sj6", text: "Elderly, disabled and minorities — RPWD Act, Waqf reforms, Maintenance Act" },
      ]},
      { id: "gs2-ir", title: "International Relations", topics: [
        { id: "gs2-ir1", text: "Neighbourhood First — SAARC, BIMSTEC, ACT-EAST, IORA" },
        { id: "gs2-ir2", text: "India-US relations — 2+2 dialogue, IPEF, technology partnership, Quad" },
        { id: "gs2-ir3", text: "India-China relations — LAC dispute, Galwan 2020, trade, de-escalation" },
        { id: "gs2-ir4", text: "India-Russia relations — S-400, CAATSA, balancing post-Ukraine war" },
        { id: "gs2-ir5", text: "Multilateral institutions — UN reform, WTO, BRICS expansion, G20 India presidency" },
        { id: "gs2-ir6", text: "Strategic Autonomy — from NAM to Multi-Alignment, Voice of Global South" },
        { id: "gs2-ir7", text: "Indian Diaspora — foreign policy role, remittances ($120 bn), soft power" },
      ]},
    ],
  },

  gs3: {
    label: "GS Paper III", desc: "Economy, Environment & Security",
    color: "#047857", bg: "#ECFDF5",
    sections: [
      { id: "gs3-econ", title: "Economy & Development", topics: [
        { id: "gs3-e1", text: "Indian Economy since Independence — planning → LPG 1991 → post-2014 structural reforms" },
        { id: "gs3-e2", text: "Growth, development and employment — GDP, HDI, SDGs, inclusive growth" },
        { id: "gs3-e3", text: "Government Budgeting — fiscal deficit, FRBM Act, fiscal consolidation vs stimulus" },
        { id: "gs3-e4", text: "Inflation — WPI, CPI, RBI Monetary Policy Committee, inflation targeting framework" },
        { id: "gs3-e5", text: "Capital markets — SEBI, FDI, FPI, corporate bonds, GIFT City IFSC" },
        { id: "gs3-e6", text: "Infrastructure — PM Gati Shakti, NMP, National Infrastructure Pipeline (₹111 lakh cr)" },
        { id: "gs3-e7", text: "Investment models — PPP, VGF, HAM, DBT, PLI schemes" },
        { id: "gs3-e8", text: "Poverty & Inequality — MPI, Gini coefficient, Aspirational Districts Programme" },
      ]},
      { id: "gs3-agri", title: "Agriculture & Food Security", topics: [
        { id: "gs3-a1", text: "Land Reforms — zamindari abolition, land ceiling, cooperative farming" },
        { id: "gs3-a2", text: "Green Revolution — HYV, fertiliser dependency, soil degradation" },
        { id: "gs3-a3", text: "Irrigation & Water Management — watershed development, Jal Jeevan Mission" },
        { id: "gs3-a4", text: "Crops & MSP policy — CACP, MSP vs MRP debates, crop diversification" },
        { id: "gs3-a5", text: "Agricultural schemes — PM-KISAN, PM Fasal Bima Yojana, e-NAM, FPOs" },
        { id: "gs3-a6", text: "Food Processing — cold chains, APMC reform, One Nation One Market" },
        { id: "gs3-a7", text: "Food Security — PDS, FCI buffer stocks, National Food Security Act 2013" },
      ]},
      { id: "gs3-sci", title: "Science & Technology", topics: [
        { id: "gs3-s1", text: "Space Programme — Chandrayaan-3, Aditya-L1, Gaganyaan, commercial space policy" },
        { id: "gs3-s2", text: "Biotechnology — GMO (Bt cotton), CRISPR, gene therapy, IPR issues" },
        { id: "gs3-s3", text: "Defence Technology — DRDO, Make in India defence, iDEX, Agnipath scheme" },
        { id: "gs3-s4", text: "Nuclear Technology — three-stage programme, NSG, civilian nuclear deals" },
        { id: "gs3-s5", text: "AI & Digital Economy — India's AI Mission, UPI, ONDC, DPDP Act 2023" },
        { id: "gs3-s6", text: "Cybersecurity — CERT-In, IT Act, critical information infrastructure" },
        { id: "gs3-s7", text: "Emerging Tech — quantum computing, semiconductor mission, 5G/6G" },
      ]},
      { id: "gs3-env", title: "Environment & Ecology", topics: [
        { id: "gs3-ev1", text: "Biodiversity — hotspots, IUCN categories, endemic species, PA Network" },
        { id: "gs3-ev2", text: "Climate Change — Paris Agreement, India's NDC, Net Zero 2070, carbon markets" },
        { id: "gs3-ev3", text: "Pollution — air (NCAP), water (Namami Gange), soil degradation, plastic ban" },
        { id: "gs3-ev4", text: "Environmental Governance — EIA, NGT, MoEFCC, coastal regulation zone" },
        { id: "gs3-ev5", text: "Renewable Energy — solar (300 GW target), wind, green hydrogen, ISTS waiver" },
        { id: "gs3-ev6", text: "Disaster Management — NDMA, NDRF, Sendai Framework 2015-30" },
        { id: "gs3-ev7", text: "International conventions — CBD, CITES, Ramsar, Basel, Stockholm, COP decisions" },
      ]},
      { id: "gs3-security", title: "Internal Security", topics: [
        { id: "gs3-is1", text: "Development-extremism linkages — poverty, governance deficit, tribals" },
        { id: "gs3-is2", text: "Left-Wing Extremism — causes, SAMADHAN strategy, aspirational districts" },
        { id: "gs3-is3", text: "Terrorism — external state actors, FATF grey/black list, NIA, UAPA" },
        { id: "gs3-is4", text: "Northeast Insurgency — AFSPA debate, peace accords, Nagaland" },
        { id: "gs3-is5", text: "Cybercrime — social media misuse, deep fakes, financial fraud, CERT-In" },
        { id: "gs3-is6", text: "Money Laundering & Terror Financing — PMLA, Hawala, FATF compliance" },
      ]},
    ],
  },

  gs4: {
    label: "GS Paper IV", desc: "Ethics, Integrity & Aptitude",
    color: "#B45309", bg: "#FFFBEB",
    sections: [
      { id: "gs4-ethics", title: "Ethics & Human Interface", topics: [
        { id: "gs4-e1", text: "Essence of ethics — virtue ethics (Aristotle), duty ethics (Kant), consequentialism (Mill)" },
        { id: "gs4-e2", text: "Determinants of ethics — family, society, educational institutions, religion" },
        { id: "gs4-e3", text: "Ethical concerns in public life — corruption, conflict of interest, nepotism" },
        { id: "gs4-e4", text: "Public service values — integrity, impartiality, compassion, non-partisanship" },
        { id: "gs4-e5", text: "Probity in governance — transparency, accountability, Rule of Law" },
        { id: "gs4-e6", text: "Code of ethics and conduct — CVC guidelines, service rules, Nolan principles" },
      ]},
      { id: "gs4-attitude", title: "Attitude & Aptitude", topics: [
        { id: "gs4-a1", text: "Attitude structure — ABC model (Affective, Behavioural, Cognitive)" },
        { id: "gs4-a2", text: "Attitude formation and change — propaganda, persuasion, cognitive dissonance" },
        { id: "gs4-a3", text: "Moral and political attitudes in governance contexts" },
        { id: "gs4-a4", text: "Social influence and persuasion in administration" },
        { id: "gs4-a5", text: "Moral thinkers — Chanakya, Gandhi, Ambedkar, Rawls, Amartya Sen" },
      ]},
      { id: "gs4-ei", title: "Emotional Intelligence", topics: [
        { id: "gs4-ei1", text: "Concept and significance — Goleman's model (self-awareness, self-regulation, empathy)" },
        { id: "gs4-ei2", text: "Application in governance — citizen empathy, conflict resolution" },
        { id: "gs4-ei3", text: "Emotional resilience in crisis — disaster response, crisis management" },
        { id: "gs4-ei4", text: "Empathy as an administrative virtue — citizen-centric governance" },
        { id: "gs4-ei5", text: "Managing stress and burnout in public service" },
      ]},
      { id: "gs4-pubserv", title: "Public Service Ethics", topics: [
        { id: "gs4-ps1", text: "Ethical dilemmas in public administration — decision-making frameworks" },
        { id: "gs4-ps2", text: "Conflict of interest — types, disclosure norms, recusal" },
        { id: "gs4-ps3", text: "Whistleblowing — legal protection, moral courage, institutional mechanisms" },
        { id: "gs4-ps4", text: "Corporate governance and ethics — CSR, ESG frameworks" },
        { id: "gs4-ps5", text: "International standards — UNCAC, OECD anti-bribery convention" },
        { id: "gs4-ps6", text: "Work culture in public organisations — accountability, innovation" },
      ]},
      { id: "gs4-case", title: "Case Studies", topics: [
        { id: "gs4-cs1", text: "Ethical decision-making frameworks — utilitarian, deontological, virtue-based" },
        { id: "gs4-cs2", text: "Case study approach — facts, stakeholders, options, values at stake" },
        { id: "gs4-cs3", text: "Common themes — bribery, political pressure, whistleblowing, disaster response" },
        { id: "gs4-cs4", text: "Writing balanced, multi-perspective answers in exam format" },
      ]},
    ],
  },
};

/* ══════════════════════════════════════════════════
   DAY 8 — Quote Bank
══════════════════════════════════════════════════ */
export const QUOTE_BANK = [
  // ── Ethics & Governance ──
  { id:"q01", thinker:"Aristotle",           quote:"Excellence is not an act, but a habit.",                                               context:"Nicomachean Ethics — virtue as practice", category:"ethics",      gs:["gs4","essay"], tags:["character","habits","excellence"] },
  { id:"q02", thinker:"Immanuel Kant",       quote:"Act only according to that maxim by which you can also will that it should become a universal law.", context:"Categorical Imperative — Groundwork of Metaphysics of Morals", category:"ethics", gs:["gs4"], tags:["duty","universality","moral law"] },
  { id:"q03", thinker:"John Stuart Mill",    quote:"The only freedom which deserves the name is that of pursuing our own good in our own way.",         context:"On Liberty — harm principle and individual freedom", category:"ethics",    gs:["gs4","gs2"], tags:["freedom","liberty","individuality"] },
  { id:"q04", thinker:"John Rawls",          quote:"Justice is the first virtue of social institutions, as truth is of systems of thought.",             context:"A Theory of Justice — veil of ignorance", category:"ethics",              gs:["gs4","gs2"], tags:["justice","institutions","fairness"] },
  { id:"q05", thinker:"Mahatma Gandhi",      quote:"In matters of conscience, the law of the majority has no place.",                                    context:"Young India, 1921 — conscience over conformity", category:"ethics",        gs:["gs4","essay"], tags:["conscience","moral courage","non-conformism"] },
  { id:"q06", thinker:"Lord Acton",          quote:"Power tends to corrupt; absolute power corrupts absolutely.",                                         context:"Letter to Bishop Mandell Creighton, 1887", category:"governance",          gs:["gs4","gs2"], tags:["power","corruption","accountability"] },
  { id:"q07", thinker:"Chanakya",            quote:"The king shall consider as good not what pleases himself, but what pleases his subjects.",            context:"Arthashastra — welfare state principle", category:"governance",           gs:["gs4","gs2"], tags:["king","welfare","public interest"] },
  { id:"q08", thinker:"Chanakya",            quote:"A person should not be too honest. Straight trees are cut first and honest people are screwed first.", context:"Arthashastra — pragmatic ethics in administration", category:"ethics",  gs:["gs4"], tags:["honesty","pragmatism","realpolitik"] },
  { id:"q09", thinker:"APJ Abdul Kalam",     quote:"If a country is to be corruption free and become a nation of beautiful minds, I strongly feel there are three key societal members who can make a difference: the father, the mother and the teacher.", context:"Wings of Fire", category:"ethics", gs:["gs4","essay"], tags:["corruption","education","family"] },
  { id:"q10", thinker:"Socrates",            quote:"The unexamined life is not worth living.",                                                           context:"Apology — on self-reflection and ethical living", category:"philosophy", gs:["gs4","essay"], tags:["self-reflection","wisdom","examined life"] },
  { id:"q11", thinker:"B.R. Ambedkar",       quote:"Political democracy cannot last unless there lies at the base of it social democracy.",              context:"Constituent Assembly, 1949 — constitutional morality", category:"governance", gs:["gs2","essay"], tags:["democracy","social justice","equality"] },
  { id:"q12", thinker:"B.R. Ambedkar",       quote:"I measure the progress of a community by the degree of progress which women have achieved.",         context:"Speech on women's empowerment", category:"society",                      gs:["gs1","essay"], tags:["women","progress","community"] },
  { id:"q13", thinker:"Edmund Burke",        quote:"The only thing necessary for the triumph of evil is for good men to do nothing.",                    context:"Classic political philosophy — moral inaction", category:"ethics",        gs:["gs4","essay"], tags:["evil","inaction","moral responsibility"] },
  { id:"q14", thinker:"Plato",              quote:"Wise men speak because they have something to say; fools because they have to say something.",         context:"The Republic — wisdom vs rhetoric", category:"philosophy",              gs:["gs4","essay"], tags:["wisdom","speech","fool"] },
  { id:"q15", thinker:"Confucius",           quote:"The strength of a nation derives from the integrity of the home.",                                    context:"Analects — family as foundation of governance", category:"governance",   gs:["gs4","gs2"], tags:["family","integrity","nation"] },
  { id:"q16", thinker:"Martin Luther King",  quote:"The arc of the moral universe is long, but it bends toward justice.",                               context:"Address to civil rights movement, 1965", category:"ethics",              gs:["gs4","essay"], tags:["justice","morality","change"] },
  { id:"q17", thinker:"Nolan Committee",     quote:"Selflessness, integrity, objectivity, accountability, openness, honesty, leadership — the Seven Principles of Public Life.", context:"UK Nolan Report, 1995 — public service values", category:"governance", gs:["gs4"], tags:["public service","integrity","ethics"] },

  // ── Economy & Development ──
  { id:"q18", thinker:"Amartya Sen",         quote:"Development is freedom — the expansion of human capabilities and the removal of unfreedoms.",        context:"Development as Freedom, 1999 — capability approach", category:"economy",  gs:["gs3","essay"], tags:["development","capability","freedom"] },
  { id:"q19", thinker:"Amartya Sen",         quote:"Poverty is not just a lack of money; it is not having the capability to realise one's full potential.", context:"Capability approach — poverty as unfreedom", category:"economy",     gs:["gs3","gs2"], tags:["poverty","capability","human development"] },
  { id:"q20", thinker:"Dadabhai Naoroji",    quote:"The bleeding of India — British India is being drained of its wealth like water from a vessel with holes in the bottom.", context:"Poverty and Un-British Rule in India, 1901 — Drain Theory", category:"economy", gs:["gs1","essay"], tags:["drain","colonial","wealth"] },
  { id:"q21", thinker:"John Maynard Keynes", quote:"In the long run we are all dead.",                                                                   context:"A Tract on Monetary Reform, 1923 — short-term policy relevance", category:"economy", gs:["gs3"], tags:["short-term","policy","economics"] },
  { id:"q22", thinker:"Jawaharlal Nehru",    quote:"A moment comes, which comes but rarely in history, when we step out from the old to the new, when an age ends, and when the soul of a nation, long suppressed, finds utterance.", context:"Tryst with Destiny Speech, Aug 14, 1947", category:"economy", gs:["gs1","essay"], tags:["independence","nation-building","aspirations"] },
  { id:"q23", thinker:"Manmohan Singh",      quote:"The process of economic reform is a process without an end.",                                         context:"Budget speech on LPG reforms, 1991", category:"economy",               gs:["gs3","essay"], tags:["reforms","LPG","economic liberalisation"] },
  { id:"q24", thinker:"Adam Smith",          quote:"It is not from the benevolence of the butcher, the brewer, or the baker that we expect our dinner, but from their regard to their own interest.", context:"Wealth of Nations — invisible hand", category:"economy", gs:["gs3"], tags:["market","self-interest","capitalism"] },
  { id:"q25", thinker:"Mahatma Gandhi",      quote:"Earth provides enough to satisfy every man's needs but not every man's greed.",                      context:"Economic philosophy — simple living, trusteeship", category:"economy",  gs:["gs3","essay"], tags:["greed","sustainability","trusteeship"] },
  { id:"q26", thinker:"Swami Vivekananda",   quote:"The poor in our country need no pity; they need our respect and our intelligence in raising them.",   context:"Philosophy of service — karma yoga", category:"economy",              gs:["gs4","essay"], tags:["poverty","service","respect"] },

  // ── Environment & Ecology ──
  { id:"q27", thinker:"Native American Proverb", quote:"We do not inherit the Earth from our ancestors; we borrow it from our children.",               context:"Indigenous environmental philosophy — intergenerational equity", category:"environment", gs:["gs3","essay"], tags:["environment","future generations","sustainability"] },
  { id:"q28", thinker:"Rachel Carson",        quote:"The more clearly we can focus our attention on the wonders and realities of the universe about us, the less taste we shall have for destruction.", context:"Silent Spring, 1962 — environmental consciousness", category:"environment", gs:["gs3","essay"], tags:["ecology","awareness","destruction"] },
  { id:"q29", thinker:"Sundarlal Bahuguna",   quote:"Ecology is the permanent economy.",                                                                  context:"Chipko Movement — forest conservation philosophy", category:"environment", gs:["gs3","gs1"], tags:["ecology","Chipko","conservation"] },
  { id:"q30", thinker:"David Attenborough",   quote:"No one will protect what they don't care about; and no one will care about what they have never experienced.", context:"Environmental awareness — education and conservation", category:"environment", gs:["gs3","essay"], tags:["conservation","experience","awareness"] },
  { id:"q31", thinker:"Indira Gandhi",        quote:"The environment cannot be protected by passing laws alone. The people's participation is essential.", context:"Stockholm Conference on Environment, 1972", category:"environment",    gs:["gs3","gs2"], tags:["participation","environment","governance"] },
  { id:"q32", thinker:"Wangari Maathai",      quote:"In a few decades, the relationship between the environment, resources and conflict may seem almost as obvious as the relationship we see today between human rights, democracy and peace.", context:"Nobel Peace Prize acceptance speech, 2004", category:"environment", gs:["gs3","essay"], tags:["conflict","resources","peace"] },
  { id:"q33", thinker:"Robert Swan",          quote:"The greatest threat to our planet is the belief that someone else will save it.",                    context:"Polar explorer and climate activist", category:"environment",            gs:["gs3","essay"], tags:["responsibility","climate","action"] },

  // ── Society & Women ──
  { id:"q34", thinker:"Jawaharlal Nehru",    quote:"You can tell the condition of a nation by looking at the status of its women.",                       context:"Convocation address — women as barometer of development", category:"society", gs:["gs1","essay"], tags:["women","nation","status"] },
  { id:"q35", thinker:"Savitribai Phule",    quote:"Knowledge is the greatest gift; it can never be stolen, never be burnt, never be taken away.",        context:"Pioneer of women's education in India, 1840s", category:"society",     gs:["gs1","essay"], tags:["education","women","knowledge"] },
  { id:"q36", thinker:"Swami Vivekananda",   quote:"There is no chance for the welfare of the world unless the condition of women is improved.",           context:"Lecture at Madras, 1893 — women's empowerment", category:"society",   gs:["gs1","essay"], tags:["women","welfare","empowerment"] },
  { id:"q37", thinker:"APJ Abdul Kalam",     quote:"Empowering women is a prerequisite for creating a good nation.",                                      context:"Wings of Fire — on gender equality", category:"society",              gs:["gs1","essay"], tags:["women","empowerment","nation"] },
  { id:"q38", thinker:"Mary Wollstonecraft", quote:"I do not wish women to have power over men; but over themselves.",                                    context:"A Vindication of the Rights of Woman, 1792", category:"society",       gs:["gs1","essay"], tags:["women","autonomy","equality"] },
  { id:"q39", thinker:"Mahatma Gandhi",      quote:"If you educate a man, you educate an individual. If you educate a woman, you educate a nation.",       context:"Philosophy of women's education — multiplier effect", category:"society", gs:["gs1","essay"], tags:["education","women","nation"] },
  { id:"q40", thinker:"Nelson Mandela",      quote:"Education is the most powerful weapon which you can use to change the world.",                        context:"Address at Madison Park High School, 1990", category:"society",        gs:["gs2","essay"], tags:["education","change","empowerment"] },
  { id:"q41", thinker:"Rabindranath Tagore", quote:"Where the mind is without fear and the head is held high, into that heaven of freedom let my country awake.", context:"Gitanjali, 1910 — vision of India", category:"society",   gs:["gs1","essay"], tags:["freedom","education","nation"] },

  // ── Science & Technology ──
  { id:"q42", thinker:"Vikram Sarabhai",     quote:"We must be second to none in the application of advanced technologies to the real problems of man and society.", context:"ISRO philosophy — space for national development", category:"science", gs:["gs3","essay"], tags:["space","technology","development"] },
  { id:"q43", thinker:"Albert Einstein",     quote:"Imagination is more important than knowledge. Knowledge is limited; imagination encircles the world.",  context:"On scientific creativity, 1929", category:"science",                  gs:["gs3","essay"], tags:["imagination","knowledge","creativity"] },
  { id:"q44", thinker:"C.V. Raman",          quote:"I am the master of my failure. If I never fail, how will I ever learn?",                             context:"On scientific perseverance — discovery through failure", category:"science", gs:["gs3","essay"], tags:["failure","learning","science"] },
  { id:"q45", thinker:"Carl Sagan",          quote:"Science is a way of thinking much more than it is a body of knowledge.",                              context:"The Demon-Haunted World — scientific temper", category:"science",      gs:["gs3","essay"], tags:["scientific temper","thinking","knowledge"] },
  { id:"q46", thinker:"Satya Nadella",       quote:"Technology is only meaningful when it serves humanity, not when it replaces it.",                      context:"Hit Refresh — technology and human values", category:"science",       gs:["gs3","essay"], tags:["AI","technology","humanity"] },

  // ── International Relations & Philosophy ──
  { id:"q47", thinker:"Maha Upanishad",      quote:"Vasudhaiva Kutumbakam — The world is one family.",                                                   context:"Maha Upanishad 6.71 — India's foreign policy principle (G20 theme)", category:"international", gs:["gs2","essay"], tags:["global","family","India","G20"] },
  { id:"q48", thinker:"Jawaharlal Nehru",    quote:"Peace is not a relationship of nations. It is a condition of mind brought about by a serenity of soul.", context:"Foreign policy philosophy — NAM", category:"international",       gs:["gs2","essay"], tags:["peace","foreign policy","NAM"] },
  { id:"q49", thinker:"Kautilya (Chanakya)", quote:"The enemy of my enemy is my friend.",                                                                context:"Arthashastra — Mandala theory of states", category:"international",    gs:["gs2"], tags:["foreign policy","Mandala","alliances"] },
  { id:"q50", thinker:"Kofi Annan",          quote:"We may have all come on different ships, but we're in the same boat now.",                            context:"On global solidarity and multilateralism", category:"international",   gs:["gs2","essay"], tags:["multilateralism","solidarity","UN"] },
  { id:"q51", thinker:"S. Jaishankar",       quote:"India must be a leading power, not just a balancing power.",                                          context:"The India Way, 2020 — India's strategic vision", category:"international", gs:["gs2","essay"], tags:["India","foreign policy","strategic autonomy"] },

  // ── Human Values & Philosophy ──
  { id:"q52", thinker:"Mahatma Gandhi",      quote:"Be the change you wish to see in the world.",                                                         context:"Philosophy of inner transformation before social change", category:"philosophy", gs:["gs4","essay"], tags:["change","self","transformation"] },
  { id:"q53", thinker:"Swami Vivekananda",   quote:"He who controls himself controls the world.",                                                          context:"Karma Yoga — self-mastery as foundation of service", category:"philosophy", gs:["gs4","essay"], tags:["self-control","discipline","world"] },
  { id:"q54", thinker:"Tagore",             quote:"The highest education is that which does not merely give us information but makes our life in harmony with all existence.", context:"Gitanjali on holistic education", category:"philosophy", gs:["gs2","essay"], tags:["education","harmony","holistic"] },
  { id:"q55", thinker:"George Santayana",    quote:"Those who cannot remember the past are condemned to repeat it.",                                       context:"The Life of Reason, 1905 — learning from history", category:"philosophy", gs:["gs1","essay"], tags:["history","memory","learning"] },
  { id:"q56", thinker:"Nelson Mandela",      quote:"It always seems impossible until it is done.",                                                         context:"Long Walk to Freedom — perseverance against adversity", category:"philosophy", gs:["gs4","essay"], tags:["perseverance","adversity","inspiration"] },
  { id:"q57", thinker:"Albert Camus",        quote:"In the depth of winter, I finally learned that within me there lay an invincible summer.",             context:"Return to Tipasa — resilience in crisis", category:"philosophy",      gs:["gs4","essay"], tags:["resilience","adversity","inner strength"] },
  { id:"q58", thinker:"Victor Frankl",       quote:"When we are no longer able to change a situation, we are challenged to change ourselves.",             context:"Man's Search for Meaning — logotherapy, choice in adversity", category:"ethics", gs:["gs4","essay"], tags:["change","adversity","attitude"] },
  { id:"q59", thinker:"Rumi",               quote:"Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself.",   context:"Sufi wisdom — internal transformation precedes external", category:"philosophy", gs:["gs4","essay"], tags:["wisdom","change","self"] },
  { id:"q60", thinker:"Lao Tzu",            quote:"A leader is best when people barely know he exists. When his work is done, his aim fulfilled, they will say: we did it ourselves.", context:"Tao Te Ching — servant leadership", category:"governance", gs:["gs4","gs2"], tags:["leadership","servant","humility"] },
  { id:"q61", thinker:"Winston Churchill",   quote:"Democracy is the worst form of government — except for all the others that have been tried.",          context:"House of Commons, 1947 — defence of imperfect democracy", category:"governance", gs:["gs2","essay"], tags:["democracy","governance","politics"] },
  { id:"q62", thinker:"Abraham Lincoln",     quote:"Government of the people, by the people, for the people, shall not perish from the Earth.",            context:"Gettysburg Address, 1863 — democratic ideal", category:"governance",  gs:["gs2","essay"], tags:["democracy","people","governance"] },
  { id:"q63", thinker:"Indira Gandhi",       quote:"Forgetting is never freedom; all the struggles of the past have made us what we are.",                  context:"On national memory and historical consciousness", category:"philosophy", gs:["gs1","essay"], tags:["history","freedom","memory"] },
  { id:"q64", thinker:"Sardar Patel",        quote:"India's strength lies in her unity. We must be one and strong.",                                       context:"On national integration — integration of princely states", category:"governance", gs:["gs1","gs2"], tags:["unity","integration","strength"] },
  { id:"q65", thinker:"APJ Abdul Kalam",     quote:"Dream, dream, dream. Dreams transform into thoughts, and thoughts result in action.",                  context:"Wings of Fire — on vision and aspiration", category:"philosophy",     gs:["gs4","essay"], tags:["dreams","action","aspiration"] },
];

export const QUOTE_CATEGORIES = [
  { id: "all",           label: "All",            color: "#1E3A5F" },
  { id: "ethics",        label: "Ethics",         color: "#B45309" },
  { id: "governance",    label: "Governance",     color: "#0369A1" },
  { id: "economy",       label: "Economy",        color: "#047857" },
  { id: "environment",   label: "Environment",    color: "#15803D" },
  { id: "society",       label: "Society",        color: "#7C3AED" },
  { id: "science",       label: "Science & Tech", color: "#0891B2" },
  { id: "international", label: "IR & World",     color: "#DC2626" },
  { id: "philosophy",    label: "Philosophy",     color: "#9D174D" },
];

/* ══════════════════════════════════════════════════
   DAY 8 — Answer Frameworks
══════════════════════════════════════════════════ */
export const ANSWER_FRAMEWORKS = [
  {
    id: "discuss", type: "Discuss", color: "#0369A1", gs: ["gs1","gs2","gs3"],
    desc: "Balanced exploration of a topic from multiple angles",
    keywords: ["discuss", "examine", "elaborate", "bring out"],
    wordGuide: { 150: "1+3+1 paras", 250: "2+4+2 paras", 500: "3+6+3 paras" },
    structure: [
      { part: "Introduction",  pct: 15, icon: "🟡", tip: "Define the core concept. State the scope. Set up the dimensions you will discuss." },
      { part: "Historical / Background Context", pct: 20, icon: "📜", tip: "When / how did this issue emerge? Historical roots, evolution, significance." },
      { part: "Present Status & Key Arguments", pct: 25, icon: "📊", tip: "Data, facts, recent developments. Arguments supporting the topic." },
      { part: "Challenges / Counter-arguments", pct: 20, icon: "⚠️", tip: "Critical perspective. What has not worked? Gaps, limitations." },
      { part: "Way Forward",   pct: 10, icon: "✅", tip: "2-3 concrete, actionable recommendations. Policy-level suggestions." },
      { part: "Conclusion",    pct: 10, icon: "🎯", tip: "Balanced, forward-looking. Avoid extreme positions. Quote a thinker if relevant." },
    ],
    dos: ["Use transitional phrases", "Include 2-3 data points", "Give examples from India + international"],
    donts: ["Do not take a one-sided position", "Do not repeat the introduction in conclusion"],
    example: "Discuss the role of civil society in strengthening democratic institutions in India.",
  },
  {
    id: "critically", type: "Critically Examine", color: "#DC2626", gs: ["gs1","gs2","gs3","gs4"],
    desc: "Evaluate merits AND limitations — no blind praise or criticism",
    keywords: ["critically examine", "critically analyse", "critically evaluate"],
    wordGuide: { 150: "1+2+2+1", 250: "2+3+3+2", 500: "3+5+5+3" },
    structure: [
      { part: "Introduction",      pct: 12, icon: "🟡", tip: "Introduce the statement/policy. State that you will evaluate both sides." },
      { part: "Arguments FOR",     pct: 30, icon: "✅", tip: "Positive aspects, evidence, data, success stories, expert support." },
      { part: "Arguments AGAINST", pct: 30, icon: "❌", tip: "Limitations, failures, unintended consequences, criticism, missing elements." },
      { part: "Balanced Assessment",pct:18, icon: "⚖️", tip: "Weigh both sides. Under what conditions does the statement hold? What reforms are needed?" },
      { part: "Conclusion",        pct: 10, icon: "🎯", tip: "Your balanced verdict. Quote a thinker or cite a committee recommendation." },
    ],
    dos: ["Equal weight to pros and cons", "Be specific — avoid vague criticisms", "End with constructive suggestions"],
    donts: ["Don't just list points without analysis", "Avoid writing only positives ('examine' ≠ 'praise')"],
    example: "Critically examine the effectiveness of the Right to Information Act in ensuring government accountability.",
  },
  {
    id: "analyze", type: "Analyze", color: "#7C3AED", gs: ["gs2","gs3"],
    desc: "Break into components, examine causes, effects, and interconnections",
    keywords: ["analyze", "analyse", "study", "explain in detail"],
    wordGuide: { 150: "1+2+2+1", 250: "2+3+3+2", 500: "2+4+4+4+2" },
    structure: [
      { part: "Introduction",          pct: 12, icon: "🟡", tip: "Define what is being analyzed. State the importance of this analysis." },
      { part: "Causes / Components",   pct: 28, icon: "🔍", tip: "Break down into parts. What are the root causes or driving factors?" },
      { part: "Effects / Consequences",pct: 28, icon: "💥", tip: "Short-term and long-term effects. Sector-wise / dimension-wise impact." },
      { part: "Interconnections",      pct: 20, icon: "🔗", tip: "How does this issue connect to other topics? Cross-cutting implications." },
      { part: "Conclusion",            pct: 12, icon: "🎯", tip: "Summary of key findings. Policy implication or recommendation." },
    ],
    dos: ["Use cause-effect logic", "Quantify where possible", "Show systemic thinking"],
    donts: ["Don't confuse analysis with description", "Don't list without explaining 'why'"],
    example: "Analyze the causes and consequences of urban flooding in Indian metropolitan cities.",
  },
  {
    id: "comment", type: "Comment", color: "#047857", gs: ["gs1","gs2","gs3","gs4"],
    desc: "Give your informed opinion — concise, focused, no lengthy framework needed",
    keywords: ["comment", "give your views", "what do you think", "do you agree"],
    wordGuide: { 150: "1+3+1", 250: "2+4+2" },
    structure: [
      { part: "Context Setting", pct: 20, icon: "🟡", tip: "Frame the statement. What does it mean? Why is it significant?" },
      { part: "Your Argument",   pct: 55, icon: "💬", tip: "State your position clearly. Support with 3-4 evidence points, data, examples." },
      { part: "Caveat / Nuance", pct: 15, icon: "⚖️", tip: "Acknowledge one limitation or alternative view to show balanced thinking." },
      { part: "Conclusion",      pct: 10, icon: "🎯", tip: "Restate your position in one crisp sentence." },
    ],
    dos: ["Take a clear position", "Keep it tight — this is usually a shorter question", "Quote a relevant thinker"],
    donts: ["Don't be wishy-washy — 'it depends on X' without taking a stand", "Don't write an essay when a focused comment is needed"],
    example: "Comment: 'Social media has done more harm than good to Indian democracy.'",
  },
  {
    id: "compare", type: "Compare & Contrast", color: "#B45309", gs: ["gs1","gs2","gs3"],
    desc: "Identify similarities and differences between two entities/concepts",
    keywords: ["compare", "contrast", "distinguish", "differentiate", "similarities and differences"],
    wordGuide: { 150: "1+2+2+1", 250: "2+4+4+2" },
    structure: [
      { part: "Introduction",     pct: 12, icon: "🟡", tip: "Briefly introduce both entities/concepts. State the purpose of comparison." },
      { part: "Similarities",     pct: 33, icon: "🟰", tip: "Common features, shared principles, overlapping functions. Table format helps." },
      { part: "Differences",      pct: 33, icon: "⚡", tip: "Key distinctions: scope, origin, approach, outcomes, constitutional basis." },
      { part: "Critical Assessment",pct:12, icon: "⚖️", tip: "Which is more effective/appropriate? Under what conditions?" },
      { part: "Conclusion",       pct: 10, icon: "🎯", tip: "Synthesize the comparison. What can each learn from the other?" },
    ],
    dos: ["Use a tabular comparison if word limit allows", "Be balanced — equal depth for each entity"],
    donts: ["Don't just list features — explain WHY the difference matters"],
    example: "Compare and contrast the working of Parliamentary and Presidential systems of government.",
  },
  {
    id: "evaluate", type: "Evaluate / Assess", color: "#0891B2", gs: ["gs2","gs3"],
    desc: "Judge the success or failure of a policy/scheme against stated objectives",
    keywords: ["evaluate", "assess", "appraise", "how effective", "success of"],
    wordGuide: { 150: "1+3+1", 250: "2+4+2", 500: "2+5+4+3+2" },
    structure: [
      { part: "Introduction + Objectives", pct: 15, icon: "🟡", tip: "What was the policy/scheme supposed to achieve? State its goals clearly." },
      { part: "Achievements / Successes",  pct: 28, icon: "✅", tip: "Quantified outcomes, success stories, data showing progress." },
      { part: "Shortfalls / Failures",     pct: 28, icon: "⚠️", tip: "Where has it fallen short? Corruption, poor implementation, exclusion." },
      { part: "Structural Issues",         pct: 15, icon: "🔧", tip: "Design flaws, policy gaps, institutional weaknesses." },
      { part: "Recommendations",           pct: 10, icon: "💡", tip: "Reform suggestions based on the evaluation." },
      { part: "Conclusion",               pct:  4, icon: "🎯", tip: "Overall verdict: is it worth continuing? What changes are essential?" },
    ],
    dos: ["Use data to back both success and failure", "Cite committee/CAG reports for credibility"],
    donts: ["Don't evaluate without first stating what the objectives were"],
    example: "Evaluate the success of Digital India Mission in bridging the digital divide.",
  },
  {
    id: "suggest", type: "Suggest Measures", color: "#15803D", gs: ["gs2","gs3","gs4"],
    desc: "Problem → causes → concrete, multi-dimensional solutions",
    keywords: ["suggest measures", "suggest steps", "what should be done", "how can", "remedies"],
    wordGuide: { 150: "1+1+4+1", 250: "2+2+6+2" },
    structure: [
      { part: "Problem Statement",  pct: 15, icon: "🔴", tip: "Define the problem clearly. Use data to show its magnitude." },
      { part: "Root Causes",        pct: 15, icon: "🔍", tip: "Why does this problem persist? Institutional, social, economic causes." },
      { part: "Multi-level Solutions",pct:55, icon: "✅", tip: "Short-term: immediate relief measures. Long-term: structural reforms. Use sub-heads: Legal / Administrative / Technology / Social." },
      { part: "Conclusion",         pct: 15, icon: "🎯", tip: "State the expected outcome if measures are implemented. Inspire with a quote." },
    ],
    dos: ["Categorize measures: Legal / Tech / Admin / Social / Financial", "Be specific — name actual schemes, laws, bodies"],
    donts: ["Don't suggest vague measures like 'awareness should be raised'", "Don't ignore ground-level implementation challenges"],
    example: "Suggest measures to address the problem of food wastage in India.",
  },
  {
    id: "explain", type: "Explain with Examples", color: "#9D174D", gs: ["gs1","gs2","gs3"],
    desc: "Concept-first, then illustrate with concrete India-based examples",
    keywords: ["explain", "elucidate", "illustrate", "with examples", "with reference to"],
    wordGuide: { 150: "1+3+1", 250: "2+5+2" },
    structure: [
      { part: "Concept Explanation", pct: 30, icon: "📖", tip: "Define and explain the concept clearly. Include key characteristics, types." },
      { part: "India Examples",      pct: 40, icon: "🇮🇳", tip: "3-4 specific, named examples from India. State, district, or national level." },
      { part: "Global Examples",     pct: 15, icon: "🌐", tip: "1 international example to show India's position or global context." },
      { part: "Significance + Conclusion", pct: 15, icon: "🎯", tip: "Why does this matter? Implication for policy or society." },
    ],
    dos: ["Use named, specific examples (avoid 'some states')", "Connect examples back to the concept"],
    donts: ["Don't list examples without explaining how they illustrate the concept"],
    example: "Explain the concept of cooperative federalism with examples from India.",
  },
  {
    id: "enumerate", type: "Enumerate", color: "#0369A1", gs: ["gs1","gs2","gs3"],
    desc: "List with brief explanations — structured enumeration, not a bare list",
    keywords: ["enumerate", "list", "mention", "name the", "what are the"],
    wordGuide: { 150: "1+points+1", 250: "intro+points+conclusion" },
    structure: [
      { part: "Introduction",      pct: 10, icon: "🟡", tip: "One-two lines context. State how many points you will cover." },
      { part: "Enumerated Points", pct: 80, icon: "🔢", tip: "Number each point. Bold the heading. 1-2 sentences explaining each. Include sub-examples or data." },
      { part: "Conclusion",        pct: 10, icon: "🎯", tip: "Brief synthesis. Significance or policy implication." },
    ],
    dos: ["Use numbered/bulleted format", "Prioritize — most important first", "Each point gets at least one sentence of explanation"],
    donts: ["Don't write a bare list without any explanation", "Don't go beyond the word limit by over-explaining"],
    example: "Enumerate the safeguards available against the misuse of emergency provisions in the Indian Constitution.",
  },
  {
    id: "casestudy", type: "GS4 Case Study", color: "#B45309", gs: ["gs4"],
    desc: "Structured ethical dilemma analysis: facts → stakeholders → options → decision",
    keywords: ["case study", "ethical dilemma", "what would you do", "as an officer"],
    wordGuide: { 250: "ideal length", 500: "if multiple sub-questions" },
    structure: [
      { part: "Facts of the Case",     pct: 10, icon: "📋", tip: "Summarise key facts in 2-3 lines. Identify the central ethical conflict." },
      { part: "Stakeholder Analysis",  pct: 15, icon: "👥", tip: "List all affected parties. What are their interests / rights / vulnerabilities?" },
      { part: "Ethical Issues at Stake",pct:20, icon: "⚖️", tip: "Name the ethical principles in tension: integrity vs loyalty, rule vs compassion, etc." },
      { part: "Options Available",     pct: 20, icon: "🔀", tip: "List 3 options with pros and cons of each. Apply different ethical frameworks." },
      { part: "Recommended Course of Action",pct:25,icon:"✅",tip:"State what you would do and WHY. Ground it in values, law, and consequences." },
      { part: "Safeguards / Prevention",pct:10, icon: "🛡", tip: "What systemic measures would prevent this dilemma from recurring?" },
    ],
    dos: ["Address all sub-questions if given", "Name the ethical values at stake (integrity, empathy, fairness)", "Show you considered multiple options before deciding"],
    donts: ["Don't ignore the law", "Don't be excessively rigid or excessively compassionate — show balance", "Don't skip stakeholder analysis"],
    example: "As a district collector, you find that a welfare scheme is being siphoned by local politicians. You have evidence but acting may cost your transfer. What do you do?",
  },
  {
    id: "essay-intro", type: "Essay Introduction", color: "#9D174D", gs: ["essay"],
    desc: "Hook → Context → Thesis → Road-map — the 4-step essay opener",
    keywords: ["essay", "write an essay on", "essay paper"],
    wordGuide: { 1200: "Essay paper: 200-word intro is ideal" },
    structure: [
      { part: "Hook",        pct: 20, icon: "🪝", tip: "Start with a quote, anecdote, statistic, or rhetorical question. Grab the reader." },
      { part: "Context",     pct: 25, icon: "📰", tip: "Establish why this topic is relevant. Historical context or current urgency." },
      { part: "Thesis",      pct: 30, icon: "💡", tip: "Your central argument or interpretation of the essay theme. Be clear and specific." },
      { part: "Road-map",    pct: 25, icon: "🗺", tip: "Preview the dimensions you will cover: social, economic, political, ethical, historical." },
    ],
    dos: ["Open with a memorable quote or data point", "Make your thesis original — not just restating the topic", "Keep it under 200 words"],
    donts: ["Don't start with 'In today's world...' (clichéd)", "Don't summarize the entire essay in the introduction"],
    example: "Essay on: 'Forests are the lungs of the Earth — but development is their cancer.'",
  },
  {
    id: "two-sides", type: "Two-Sided Argument", color: "#DC2626", gs: ["gs1","gs2","gs3","gs4"],
    desc: "Present both sides of a debate before arriving at your position",
    keywords: ["do you agree", "agree or disagree", "for and against", "is it correct that"],
    wordGuide: { 150: "1+2+2+1", 250: "1+3+3+2+1" },
    structure: [
      { part: "Introduction",      pct: 10, icon: "🟡", tip: "Introduce the debate. State that you will examine both sides." },
      { part: "Side A (For)",      pct: 33, icon: "✅", tip: "Present the strongest arguments and evidence supporting the statement." },
      { part: "Side B (Against)",  pct: 33, icon: "❌", tip: "Present strong counterarguments. Don't create a straw man — steel-man the opposition." },
      { part: "Your Position",     pct: 16, icon: "⚖️", tip: "Take a clear position with reasons. Acknowledge the strongest counter-argument." },
      { part: "Conclusion",        pct:  8, icon: "🎯", tip: "Synthesize with a nuanced statement. Recommend a balanced path." },
    ],
    dos: ["Take a clear position", "Acknowledge the strongest counterpoint before dismissing it"],
    donts: ["Don't be fence-sitter — UPSC rewards a reasoned position", "Don't make both sides unequal"],
    example: "Do you agree that Article 356 (President's Rule) has been misused more than it has been legitimately used? Argue.",
  },
];

// ── TOPIC CLASSIFICATION SYSTEM ──────────────────────────────────────────────
// Maps topic categories to UPSC-relevant note sections.
// Used by NoteGenerator to show only the sections that make sense for a topic.
//
// Each section has:
//   id            — snake_case key matching NOTE_SECTIONS ids where possible
//   label         — display name
//   icon          — single emoji
//   hint          — ≤15 words describing what content to write
//   pdfKeyPhrases — 5-6 short phrases to grep in PDF text for this section

export const TOPIC_CATEGORIES = {

  // ── 1. GEOGRAPHY ────────────────────────────────────────────────────────────
  // Corridors, passes, rivers, regions, plateaus, islands, straits, lakes
  GEOGRAPHY: {
    label: "Geography",
    gs: ["gs1", "gs3"],
    matchKeywords: [
      "corridor", "pass", "ghats", "plateau", "peninsula", "strait", "canal",
      "river", "lake", "delta", "basin", "bay", "gulf", "island", "archipelago",
      "range", "valley", "plain", "desert", "glacier", "waterfall", "port",
      "siliguri", "doklam", "palk", "deccan", "thar", "brahmaputra", "himalaya",
      "western ghats", "eastern ghats", "sundarbans", "rann", "lakshadweep",
      "andaman", "nicobar", "konkan", "coromandel", "malabar"
    ],
    sections: [
      {
        id: "geo_overview",
        label: "Location & Overview",
        icon: "🗺️",
        hint: "Coordinates, extent, bordering states/countries, basic geographic character.",
        pdfKeyPhrases: ["located at", "situated in", "bordered by", "extends from", "geographic coordinates"]
      },
      {
        id: "geo_physical",
        label: "Physical Features",
        icon: "⛰️",
        hint: "Terrain, elevation, landforms, soil type, drainage pattern, climate zone.",
        pdfKeyPhrases: ["topography", "elevation", "soil type", "drainage", "landform", "climate zone"]
      },
      {
        id: "geo_strategic",
        label: "Strategic Significance",
        icon: "🛡️",
        hint: "Military, trade, connectivity importance; chokepoint or access value.",
        pdfKeyPhrases: ["strategic importance", "trade route", "military significance", "connectivity", "chokepoint"]
      },
      {
        id: "geo_ecology",
        label: "Ecology & Biodiversity",
        icon: "🌿",
        hint: "Flora, fauna, protected areas, wetlands, ecological sensitivity.",
        pdfKeyPhrases: ["biodiversity", "endemic species", "wildlife sanctuary", "national park", "wetland", "ecosystem"]
      },
      {
        id: "geo_economy",
        label: "Economic Importance",
        icon: "💰",
        hint: "Agriculture, minerals, fisheries, tourism, industrial activity in the region.",
        pdfKeyPhrases: ["natural resources", "economic activity", "agriculture", "mineral deposits", "fisheries", "tourism"]
      },
      {
        id: "geo_issues",
        label: "Challenges & Threats",
        icon: "⚠️",
        hint: "Environmental degradation, encroachment, climate vulnerability, disputes.",
        pdfKeyPhrases: ["threats", "degradation", "dispute", "encroachment", "climate risk", "flood prone"]
      },
      {
        id: "geo_governance",
        label: "Governance & Policy",
        icon: "🏛️",
        hint: "Relevant laws, missions, tribunals, international agreements for the region.",
        pdfKeyPhrases: ["tribunal", "authority", "policy", "mission", "water sharing", "interstate"]
      },
      {
        id: "wayforward",
        label: "Way Forward",
        icon: "✅",
        hint: "Conservation, development, connectivity, and governance recommendations.",
        pdfKeyPhrases: ["recommendation", "way forward", "solution", "conservation plan", "sustainable development"]
      }
    ]
  },

  // ── 2. HISTORY ───────────────────────────────────────────────────────────────
  // Empires, dynasties, movements, freedom struggle, personalities, art & culture
  HISTORY: {
    label: "History",
    gs: ["gs1"],
    matchKeywords: [
      "empire", "dynasty", "kingdom", "sultanate", "mughal", "maratha", "vijayanagara",
      "chola", "gupta", "maurya", "delhi sultanate", "british raj", "colonial",
      "freedom struggle", "independence movement", "revolt", "uprising", "war",
      "battle", "partition", "satyagraha", "non-cooperation", "quit india",
      "nationalism", "gandhi", "nehru", "ambedkar", "bhagat singh", "bose",
      "ancient", "medieval", "modern history", "civilization", "culture",
      "art", "architecture", "sculpture", "painting", "literature", "philosophy",
      "bhakti", "sufi", "reform movement", "renaissance", "personality"
    ],
    sections: [
      {
        id: "definition",
        label: "Introduction & Context",
        icon: "📖",
        hint: "Who/what/when — brief identification, time period, geographic setting.",
        pdfKeyPhrases: ["introduction", "founded", "established", "period", "century", "origin"]
      },
      {
        id: "background",
        label: "Rise & Background",
        icon: "🕰️",
        hint: "Political, social, economic conditions that enabled emergence; founding events.",
        pdfKeyPhrases: ["rise", "foundation", "origins", "causes", "background", "early history"]
      },
      {
        id: "hist_political",
        label: "Political & Administrative History",
        icon: "👑",
        hint: "Rulers, succession, administrative system, territorial expansion or decline.",
        pdfKeyPhrases: ["administration", "ruler", "governance", "territorial expansion", "succession", "bureaucracy"]
      },
      {
        id: "hist_socioeco",
        label: "Economy & Society",
        icon: "⚖️",
        hint: "Trade, agriculture, taxation, social hierarchy, position of women and lower castes.",
        pdfKeyPhrases: ["trade", "economy", "social structure", "caste", "taxation", "agriculture"]
      },
      {
        id: "casestudies",
        label: "Art, Architecture & Culture",
        icon: "🏛️",
        hint: "Monuments, literary works, religious developments, scientific contributions.",
        pdfKeyPhrases: ["architecture", "temple", "art", "literature", "religion", "scientific"]
      },
      {
        id: "challenges",
        label: "Decline & Fall",
        icon: "📉",
        hint: "Internal contradictions, external invasions, economic collapse, succession failures.",
        pdfKeyPhrases: ["decline", "fall", "collapse", "weaknesses", "invasions", "disintegration"]
      },
      {
        id: "impacts",
        label: "Legacy & Significance",
        icon: "💥",
        hint: "Long-term impact on culture, polity, economy; what India inherited.",
        pdfKeyPhrases: ["legacy", "significance", "contributions", "influence", "impact", "modern relevance"]
      },
      {
        id: "conclusion",
        label: "Conclusion",
        icon: "🎯",
        hint: "UPSC-relevant synthesis: lessons, contemporary resonance, examiner takeaway.",
        pdfKeyPhrases: ["conclusion", "contemporary relevance", "lessons", "significance today"]
      }
    ]
  },

  // ── 3. SECURITY ──────────────────────────────────────────────────────────────
  // Terrorism, insurgency, cyber, border, internal security, defence
  SECURITY: {
    label: "Security",
    gs: ["gs3"],
    matchKeywords: [
      "terrorism", "terrorist", "insurgency", "naxal", "maoist", "ltte",
      "cyber security", "cyber attack", "hacking", "border security", "bsf",
      "internal security", "counter-terrorism", "radicalization", "militancy",
      "jem", "let", "northeast insurgency", "narco-terrorism", "money laundering",
      "organised crime", "human trafficking", "fake currency", "proxy war",
      "left wing extremism", "north east", "j&k", "kashmir", "defence"
    ],
    sections: [
      {
        id: "definition",
        label: "Concept & Definition",
        icon: "📖",
        hint: "Define the threat; legal/statutory definitions; distinguish from related concepts.",
        pdfKeyPhrases: ["definition", "terrorism", "insurgency", "legal definition", "uapa", "concept"]
      },
      {
        id: "background",
        label: "Historical Background",
        icon: "🕰️",
        hint: "Origin, evolution, key events/incidents that define the current threat.",
        pdfKeyPhrases: ["history", "origin", "evolution", "incidents", "timeline", "background"]
      },
      {
        id: "causes",
        label: "Causes & Root Factors",
        icon: "🔍",
        hint: "Socioeconomic deprivation, ideology, state failure, external support, grievances.",
        pdfKeyPhrases: ["causes", "root causes", "factors", "grievances", "unemployment", "ideology"]
      },
      {
        id: "sec_agencies",
        label: "Security Architecture",
        icon: "🛡️",
        hint: "NIA, NSG, CRPF, IB, RAW, state police — roles, gaps, coordination mechanisms.",
        pdfKeyPhrases: ["NIA", "NSG", "CRPF", "intelligence", "security forces", "coordination"]
      },
      {
        id: "legal",
        label: "Legal Framework",
        icon: "📋",
        hint: "UAPA, NSA, AFSPA, IT Act, NIA Act — powers, safeguards, controversies.",
        pdfKeyPhrases: ["UAPA", "AFSPA", "NSA", "NIA Act", "legislation", "legal framework"]
      },
      {
        id: "challenges",
        label: "Challenges",
        icon: "⚠️",
        hint: "Governance deficits, cross-border sanctuary, radicalisation online, human rights.",
        pdfKeyPhrases: ["challenges", "cross-border", "radicalisation", "human rights concerns", "safe havens"]
      },
      {
        id: "intl",
        label: "International Dimensions",
        icon: "🌐",
        hint: "State sponsors, FATF, UN counter-terrorism conventions, bilateral agreements.",
        pdfKeyPhrases: ["FATF", "UN convention", "bilateral", "state sponsor", "cross-border", "international"]
      },
      {
        id: "wayforward",
        label: "Way Forward",
        icon: "✅",
        hint: "SMART policing, de-radicalisation, development approach, intelligence reform.",
        pdfKeyPhrases: ["de-radicalisation", "police reform", "development", "way forward", "recommendation"]
      }
    ]
  },

  // ── 4. ENVIRONMENT ───────────────────────────────────────────────────────────
  // Climate, biodiversity, pollution, forests, oceans, disasters, wildlife
  ENVIRONMENT: {
    label: "Environment",
    gs: ["gs3"],
    matchKeywords: [
      "climate change", "global warming", "biodiversity", "species", "wildlife",
      "forest", "deforestation", "pollution", "air quality", "water pollution",
      "plastic", "waste", "ocean", "marine", "coral reef", "mangrove",
      "wetland", "disaster", "flood", "drought", "cyclone", "earthquake",
      "ozone", "greenhouse gas", "carbon", "emissions", "renewable energy",
      "solar", "wind energy", "electric vehicle", "sustainable", "ecology",
      "tiger", "elephant", "project tiger", "biosphere reserve", "ramsar",
      "paris agreement", "cop", "ndma", "ngt"
    ],
    sections: [
      {
        id: "definition",
        label: "Concept & Significance",
        icon: "📖",
        hint: "Define the issue; why it matters for India's ecology and economy.",
        pdfKeyPhrases: ["definition", "significance", "concept", "ecological importance", "overview"]
      },
      {
        id: "background",
        label: "Historical Context",
        icon: "🕰️",
        hint: "Evolution of the issue; key milestones, treaties, policy developments.",
        pdfKeyPhrases: ["history", "evolution", "milestones", "Stockholm", "Rio", "UNFCCC", "timeline"]
      },
      {
        id: "causes",
        label: "Causes",
        icon: "🔍",
        hint: "Anthropogenic and natural drivers; sectoral emission sources; policy failures.",
        pdfKeyPhrases: ["causes", "drivers", "anthropogenic", "emissions", "deforestation", "pollution sources"]
      },
      {
        id: "impacts",
        label: "Impacts",
        icon: "💥",
        hint: "On ecosystems, agriculture, water, health, economy, vulnerable communities.",
        pdfKeyPhrases: ["impacts", "consequences", "effect on", "agriculture", "health impact", "economic loss"]
      },
      {
        id: "data",
        label: "Data & Statistics",
        icon: "📊",
        hint: "IPCC, MoEF, FSI, CPCB, NCRB, NGT data; India's global ranking.",
        pdfKeyPhrases: ["statistics", "data", "percentage", "square kilometres", "global ranking", "index"]
      },
      {
        id: "legal",
        label: "Legal & Policy Framework",
        icon: "📋",
        hint: "EPA, Forest Act, Wildlife Act, NGT, EIA, constitutional provisions.",
        pdfKeyPhrases: ["Environment Protection Act", "Forest Conservation Act", "EIA", "NGT", "Wildlife Act", "constitutional"]
      },
      {
        id: "intl",
        label: "International Frameworks",
        icon: "🌐",
        hint: "Paris Agreement, CBD, CITES, Ramsar, UNFCCC, COP outcomes, India's commitments.",
        pdfKeyPhrases: ["Paris Agreement", "CBD", "CITES", "Ramsar", "COP", "NDC", "international treaty"]
      },
      {
        id: "wayforward",
        label: "Way Forward",
        icon: "✅",
        hint: "Nature-based solutions, technology, policy reforms, international cooperation.",
        pdfKeyPhrases: ["way forward", "solution", "recommendation", "nature-based", "green technology", "policy reform"]
      }
    ]
  },

  // ── 5. ECONOMY ───────────────────────────────────────────────────────────────
  // Sectors, trade, fiscal policy, agriculture, digital economy, banking, MSMEs
  ECONOMY: {
    label: "Economy",
    gs: ["gs3"],
    matchKeywords: [
      "gdp", "inflation", "fiscal", "monetary policy", "rbi", "budget",
      "taxation", "gst", "agriculture", "food security", "pds", "msp",
      "banking", "npa", "credit", "microfinance", "insurance",
      "trade", "export", "import", "wto", "fta", "make in india",
      "startup", "msme", "industry", "manufacturing", "pli",
      "digital economy", "upi", "fintech", "gig economy", "unemployment",
      "labour", "poverty", "inequality", "human development", "infrastructure",
      "energy", "oil", "coal", "renewable", "logistics", "supply chain"
    ],
    sections: [
      {
        id: "definition",
        label: "Concept & Overview",
        icon: "📖",
        hint: "Define the economic issue/sector; its share in GDP and national importance.",
        pdfKeyPhrases: ["definition", "overview", "GDP contribution", "sector overview", "economic significance"]
      },
      {
        id: "background",
        label: "Evolution & Policy History",
        icon: "🕰️",
        hint: "Pre-liberalisation to present; key policy shifts; Committees and commissions.",
        pdfKeyPhrases: ["history", "evolution", "liberalisation", "five-year plan", "policy reform", "committee"]
      },
      {
        id: "data",
        label: "Data & Statistics",
        icon: "📊",
        hint: "GDP share, growth rate, employment, trade figures, India's global rank.",
        pdfKeyPhrases: ["GDP", "growth rate", "employment", "export", "billion", "crore", "per cent"]
      },
      {
        id: "schemes",
        label: "Government Schemes & Policies",
        icon: "🏛️",
        hint: "Central and state schemes, PLI, budget allocations, regulatory reforms.",
        pdfKeyPhrases: ["scheme", "PLI", "mission", "policy", "budget allocation", "reform"]
      },
      {
        id: "challenges",
        label: "Challenges",
        icon: "⚠️",
        hint: "Structural problems, market failures, infrastructure gaps, global headwinds.",
        pdfKeyPhrases: ["challenges", "problems", "constraints", "barriers", "market failure", "structural issues"]
      },
      {
        id: "intl",
        label: "Global Context",
        icon: "🌐",
        hint: "WTO, FTAs, global value chains, India's position vs peers, IMF/World Bank data.",
        pdfKeyPhrases: ["WTO", "FTA", "global", "world bank", "IMF", "international trade", "global ranking"]
      },
      {
        id: "committees",
        label: "Committees & Reforms",
        icon: "👥",
        hint: "Key committee recommendations; pending reforms; regulatory changes needed.",
        pdfKeyPhrases: ["committee", "task force", "reform", "recommendation", "panel", "commission"]
      },
      {
        id: "wayforward",
        label: "Way Forward",
        icon: "✅",
        hint: "Supply-side reforms, demand stimulus, technology adoption, global integration.",
        pdfKeyPhrases: ["way forward", "recommendation", "reform agenda", "solution", "policy suggestion"]
      }
    ]
  },

  // ── 6. POLITY ────────────────────────────────────────────────────────────────
  // Constitutional bodies, laws, electoral reforms, federalism, rights, governance
  POLITY: {
    label: "Polity",
    gs: ["gs2"],
    matchKeywords: [
      "constitution", "article", "amendment", "parliament", "lok sabha", "rajya sabha",
      "president", "governor", "prime minister", "cabinet", "council of ministers",
      "supreme court", "high court", "judiciary", "election commission",
      "federal", "federalism", "panchayati raj", "urban local body",
      "fundamental rights", "dpsp", "fundamental duties",
      "constitutional body", "statutory body", "lokpal", "cag", "upsc",
      "electoral reform", "anti-defection", "right to information",
      "lokayukta", "ombudsman", "civil service", "ias", "bureaucracy",
      "cbi", "enforcement directorate", "one nation one election",
      "delimitation", "reservation", "obc", "sc", "st"
    ],
    sections: [
      {
        id: "definition",
        label: "Concept & Constitutional Basis",
        icon: "📖",
        hint: "Define the institution/concept; founding Article(s); original intent.",
        pdfKeyPhrases: ["Article", "constitutional provision", "definition", "statutory basis", "established under"]
      },
      {
        id: "constitution",
        label: "Constitutional Provisions",
        icon: "⚖️",
        hint: "Specific Articles, Parts, Schedules; relevant Amendments; Constituent Assembly debates.",
        pdfKeyPhrases: ["Article", "Part III", "Part IV", "Schedule", "Amendment", "Constituent Assembly"]
      },
      {
        id: "legal",
        label: "Legal Framework",
        icon: "📋",
        hint: "Enabling legislation, rules, regulations; evolution through Acts and Amendments.",
        pdfKeyPhrases: ["Act", "Rules", "legislation", "amendment", "statutory", "law"]
      },
      {
        id: "data",
        label: "Performance & Data",
        icon: "📊",
        hint: "Key statistics: pending cases, election figures, seat composition, budget.",
        pdfKeyPhrases: ["statistics", "data", "pending", "composition", "seats", "percentage"]
      },
      {
        id: "judgements",
        label: "SC / HC Judgements",
        icon: "🏛️",
        hint: "Landmark cases that shaped interpretation; ratio decidendi; recent orders.",
        pdfKeyPhrases: ["Supreme Court", "judgement", "case", "held", "ratio", "constitutional bench"]
      },
      {
        id: "challenges",
        label: "Issues & Challenges",
        icon: "⚠️",
        hint: "Structural defects, political interference, implementation gaps, delays.",
        pdfKeyPhrases: ["challenges", "issues", "criticism", "concern", "problem", "deficiency"]
      },
      {
        id: "committees",
        label: "Committee Recommendations",
        icon: "👥",
        hint: "2nd ARC, Law Commission, Sarkaria, Punchhi, Venkatachaliah — key reforms.",
        pdfKeyPhrases: ["2nd ARC", "Law Commission", "Sarkaria", "Punchhi", "committee", "recommendation"]
      },
      {
        id: "wayforward",
        label: "Way Forward",
        icon: "✅",
        hint: "Constitutional/legislative reforms; global best practices; institutional fixes.",
        pdfKeyPhrases: ["reform", "way forward", "recommendation", "legislative change", "solution"]
      }
    ]
  },

  // ── 7. SCIENCE_TECH ──────────────────────────────────────────────────────────
  // AI, space, nuclear, biotech, digital, defence technology, health tech
  SCIENCE_TECH: {
    label: "Science & Technology",
    gs: ["gs3"],
    matchKeywords: [
      "artificial intelligence", "ai", "machine learning", "deep learning",
      "space", "isro", "satellite", "chandrayaan", "gaganyaan", "launch vehicle",
      "nuclear", "atomic energy", "reactor", "thorium",
      "biotechnology", "genome", "crispr", "vaccine", "drug",
      "semiconductor", "chip", "5g", "quantum", "nanotechnology",
      "drone", "uav", "defence technology", "missile", "drdo",
      "internet of things", "iot", "blockchain", "digital technology",
      "supercomputer", "cloud", "data centre", "electric vehicle",
      "green hydrogen", "carbon capture", "gene editing", "stem cell"
    ],
    sections: [
      {
        id: "definition",
        label: "Concept & Science",
        icon: "📖",
        hint: "What it is; underlying science; how the technology works.",
        pdfKeyPhrases: ["definition", "concept", "technology", "how it works", "mechanism", "overview"]
      },
      {
        id: "background",
        label: "India's Journey",
        icon: "🕰️",
        hint: "History of India's programme; key milestones; institutional evolution.",
        pdfKeyPhrases: ["India's", "history", "programme", "milestones", "ISRO", "DRDO", "evolution"]
      },
      {
        id: "data",
        label: "Current Status & Data",
        icon: "📊",
        hint: "India's achievements, global ranking, investment, capacity data.",
        pdfKeyPhrases: ["current status", "achievements", "capacity", "investment", "global ranking", "data"]
      },
      {
        id: "st_applications",
        label: "Applications & Use Cases",
        icon: "🔬",
        hint: "Defence, agriculture, health, governance, industry applications in India.",
        pdfKeyPhrases: ["application", "use case", "deployed", "agriculture", "health", "defence application"]
      },
      {
        id: "challenges",
        label: "Challenges",
        icon: "⚠️",
        hint: "R&D gaps, patent deficits, brain drain, import dependence, ethical risks.",
        pdfKeyPhrases: ["challenges", "R&D", "patent", "brain drain", "import dependence", "ethical"]
      },
      {
        id: "intl",
        label: "Global Landscape",
        icon: "🌐",
        hint: "Global leaders, treaties (NPT, MTCR, Wassenaar), tech geopolitics, India's position.",
        pdfKeyPhrases: ["global", "USA", "China", "geopolitics", "treaty", "technology competition", "leader"]
      },
      {
        id: "schemes",
        label: "Government Initiatives",
        icon: "🏛️",
        hint: "Missions, PLI schemes, national programmes, budget outlays.",
        pdfKeyPhrases: ["mission", "PLI", "scheme", "national programme", "budget", "government initiative"]
      },
      {
        id: "wayforward",
        label: "Way Forward",
        icon: "✅",
        hint: "R&D investment, public-private partnerships, ethical governance, skilling.",
        pdfKeyPhrases: ["way forward", "R&D", "investment", "policy", "ethical governance", "recommendation"]
      }
    ]
  },

  // ── 8. SOCIETY ───────────────────────────────────────────────────────────────
  // Women, tribals, caste, poverty, health, education, migrants, minorities
  SOCIETY: {
    label: "Society",
    gs: ["gs1", "gs2"],
    matchKeywords: [
      "women", "gender", "feminist", "mahila", "girl child", "dowry",
      "tribal", "adivasi", "schedule tribe", "forest rights", "displacement",
      "caste", "dalit", "obc", "scheduled caste", "discrimination",
      "poverty", "inequality", "hunger", "malnutrition", "food security",
      "health", "mental health", "suicide", "neet", "infant mortality",
      "education", "literacy", "school dropout", "higher education",
      "migrant", "migration", "labour migration", "diaspora",
      "minority", "communal", "secularism", "diversity",
      "urbanisation", "slum", "homelessness", "social exclusion",
      "elderly", "disability", "lgbtq", "child labour", "trafficking"
    ],
    sections: [
      {
        id: "definition",
        label: "Concept & Significance",
        icon: "📖",
        hint: "Define the social group/issue; constitutional and legal status.",
        pdfKeyPhrases: ["definition", "significance", "constitutional status", "vulnerable group", "overview"]
      },
      {
        id: "background",
        label: "Historical Context",
        icon: "🕰️",
        hint: "Social history; reform movements; colonial and post-independence evolution.",
        pdfKeyPhrases: ["history", "social reform", "colonial", "movement", "evolution", "background"]
      },
      {
        id: "data",
        label: "Data & Statistics",
        icon: "📊",
        hint: "NFHS, Census, NCRB, NSSO, HDI sub-indices; state-wise variation.",
        pdfKeyPhrases: ["NFHS", "census", "NCRB", "statistics", "percentage", "ranking", "data"]
      },
      {
        id: "causes",
        label: "Root Causes",
        icon: "🔍",
        hint: "Structural inequality, patriarchy, caste, poverty, policy failure.",
        pdfKeyPhrases: ["causes", "root causes", "patriarchy", "structural", "discrimination", "poverty"]
      },
      {
        id: "challenges",
        label: "Challenges",
        icon: "⚠️",
        hint: "Persisting gaps, implementation failures, social resistance, digital divide.",
        pdfKeyPhrases: ["challenges", "barriers", "gaps", "resistance", "implementation", "issues"]
      },
      {
        id: "schemes",
        label: "Government Schemes",
        icon: "🏛️",
        hint: "Central and state welfare schemes; convergence; DBT; coverage data.",
        pdfKeyPhrases: ["scheme", "mission", "welfare", "DBT", "coverage", "beneficiary"]
      },
      {
        id: "casestudies",
        label: "Case Studies",
        icon: "📌",
        hint: "Successful models — Kudumbashree, SHGs, SEWA, state innovations.",
        pdfKeyPhrases: ["case study", "model", "success story", "initiative", "example", "best practice"]
      },
      {
        id: "wayforward",
        label: "Way Forward",
        icon: "✅",
        hint: "Structural reform, empowerment, social norms change, convergence of schemes.",
        pdfKeyPhrases: ["way forward", "reform", "empowerment", "recommendation", "social change", "solution"]
      }
    ]
  },

  // ── 9. INTERNATIONAL ─────────────────────────────────────────────────────────
  // Bilateral relations, regional groupings, treaties, IR issues
  INTERNATIONAL: {
    label: "International Relations",
    gs: ["gs2"],
    matchKeywords: [
      "bilateral", "india-china", "india-pakistan", "india-usa", "india-russia",
      "india-bangladesh", "india-nepal", "india-sri lanka", "india-myanmar",
      "india-france", "india-germany", "saarc", "bimstec", "quad", "g20",
      "brics", "sco", "asean", "un", "wto", "imf", "world bank",
      "treaty", "agreement", "memorandum", "cooperation", "foreign policy",
      "neighbour", "neighbourhood first", "act east", "indo-pacific",
      "international relation", "global south", "diplomacy", "soft power",
      "non-alignment", "strategic autonomy", "trade war", "sanction"
    ],
    sections: [
      {
        id: "definition",
        label: "Overview & Historical Background",
        icon: "📖",
        hint: "Brief history of the relationship; when and how it was established.",
        pdfKeyPhrases: ["history", "establishment", "background", "relationship", "diplomatic ties", "overview"]
      },
      {
        id: "ir_areas",
        label: "Areas of Cooperation",
        icon: "🤝",
        hint: "Trade, defence, energy, connectivity, people-to-people, multilateral cooperation.",
        pdfKeyPhrases: ["cooperation", "trade", "defence", "bilateral", "agreement", "partnership"]
      },
      {
        id: "ir_disputes",
        label: "Issues & Disputes",
        icon: "⚔️",
        hint: "Territorial disputes, trade friction, historical grievances, unresolved issues.",
        pdfKeyPhrases: ["dispute", "issue", "friction", "territorial", "concern", "challenge"]
      },
      {
        id: "data",
        label: "Trade & Economic Data",
        icon: "📊",
        hint: "Bilateral trade figures, FDI flows, remittances, investment data.",
        pdfKeyPhrases: ["trade", "billion", "FDI", "investment", "export", "import", "economic data"]
      },
      {
        id: "ir_strategic",
        label: "Strategic Significance",
        icon: "🛡️",
        hint: "Geopolitical importance; India's strategic interests; regional balance of power.",
        pdfKeyPhrases: ["strategic", "geopolitical", "significance", "balance of power", "security", "alliance"]
      },
      {
        id: "ir_multilateral",
        label: "Multilateral Dimensions",
        icon: "🌐",
        hint: "Groupings, treaties, UN votes, shared positions on global issues.",
        pdfKeyPhrases: ["multilateral", "grouping", "UN", "G20", "BRICS", "global forum", "treaty"]
      },
      {
        id: "ir_india",
        label: "India's Approach & Interests",
        icon: "🇮🇳",
        hint: "India's foreign policy stance, Neighbourhood First, Act East, strategic autonomy.",
        pdfKeyPhrases: ["India's foreign policy", "neighbourhood first", "strategic autonomy", "act east", "India's interest"]
      },
      {
        id: "wayforward",
        label: "Way Forward",
        icon: "✅",
        hint: "Diplomatic initiatives, CBMs, economic cooperation, people-to-people ties.",
        pdfKeyPhrases: ["way forward", "confidence-building", "initiative", "recommendation", "diplomacy", "solution"]
      }
    ]
  },

  // ── 10. ETHICS ───────────────────────────────────────────────────────────────
  // Dilemmas, case studies, values, governance ethics, emotional intelligence
  ETHICS: {
    label: "Ethics",
    gs: ["gs4"],
    matchKeywords: [
      "ethics", "integrity", "corruption", "probity", "attitude", "aptitude",
      "emotional intelligence", "civil servant", "public servant",
      "dilemma", "moral", "values", "virtue", "conscience",
      "whistle blower", "conflict of interest", "accountability",
      "transparency", "impartiality", "objectivity", "selflessness",
      "thinker", "philosopher", "kant", "gandhi", "rawls", "sen",
      "case study ethics", "governance ethics", "corporate ethics",
      "social justice", "human rights", "compassion", "empathy"
    ],
    sections: [
      {
        id: "definition",
        label: "Concept & Meaning",
        icon: "📖",
        hint: "Define the ethical concept; distinguish from adjacent terms.",
        pdfKeyPhrases: ["definition", "concept", "meaning", "distinguish", "ethics", "integrity"]
      },
      {
        id: "eth_dimensions",
        label: "Ethical Dimensions",
        icon: "🔮",
        hint: "Deontological, consequentialist, virtue ethics, Gandhian, Rawlsian angles.",
        pdfKeyPhrases: ["deontological", "consequentialist", "virtue ethics", "Kant", "Rawls", "Gandhi", "ethical framework"]
      },
      {
        id: "eth_thinkers",
        label: "Thinkers & Quotes",
        icon: "🧠",
        hint: "Relevant philosophers, their contributions, applicable quotes for answers.",
        pdfKeyPhrases: ["thinker", "philosopher", "quote", "said", "argued", "contribution", "school of thought"]
      },
      {
        id: "eth_governance",
        label: "Ethics in Governance",
        icon: "🏢",
        hint: "Nolan principles, 2nd ARC, Lokpal, RTI, accountability mechanisms.",
        pdfKeyPhrases: ["Nolan principles", "2nd ARC", "public servant", "accountability", "probity", "civil servant"]
      },
      {
        id: "casestudies",
        label: "Case Studies",
        icon: "📌",
        hint: "Inspiring civil servants; ethical dilemma scenarios; real incidents.",
        pdfKeyPhrases: ["case study", "example", "civil servant", "dilemma", "scenario", "officer"]
      },
      {
        id: "eth_issues",
        label: "Contemporary Issues",
        icon: "⚠️",
        hint: "AI ethics, social media ethics, corporate responsibility, bioethics.",
        pdfKeyPhrases: ["contemporary", "AI ethics", "corporate", "social media", "bioethics", "modern challenge"]
      },
      {
        id: "wayforward",
        label: "Way Forward",
        icon: "✅",
        hint: "Institutional reforms, values education, Mission Karmayogi, ethical codes.",
        pdfKeyPhrases: ["way forward", "Mission Karmayogi", "reform", "values education", "ethical code", "recommendation"]
      }
    ]
  },

  // ── 11. GENERIC ──────────────────────────────────────────────────────────────
  // Fallback for topics that don't match a specific category
  GENERIC: {
    label: "General",
    gs: ["gs1", "gs2", "gs3", "gs4"],
    matchKeywords: [],   // matches everything — used as fallback
    sections: [
      {
        id: "definition",
        label: "Definition & Overview",
        icon: "📖",
        hint: "Formal definition, scope, key concepts; why it matters for UPSC.",
        pdfKeyPhrases: ["definition", "overview", "concept", "meaning", "significance"]
      },
      {
        id: "background",
        label: "Background",
        icon: "🕰️",
        hint: "Historical evolution, key phases, origins of the current situation.",
        pdfKeyPhrases: ["history", "background", "evolution", "origin", "development"]
      },
      {
        id: "context",
        label: "Current Context",
        icon: "📰",
        hint: "Recent developments, news peg, current data, why it is in news.",
        pdfKeyPhrases: ["current", "recent", "2023", "2024", "news", "latest"]
      },
      {
        id: "data",
        label: "Data & Statistics",
        icon: "📊",
        hint: "Key numbers, India's ranking, trend data from credible sources.",
        pdfKeyPhrases: ["data", "statistics", "percentage", "ranking", "report", "survey"]
      },
      {
        id: "challenges",
        label: "Challenges",
        icon: "⚠️",
        hint: "Major problems, structural gaps, governance failures, global headwinds.",
        pdfKeyPhrases: ["challenges", "problems", "issues", "barriers", "concern", "failure"]
      },
      {
        id: "causes",
        label: "Causes",
        icon: "🔍",
        hint: "Root causes — structural, historical, economic, institutional, social.",
        pdfKeyPhrases: ["causes", "reasons", "factors", "roots", "why"]
      },
      {
        id: "impacts",
        label: "Impacts",
        icon: "💥",
        hint: "Economic, social, environmental, security, and governance consequences.",
        pdfKeyPhrases: ["impact", "consequence", "effect", "outcome", "result"]
      },
      {
        id: "intl",
        label: "International Best Practices",
        icon: "🌐",
        hint: "Global models, country comparisons, international frameworks.",
        pdfKeyPhrases: ["international", "global", "country", "model", "best practice", "comparison"]
      },
      {
        id: "casestudies",
        label: "Case Studies",
        icon: "📌",
        hint: "Success stories, pilot projects, state-level innovations.",
        pdfKeyPhrases: ["case study", "example", "model", "success story", "pilot"]
      },
      {
        id: "wayforward",
        label: "Way Forward",
        icon: "✅",
        hint: "Policy recommendations, short/medium/long-term solutions, SDG links.",
        pdfKeyPhrases: ["way forward", "recommendation", "solution", "reform", "suggestion"]
      },
      {
        id: "conclusion",
        label: "Conclusion",
        icon: "🎯",
        hint: "Synthesis: integrate dimensions, quote if apt, Viksit Bharat/SDG hook.",
        pdfKeyPhrases: ["conclusion", "summary", "synthesis", "thus", "therefore"]
      }
    ]
  }
};

// ── Category detection function ───────────────────────────────────────────────
// Returns the best-matching TOPIC_CATEGORIES key for a given topic string.
// GENERIC is the fallback if nothing matches.

export function detectTopicCategory(topic) {
  const t = topic.toLowerCase();
  const scores = {};
  for (const [catKey, catData] of Object.entries(TOPIC_CATEGORIES)) {
    if (catKey === "GENERIC") continue;
    scores[catKey] = catData.matchKeywords.filter(kw => t.includes(kw)).length;
  }
  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  return (best && best[1] > 0) ? best[0] : "GENERIC";
}

// ── Get sections for a topic ──────────────────────────────────────────────────
// Returns the array of section objects for a given topic string.

export function getSectionsForTopic(topic) {
  const catKey = detectTopicCategory(topic);
  return TOPIC_CATEGORIES[catKey].sections;
}
