import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./MobileTopBar.css";
import logo from "../assets/vinora-logo.png";

const MobileTopBar = () => {
  const navigate = useNavigate();

  // Read auth state exactly as Navbar.jsx does — no extra API calls
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleSearchClick = () => {
    navigate("/search?q=");
  };

  const handleProfileClick = () => {
    if (token) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="mob-topbar">

      {/* ── LEFT: Logo ─────────────────────────────────────────── */}
      <Link to="/" className="mob-topbar__logo">
        {/* VINORA logo */}
        <img
          src={logo}
          alt="VINORA"
          className="logo mob-topbar__play-icon"
        />

        <span className="mob-topbar__wordmark">
          <span>V</span>INORA
        </span>
      </Link>

      {/* ── RIGHT: Icon cluster ─────────────────────────────────── */}
      <div className="mob-topbar__icons">

        {/* Search */}
        <button
          className="mob-topbar__icon-btn"
          onClick={handleSearchClick}
          aria-label="Search"
        >
          {/* Magnifying-glass SVG */}
          <svg viewBox="0 0 24 24">
            <path d="M21 20l-5.4-5.4A7.5 7.5 0 1 0 4.5 4.5a7.5 7.5 0 0 0 10.1 11.1L20 21l1-1zM11 17a6 6 0 1 1 0-12 6 6 0 0 1 0 12z" />
          </svg>
        </button>

        {/* Notifications (only when logged in) */}
        {token && (
          <button
            className="mob-topbar__icon-btn"
            aria-label="Notifications"
          >
            {/* Bell SVG */}
            <svg viewBox="0 0 24 24">
              <path d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2zm6-6V11a6 6 0 0 0-5-5.91V4a1 1 0 0 0-2 0v1.09A6 6 0 0 0 6 11v5l-2 2v1h16v-1l-2-2z" />
            </svg>
            {/* Red dot badge */}
            <span className="mob-topbar__badge" aria-hidden="true" />
          </button>
        )}

        {/* Profile avatar / guest icon */}
        {token ? (
          <img
            src={user?.profileImage || "https://i.pravatar.cc/100"}
            alt="Profile"
            className="mob-topbar__avatar"
            onClick={handleProfileClick}
          />
        ) : (
          <div
            className="mob-topbar__avatar-guest"
            onClick={handleProfileClick}
            role="button"
            aria-label="Login"
          >
            {/* Person/account SVG */}
            <svg viewBox="0 0 24 24">
              <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-5.33 0-8 2.67-8 4v1h16v-1c0-1.33-2.67-4-8-4z" />
            </svg>
          </div>
        )}

      </div>
    </div>
  );
};

export default MobileTopBar;
