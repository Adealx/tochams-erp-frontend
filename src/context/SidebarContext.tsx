"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

interface SidebarContextType {
  collapsed: boolean;
  toggleSidebar: () => void;
  mobileOpen: boolean;
  toggleMobileSidebar: () => void;
  closeMobileSidebar: () => void;
}

const SidebarContext = createContext<
  SidebarContextType | undefined
>(undefined);

export function SidebarProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [collapsed, setCollapsed] =
    useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSidebar = () =>
    setCollapsed((prev) => !prev);

  const toggleMobileSidebar = () => setMobileOpen((prev) => !prev);
  const closeMobileSidebar = () => setMobileOpen(false);

  return (
    <SidebarContext.Provider
      value={{
        collapsed,
        toggleSidebar,
        mobileOpen,
        toggleMobileSidebar,
        closeMobileSidebar,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context =
    useContext(SidebarContext);

  if (!context) {
    throw new Error(
      "useSidebar must be used inside SidebarProvider"
    );
  }

  return context;
}
