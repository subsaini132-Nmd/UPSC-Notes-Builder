export const NAV_ITEMS = [
  // Workspace
  { id: "dashboard",  label: "Dashboard",        icon: "grid",       desc: "Overview & quick access" },
  { id: "library",    label: "PDF Library",      icon: "library",    desc: "Upload & manage sources" },
  { id: "generator",  label: "Note Generator",   icon: "sparkles",   desc: "Create notes from topics" },
  { id: "notes",      label: "My Notes",         icon: "book-open",  desc: "Browse & edit notes" },
  { id: "planner",    label: "Mains Planner",    icon: "clock",      desc: "Exam countdown & daily tasks" },
  // Tools
  { id: "affairs",    label: "Current Affairs",  icon: "newspaper",  desc: "Daily CA linked to topics" },
  { id: "pyq",        label: "PYQ Mapper",       icon: "target",     desc: "Map to past questions" },
  { id: "answers",    label: "Answer Builder",   icon: "pen-line",   desc: "Generate word-limited answers" },
  { id: "search",     label: "Search",           icon: "search",     desc: "Cross-note search & filter" },
  { id: "essay",      label: "Essay Builder",    icon: "feather",    desc: "Structure & write essays" },
  // Study
  { id: "flashcards", label: "Flashcards",       icon: "layers",     desc: "Active recall study mode" },
  { id: "quiz",       label: "Quiz Mode",        icon: "zap",        desc: "Self-test from your notes" },
  { id: "revision",   label: "Revision Tracker", icon: "calendar",   desc: "Spaced repetition planner" },
  { id: "progress",   label: "GS Progress",      icon: "bar-chart",  desc: "Paper-wise tracking" },
  { id: "optional",   label: "Optional (Anthro)", icon: "award",     desc: "Anthropology syllabus tracker" },
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
  }
};

export const SAMPLE_PDFS = [
  { id: "1", name: "Economic Survey 2023-24.pdf",          size: "18.4 MB", pages: 312, chunks: 1842, status: "indexed",    date: "2024-11-01" },
  { id: "2", name: "ARC 2nd Report - Ethics.pdf",          size: "4.2 MB",  pages: 148, chunks: 724,  status: "indexed",    date: "2024-11-02" },
  { id: "3", name: "India Year Book 2024.pdf",             size: "22.1 MB", pages: 480, chunks: 2940, status: "indexed",    date: "2024-11-03" },
  { id: "4", name: "NCERT Geography Class 11.pdf",         size: "8.7 MB",  pages: 204, chunks: 1120, status: "indexed",    date: "2024-11-05" },
  { id: "5", name: "PIB Compilation Nov 2024.pdf",         size: "3.1 MB",  pages: 86,  chunks: 492,  status: "processing", date: "2024-11-11" },
  { id: "6", name: "Vision IAS Current Affairs Oct.pdf",   size: "6.8 MB",  pages: 198, chunks: 0,    status: "queued",     date: "2024-11-12" },
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
