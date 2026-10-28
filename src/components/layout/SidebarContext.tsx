"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface SidebarContextType {
  mobileOpen: boolean;
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
}

const SidebarContext =
  createContext<SidebarContextType | undefined>(
    undefined
  );

export function SidebarProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const value: SidebarContextType = {
    mobileOpen,

    toggleSidebar: () => {
      setMobileOpen((current) => !current);
    },

    openSidebar: () => {
      setMobileOpen(true);
    },

    closeSidebar: () => {
      setMobileOpen(false);
    },
  };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar(): SidebarContextType {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error(
      "useSidebar must be used within SidebarProvider."
    );
  }

  return context;
}