import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";
import "./Sidebar.css";

/* ── Icon SVGs ─────────────────────────────────────────────── */
const HomeIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </svg>
);

const TrendingIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M17.53 11.2c-.23-.3-.5-.56-.76-.83-.65-.7-1.4-1.27-1.92-2.08-.52-.8-.7-1.98-.28-2.88.38-.8 1.1-1.37 1.88-1.73.3-.13.6-.23.9-.3-.02.02-.04.04-.05.06-1.01 1.41-1.05 3.49 0 4.9zm4.27-2.59c-.34-1.53-1.47-2.9-2.81-3.74-.37-.23-.79-.4-1.22-.47-.06.28-.03.57.07.83.36.96 1.16 1.6 1.67 2.5.52.91.53 2.03.13 3.01-.56 1.4-2.1 2.18-3.07 3.3a5.92 5.92 0 0 0-1.3 2.21 5.82 5.82 0 0 0-.08.35c-.37-.21-.53-.62-.5-1.05.07-.9.52-1.74.64-2.64.12-.87-.05-1.87-.61-2.58-1.39 2.14-2.78 4.08-2.64 7.64.1 2.4 2.47 3.94 4.62 3.47 2.37-.53 3.36-3.08 3.01-5.17-.25-1.48-1.41-2.69-1.55-4.19-.08-.82.16-1.66.64-2.33.48-.67 1.19-1.18 1.94-1.47-.33.28-.65.58-.88.95-.72 1.18-.46 2.82.1 4.07.34.76.66 1.5.66 2.33.01.74-.2 1.47-.55 2.12.28-.04.55-.11.82-.21 1.45-.56 2.3-2.14 2.31-3.67 0-1.03-.3-2.08-.57-3.07zm-15.47 7.02c.27 1.43 1.24 2.64 2.28 3.64.9.86 1.95 1.69 3.17 1.89-.28-.38-.57-.79-.72-1.24-.66-1.97.33-4.11 1.75-5.42a8.47 8.47 0 0 0 1.17-1.25 4.55 4.55 0 0 0 .73-3.73c-.18-.72-.52-1.4-.98-1.98-.9-1.14-2.24-1.81-3.27-2.83C9.9 3.5 9.37 2.32 9.55 1c-1.56.87-2.68 2.41-3.1 4.14-.41 1.71-.12 3.57.78 5.06.32.54.72 1.03.96 1.61.22.55.23 1.22-.12 1.71-.61.87-1.74 1.22-2.52 1.89-.6.51-.97 1.24-1.21 2.02.25-.08.51-.15.76-.22.41-.12.82-.19 1.22-.22-.31.42-.58.87-.77 1.34-.19.47-.27.98-.21 1.48z" />
  </svg>
);

const SubscriptionsIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M10 18v-6l5 3-5 3zM2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10S2 17.52 2 12zm2 0c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8-8 3.58-8 8z" />
  </svg>
);

const HistoryIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.25 2.52.77-1.28-3.52-2.09V8z" />
  </svg>
);

const DownloadsIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z" />
  </svg>
);

const ProfileIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-5.33 0-8 2.67-8 4v1h16v-1c0-1.33-2.67-4-8-4z" />
  </svg>
);

const CallIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
  </svg>
);

const PremiumIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

/* ── Sidebar menu item ─────────────────────────────────────── */
const SidebarLink = ({ to, icon, label, isExpanded, onClick }) => {
  const { pathname } = useLocation();
  const isActive = pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`vinora-sidebar__item${isActive ? " active" : ""}${isExpanded ? " expanded" : ""}`}
      title={!isExpanded ? label : undefined}
    >
      <span className="vinora-sidebar__icon">{icon}</span>
      {isExpanded && <span className="vinora-sidebar__label">{label}</span>}
    </Link>
  );
};

/* ── Sidebar ───────────────────────────────────────────────── */
const Sidebar = () => {
  const { isExpanded, closeSidebar } = useSidebar();

  // On mobile, clicking a link closes the drawer
  const handleLinkClick = () => {
    if (window.innerWidth <= 768) closeSidebar();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isExpanded && (
        <div
          className="vinora-sidebar__backdrop"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      <nav
        className={`vinora-sidebar${isExpanded ? " vinora-sidebar--expanded" : ""}`}
        aria-label="Main navigation"
      >
        {/* ── MAIN ── */}
        {isExpanded && (
          <span className="vinora-sidebar__section-label">Main</span>
        )}

        <SidebarLink to="/"            icon={<HomeIcon />}          label="Home"          isExpanded={isExpanded} onClick={handleLinkClick} />
        <SidebarLink to="/search"      icon={<TrendingIcon />}      label="Trending"      isExpanded={isExpanded} onClick={handleLinkClick} />
        <SidebarLink to="/subscriptions" icon={<SubscriptionsIcon />} label="Subscriptions" isExpanded={isExpanded} onClick={handleLinkClick} />

        {isExpanded && <hr className="vinora-sidebar__divider" />}
        {!isExpanded && <div className="vinora-sidebar__mini-divider" />}

        {/* ── LIBRARY ── */}
        {isExpanded && (
          <span className="vinora-sidebar__section-label">Library</span>
        )}

        <SidebarLink to="/history"   icon={<HistoryIcon />}   label="History"     isExpanded={isExpanded} onClick={handleLinkClick} />
        <SidebarLink to="/downloads" icon={<DownloadsIcon />} label="Downloads"   isExpanded={isExpanded} onClick={handleLinkClick} />
        <SidebarLink to="/profile"   icon={<ProfileIcon />}   label="Profile"     isExpanded={isExpanded} onClick={handleLinkClick} />
        <SidebarLink to="/call"      icon={<CallIcon />}      label="Video Call"  isExpanded={isExpanded} onClick={handleLinkClick} />

        {isExpanded && <hr className="vinora-sidebar__divider" />}
        {!isExpanded && <div className="vinora-sidebar__mini-divider" />}

        {/* ── PREMIUM ── */}
        <SidebarLink to="/premium" icon={<PremiumIcon />} label="Premium" isExpanded={isExpanded} onClick={handleLinkClick} />
      </nav>
    </>
  );
};

export default Sidebar;