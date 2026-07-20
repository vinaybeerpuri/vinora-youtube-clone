import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";
import "./Navbar.css";
import logo from "../assets/vinora-logo.png";

const Navbar = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navigate = useNavigate();
  const { toggleSidebar } = useSidebar();

  const handleSearch = (e) => {
    if (e.key === "Enter" && search.trim() !== "") {
      navigate(`/search?q=${search}`);
    }
  };

  const handleSearchBtn = () => {
    if (search.trim() !== "") {
      navigate(`/search?q=${search}`);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="vinora-navbar">

      {/* ── LEFT: Hamburger + Logo ────────────────────────────── */}
      <div className="vinora-navbar__left">
        <button
          className="vinora-navbar__hamburger"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          id="sidebar-toggle-btn"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
          </svg>
        </button>

        <Link to="/" className="vinora-navbar__logo">
          <img src={logo} alt="VINORA" className="logo" />
        </Link>
      </div>

      {/* ── CENTER: Search ───────────────────────────────────── */}
      <div className="vinora-navbar__center">
        <div className="vinora-navbar__search-wrap">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            className="vinora-navbar__search"
            aria-label="Search"
          />
          <button
            className="vinora-navbar__search-btn"
            onClick={handleSearchBtn}
            aria-label="Search button"
          >
            {/* Search / magnifier icon */}
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.87 20.17l-5.59-5.59A7.49 7.49 0 0 0 16 10a7.5 7.5 0 1 0-7.5 7.5c1.82 0 3.5-.65 4.82-1.72l5.58 5.58.97-.97zM10 16a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z" />
            </svg>
          </button>
        </div>

        {/* Voice Search */}
        <button className="vinora-navbar__voice-btn" aria-label="Voice search">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 15c1.66 0 3-1.34 3-3V6c0-1.66-1.34-3-3-3S9 4.34 9 6v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V6zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-2.08c3.39-.49 6-3.39 6-6.92h-2z" />
          </svg>
        </button>
      </div>

      {/* ── RIGHT: Create / Notifications / Profile ───────────── */}
      <div className="vinora-navbar__right">
        {token ? (
          <>
            {/* CREATE */}
            <div className="vinora-navbar__create-wrap">
              <button
                onClick={() => setCreateOpen(!createOpen)}
                className="vinora-navbar__create-btn"
                id="create-menu-btn"
              >
                {/* Camera / create icon */}
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
                </svg>
                <span>Create</span>
              </button>

              {createOpen && (
                <div className="vinora-navbar__create-menu">
                  <p onClick={() => { navigate("/upload"); setCreateOpen(false); }}>
                    🎥 Upload Video
                  </p>
                  <p onClick={() => { navigate("/live"); setCreateOpen(false); }}>
                    🔴 Go Live
                  </p>
                </div>
              )}
            </div>

            {/* NOTIFICATIONS */}
            <button className="vinora-navbar__icon-btn vinora-navbar__notif" aria-label="Notifications">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2zm6-6V11a6 6 0 0 0-5-5.91V4a1 1 0 0 0-2 0v1.09A6 6 0 0 0 6 11v5l-2 2v1h16v-1l-2-2z" />
              </svg>
            </button>

            {/* PROFILE */}
            <div className="vinora-navbar__profile-wrap">
              <img
                src={user?.profileImage || "https://i.pravatar.cc/100"}
                onClick={() => setProfileOpen(!profileOpen)}
                alt="profile"
                className="vinora-navbar__avatar"
              />

              {profileOpen && (
                <div className="vinora-navbar__profile-menu">
                  <div className="vinora-navbar__profile-header">
                    <img
                      src={user?.profileImage || "https://i.pravatar.cc/100"}
                      alt="profile"
                    />
                    <div>
                      <h3>{user?.name || "Vinay"}</h3>
                      <p>@{user?.username || "vinay"}</p>
                    </div>
                  </div>

                  <hr />

                  <p onClick={() => { navigate("/dashboard"); setProfileOpen(false); }}>
                    👤 View your channel
                  </p>
                  <p onClick={() => { navigate("/call"); setProfileOpen(false); }}>
                    📞 Video Call
                  </p>
                  <p>🔵 Google Account</p>
                  <p>🔄 Switch account</p>
                  <p onClick={logout}>🚪 Sign out</p>

                  <hr />

                  <p>⚙ Settings</p>
                  <p>🌙 Appearance</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/login">
              <button className="vinora-navbar__auth-btn">Login</button>
            </Link>
            <Link to="/upload">
              <button className="vinora-navbar__auth-btn">➕ Create</button>
            </Link>
            <Link to="/register">
              <button className="vinora-navbar__auth-btn">Register</button>
            </Link>
          </>
        )}
      </div>

    </header>
  );
};

export default Navbar;