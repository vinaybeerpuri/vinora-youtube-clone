import React, { createContext, useContext, useState, useCallback } from "react";

const SidebarContext = createContext(null);

/**
 * SidebarProvider — wraps the app so both Navbar and Sidebar
 * can read/write the sidebar open state without prop drilling.
 */
export const SidebarProvider = ({ children }) => {
  // Default: collapsed (matches YouTube's default desktop behaviour)
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSidebar = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setIsExpanded(false);
  }, []);

  return (
    <SidebarContext.Provider value={{ isExpanded, toggleSidebar, closeSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

/** Custom hook — throws if used outside the provider */
export const useSidebar = () => {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return ctx;
};
