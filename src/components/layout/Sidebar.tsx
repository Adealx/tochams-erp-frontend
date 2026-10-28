"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useSyncExternalStore,
} from "react";

import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  FileText,
  CreditCard,
  Package,
  Building2,
  Warehouse,
  Calculator,
  Receipt,
  ClipboardList,
  BarChart3,
  UserCog,
  Settings,
  Clock3,
  ChevronRight,
  ChevronLeft,
  X,
  Menu,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { hasPermission } from "@/lib/permissions";
import { useSidebar } from "@/components/layout/SidebarContext";

/* =========================================================
   NAVIGATION TYPES
========================================================= */

interface NavigationItem {
  label: string;
  href: string;
  icon: React.ElementType;
  permission: string;
  badge?: string;
}

interface NavigationGroup {
  title: string;
  items: NavigationItem[];
}

/* =========================================================
   COLLAPSIBLE SIDEBAR PREFERENCE

   useSyncExternalStore keeps the initial server and
   hydration snapshots consistent.

   The saved preference is restored from localStorage
   after hydration without calling setState inside an effect.
========================================================= */

const SIDEBAR_STORAGE_KEY = "tochams-sidebar-collapsed";

const sidebarCollapseListeners = new Set<() => void>();

function getSidebarCollapsedSnapshot(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return (
    window.localStorage.getItem(SIDEBAR_STORAGE_KEY) ===
    "true"
  );
}

function getSidebarCollapsedServerSnapshot(): boolean {
  return false;
}

function subscribeToSidebarCollapsed(
  callback: () => void
): () => void {
  sidebarCollapseListeners.add(callback);

  const handleStorageChange = () => {
    callback();
  };

  window.addEventListener("storage", handleStorageChange);

  return () => {
    sidebarCollapseListeners.delete(callback);

    window.removeEventListener(
      "storage",
      handleStorageChange
    );
  };
}

function saveSidebarCollapsedState(
  collapsed: boolean
): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    SIDEBAR_STORAGE_KEY,
    String(collapsed)
  );

  // Notify subscribers in this tab immediately.
  sidebarCollapseListeners.forEach((listener) => {
    listener();
  });
}

/* =========================================================
   NAVIGATION CONFIGURATION

   Visibility is controlled by the shared permission map.
   Backend permissions remain the security enforcement layer.
========================================================= */

const navigationGroups: NavigationGroup[] = [
  {
    title: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        permission: "dashboard",
      },
    ],
  },
  {
    title: "Sales & Distribution",
    items: [
      {
        label: "Customers",
        href: "/customers",
        icon: Users,
        permission: "customers",
      },
      {
        label: "Sales Orders",
        href: "/sales-orders",
        icon: ShoppingCart,
        permission: "orders",
      },
      {
        label: "Invoices",
        href: "/invoices",
        icon: FileText,
        permission: "invoices",
      },
      {
        label: "Payments",
        href: "/payments",
        icon: CreditCard,
        permission: "payments",
      },
    ],
  },
  {
    title: "Inventory",
    items: [
      {
        label: "Inventory",
        href: "/inventory",
        icon: Package,
        permission: "inventory",
      },
      {
        label: "Procurement",
        href: "/procurement",
        icon: ShoppingCart,
        permission: "procurement",
      },
      {
        label: "Vendors",
        href: "/vendors",
        icon: Building2,
        permission: "vendors",
      },
    ],
  },
  {
    title: "Operations",
    items: [
      {
        label: "Warehouse",
        href: "/warehouse",
        icon: Warehouse,
        permission: "warehouse",
      },
    ],
  },
  {
    title: "Finance",
    items: [
      {
        label: "Accounting",
        href: "/accounting",
        icon: Calculator,
        permission: "accounting",
      },
      {
        label: "Expenses",
        href: "/expenses",
        icon: Receipt,
        permission: "expenses",
      },
      {
        label: "Transaction Tracker",
        href: "/transaction-tracker",
        icon: ClipboardList,
        permission: "transaction-tracker",
      },
    ],
  },
  {
    title: "Analytics",
    items: [
      {
        label: "Reports",
        href: "/reports",
        icon: BarChart3,
        permission: "reports",
      },
    ],
  },
  {
    title: "Administration",
    items: [
      {
        label: "Users",
        href: "/users",
        icon: UserCog,
        permission: "users",
      },
      {
        label: "Attendance",
        href: "/attendance",
        icon: Clock3,
        permission: "attendance",
      },
      {
        label: "Settings",
        href: "/settings",
        icon: Settings,
        permission: "settings",
      },
    ],
  },
];

