import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./BottomNavbar.css";

const BottomNavbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    {
      label: "Home",
      path: "/",
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M4 10V21h6v-6h4v6h6V10l-8-7z"/>
        </svg>
      )
    },
    {
      label: "Shorts",
      path: "/search?q=shorts",
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M19 10.3c0-.3-.1-.5-.3-.7-.2-.2-.5-.3-.7-.3h-3.9l1.7-4.1c.1-.3 0-.7-.2-1-.2-.3-.5-.5-.9-.5-.2 0-.3 0-.5.1L6.7 10.7c-.3.2-.5.5-.5.8.0.3.1.6.4.8h3.9l-1.7 4.1c-.1.3 0 .7.2 1 .2.3.5.5.9.5.2 0 .3 0 .5-.1l7.8-6.9c.3-.2.5-.5.5-.8z"/>
        </svg>
      )
    },
    {
      label: "Create",
      path: "/upload",
      icon: (
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
        </svg>
      )
    },
    {
      label: "Subscriptions",
      path: "/subscriptions",
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M20 4H4v2h16V4zm2 4H2v12h20V8zm-12 9.5v-7l6 3.5-6 3.5z"/>
        </svg>
      )
    },
    {
      label: "You",
      path: "/profile",
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
        </svg>
      )
    }
  ];

  const isActive = (path) => {
    if (path === "/") {
      return currentPath === "/";
    }
    if (path.startsWith("/search")) {
      return currentPath === "/search";
    }
    return currentPath === path;
  };

  return (
    <div className="vinora-bottom-nav">
      {navItems.map((item) => (
        <Link
          key={item.label}
          to={item.path}
          className={`vinora-bottom-nav__item ${
            isActive(item.path) ? "vinora-bottom-nav__item--active" : ""
          }`}
        >
          <span className="vinora-bottom-nav__icon">{item.icon}</span>
          <span className="vinora-bottom-nav__label">{item.label}</span>
        </Link>
      ))}
    </div>
  );
};

export default BottomNavbar;
