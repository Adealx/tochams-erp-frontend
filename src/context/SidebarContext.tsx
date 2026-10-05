"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";

/* =========================================================
   TYPES
========================================================= */

interface SidebarContextType {
  /* Desktop */
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  toggleSidebar: () => void;

  /* Mobile */
  mobileOpen: boolean;
  openMobileSidebar: () => void;
  closeMobileSidebar: () => void;
  toggleMobileSidebar: () => void;

  /* Utility */
  resetSidebar: () => void;
}

/* =========================================================
   CONTEXT
========================================================= */

const SidebarContext =
  createContext<SidebarContextType | undefined>(
    undefined
  );

/* =========================================================
   STORAGE
========================================================= */

const SIDEBAR_STORAGE_KEY =
  "tochams-erp-sidebar-collapsed";

/* =========================================================
   PROVIDER
========================================================= */

export function SidebarProvider({
  children,
}: {
  children: ReactNode;
}) {
  /*
   * Start with false so the server and first client render
   * remain consistent.
   */
  const [collapsed, setCollapsedState] =
    useState(false);

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [hydrated, setHydrated] =
    useState(false);

  /* =======================================================
     RESTORE DESKTOP SIDEBAR STATE
  ======================================================= */

  useEffect(() => {
    try {
      const stored =
        window.localStorage.getItem(
          SIDEBAR_STORAGE_KEY
        );

      if (stored !== null) {
        setCollapsedState(
          stored === "true"
        );
      }
    } catch {
      /*
       * Ignore localStorage errors.
       * The sidebar should still function normally.
       */
    }

    setHydrated(true);
  }, []);

  /* =======================================================
     PERSIST DESKTOP SIDEBAR STATE
  ======================================================= */

  useEffect(() => {
    if (!hydrated) return;

    try {
      window.localStorage.setItem(
        SIDEBAR_STORAGE_KEY,
        String(collapsed)
      );
    } catch {
      /*
       * Ignore storage errors.
       */
    }
  }, [collapsed, hydrated]);

  /* =======================================================
     DESKTOP SIDEBAR
  ======================================================= */

  const setCollapsed = useCallback(
    (value: boolean) => {
      setCollapsedState(value);
    },
    []
  );

  const toggleSidebar = useCallback(() => {
    setCollapsedState((prev) => !prev);
  }, []);

  /* =======================================================
     MOBILE SIDEBAR
  ======================================================= */

  const openMobileSidebar =
    useCallback(() => {
      setMobileOpen(true);
    }, []);

  const closeMobileSidebar =
    useCallback(() => {
      setMobileOpen(false);
    }, []);

  const toggleMobileSidebar =
    useCallback(() => {
      setMobileOpen((prev) => !prev);
    }, []);

  /* =======================================================
     RESET
  ======================================================= */

  const resetSidebar = useCallback(() => {
    setCollapsedState(false);
    setMobileOpen(false);

    try {
      window.localStorage.removeItem(
        SIDEBAR_STORAGE_KEY
      );
    } catch {
      /*
       * Ignore storage errors.
       */
    }
  }, []);

  /* =======================================================
     KEYBOARD SHORTCUT
     
     Ctrl + B / Cmd + B
     toggles the desktop sidebar.
  ======================================================= */

  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      const isModifier =
        event.ctrlKey || event.metaKey;

      if (
        isModifier &&
        event.key.toLowerCase() === "b"
      ) {
        event.preventDefault();

        setCollapsedState(
          (prev) => !prev
        );
      }

      /*
       * Escape closes mobile navigation.
       */
      if (
        event.key === "Escape" &&
        mobileOpen
      ) {
        setMobileOpen(false);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [mobileOpen]);

  /* =======================================================
     PROVIDER
  ======================================================= */

  return (
    <SidebarContext.Provider
      value={{
        collapsed,
        setCollapsed,
        toggleSidebar,

        mobileOpen,
        openMobileSidebar,
        closeMobileSidebar,
        toggleMobileSidebar,

        resetSidebar,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

/* =========================================================
   HOOK
========================================================= */

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