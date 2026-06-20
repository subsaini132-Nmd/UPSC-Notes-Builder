import React from "react";

const META = {
  pyq:     { icon: "🎯", title: "PYQ Mapper", day: "Day 5 (Phase 5)", desc: "Maps every generated note to relevant UPSC Past Year Questions from GS1–GS4, Essay, Ethics, and Anthropology papers (2013–2024). Each PYQ is clickable with full question text and model approach." },
  answers: { icon: "✍️", title: "Answer Builder", day: "Day 5 (Phase 5)", desc: "Generates word-limited UPSC Mains answers (150 / 250 / 500 / 1000 words) from your notes. Supports standard Mains format, Essay style, and Interview language with live word count." },
  search:  { icon: "🔍", title: "Global Search", day: "Day 6 (Phase 6)", desc: "Full-text search across all your notes with filters for GS paper, Rajasthan-specific content, Ethics dimension, and Anthropology. Highlights matched sections with keyword context." },
};

export default function ComingSoon({ page, onBack }) {
  const m = META[page] || META.pyq;
  return (
    <div className="page coming-soon-page">
      <div className="coming-soon-wrap">
        <div className="coming-soon-icon">{m.icon}</div>
        <div className="coming-soon-day">{m.day}</div>
        <h2 className="coming-soon-title">{m.title}</h2>
        <p className="coming-soon-desc">{m.desc}</p>
        <button className="primary-btn" onClick={onBack}>← Back to Dashboard</button>
      </div>
    </div>
  );
}
