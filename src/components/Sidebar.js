import React, { useState } from "react";
import { NAV_ITEMS } from "../lib/constants";

const Icons = {
  grid:       () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  library:    () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 19V6a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v14"/><path d="M4 19a1 1 0 0 0 1 1h14"/><path d="M9 6v13"/></svg>,
  sparkles:   () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/><path d="M19 15l.75 2.25L22 18l-2.25.75L19 21l-.75-2.25L16 18l2.25-.75z"/><path d="M5 5l.5 1.5L7 7l-1.5.5L5 9l-.5-1.5L3 7l1.5-.5z"/></svg>,
  "book-open":() => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  target:     () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  "pen-line": () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>,
  search:     () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  layers:     () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 2 7l10 5 10-5z"/><path d="M2 12l10 5 10-5"/><path d="M2 17l10 5 10-5"/></svg>,
  calendar:   () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><circle cx="8" cy="15" r="1" fill="currentColor"/><circle cx="12" cy="15" r="1" fill="currentColor"/><circle cx="16" cy="15" r="1" fill="currentColor"/></svg>,
  newspaper:  () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8M15 18h-5M10 6h8v4h-8z"/></svg>,
  zap:        () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
  "bar-chart":() => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M7 16V10M11 16V6M15 16v-4M19 16V8"/></svg>,
  clock:      () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
  feather:    () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/></svg>,
  award:      () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>,
  chevron:    () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m9 18 6-6-6-6"/></svg>,
  menu:       () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  close:      () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>,
};

export default function Sidebar({ activePage, onNavigate }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavLink = ({ item }) => {
    const Icon = Icons[item.icon] || Icons.grid;
    const active = activePage === item.id;
    return (
      <button
        className={`nav-item ${active ? "nav-active" : ""}`}
        onClick={() => { onNavigate(item.id); setMobileOpen(false); }}
        title={collapsed ? item.label : ""}
      >
        <span className="nav-icon"><Icon /></span>
        {!collapsed && <span className="nav-label">{item.label}</span>}
        {!collapsed && active && <span className="nav-active-dot" />}
      </button>
    );
  };

  return (
    <>
      {/* Mobile toggle */}
      <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>
        {mobileOpen ? <Icons.close /> : <Icons.menu />}
      </button>

      {/* Overlay */}
      {mobileOpen && <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />}

      <aside className={`sidebar ${collapsed ? "sidebar-collapsed" : ""} ${mobileOpen ? "sidebar-mobile-open" : ""}`}>
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="brand-mark">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#1E3A5F"/>
              <path d="M8 24V12l8-4 8 4v12" stroke="#C8A96E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13 24v-7h6v7" stroke="#C8A96E" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M10 14h12" stroke="#C8A96E" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
            </svg>
          </div>
          {!collapsed && (
            <div className="brand-text">
              <div className="brand-name">NotesAI</div>
              <div className="brand-sub">UPSC Mains Builder</div>
            </div>
          )}
          <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
            <span style={{ transform: collapsed ? "rotate(0deg)" : "rotate(180deg)", display: "inline-block", transition: "transform 0.2s" }}>
              <Icons.chevron />
            </span>
          </button>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          <div className="nav-section-label">{!collapsed && "Workspace"}</div>
          {NAV_ITEMS.slice(0, 5).map(item => <NavLink key={item.id} item={item} />)}
          <div className="nav-divider" />
          <div className="nav-section-label">{!collapsed && "Tools"}</div>
          {NAV_ITEMS.slice(5, 10).map(item => <NavLink key={item.id} item={item} />)}
          <div className="nav-divider" />
          <div className="nav-section-label">{!collapsed && "Study"}</div>
          {NAV_ITEMS.slice(10).map(item => <NavLink key={item.id} item={item} />)}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          {!collapsed && (
            <div className="sidebar-user">
              <div className="user-avatar">AK</div>
              <div className="user-info">
                <div className="user-name">UPSC Aspirant</div>
                <div className="user-role">2026 Batch</div>
              </div>
            </div>
          )}
          {collapsed && <div className="user-avatar-sm">AK</div>}
        </div>
      </aside>
    </>
  );
}