/* =========================================================
   SIDEBAR COMPONENT
========================================================= */

export default function Sidebar() {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  /*
   * Shared state is provided by SidebarContext.tsx.
   * AppShell must wrap Sidebar and Topbar in SidebarProvider.
   */

  const {
    mobileOpen,
    toggleSidebar,
    closeSidebar,
  } = useSidebar();

  /* =======================================================
     DESKTOP COLLAPSIBLE SIDEBAR STATE

     The saved preference is restored automatically.
     The desktop collapse preference is shared with the
     mobile sidebar content, as in the existing component.
  ======================================================= */

  const collapsed = useSyncExternalStore(
    subscribeToSidebarCollapsed,
    getSidebarCollapsedSnapshot,
    getSidebarCollapsedServerSnapshot
  );

  /* =======================================================
     CLOSE MOBILE NAVIGATION WHEN ROUTE CHANGES
  ======================================================= */

  useEffect(() => {
    closeSidebar();
  }, [pathname, closeSidebar]);

  /* =======================================================
     ESCAPE KEY
  ======================================================= */

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeSidebar();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [mobileOpen, closeSidebar]);

  /* =======================================================
     PREVENT BODY SCROLL WHEN MOBILE SIDEBAR IS OPEN
  ======================================================= */

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  /* =======================================================
     ACTIVE ROUTE
  ======================================================= */

  function isActive(href: string): boolean {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  }

  /* =======================================================
     ROLE-BASED NAVIGATION

     Unknown and pending roles receive no permissions
     unless explicitly granted by the permission map.
  ======================================================= */

  const visibleNavigationGroups: NavigationGroup[] =
    loading || !user
      ? []
      : navigationGroups
          .map((group) => ({
            ...group,
            items: group.items.filter((item) =>
              hasPermission(
                user.role,
                item.permission
              )
            ),
          }))
          .filter(
            (group) => group.items.length > 0
          );

  /* =======================================================
     DESKTOP COLLAPSE
  ======================================================= */

  function toggleCollapsed() {
    saveSidebarCollapsedState(!collapsed);
  }

  /* =======================================================
     NAVIGATION
  ======================================================= */

  const navigation = (
    <nav
      aria-label="Primary navigation"
      className="
        min-h-0
        flex-1
        overflow-x-hidden
        overflow-y-auto
        px-3
        py-4
      "
    >
      {loading ? (
        <div
          className="px-3 py-4 text-xs text-slate-500"
          role="status"
        >
          Loading navigation...
        </div>
      ) : !user ? (
        <div className="px-3 py-4 text-xs text-slate-500">
          Sign in to access the ERP.
        </div>
      ) : visibleNavigationGroups.length === 0 ? (
        <div className="px-3 py-4 text-xs text-slate-500">
          No navigation items are assigned to this role.
        </div>
      ) : (
        <div className="space-y-6">
          {visibleNavigationGroups.map((group) => (
            <div key={group.title}>
              {/* Section Heading */}

              <div
                className={`
                  mb-2
                  overflow-hidden
                  whitespace-nowrap
                  px-3
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.18em]
                  text-slate-500
                  transition-all
                  duration-300
                  ${
                    collapsed
                      ? "h-0 opacity-0"
                      : "h-auto opacity-100"
                  }
                `}
              >
                {group.title}
              </div>

              {/* Navigation Items */}

              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={
                        collapsed
                          ? item.label
                          : undefined
                      }
                      aria-current={
                        active ? "page" : undefined
                      }
                      onClick={closeSidebar}
                      className={`
                        group
                        relative
                        flex
                        min-w-0
                        items-center
                        rounded-xl
                        transition-all
                        duration-200
                        ${
                          collapsed
                            ? "justify-center px-2.5 py-2.5"
                            : "gap-3 px-3 py-2.5"
                        }
                        ${
                          active
                            ? `
                              bg-blue-600/[0.14]
                              text-white
                              shadow-[inset_0_0_0_1px_rgba(96,165,250,0.10)]
                            `
                            : `
                              text-slate-400
                              hover:bg-white/[0.05]
                              hover:text-white
                            `
                        }
                      `}
                    >
                      {/* Active Indicator */}

                      {active && (
                        <span
                          className="
                            absolute
                            left-0
                            top-1/2
                            h-6
                            w-[3px]
                            -translate-y-1/2
                            rounded-r-full
                            bg-gradient-to-b
                            from-cyan-300
                            to-blue-500
                          "
                        />
                      )}

                      {/* Icon */}

                      <span
                        className={`
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          transition-all
                          duration-200
                          ${
                            active
                              ? "bg-blue-500/15 text-cyan-300"
                              : "text-slate-500 group-hover:bg-white/[0.05] group-hover:text-slate-200"
                          }
                        `}
                      >
                        <Icon
                          size={17}
                          strokeWidth={
                            active ? 2.2 : 1.9
                          }
                        />
                      </span>

                      {/* Label */}

                      <span
                        className={`
                          min-w-0
                          flex-1
                          truncate
                          text-[13px]
                          font-medium
                          transition-all
                          duration-300
                          ${
                            collapsed
                              ? "w-0 opacity-0"
                              : "w-auto opacity-100"
                          }
                        `}
                      >
                        {item.label}
                      </span>

                      {/* Optional Badge */}

                      {!collapsed && item.badge && (
                        <span
                          className="
                            rounded-full
                            bg-blue-500/15
                            px-2
                            py-0.5
                            text-[9px]
                            font-bold
                            text-blue-300
                          "
                        >
                          {item.badge}
                        </span>
                      )}

                      {/* Active Arrow */}

                      {!collapsed && active && (
                        <ChevronRight
                          size={14}
                          className="text-blue-300"
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </nav>
  );

  /* =======================================================
     SIDEBAR CONTENT
  ======================================================= */

  const sidebarContent = (
    <>
      {/* BRAND */}

      <div
        className={`
          relative
          shrink-0
          border-b
          border-white/[0.07]
          transition-all
          duration-300
          ${collapsed ? "px-3 py-5" : "px-5 py-5"}
        `}
      >
        {/* Decorative Glow */}

        <div
          className="
            pointer-events-none
            absolute
            -right-16
            -top-16
            h-40
            w-40
            rounded-full
            bg-blue-500/10
            blur-3xl
          "
        />

        <Link
          href="/dashboard"
          title={
            collapsed ? "TOCHAMS ERP" : undefined
          }
          onClick={closeSidebar}
          className={`
            relative
            flex
            min-w-0
            items-center
            transition-all
            duration-300
            ${collapsed ? "justify-center" : "gap-3"}
          `}
        >
          {/* Logo */}

          <div
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-white/10
              bg-white
              shadow-[0_8px_25px_rgba(0,0,0,0.20)]
            "
          >
            <Image
              src="/logo/tochams-logo.png"
              alt="TOCHAMS"
              width={36}
              height={36}
              priority
              className="h-8 w-8 object-contain"
            />
          </div>

          {/* Brand Text */}

          <div
            className={`
              min-w-0
              overflow-hidden
              whitespace-nowrap
              transition-all
              duration-300
              ${
                collapsed
                  ? "w-0 opacity-0"
                  : "w-auto opacity-100"
              }
            `}
          >
            <p className="truncate text-sm font-black tracking-tight text-white">
              TOCHAMS ERP
            </p>

            <p
              className="
                mt-0.5
                truncate
                text-[9px]
                font-medium
                uppercase
                tracking-[0.14em]
                text-blue-300/60
              "
            >
              Enterprise Platform
            </p>
          </div>
        </Link>

        {/* Desktop Collapse Button */}

        <button
          type="button"
          onClick={toggleCollapsed}
          aria-label={
            collapsed
              ? "Expand sidebar"
              : "Collapse sidebar"
          }
          aria-expanded={!collapsed}
          title={
            collapsed
              ? "Expand sidebar"
              : "Collapse sidebar"
          }
          className="
            absolute
            -right-3
            top-1/2
            z-30
            hidden
            h-7
            w-7
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            border
            border-slate-700
            bg-[#0b2147]
            text-slate-400
            shadow-lg
            transition-all
            duration-200
            hover:border-blue-400/40
            hover:bg-blue-600
            hover:text-white
            focus:outline-none
            focus:ring-2
            focus:ring-blue-400/40
            md:flex
          "
        >
          {collapsed ? (
            <ChevronRight
              size={14}
              strokeWidth={2.5}
            />
          ) : (
            <ChevronLeft
              size={14}
              strokeWidth={2.5}
            />
          )}
        </button>

        {/* Mobile Close Button */}

        <button
          type="button"
          onClick={closeSidebar}
          aria-label="Close navigation"
          className="
            absolute
            right-4
            top-5
            grid
            h-9
            w-9
            place-items-center
            rounded-xl
            border
            border-white/10
            bg-white/[0.04]
            text-slate-400
            transition
            hover:bg-white/[0.08]
            hover:text-white
            md:hidden
          "
        >
          <X size={18} />
        </button>
      </div>

      {/* ROLE-FILTERED NAVIGATION */}

      {navigation}

      {/* SIDEBAR FOOTER */}

      <div
        className={`
          shrink-0
          border-t
          border-white/[0.07]
          p-3
          transition-all
          duration-300
          ${collapsed ? "flex justify-center" : ""}
        `}
      >
        {collapsed ? (
          <div
            title="TOCHAMS ERP"
            className="
              grid
              h-9
              w-9
              place-items-center
              rounded-xl
              bg-white/[0.04]
              text-[10px]
              font-black
              text-blue-300
            "
          >
            TE
          </div>
        ) : (
          <div
            className="
              rounded-xl
              border
              border-white/[0.06]
              bg-white/[0.025]
              px-3
              py-2.5
            "
          >
            <p className="text-[10px] font-semibold text-slate-400">
              TOCHAMS ERP
            </p>

            <p className="mt-0.5 text-[9px] text-slate-600">
              Enterprise operational workspace
            </p>

            {user && (
              <p className="mt-1 truncate text-[9px] capitalize text-blue-300/70">
                {user.role.replace(/_/g, " ")} access
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <>
      {/* MOBILE MENU BUTTON */}

      <button
        type="button"
        onClick={toggleSidebar}
        aria-label="Open navigation"
        aria-expanded={mobileOpen}
        aria-controls="tochams-mobile-sidebar"
        className="
          fixed
          left-4
          top-4
          z-40
          grid
          h-10
          w-10
          place-items-center
          rounded-xl
          border
          border-slate-200
          bg-white
          text-slate-600
          shadow-lg
          shadow-slate-900/5
          transition
          hover:border-blue-200
          hover:bg-blue-50
          hover:text-blue-600
          md:hidden
        "
      >
        <Menu size={19} />
      </button>

      {/* MOBILE BACKDROP */}

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={closeSidebar}
          className="
            fixed
            inset-0
            z-40
            bg-slate-950/50
            backdrop-blur-[2px]
            md:hidden
          "
        />
      )}

      {/* MOBILE SIDEBAR */}

      <aside
        id="tochams-mobile-sidebar"
        aria-label="Mobile sidebar"
        aria-hidden={!mobileOpen}
        className={`
          fixed
          inset-y-0
          left-0
          z-50
          flex
          w-[285px]
          flex-col
          border-r
          border-white/[0.07]
          bg-[#071633]
          text-white
          shadow-2xl
          transition-transform
          duration-300
          ease-out
          md:hidden
          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {sidebarContent}
      </aside>

      {/* DESKTOP SIDEBAR */}

      <aside
        aria-label="Desktop sidebar"
        className={`
          relative
          hidden
          h-screen
          shrink-0
          flex-col
          border-r
          border-slate-800/70
          bg-[#071633]
          text-white
          transition-[width]
          duration-300
          ease-in-out
          md:flex
          ${collapsed ? "w-[76px]" : "w-[260px]"}
        `}
      >
        {sidebarContent}
      </aside>
    </>
  );
}